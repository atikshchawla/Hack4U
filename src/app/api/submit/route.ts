import { prisma } from "@/lib/prisma";
import { validateSubmissionLinks } from "@/lib/validators";
import { errorResponse, successResponse, parseJsonBody, logRequest, logResponse } from "@/lib/api-helpers";
import { auth } from "@/auth";
import type { NextRequest } from "next/server";
import type { NextResponse } from "next/server";

interface SubmissionRequest {
  projectTitle: string;
  projectDescription: string;
  track: string;
  teamId: string;
  githubLink?: string | null;
  figmaLink?: string | null;
  pptLink?: string | null;
  otherLinks?: string | null;
  progressNote?: string | null;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    logRequest("GET", "/api/submit");

    const session = await auth();
    if (!session?.user?.email) {
      logResponse("GET", "/api/submit", 401, Date.now() - startTime);
      return errorResponse("Unauthorized", 401);
    }

    const { searchParams } = new URL(request.url);
    const teamId = searchParams.get("teamId");

    if (!teamId) {
      logResponse("GET", "/api/submit", 400, Date.now() - startTime);
      return errorResponse("teamId is required as query parameter", 400);
    }

    const team = await prisma.team.findUnique({
      where: { id: teamId },
      include: {
        vitStudents: {
          where: { 
            user: {
              email: session.user.email
            }
          },
          select: { id: true },
        },
      },
    });

    if (!team) {
      logResponse("GET", "/api/submit", 404, Date.now() - startTime);
      return errorResponse("Team not found", 404);
    }

    if (team.vitStudents.length === 0) {
      logResponse("GET", "/api/submit", 403, Date.now() - startTime);
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

    logResponse("GET", "/api/submit", 200, Date.now() - startTime);
    return successResponse(submission, "Submission data retrieved successfully");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[API] GET /api/submit error:", {
      error: errorMessage,
      timestamp: new Date().toISOString(),
      duration: `${Date.now() - startTime}ms`,
    });

    logResponse("GET", "/api/submit", 500, Date.now() - startTime);
    return errorResponse("Failed to retrieve submission. Please try again.", 500);
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now();

  try {
    logRequest("POST", "/api/submit");

    // Get authenticated user
    const session = await auth();
    if (!session?.user?.email) {
      logResponse("POST", "/api/submit", 401, Date.now() - startTime);
      return errorResponse("Unauthorized", 401);
    }

    // Parse request body
    const body = await parseJsonBody(request);

    // Validate request structure
    const submissionData = body as SubmissionRequest;

    if (!submissionData.teamId || typeof submissionData.teamId !== "string") {
      logResponse("POST", "/api/submit", 400);
      return errorResponse("teamId is required and must be a string", 400);
    }

    if (!submissionData.projectTitle?.trim()) {
      logResponse("POST", "/api/submit", 400);
      return errorResponse("Project title is required", 400);
    }

    if (!submissionData.track?.trim()) {
      logResponse("POST", "/api/submit", 400);
      return errorResponse("Track is required", 400);
    }

    // Verify team exists and user is a member
    const team = await prisma.team.findUnique({
      where: { id: submissionData.teamId },
      include: {
        vitStudents: {
          where: { userId: { not: null } },
          include: {
            user: {
              select: { email: true }
            }
          }
        }
      },
    });

    if (!team) {
      logResponse("POST", "/api/submit", 404, Date.now() - startTime);
      return errorResponse("Team not found", 404);
    }

    // Check if user is a team member
    const isMember = team.vitStudents.some(
      student => student.user?.email === session.user.email
    );

    if (!isMember) {
      logResponse("POST", "/api/submit", 403, Date.now() - startTime);
      return errorResponse("You are not a member of this team", 403);
    }

    // Validate submission links
    const validation = validateSubmissionLinks({
      githubLink: submissionData.githubLink,
      figmaLink: submissionData.figmaLink,
      pptLink: submissionData.pptLink,
      otherLinks: submissionData.otherLinks,
    });

    if (!validation.isValid) {
      logResponse("POST", "/api/submit", 400, Date.now() - startTime);
      const errorMessage = validation.errors 
        ? Object.entries(validation.errors).map(([field, msg]) => `${field}: ${msg}`).join(", ")
        : "Invalid submission links";
      return errorResponse(errorMessage, 400, validation.errors);
    }

    // Update team with latest submission data
    await prisma.team.update({
      where: { id: submissionData.teamId },
      data: {
        projectTitle: submissionData.projectTitle.trim(),
        projectDescription: submissionData.projectDescription?.trim() || null,
        track: submissionData.track.trim(),
        githubLink: validation.cleanedLinks.githubLink || null,
        figmaLink: validation.cleanedLinks.figmaLink || null,
        pptLink: validation.cleanedLinks.pptLink || null,
        otherLinks: validation.cleanedLinks.otherLinks || null,
        progressNote: submissionData.progressNote?.trim() || null,
        lastSubmittedAt: new Date(),
      },
    });

    logResponse("POST", "/api/submit", 200, Date.now() - startTime);
    return successResponse(undefined, "Submission saved successfully");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[API] POST /api/submit error:", {
      error: errorMessage,
      timestamp: new Date().toISOString(),
      duration: `${Date.now() - startTime}ms`,
    });

    logResponse("POST", "/api/submit", 500, Date.now() - startTime);
    return errorResponse("Failed to save submission. Please try again.", 500);
  }
}
