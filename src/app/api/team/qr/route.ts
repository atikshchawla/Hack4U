import { auth } from "@/auth";
import {
	errorResponse,
	successResponse,
	logRequest,
	logResponse,
} from "@/lib/api-helpers";
import type { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";

export async function GET(request: NextRequest): Promise<NextResponse> {
	const startTime = Date.now();

	try {
		logRequest("GET", "/api/team/qr");

		const session = await auth();
		if (!session?.user?.email) {
			logResponse("GET", "/api/team/qr", 401, Date.now() - startTime);
			return errorResponse("Unauthorized", 401);
		}

		const { searchParams } = new URL(request.url);
		const teamCode = searchParams.get("code");

		if (!teamCode) {
			logResponse("GET", "/api/team/qr", 400, Date.now() - startTime);
			return errorResponse("Team code is required", 400);
		}

		// Generate join URL
		const joinUrl = `https://localhost:3000/setup/join?code=${teamCode.toUpperCase()}`;

		// Generate QR code as data URL
		const qrCodeDataUrl = await QRCode.toDataURL(joinUrl, {
			width: 400,
			margin: 2,
			color: {
				dark: "#000000",
				light: "#FFFFFF",
			},
		});

		logResponse("GET", "/api/team/qr", 200, Date.now() - startTime);

		// Return JSON with data URL
		return successResponse(
			{
				qrCode: qrCodeDataUrl,
				joinUrl,
			},
			"QR code generated successfully",
		);
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error";
		console.error("[API] GET /api/team/qr error:", {
			error: errorMessage,
			timestamp: new Date().toISOString(),
			duration: `${Date.now() - startTime}ms`,
		});

		logResponse("GET", "/api/team/qr", 500, Date.now() - startTime);
		return errorResponse("Failed to generate QR code. Please try again.", 500);
	}
}
