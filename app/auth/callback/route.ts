import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/protected";
  const safeNext =
    next.startsWith("/") && !next.startsWith("//") ? next : "/protected";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const firstName = user.user_metadata?.firstName;

        // Update profile with firstName
        if (firstName) {
          const { error: updateError } = await supabase
            .from("profiles")
            .update({ first_name: firstName })
            .eq("id", user.id);
          // Silently continue - non-critical operation
        }

        // Sync verified user to Loops
        if (user.email && process.env.LOOPS_API_KEY) {
          try {
            const loopsResponse = await fetch(
              "https://app.loops.so/api/v1/contacts/create",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  email: user.email,
                  ...(firstName && { firstName }),
                }),
              }
            );
            await loopsResponse.json();
          } catch (loopsError) {
            // Silently fail - non-critical operation
          }
        }
      }

      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  // Return to login with error if code exchange fails
  return NextResponse.redirect(
    `${origin}/auth/login?error=auth_callback_error`
  );
}
