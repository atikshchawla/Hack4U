import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { errorResponse, successResponse, parseJsonBody, logRequest, logResponse } from "@/lib/api-helpers";
import type { NextRequest } from "next/server";
import type { NextResponse } from "next/server";

interface RemoveMemberRequest {
  memberEmail: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    logRequest("POST", "/api/team/remove-member");

    const session = await auth();
    if (!session?.user?.email) {
      logResponse("POST", "/api/team/remove-member", 401, Date.now() - startTime);
      return errorResponse("Unauthorized", 401);
    }

    const body = await parseJsonBody(request);
    const { memberEmail } = body as RemoveMemberRequest;

    if (!memberEmail || typeof memberEmail !== "string") {
      logResponse("POST", "/api/team/remove-member", 400, Date.now() - startTime);
      return errorResponse("memberEmail is required", 400);
    }

    // Get current user with their team
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        vitStudent: {
          select: {
            id: true,
            teamId: true,
          },
        },
      },
    });

    if (!currentUser?.vitStudent?.teamId) {
      logResponse("POST", "/api/team/remove-member", 400, Date.now() - startTime);
      return errorResponse("You are not part of any team", 400);
    }

    const teamId = currentUser.vitStudent.teamId;

    // Load team members ordered by join time
    const teamWithMembers = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        vitStudents: {
          orderBy: { createdAt: "asc" },
          include: {
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
    });

    if (!teamWithMembers) {
      logResponse("POST", "/api/team/remove-member", 404, Date.now() - startTime);
      return errorResponse("Team not found", 404);
    }

    const vitStudents = teamWithMembers.vitStudents;

    if (vitStudents.length === 0) {
      logResponse("POST", "/api/team/remove-member", 400, Date.now() - startTime);
      return errorResponse("Team has no members", 400);
    }

    // Leader is first member by createdAt
    const leader = vitStudents[0];
    const isLeader = leader.user?.email === session.user.email;

    if (!isLeader) {
      logResponse("POST", "/api/team/remove-member", 403, Date.now() - startTime);
      return errorResponse("Only the team leader can remove members", 403);
    }

    // Find target member in the same team
    const target = vitStudents.find((vs) => vs.user?.email === memberEmail);

    if (!target) {
      logResponse("POST", "/api/team/remove-member", 404, Date.now() - startTime);
      return errorResponse("Member not found in this team", 404);
    }

    // Do not allow leader to remove themselves via this endpoint
    if (target.id === leader.id) {
      logResponse("POST", "/api/team/remove-member", 400, Date.now() - startTime);
      return errorResponse("Team leader cannot be removed", 400);
    }

    await prisma.vITStudent.update({
      where: { id: target.id },
      data: { teamId: null },
    });

    logResponse("POST", "/api/team/remove-member", 200, Date.now() - startTime);
    return successResponse(undefined, "Member removed from team");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[API] POST /api/team/remove-member error:", {
      error: errorMessage,
      timestamp: new Date().toISOString(),
      duration: `${Date.now() - startTime}ms`,
    });

    logResponse("POST", "/api/team/remove-member", 500, Date.now() - startTime);
    return errorResponse("Failed to remove member. Please try again.", 500);
  }
}
