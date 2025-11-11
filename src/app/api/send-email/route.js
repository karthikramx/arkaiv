import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(request) {
    try {
        const { to, subject, text, html } = await request.json();

        const msg = {
            to,
            from: 'no-reply@arkaiv.in',
            subject,
            text,
            html,
        };

        await sgMail.send(msg);

        return NextResponse.json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('SendGrid Error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to send email', error: error.message },
            { status: 500 }
        );
    }
}
