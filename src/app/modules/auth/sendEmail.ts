import nodemailer from "nodemailer";
import config from "../../../config";

// Create a test account or replace with real credentials.
const sendEmail = async (email: string, resetLink: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.emailSender.email,
      pass: config.emailSender.email_sender_pass,
    },
  });

  // Wrap in an async IIFE so we can use await.
  const info = await transporter.sendMail({
    from: '"My Health Care" <abdullahnoman4537@gmail.com>',
    to: email,
    subject: "Reset Password Link",
    html: `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <title>Reset Your Password</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }
          .button {
            display: inline-block;
            padding: 12px 20px;
            margin-top: 20px;
            background-color: #4CAF50;
            color: white;
            text-decoration: none;
            border-radius: 6px;
          }
          .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #888888;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h2>Password Reset Request</h2>
          <p>Hi,</p>
          <p>You recently requested to reset your password for your My Health Care account. Click the button below to reset it.</p>
          <a href="${resetLink}" class="button">Reset Your Password</a>
          <p>If you didn’t request a password reset, you can ignore this email. Your password will not change.</p>
          <div class="footer">
            <p>This link will expire in 15 minutes for security reasons.</p>
            <p>&copy; 2025 My Health Care</p>
          </div>
        </div>
      </body>
    </html>
  `,
  });
};

export default sendEmail;
