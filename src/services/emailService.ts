import emailjs from '@emailjs/browser';

interface MentorEmailParams {
  to_email: string;
  to_name: string;
  message: string;
}

export const sendMentorSignupEmail = async (params: MentorEmailParams): Promise<void> => {
  try {
    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      params,
    );

    if (response.status !== 200) {
      throw new Error('Failed to send email');
    }
  } catch (error) {
    console.error('EmailJS Error:', error);
    throw new Error('Failed to send confirmation email. Please contact support.');
  }
};
