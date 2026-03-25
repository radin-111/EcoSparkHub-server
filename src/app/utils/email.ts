import nodemailer from "nodemailer";
import { envConfig } from "../config/env";
import path from "path";
import ejs from "ejs";

interface sendEmailProps {
  to: string;
  subject: string;
  templateName: string;
  templateData: Record<string, any>;
  attachments?: {
    filename: string;
    content: Buffer | string;
    contentType: string;
  }[];
}

const transporter = nodemailer.createTransport({
  host: envConfig.EMAIL_SENDER.EMAIL_SENDER_HOST,
  port: Number(envConfig.EMAIL_SENDER.EMAIL_SENDER_PORT),
  secure: true,
  auth: {
    user: envConfig.EMAIL_SENDER.EMAIL_SENDER_EMAIL,
    pass: envConfig.EMAIL_SENDER.EMAIL_SENDER_PASS,
  },
});

export const sendEmailOtp = async ({
  to,
  subject,
  templateName,
  templateData,
  attachments,
}: sendEmailProps) => {
  try {
    const templatePath = path.resolve(
      process.cwd(),
      `src/app/templates/${templateName}.ejs`,
    );

    const html = await ejs.renderFile(templatePath, templateData);
    const emailInfo = await transporter.sendMail({
      from: `${envConfig.EMAIL_SENDER.EMAIL_SENDER_NAME} <${envConfig.EMAIL_SENDER.EMAIL_SENDER_EMAIL}>`,
      to,
      subject,
      html,
      attachments: attachments?.map((item) => ({
        filename: item.filename,
        content: item.content,
        contentType: item.contentType,
      })),
    });
    console.log(`email sent : ${emailInfo.messageId} , ${emailInfo.accepted}`);
  } catch (error) {
    console.log(error);
    throw new Error("Email not sent");
  }
};
