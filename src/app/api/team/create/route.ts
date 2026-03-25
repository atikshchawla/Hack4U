import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { errorResponse, successResponse, parseJsonBody, logRequest, logResponse } from "@/lib/api-helpers";
import type { NextRequest } from "next/server";
import type { NextResponse } from "next/server";

interface CreateTeamRequest {
  teamName: string;
  description?: string;
}

// Generate a random 6-character team code
function generateTeamCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    logRequest("POST", "/api/team/create");

    // Get authenticated user
    const session = await auth();
    if (!session?.user?.email) {
      logResponse("POST", "/api/team/create", 401, Date.now() - startTime);
      return errorResponse("Unauthorized", 401);
    }

    // Check if user already has a team
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { 
        id: true,
        vitStudent: {
          select: {
            id: true,
            teamId: true,
          },
        },
      },
    });

    if (!user) {
      logResponse("POST", "/api/team/create", 404, Date.now() - startTime);
      return errorResponse("User not found", 404);
    }

    if (user.vitStudent?.teamId) {
      logResponse("POST", "/api/team/create", 400, Date.now() - startTime);
      return errorResponse("You are already part of a team", 400);
    }

    // Parse request body
    const body = await parseJsonBody(request);
    const { teamName, description } = body as CreateTeamRequest;

    if (!teamName || typeof teamName !== "string" || teamName.trim().length === 0) {
      logResponse("POST", "/api/team/create", 400, Date.now() - startTime);
      return errorResponse("Team name is required", 400);
    }

    // Generate unique team code
    let teamCode = generateTeamCode();
    let codeExists = true;
    let attempts = 0;

    while (codeExists && attempts < 10) {
      const existingTeam = await prisma.team.findUnique({
        where: { code: teamCode },
      });

      if (!existingTeam) {
        codeExists = false;
      } else {
        teamCode = generateTeamCode();
        attempts++;
      }
    }

    if (codeExists) {
      logResponse("POST", "/api/team/create", 500, Date.now() - startTime);
      return errorResponse("Failed to generate unique team code. Please try again.", 500);
    }

    if (!user.vitStudent) {
      logResponse("POST", "/api/team/create", 400, Date.now() - startTime);
      return errorResponse("Please complete your profile setup first", 400);
    }

    // Create team with category as empty string (required field)
    const team = await prisma.team.create({
      data: {
        name: teamName.trim(),
        code: teamCode,
        description: description?.trim() || null,
        category: "",
        leaderId: user.vitStudent.id,
      },
    });

    // Update VITStudent with team ID
    await prisma.vITStudent.update({
      where: { id: user.vitStudent.id },
      data: { teamId: team.id },
    });

    logResponse("POST", "/api/team/create", 200, Date.now() - startTime);
    return successResponse(
      { teamCode: team.code, teamName: team.name },
      "Team created successfully"
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[API] POST /api/team/create error:", {
      error: errorMessage,
      timestamp: new Date().toISOString(),
      duration: `${Date.now() - startTime}ms`,
    });

    logResponse("POST", "/api/team/create", 500, Date.now() - startTime);
    return errorResponse("Failed to create team. Please try again.", 500);
  }
}
