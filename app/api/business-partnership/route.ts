import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessName, email, budget, rewardDetails } = body;

    // Validate required fields
    if (!businessName || !email || !budget || !rewardDetails) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Save to database
    // 2. Send email to business team
    // 3. Send confirmation email to business
    
    console.log('Business Partnership Request:', {
      businessName,
      email,
      budget,
      rewardDetails,
      timestamp: new Date().toISOString()
    });

    // For demo purposes, just return success
    return NextResponse.json({
      success: true,
      message: 'Partnership request submitted successfully! Our team will contact you within 24 hours.',
      data: {
        businessName,
        email,
        budget,
        submittedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Business partnership form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
