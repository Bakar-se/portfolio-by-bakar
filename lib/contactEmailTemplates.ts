/** Escape user-controlled strings for safe HTML email bodies. */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatMultilineForHtml(text: string): string {
  return escapeHtml(text).replace(/\r\n/g, "\n").replace(/\n/g, "<br>");
}

const accent = "#4f46e5";
const accentSoft = "#eef2ff";
const ink = "#18181b";
const muted = "#71717a";
const border = "#e4e4e7";
const surface = "#fafafa";

function emailShell(inner: string, footer: string): string {
  const safeFooter = escapeHtml(footer);
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Email</title>
</head>
<body style="margin:0;padding:0;background-color:${surface};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:${surface};padding:40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(15,23,42,0.08);border:1px solid ${border};">
          ${inner}
        </table>
        <p style="margin:24px 0 0;font-size:12px;color:${muted};line-height:1.5;max-width:560px;text-align:center;">
          ${safeFooter}
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

export function buildAdminNotificationHtml(params: {
  name: string;
  email: string;
  message: string;
}): string {
  const { name, email, message } = params;
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  /** `email` is validated in the API before templates run. */
  const mailHrefAttr = escapeHtml(`mailto:${email}`);
  const safeMessage = formatMultilineForHtml(message);

  const inner = `
          <tr>
            <td style="background:linear-gradient(135deg,#1e1b4b 0%,${accent} 100%);padding:28px 32px;">
              <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.85);">New inquiry</p>
              <h1 style="margin:8px 0 0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">Someone reached out</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 20px;font-size:15px;color:${ink};line-height:1.6;">You have a new message from your portfolio contact form.</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:separate;border-spacing:0 12px;">
                <tr>
                  <td style="padding:14px 16px;background:${accentSoft};border-radius:10px;border-left:4px solid ${accent};">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:${accent};">Name</p>
                    <p style="margin:0;font-size:16px;font-weight:600;color:${ink};">${safeName}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 16px;background:${accentSoft};border-radius:10px;border-left:4px solid ${accent};">
                    <p style="margin:0 0 4px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:${accent};">Email</p>
                    <p style="margin:0;font-size:16px;color:${ink};"><a href="${mailHrefAttr}" style="color:${accent};text-decoration:none;font-weight:500;">${safeEmail}</a></p>
                  </td>
                </tr>
              </table>
              <p style="margin:24px 0 8px;font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:${muted};">Message</p>
              <div style="padding:18px 20px;background:#f4f4f5;border-radius:12px;border:1px solid ${border};font-size:15px;color:${ink};line-height:1.65;">${safeMessage}</div>
            </td>
          </tr>`;

  return emailShell(
    inner,
    "Internal notification from your portfolio contact form.",
  );
}

export function buildAdminNotificationText(params: {
  name: string;
  email: string;
  message: string;
}): string {
  return [
    "New contact form submission",
    "",
    `Name: ${params.name}`,
    `Email: ${params.email}`,
    "",
    "Message:",
    params.message,
  ].join("\n");
}

export function buildSubmitterConfirmationHtml(params: {
  name: string;
}): string {
  const firstName = params.name.trim().split(/\s+/)[0] ?? params.name;
  const greeting = escapeHtml(firstName);

  const inner = `
          <tr>
            <td style="background:linear-gradient(135deg,#1e1b4b 0%,${accent} 100%);padding:28px 32px;text-align:center;">
              <p style="margin:0;font-size:36px;line-height:1;" aria-hidden="true">✉️</p>
              <h1 style="margin:12px 0 0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">We got your message</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px;font-size:16px;color:${ink};line-height:1.6;">Hi ${greeting},</p>
              <p style="margin:0 0 16px;font-size:15px;color:${ink};line-height:1.65;">Thank you for reaching out through my portfolio. Your email was received successfully.</p>
              <p style="margin:0 0 24px;font-size:15px;color:${ink};line-height:1.65;">I will get back to you <strong style="color:${accent};">within 24 hours</strong>. If your note is time-sensitive, feel free to reply to this message.</p>
              <div style="padding:16px 18px;background:${accentSoft};border-radius:12px;border:1px solid rgba(79,70,229,0.15);">
                <p style="margin:0;font-size:14px;color:${ink};line-height:1.55;">Talk soon,<br><span style="font-weight:600;">Muhammad Abu Bakar</span></p>
              </div>
            </td>
          </tr>`;

  return emailShell(
    inner,
    "You are receiving this because you used the contact form on my portfolio.",
  );
}

export function buildSubmitterConfirmationText(params: {
  name: string;
}): string {
  const firstName = params.name.trim().split(/\s+/)[0] ?? params.name;
  return [
    `Hi ${firstName},`,
    "",
    "Thank you for reaching out through my portfolio. Your email was received successfully.",
    "",
    "I will get back to you within 24 hours. If your note is time-sensitive, feel free to reply to this message.",
    "",
    "Talk soon,",
    "Muhammad Abu Bakar",
  ].join("\n");
}
