import { createTransport } from "nodemailer";
export const sendEmail = async (to, subject, text) => {
  const transport = createTransport({
    host: process.env.MAIL_TRAP_HOST,
    port: process.env.MAIL_TRAP_PORT,
    auth: {
      user: process.env.MAIL_TRAP_USERNAME,
      pass: process.env.MAIL_TRAP_PASSWORD,
    },
  });
  await transport.sendMail({
    to,
    subject,
    text,
  });
};
