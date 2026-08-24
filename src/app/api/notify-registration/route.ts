import { NextResponse } from "next/server";

const ADMIN_EMAIL = "yurigolo@mail.com";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, country } = body;

    const timestamp = new Date().toLocaleString("en-GB", {
      dateStyle: "full",
      timeStyle: "short",
    });

    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #0d3320 0%, #166534 100%); padding: 32px 24px; text-align: center; border-radius: 12px 12px 0 0;">
          <h1 style="color: #c9a84c; margin: 0; font-size: 24px; letter-spacing: 3px; font-weight: 700;">CROSSHILL CAPITAL</h1>
          <p style="color: rgba(255,255,255,0.7); margin: 8px 0 0; font-size: 13px;">Investment Platform</p>
        </div>
        <div style="padding: 32px 24px; background: #f8fafc; border: 1px solid #e2e8f0; border-top: none;">
          <div style="background: #ffffff; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;">
            <h2 style="color: #0d3320; margin: 0 0 8px; font-size: 20px;">New Investor Registration</h2>
            <p style="color: #64748b; margin: 0 0 20px; font-size: 14px;">A new investor has just signed up on the platform.</p>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #374151; font-size: 14px; width: 120px;">Name</td>
                <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; color: #111827; font-size: 14px;">${fullName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #374151; font-size: 14px;">Email</td>
                <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; color: #111827; font-size: 14px;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; font-weight: 600; color: #374151; font-size: 14px;">Country</td>
                <td style="padding: 12px 16px; border-bottom: 1px solid #f1f5f9; color: #111827; font-size: 14px;">${country}</td>
              </tr>
              <tr>
                <td style="padding: 12px 16px; font-weight: 600; color: #374151; font-size: 14px;">Registered</td>
                <td style="padding: 12px 16px; color: #111827; font-size: 14px;">${timestamp}</td>
              </tr>
            </table>
          </div>
          <p style="color: #94a3b8; font-size: 12px; margin: 20px 0 0; text-align: center;">
            Log in to the admin panel to review this investor's account.
          </p>
        </div>
        <div style="padding: 16px 24px; text-align: center; border-radius: 0 0 12px 12px; background: #f1f5f9;">
          <p style="color: #94a3b8; font-size: 11px; margin: 0;">&copy; ${new Date().getFullYear()} CROSSHILL CAPITAL. All rights reserved.</p>
        </div>
      </div>
    `;

    if (process.env.RESEND_API_KEY) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "CROSSHILL CAPITAL <onboarding@resend.dev>",
          to: [ADMIN_EMAIL],
          subject: `New Investor: ${fullName} (${country})`,
          html: emailHtml,
        }),
      });

      if (!res.ok) {
        console.error("Failed to send email:", await res.text());
      }
    } else {
      console.log("=== NEW REGISTRATION ===");
      console.log(`Name: ${fullName} | Email: ${email} | Country: ${country}`);
      console.log("========================");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Notification error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
