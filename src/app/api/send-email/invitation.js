import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(request) {
    try {
        const { inviter, to, subject } = await request.json();

        const signupLink = 'https://arkaiv.in/signup'; // Define the signup page link

        const text = `Hi,

You have been invited to join Arkaiv by ${inviter}.

Click here to sign up: ${signupLink}

Best regards,
Arkaiv Team`;

        const html = `<p>Hi,</p>
<p>You have been invited to join Arkaiv by <strong>${inviter}</strong>.</p>
<p><a href="${signupLink}">Click here to sign up</a></p>
<p>Best regards,<br>Arkaiv Team</p>`;

        const msg = {
            to,
            from: 'no-reply@arkaiv.in',
            subject,
            text,
            html,
        };

        await sgMail.send(msg);

        return NextResponse.json({ success: true, message: 'Invitation email sent successfully' });
    } catch (error) {
        console.error('SendGrid Error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to send invitation email', error: error.message },
            { status: 500 }
        );
    }
}
