import nodemailer from "nodemailer";
import nodemailerConfig from "./nodemailerConfig";

const transporter = nodemailer.createTransport(nodemailerConfig);

export const sendEmail = async (option: {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}) => {
  const { to, subject, text, html } = option;

  try {
    const info = await transporter.sendMail({
      from: process.env.email || "",
      to,
      subject,
      text,
      html,
    });
    console.log("Message sent: %s", info.messageId);
  } catch (error) {
    console.error("Error occurred while sending email:", error);
  }
};
