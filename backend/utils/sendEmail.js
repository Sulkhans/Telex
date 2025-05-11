import nodemailer from "nodemailer";

const sendEmail = async (to, user, link) => {
  let html = template
  .replace(/\{\{user\}\}/g, user)
  .replace(/\{\{confirmationLink\}\}/g, link);

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Telex",
    html,
  });
};

const template = `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Confirm Your Telex Registration</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-size: 16px; line-height: 1.6; color: #09090b; background-color: #f8f8fb;">
      <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" style="padding: 40px 0">
            <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" style="border-collapse: collapse; max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
              <tr>
                <td style="background-color: #09090b; padding: 24px 40px; text-align: center; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 500; display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
                    <svg width="32" viewBox="90 90 315 315" fill="#ffffff" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                      <circle cx="307" cy="141" r="38.5" />
                      <circle cx="193" cy="250" r="38.5" />
                      <circle cx="307" cy="250" r="38.5" />
                      <circle cx="193" cy="359" r="38.5" />
                    </svg>
                    TELEX
                  </h1>
                </td>
              </tr>
              <tr>
                <td style="padding: 40px">
                  <h2 style="margin-top: 0; margin-bottom: 20px; color: oklch(0.141 0.005 285.823); font-size: 22px;">Confirm Your Registration</h2>
                  <p style="margin-bottom: 24px">Hello, {{user}}</p>
                  <p style="margin-bottom: 24px">Thank you for registering on Telex! To complete your registration and activate your account, please click the confirmation button below:</p>
                  <p style="text-align: center; margin: 32px 0">
                    <a href="{{confirmationLink}}" target="_blank" style="display: inline-block; background-color: #09090b; color: #ffffff; font-weight: 500; text-decoration: none; padding: 12px 32px; border-radius: 6px; font-size: 16px;">Confirm Registration</a>
                  </p>
                  <p style="margin-bottom: 24px">If the button above doesn't work, you can also copy and paste the following link into your browser:</p>
                  <p style="background-color: #f5f5f5; padding: 12px; border-radius: 4px; word-break: break-all; margin-bottom: 24px; font-size: 14px;">{{confirmationLink}}</p>
                  <p style="margin-bottom: 12px">This confirmation link will expire in 24 hours for security reasons.</p>
                  <p style="margin-bottom: 24px">If you didn't create an account with Telex, you can safely ignore this email.</p>
                  <p style="margin-bottom: 8px">Best regards,</p>
                  <p style="margin-top: 0">The Telex Team</p>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f8f8f8; padding: 25px 40px; text-align: center; font-size: 14px; color: #666666; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                  <p style="margin: 0 0 8px 0">© 2025 Telex. All rights reserved.</p>
                  <p style="margin: 0; color: #09090b"><a>Privacy Policy</a> • <a>Terms of Service</a> • <a>Contact Us</a></p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
`

export default sendEmail;
