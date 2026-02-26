export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map<string, { code: string; expires: number }>();

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with 10-minute expiration
    otpStore.set(email, {
      code: otp,
      expires: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: 'Fakebook <no-reply@otp.shauryachopra.dev>', // Use your verified domain
      to: email,
      subject: 'Your Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="color: #0f172a; letter-spacing: 8px; font-size: 32px; margin: 0;">${otp}</h1>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    console.log('OTP sent successfully:', { email, id: data?.id });
    return NextResponse.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Endpoint to verify OTP
export async function PUT(request: Request) {
  try {
    const { email, otp } = await request.json();

    const stored = otpStore.get(email);

    if (!stored) {
      return NextResponse.json({ error: 'No OTP found for this email' }, { status: 400 });
    }

    if (Date.now() > stored.expires) {
      otpStore.delete(email);
      return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
    }

    if (stored.code !== otp) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    // OTP is valid, remove it
    otpStore.delete(email);
    return NextResponse.json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
