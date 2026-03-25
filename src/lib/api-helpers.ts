import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Standard success response helper
 */
export function successResponse(data?: any, message: string = "Success", status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

/**
 * Standard error response helper
 */
export function errorResponse(message: string, status: number = 400, errors?: any) {
  return NextResponse.json(
    {
      success: false,
      message,
      ...(errors && { errors }),
    },
    { status }
  );
}

/**
 * Parse JSON body from request with error handling
 */
export async function parseJsonBody(request: NextRequest): Promise<any> {
  try {
    return await request.json();
  } catch (error) {
    throw new Error("Invalid JSON body");
  }
}

/**
 * Log incoming request
 */
export function logRequest(method: string, path: string, data?: any) {
  console.log(`[API] ${method} ${path}`, {
    timestamp: new Date().toISOString(),
    ...(data && { data }),
  });
}

/**
 * Log response
 */
export function logResponse(method: string, path: string, status: number, duration?: number) {
  console.log(`[API] ${method} ${path} - ${status}`, {
    timestamp: new Date().toISOString(),
    ...(duration && { duration: `${duration}ms` }),
  });
}
