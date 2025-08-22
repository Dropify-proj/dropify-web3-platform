import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Return sanitized environment info (never expose secrets!)
    const envInfo = {
      nodeEnv: process.env.NODE_ENV,
      appName: process.env.APP_NAME,
      appUrl: process.env.APP_URL,
      // Only show if certain keys are configured (but not the actual values)
      hasDatabase: !!process.env.DATABASE_URL,
      hasEmailConfig: !!(process.env.SMTP_HOST && process.env.SMTP_USER),
      hasOpenAI: !!process.env.OPENAI_API_KEY,
      hasStripe: !!(process.env.STRIPE_PUBLIC_KEY && process.env.STRIPE_SECRET_KEY),
      hasAuth: !!process.env.NEXTAUTH_SECRET,
      // Timestamp
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json({
      message: 'Environment configuration status',
      environment: envInfo,
    });

  } catch (error) {
    console.error('Environment check error:', error);
    return NextResponse.json(
      { error: 'Failed to check environment configuration' },
      { status: 500 }
    );
  }
}
