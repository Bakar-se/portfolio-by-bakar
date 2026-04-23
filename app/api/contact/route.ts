import { NextResponse } from "next/server";
import {
  buildAdminNotificationHtml,
  buildAdminNotificationText,
  buildSubmitterConfirmationHtml,
  buildSubmitterConfirmationText,
} from "@/lib/contactEmailTemplates";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/** Must use an address on a domain verified in Resend (e.g. abubakar.com). https://resend.com/domains */
const resendFrom =
  process.env.RESEND_FROM ?? "Portfolio Contact <contact@bakar.info>";

/** Inbox that receives contact form notifications (any valid email). */
const contactInbox =
  process.env.CONTACT_EMAIL ?? "contact@bakar.info";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, message, name } = body;

    // Input validation
    if (!email || !message || !name) {
      console.error("❌ Missing required fields:", { email, message, name });
      return NextResponse.json(
        { error: "All fields (email, message, name) are required" },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("❌ Invalid email format:", email);
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 },
      );
    }

    console.log("📧 Sending contact form submission:", { name, email });

    const adminHtml = buildAdminNotificationHtml({ name, email, message });
    const adminText = buildAdminNotificationText({ name, email, message });

    const { data: adminData, error: adminError } = await resend.emails.send({
      from: resendFrom,
      to: contactInbox,
      replyTo: email,
      subject: `New message from ${name}`,
      html: adminHtml,
      text: adminText,
    });

    if (adminError) {
      console.error("❌ Resend API error (inbox):", adminError);
      return NextResponse.json(
        {
          error: "Failed to send email. Please try again later.",
          details: adminError.message,
        },
        { status: 500 },
      );
    }

    const confirmHtml = buildSubmitterConfirmationHtml({ name });
    const confirmText = buildSubmitterConfirmationText({ name });

    const { error: confirmError } = await resend.emails.send({
      from: resendFrom,
      to: email,
      subject: "We received your message — thank you",
      html: confirmHtml,
      text: confirmText,
    });

    if (confirmError) {
      console.error("❌ Resend API error (auto-reply):", confirmError);
    }

    const data = { inbox: adminData, autoReplyOk: !confirmError };
    console.log("✅ Contact flow complete:", data);
    return NextResponse.json({
      success: true,
      message: confirmError
        ? "Your message was delivered; confirmation email could not be sent."
        : "Your message was sent. Check your inbox for a confirmation.",
      data,
    });
  } catch (error) {
    console.error("❌ Unexpected error in contact form:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred. Please try again later.",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
