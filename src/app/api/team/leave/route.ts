import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse, logRequest, logResponse } from "@/lib/api-helpers";
import { auth } from "@/auth";
import type { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    logRequest("POST", "/api/team/leave");

    const session = await auth();
    if (!session?.user?.email) {
      logResponse("POST", "/api/team/leave", 401, Date.now() - startTime);
      return errorResponse("Unauthorized", 401);
    }

    // Find user's VIT student record
    const user = await prisma.user.findUnique({
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

    if (!user?.vitStudent?.id) {
      logResponse("POST", "/api/team/leave", 404, Date.now() - startTime);
      return errorResponse("VIT student record not found", 404);
    }

    if (!user.vitStudent.teamId) {
      logResponse("POST", "/api/team/leave", 400, Date.now() - startTime);
      return errorResponse("You are not part of any team", 400);
    }

    const teamId = user.vitStudent.teamId;

    // Fetch team to check leadership and remaining members
    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        vitStudents: {
          where: { id: { not: user.vitStudent.id } }, // Exclude current user
          orderBy: { createdAt: "asc" }, // Oldest member gets priority
          take: 1, // We only need the first candidate
        },
      },
    });

    // Remove user from team
    await prisma.vITStudent.update({
      where: { id: user.vitStudent.id },
      data: {
        teamId: null,
      },
    });

    // Handle leadership transfer or team cleanup
    if (team) {
      // If no members left (since we filtered out the current user), delete the team
      if (team.vitStudents.length === 0) {
        await prisma.team.delete({
          where: { id: teamId },
        });
      }
      // If user was leader and there are other members, transfer leadership
      else if (team.leaderId === user.vitStudent.id) {
        await prisma.team.update({
          where: { id: teamId },
          data: {
            leaderId: team.vitStudents[0].id,
          },
        });
      }
    }

    logResponse("POST", "/api/team/leave", 200, Date.now() - startTime);
    return successResponse(undefined, "Successfully left the team");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[API] POST /api/team/leave error:", {
      error: errorMessage,
      timestamp: new Date().toISOString(),
      duration: `${Date.now() - startTime}ms`,
    });

    logResponse("POST", "/api/team/leave", 500, Date.now() - startTime);
    return errorResponse("Failed to leave team. Please try again.", 500);
  }
}
