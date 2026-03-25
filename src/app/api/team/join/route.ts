import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { errorResponse, successResponse, parseJsonBody, logRequest, logResponse } from "@/lib/api-helpers";
import type { NextRequest } from "next/server";
import type { NextResponse } from "next/server";

interface JoinTeamRequest {
  teamCode: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    logRequest("POST", "/api/team/join");

    // Get authenticated user
    const session = await auth();
    if (!session?.user?.email) {
      logResponse("POST", "/api/team/join", 401, Date.now() - startTime);
      return errorResponse("Unauthorized", 401);
    }

    // Parse request body
    const body = await parseJsonBody(request);
    const { teamCode } = body as JoinTeamRequest;

    if (!teamCode || typeof teamCode !== "string") {
      logResponse("POST", "/api/team/join", 400, Date.now() - startTime);
      return errorResponse("Team code is required", 400);
    }

    const normalizedCode = teamCode.trim().toUpperCase();

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
      logResponse("POST", "/api/team/join", 400, Date.now() - startTime);
      return errorResponse("Please complete your profile setup first", 400);
    }

    if (user.vitStudent.teamId) {
      logResponse("POST", "/api/team/join", 400, Date.now() - startTime);
      return errorResponse("You are already in a team. Leave your current team first.", 400);
    }

    // Find team by code and check member count
    const team = await prisma.team.findUnique({
      where: { code: normalizedCode },
      include: {
        vitStudents: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!team) {
      logResponse("POST", "/api/team/join", 404, Date.now() - startTime);
      return errorResponse("Invalid team code. Please check and try again.", 404);
    }

    // Check if team is full (max 5 members)
    if (team.vitStudents.length >= 5) {
      logResponse("POST", "/api/team/join", 400, Date.now() - startTime);
      return errorResponse("Team is full. Maximum 5 members allowed.", 400);
    }

    // Update VITStudent with team ID
    await prisma.vITStudent.update({
      where: { id: user.vitStudent.id },
      data: { teamId: team.id },
    });

    logResponse("POST", "/api/team/join", 200, Date.now() - startTime);
    return successResponse(undefined, "Successfully joined team");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[API] POST /api/team/join error:", {
      error: errorMessage,
      timestamp: new Date().toISOString(),
      duration: `${Date.now() - startTime}ms`,
    });

    logResponse("POST", "/api/team/join", 500, Date.now() - startTime);
    return errorResponse("Failed to join team. Please try again.", 500);
  }
}
