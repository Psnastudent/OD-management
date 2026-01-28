import { User } from "../types";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send verification email
export const sendVerificationEmail = async (user: User, otp: number) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: user.email,
    subject: "Verify Your Email",
    html: `<p>Your OTP is ${otp}. It will expire in 8 minutes.</p>`,
  });
};

// Send reset password email
export const sendResetPasswordEmail = async (user: User, otp: number) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: user.email,
    subject: "Reset Your Password",
    html: `<p>Your OTP is ${otp}. It will expire in 8 minutes.</p>`,
  });
};

// Generic sendEmail
export const sendEmail = async ({
  to,
  subject,
  message,
}: {
  to: string;
  subject: string;
  message: string;
}) => {
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to,
    subject,
    html: message,
  });
};
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Error:", error);
  } else {
    console.log("SMTP Connection Successful!");
  }
});
