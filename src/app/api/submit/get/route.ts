import { prisma } from "@/lib/prisma";
import { errorResponse, successResponse, parseJsonBody, logRequest, logResponse } from "@/lib/api-helpers";
import { auth } from "@/auth";
import type { NextRequest } from "next/server";
import type { NextResponse } from "next/server";

interface GetSubmissionRequest {
  teamId?: string;
  teamCode?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    logRequest("POST", "/api/submit/get");

    const session = await auth();
    if (!session?.user?.email) {
      logResponse("POST", "/api/submit/get", 401, Date.now() - startTime);
      return errorResponse("Unauthorized", 401);
    }

    const body = await parseJsonBody(request);
    const { teamId, teamCode } = body as GetSubmissionRequest;

    if (!teamId && !teamCode) {
      logResponse("POST", "/api/submit/get", 400, Date.now() - startTime);
      return errorResponse("Either teamId or teamCode is required", 400);
    }

    const query = teamId ? { id: teamId } : { code: (teamCode as string).toUpperCase() };

    const team = await prisma.team.findUnique({
      where: query,
      select: {
        id: true,
        projectTitle: true,
        projectDescription: true,
        track: true,
        githubLink: true,
        figmaLink: true,
        pptLink: true,
        otherLinks: true,
        progressNote: true,
        lastSubmittedAt: true,
        vitStudents: {
          select: { 
            user: {
              select: { email: true }
            }
          },
        },
      },
    });

    if (!team) {
      logResponse("POST", "/api/submit/get", 404, Date.now() - startTime);
      return errorResponse("Team not found", 404);
    }

    // Check if user is a member of the team
    const isMember = team.vitStudents.some((vs) => vs.user?.email === session.user?.email);
    if (!isMember) {
      logResponse("POST", "/api/submit/get", 403, Date.now() - startTime);
      return errorResponse("You are not a member of this team", 403);
    }

    const submission = {
      teamId: team.id,
      projectTitle: team.projectTitle,
      projectDescription: team.projectDescription,
      track: team.track,
      githubLink: team.githubLink,
      figmaLink: team.figmaLink,
      pptLink: team.pptLink,
      otherLinks: team.otherLinks,
      progressNote: team.progressNote,
      lastSubmittedAt: team.lastSubmittedAt,
    };

    logResponse("POST", "/api/submit/get", 200, Date.now() - startTime);
    return successResponse(submission, "Submission data retrieved successfully");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[API] POST /api/submit/get error:", {
      error: errorMessage,
      timestamp: new Date().toISOString(),
      duration: `${Date.now() - startTime}ms`,
    });

    logResponse("POST", "/api/submit/get", 500, Date.now() - startTime);
    return errorResponse("Failed to retrieve submission data. Please try again.", 500);
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    logRequest("GET", "/api/submit/get");

    const session = await auth();
    if (!session?.user?.email) {
      logResponse("GET", "/api/submit/get", 401, Date.now() - startTime);
      return errorResponse("Unauthorized", 401);
    }

    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get("teamId");
    const teamCode = searchParams.get("teamCode");

    if (!teamId && !teamCode) {
      logResponse("GET", "/api/submit/get", 400, Date.now() - startTime);
      return errorResponse("Either teamId or teamCode query parameter is required", 400);
    }

    const query = teamId ? { id: teamId } : { code: (teamCode as string).toUpperCase() };

    const team = await prisma.team.findUnique({
      where: query,
      select: {
        id: true,
        projectTitle: true,
        projectDescription: true,
        track: true,
        githubLink: true,
        figmaLink: true,
        pptLink: true,
        otherLinks: true,
        progressNote: true,
        lastSubmittedAt: true,
        vitStudents: {
          select: { 
            user: {
              select: { email: true }
            }
          },
        },
      },
    });

    if (!team) {
      logResponse("GET", "/api/submit/get", 404, Date.now() - startTime);
      return errorResponse("Team not found", 404);
    }

    // Check if user is a member of the team
    const isMember = team.vitStudents.some((vs) => vs.user?.email === session.user?.email);
    if (!isMember) {
      logResponse("GET", "/api/submit/get", 403, Date.now() - startTime);
      return errorResponse("You are not a member of this team", 403);
    }

    const submission = {
      teamId: team.id,
      projectTitle: team.projectTitle,
      projectDescription: team.projectDescription,
      track: team.track,
      githubLink: team.githubLink,
      figmaLink: team.figmaLink,
      pptLink: team.pptLink,
      otherLinks: team.otherLinks,
      progressNote: team.progressNote,
      lastSubmittedAt: team.lastSubmittedAt,
    };

    logResponse("GET", "/api/submit/get", 200, Date.now() - startTime);
    return successResponse(submission, "Submission data retrieved successfully");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[API] GET /api/submit/get error:", {
      error: errorMessage,
      timestamp: new Date().toISOString(),
      duration: `${Date.now() - startTime}ms`,
    });

    logResponse("GET", "/api/submit/get", 500, Date.now() - startTime);
    return errorResponse("Failed to retrieve submission data. Please try again.", 500);
  }
}
