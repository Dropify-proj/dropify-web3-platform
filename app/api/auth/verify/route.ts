import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    
    // Demo password for Supra acquisition demo
    const DEMO_PASSWORD = 'SupraDropify2025!';
    
    if (password === DEMO_PASSWORD) {
      // Set authentication cookie
      const response = NextResponse.json({ 
        success: true, 
        message: 'Access granted to Dropify Technologies demo',
        demoType: 'email-to-wallet-technology'
      });
      
      response.cookies.set('demo-auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 24 hours
      });
      
      return response;
    } else {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid password - contact Dropify Technologies for access' 
      }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Authentication error' 
    }, { status: 500 });
  }
}
