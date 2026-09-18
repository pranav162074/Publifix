import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, text }) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Publifix <onboarding@resend.dev>',
      to,
      subject,
      text,
    });

    if (error) {
      console.error('Email send failed:', error.message);
    } else {
      console.log('Email sent successfully:', data.id);
    }
  } catch (error) {
    console.error('Email send failed:', error.message);
  }
};

export default sendEmail;