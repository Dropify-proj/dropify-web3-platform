// Example API route: app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

// In production, replace with actual database
const mockDatabase = {
  users: new Map(),
  receipts: new Map(),
  platformStats: {
    totalDropMinted: 5000000,
    totalDropBurned: 1000000,
    totalReceiptsProcessed: 25000,
    drfTreasuryBalance: 999000000
  }
};

export async function createUserPOST(req: NextRequest) {
  try {
    const { email, walletAddress } = await req.json();
    
    // Create new user
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user = {
      id: userId,
      email,
      walletAddress,
      dropBalance: 1000, // Welcome bonus
      drfBalance: 10000, // Welcome bonus
      createdAt: new Date().toISOString(),
      events: []
    };
    
    mockDatabase.users.set(userId, user);
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        walletAddress: user.walletAddress,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to create user'
    }, { status: 500 });
  }
}

// app/api/users/[userId]/balance/route.ts
export async function getUserBalanceGET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const user = mockDatabase.users.get(params.userId);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      dropBalance: user.dropBalance,
      drfBalance: user.drfBalance
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to get balance'
    }, { status: 500 });
  }
}

// app/api/receipts/scan/route.ts
export async function scanReceiptPOST(req: NextRequest) {
  try {
    const { userId, receiptHash, purchaseAmount } = await req.json();
    
    const user = mockDatabase.users.get(userId);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }
    
    // Check if receipt already processed
    if (mockDatabase.receipts.has(receiptHash)) {
      return NextResponse.json({
        success: false,
        error: 'Receipt already processed'
      }, { status: 400 });
    }
    
    // Calculate DROP reward (1% of purchase amount)
    const dropEarned = Math.floor(purchaseAmount * 0.01);
    
    // Update user balance
    user.dropBalance += dropEarned;
    
    // Record receipt
    const receipt = {
      id: `receipt_${Date.now()}`,
      userId,
      receiptHash,
      purchaseAmount,
      dropEarned,
      processedAt: new Date().toISOString()
    };
    
    mockDatabase.receipts.set(receiptHash, receipt);
    
    // Add event to user history
    user.events.unshift({
      id: `event_${Date.now()}`,
      type: 'receipt_scanned',
      timestamp: Date.now(),
      details: { receiptHash, purchaseAmount, dropEarned }
    });
    
    // Update platform stats
    mockDatabase.platformStats.totalDropMinted += dropEarned;
    mockDatabase.platformStats.totalReceiptsProcessed += 1;
    
    return NextResponse.json({
      success: true,
      dropEarned,
      transactionHash: `tx_${Math.random().toString(36).substr(2, 16)}`,
      receipt
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to scan receipt'
    }, { status: 500 });
  }
}

// app/api/rewards/redeem/route.ts
export async function redeemRewardPOST(req: NextRequest) {
  try {
    const { userId, rewardType, dropAmount } = await req.json();
    
    const user = mockDatabase.users.get(userId);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      }, { status: 404 });
    }
    
    // Check if user has enough DROP tokens
    if (user.dropBalance < dropAmount) {
      return NextResponse.json({
        success: false,
        error: 'Insufficient DROP balance'
      }, { status: 400 });
    }
    
    // Burn DROP tokens
    user.dropBalance -= dropAmount;
    
    // Add event to user history
    user.events.unshift({
      id: `event_${Date.now()}`,
      type: 'reward_redeemed',
      timestamp: Date.now(),
      details: { rewardType, dropAmount }
    });
    
    // Update platform stats
    mockDatabase.platformStats.totalDropBurned += dropAmount;
    
    return NextResponse.json({
      success: true,
      transactionHash: `tx_${Math.random().toString(36).substr(2, 16)}`,
      rewardType,
      dropBurned: dropAmount
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to redeem reward'
    }, { status: 500 });
  }
}

// app/api/platform/stats/route.ts
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      stats: mockDatabase.platformStats
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to get platform stats'
    }, { status: 500 });
  }
}
