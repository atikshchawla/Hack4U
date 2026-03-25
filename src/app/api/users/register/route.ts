import { prisma } from "@/lib/prisma";
import {
	errorResponse,
	successResponse,
	parseJsonBody,
	logRequest,
	logResponse,
} from "@/lib/api-helpers";
import { auth } from "@/auth";
import type { NextRequest } from "next/server";
import type { NextResponse } from "next/server";

interface RegisterRequest {
	name: string;
	regNo: string;
	year: number;
	phone: string;
	accommodation: string;
	hostelType?: string | null;
	block?: string | null;
	room?: string | null;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
	const startTime = Date.now();

	try {
		logRequest("POST", "/api/users/register");

		const session = await auth();
		if (!session?.user?.email) {
			logResponse("POST", "/api/users/register", 401, Date.now() - startTime);
			return errorResponse("Unauthorized", 401);
		}

		const body = await parseJsonBody(request);
		const { name, regNo, year, phone, accommodation, hostelType, block, room } =
			body as RegisterRequest;

		if (!name || typeof name !== "string" || name.trim().length === 0) {
			logResponse("POST", "/api/users/register", 400, Date.now() - startTime);
			return errorResponse(
				"Name is required and must be a non-empty string",
				400,
			);
		}

		if (!regNo || typeof regNo !== "string" || regNo.trim().length === 0) {
			logResponse("POST", "/api/users/register", 400, Date.now() - startTime);
			return errorResponse("Registration number is required", 400);
		}

		if (!year || typeof year !== "number" || year < 1 || year > 4) {
			logResponse("POST", "/api/users/register", 400, Date.now() - startTime);
			return errorResponse("Valid year (1-4) is required", 400);
		}

		if (!phone || typeof phone !== "string" || !/^[6-9]\d{9}$/.test(phone)) {
			logResponse("POST", "/api/users/register", 400, Date.now() - startTime);
			return errorResponse("Please enter a valid phone number", 400);
		}

		if (!accommodation || !["hostel", "dayscholar"].includes(accommodation)) {
			logResponse("POST", "/api/users/register", 400, Date.now() - startTime);
			return errorResponse("Valid accommodation type is required", 400);
		}

		// Update or create user
		const user = await prisma.user.upsert({
			where: { email: session.user.email },
			update: {
				name: name.trim(),
				isRegistered: true,
			},
			create: {
				email: session.user.email,
				name: name.trim(),
				isRegistered: true,
				image: session.user.image || null,
			},
			select: {
				id: true,
				name: true,
				email: true,
				image: true,
				isRegistered: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		// Create or update VITStudent record
		await prisma.vITStudent.upsert({
			where: { userId: user.id },
			update: {
				name: name.trim(),
				regNo: regNo.trim().toUpperCase(),
				year,
				phone: phone.trim(),
				accommodation,
				hostelType: accommodation === "hostel" ? hostelType : null,
				block: accommodation === "hostel" ? block : null,
				room: accommodation === "hostel" ? room : null,
			},
			create: {
				userId: user.id,
				name: name.trim(),
				regNo: regNo.trim().toUpperCase(),
				year,
				phone: phone.trim(),
				accommodation,
				hostelType: accommodation === "hostel" ? hostelType : null,
				block: accommodation === "hostel" ? block : null,
				room: accommodation === "hostel" ? room : null,
			},
		});

		logResponse("POST", "/api/users/register", 200, Date.now() - startTime);
		return successResponse(user, "User registered successfully");
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error";
		console.error("[API] POST /api/users/register error:", {
			error: errorMessage,
			stack: error instanceof Error ? error.stack : undefined,
			timestamp: new Date().toISOString(),
			duration: `${Date.now() - startTime}ms`,
		});

		// Better error messages for common issues
		let clientMessage = "Failed to register user. Please try again.";

		if (
			errorMessage.includes("Unique constraint failed") ||
			errorMessage.includes("duplicate")
		) {
			clientMessage =
				"This registration number is already registered. Please check and try again.";
		} else if (errorMessage.includes("connect")) {
			clientMessage = "Database connection error. Please try again.";
		}

		logResponse("POST", "/api/users/register", 500, Date.now() - startTime);
		return errorResponse(clientMessage, 500);
	}
}
