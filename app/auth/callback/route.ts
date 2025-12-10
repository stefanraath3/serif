import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/protected";

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
          await supabase
            .from("profiles")
            .update({ first_name: firstName })
            .eq("id", user.id);
        }

        // Sync verified user to Loops
        if (user.email) {
          try {
            await fetch(`${origin}/api/loops`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: user.email,
                firstName,
              }),
            });
          } catch (loopsError) {
            console.error("Failed to sync to Loops:", loopsError);
          }
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Return to login with error if code exchange fails
  return NextResponse.redirect(
    `${origin}/auth/login?error=auth_callback_error`
  );
}
