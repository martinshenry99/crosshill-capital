import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email } = body;

    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || "456");
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.EMAIL_FROM || "CROSSHILL CAPITAL <office@termoprodukt.com>";

    if (host && user && pass) {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465 || port === 456,
        auth: { user, pass },
        tls: {
          rejectUnauthorized: false,
        },
      });

      await transporter.sendMail({
        from,
        to: email,
        subject: "Welcome to CROSSHILL CAPITAL",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 520px; margin: 0 auto; padding: 48px 24px;">
            <h2 style="font-size: 22px; font-weight: 500; color: #0d3320; margin-bottom: 8px;">CROSSHILL CAPITAL</h2>
            <p style="font-size: 14px; color: #64748b; margin: 0 0 32px;">Investment platform</p>
            
            <p style="font-size: 16px; color: #111827; line-height: 1.6; margin-bottom: 24px;">
              Hi ${fullName || "there"},
            </p>
            
            <p style="font-size: 16px; color: #111827; line-height: 1.6; margin-bottom: 24px;">
              Welcome to CROSSHILL CAPITAL. Your account has been created and we’re glad to have you on board.
            </p>
            
            <p style="font-size: 16px; color: #111827; line-height: 1.6; margin-bottom: 32px;">
              Please confirm your email to access your dashboard and explore our investment plans.
            </p>
            
            <a href="https://crosshill-capital.vercel.app/login" style="display: inline-block; background-color: #166534; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-size: 15px; font-weight: 500;">Go to login</a>
            
            <p style="font-size: 12px; color: #9ca3af; margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
              If you have any questions, reply to this email. We’re here to help.
            </p>
          </div>
        `,
      });
    } else {
      console.log("=== WELCOME EMAIL (not sent, SMTP not configured) ===");
      console.log(`To: ${email} | Name: ${fullName}`);
      console.log("=====================================================");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Welcome email error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
