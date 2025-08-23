// Temporary Dropify Contract Client (without Aptos dependency)
// This allows the platform to run locally while we fix the blockchain integration

export class DropifyContractClient {
  private moduleAddress: string;
  
  constructor(moduleAddress: string) {
    this.moduleAddress = moduleAddress;
    console.log('🔧 Dropify Contract Client initialized in demo mode');
  }

  // Mock functions for local testing
  async scanReceipt(userAccount: any, receiptHash: string, purchaseAmount: number) {
    console.log(`📄 Mock: Scanning receipt ${receiptHash} for $${purchaseAmount/100}`);
    return {
      success: true,
      dropEarned: Math.floor(purchaseAmount * 0.01), // 1% reward
      transactionHash: `0x${Math.random().toString(16).substr(2, 8)}`
    };
  }

  async redeemReward(userAccount: any, rewardType: string, dropAmount: number) {
    console.log(`🎁 Mock: Redeeming ${rewardType} for ${dropAmount} DROP tokens`);
    return {
      success: true,
      rewardType,
      dropBurned: dropAmount,
      transactionHash: `0x${Math.random().toString(16).substr(2, 8)}`
    };
  }

  async purchaseAdvertising(businessAccount: any, drfAmount: number, duration: number) {
    console.log(`📢 Mock: Business advertising purchase - ${drfAmount} DRF for ${duration} seconds`);
    return {
      success: true,
      drfSpent: drfAmount,
      duration,
      transactionHash: `0x${Math.random().toString(16).substr(2, 8)}`
    };
  }

  async getDRFBalance(address: string): Promise<number> {
    // Mock balance for testing
    return 1000000; // 1M DRF tokens
  }

  async getDROPBalance(address: string): Promise<number> {
    // Mock balance for testing  
    return 50000; // 50K DROP tokens
  }

  async getPlatformStats(adminAddress: string) {
    return {
      totalDropMinted: 5000000,
      totalDropBurned: 1000000,
      totalReceiptsProcessed: 25000,
      drfTreasuryBalance: 999000000 // 999M DRF remaining
    };
  }
}

// Export a default instance for immediate use
export const dropifyContract = new DropifyContractClient(
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x_mock_contract_address"
);

// Mock account class for testing
export class MockAccount {
  private address_value: string;
  
  constructor() {
    this.address_value = `0x${Math.random().toString(16).substr(2, 40)}`;
  }
  
  address() {
    return this.address_value;
  }
  
  toPrivateKeyObject() {
    return {
      privateKeyHex: process.env.ADMIN_PRIVATE_KEY || "0x_mock_private_key"
    };
  }
}

console.log('🔧 Temporary contract client loaded - blockchain features will work in demo mode');
