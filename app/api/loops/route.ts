import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { email, firstName } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!firstName || firstName.trim() === "") {
      return NextResponse.json(
        { error: "First name is required" },
        { status: 400 }
      );
    }

    const loopsApiKey = process.env.LOOPS_API_KEY;
    if (!loopsApiKey) {
      console.error("LOOPS_API_KEY is not set");
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
          firstName,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Loops API error:", data);
      return NextResponse.json(
        { error: "Failed to create contact in Loops", details: data },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error syncing to Loops:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
