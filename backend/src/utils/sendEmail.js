import nodemailer from 'nodemailer';
import dns from 'node:dns/promises';

const sendEmail = async ({ to, subject, text }) => {
  try {
    const { address } = await dns.lookup('smtp.gmail.com', { family: 4 });

    const transporter = nodemailer.createTransport({
      host: address,
      port: 465,
      secure: true,
      tls: {
        servername: 'smtp.gmail.com',
      },
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `"Publifix" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
    console.log('Email sent successfully:', info.response);
  } catch (error) {
    console.error('Email send failed:', error.message);
  }
};

export default sendEmail;