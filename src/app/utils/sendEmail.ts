import nodemailer from 'nodemailer';
import config from '../config';

export const sendEmail = async (to: string, html: string) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: config.NODE_ENV === 'production',
    auth: {
      user: 'azharmahmud730@gmail.com',
      pass: 'xqcl wsty wygy mdmv',
    },
  });

  await transporter.sendMail({
    from: 'azharmahmud730@gmail.com', // sender address
    to,
    subject: 'Reset your Password within 5 minutes',
    text: 'Hello world?',
    html,
  });
};
