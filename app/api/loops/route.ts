import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { timingSafeEqual } from "crypto";

// Simple in-memory rate limiting
const rateLimit = new Map<string, { count: number; timestamp: number }>();
const WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS = 10;

function getClientIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded
    ? forwarded.split(",")[0]
    : request.headers.get("x-real-ip") || "unknown";
  return ip;
}

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimit.get(identifier);

  if (!record || now - record.timestamp > WINDOW_MS) {
    rateLimit.set(identifier, { count: 1, timestamp: now });
    return true;
  }

  if (record.count >= MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

function isValidSecret(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export async function POST(request: NextRequest) {
  // Rate limiting check
  const clientId = getClientIdentifier(request);
  if (!checkRateLimit(clientId)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  try {
    const { email, firstName } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    const internalSecret = process.env.INTERNAL_API_SECRET;
    const headerSecret = request.headers.get("x-internal-auth");

    if (!internalSecret) {
      logger.error("INTERNAL_API_SECRET is not set");
      return NextResponse.json(
        { error: "Internal API secret not configured" },
        { status: 500 }
      );
    }

    if (!headerSecret || !isValidSecret(headerSecret, internalSecret)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const loopsApiKey = process.env.LOOPS_API_KEY;
    if (!loopsApiKey) {
      logger.error("LOOPS_API_KEY is not set");
      return NextResponse.json(
        { error: "Loops API key not configured" },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://app.loops.so/api/v1/contacts/create",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${loopsApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          ...(firstName && { firstName }),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to create contact in Loops" },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    logger.error("Error syncing to Loops:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
