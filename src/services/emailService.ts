import emailjs from '@emailjs/browser';

interface MentorWaitlistParams {
  to_email: string;
  to_name: string;
  position?: number; // Optional waitlist position
  linkedin: string;
  biography: string;
}

export const sendMentorWaitlistEmail = async (params: MentorWaitlistParams): Promise<void> => {
  try {
    const templateParams = {
      to_email: params.to_email,
      to_name: params.to_name,
      position: params.position,
      message: `
        Dear ${params.to_name},

        Thank you for joining our mentorship platform waitlist! 
        
        We have received your application with the following details:
        - LinkedIn: ${params.linkedin}
        - Biography: ${params.biography.substring(0, 100)}...

        We'll review your profile and notify you when we're ready to onboard new mentors.

        Best regards,
        The Team
      `
    };

    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      templateParams
    );

    if (response.status !== 200) {
      throw new Error('Failed to send waitlist confirmation');
    }
  } catch (error) {
    console.error('EmailJS Error:', error);
    throw new Error('Failed to send waitlist confirmation. Please contact support.');
  }
};
