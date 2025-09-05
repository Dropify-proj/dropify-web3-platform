import { NextRequest, NextResponse } from 'next/server';
import { userDatabase } from '@/lib/user-database';

// Note: Sample data initialization moved to client-side for build compatibility

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');
  const walletAddress = searchParams.get('wallet');

  try {
    switch (action) {
      case 'profile':
        if (!walletAddress) {
          return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
        }
        
        const user = await userDatabase.getUser(walletAddress);
        if (!user) {
          const newUser = await userDatabase.createUser(walletAddress);
          return NextResponse.json({ success: true, user: newUser, isNew: true });
        }
        
        return NextResponse.json({ success: true, user, isNew: false });

      case 'achievements':
        if (!walletAddress) {
          return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
        }
        
        const achievements = await userDatabase.getUserAchievements(walletAddress);
        return NextResponse.json({ success: true, achievements });

      case 'analytics':
        if (!walletAddress) {
          return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
        }
        
        const analytics = await userDatabase.getUserAnalytics(walletAddress);
        return NextResponse.json({ success: true, analytics });

      case 'platform':
        const platformStats = await userDatabase.getPlatformAnalytics();
        return NextResponse.json({ success: true, platformStats });

      default:
        return NextResponse.json({ 
          error: 'Invalid action. Use: profile, achievements, analytics, or platform' 
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Database API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, walletAddress, data } = body;

    switch (action) {
      case 'create_user':
        if (!walletAddress) {
          return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
        }
        
        const newUser = await userDatabase.createUser(walletAddress, data?.email);
        return NextResponse.json({ success: true, user: newUser });

      case 'update_profile':
        if (!walletAddress || !data) {
          return NextResponse.json({ error: 'Wallet address and data required' }, { status: 400 });
        }
        
        const updatedUser = await userDatabase.updateUser(walletAddress, data);
        return NextResponse.json({ success: true, user: updatedUser });

      case 'unlock_achievement':
        if (!walletAddress || !data) {
          return NextResponse.json({ error: 'Wallet address and achievement data required' }, { status: 400 });
        }
        
        const achievement = await userDatabase.unlockAchievement(walletAddress, data);
        return NextResponse.json({ success: true, achievement });

      case 'create_redemption':
        if (!walletAddress || !data) {
          return NextResponse.json({ error: 'Wallet address and redemption data required' }, { status: 400 });
        }
        
        const redemption = await userDatabase.createRedemption(walletAddress, data);
        return NextResponse.json({ success: true, redemption });

      default:
        return NextResponse.json({ 
          error: 'Invalid action. Use: create_user, update_profile, unlock_achievement, or create_redemption' 
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Database API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
