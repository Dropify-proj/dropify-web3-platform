'use client';

// Supra Network Configuration
export const SUPRA_CONFIG = {
  chainId: 6,
  name: "Supra Testnet",
  rpcUrl: "https://testnet-rpc.supra.com",
  explorerUrl: "https://testnet-explorer.supra.com",
  faucetUrl: "https://testnet-faucet.supra.com",
  contractAddress: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x1::dropify_dual_token"
};

// Transaction payload interfaces
interface TransactionPayload {
  type: string;
  function: string;
  type_arguments: string[];
  arguments: any[];
}

interface ReceiptScanResult {
  success: boolean;
  dropEarned: number;
  transactionHash?: string;
  error?: string;
}

interface RedemptionResult {
  success: boolean;
  rewardType: string;
  dropBurned: number;
  transactionHash?: string;
  error?: string;
}

interface PlatformStats {
  totalDropMinted: number;
  totalDropBurned: number;
  totalReceiptsProcessed: number;
  drfTreasuryBalance: number;
  testnetDrfDistributed: number;
  testnetDrfLimit: number;
}

// OCR Service interface for receipt processing
export class OCRService {
  static async processReceipt(file: File): Promise<{
    total: number;
    items: string[];
    receiptHash: string;
    vendor?: string;
    date?: string;
  }> {
    // This would normally call a real OCR API
    // For now, simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate a hash for the receipt
    const receiptData = await file.arrayBuffer();
    const hashArray = await crypto.subtle.digest('SHA-256', receiptData);
    const receiptHash = Array.from(new Uint8Array(hashArray))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Mock extracted data - in production this would come from OCR
    const mockTotal = Math.floor(Math.random() * 100) + 10 + Math.random();
    const mockItems = [
      'Coffee - $4.50',
      'Sandwich - $8.99', 
      'Tax - $1.25'
    ];

    return {
      total: mockTotal,
      items: mockItems,
      receiptHash: receiptHash.substring(0, 32), // Use first 32 chars
      vendor: 'Demo Store',
      date: new Date().toISOString().split('T')[0]
    };
  }
}

// Smart Contract Client
export class DropifyContract {
  private rpcUrl: string;
  private contractAddress: string;

  constructor() {
    this.rpcUrl = SUPRA_CONFIG.rpcUrl;
    this.contractAddress = SUPRA_CONFIG.contractAddress;
  }

  // Scan receipt and earn DROP tokens
  async scanReceipt(
    account: any,
    receiptHash: string,
    purchaseAmount: number
  ): Promise<ReceiptScanResult> {
    try {
      // Convert purchase amount to microtokens (6 decimals)
      const amountMicrotokens = Math.floor(purchaseAmount * 1_000_000);
      
      const payload: TransactionPayload = {
        type: "entry_function_payload",
        function: `${this.contractAddress}::scan_receipt`,
        type_arguments: [],
        arguments: [
          receiptHash,
          amountMicrotokens.toString()
        ]
      };

      // For demo mode, simulate transaction
      if (!account || account.constructor.name === 'MockAccount') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
          success: true,
          dropEarned: purchaseAmount,
          transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`
        };
      }

      // Real transaction submission would go here
      const txnHash = await this.submitTransaction(account, payload);
      
      return {
        success: true,
        dropEarned: purchaseAmount, // 1 DROP per dollar
        transactionHash: txnHash
      };

    } catch (error) {
      console.error('Receipt scan error:', error);
      return {
        success: false,
        dropEarned: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Redeem rewards by burning DROP tokens
  async redeemReward(
    account: any,
    rewardType: string,
    dropAmount: number
  ): Promise<RedemptionResult> {
    try {
      const amountMicrotokens = Math.floor(dropAmount * 1_000_000);
      
      const payload: TransactionPayload = {
        type: "entry_function_payload",
        function: `${this.contractAddress}::redeem_reward`,
        type_arguments: [],
        arguments: [
          rewardType,
          amountMicrotokens.toString()
        ]
      };

      // For demo mode, simulate transaction
      if (!account || account.constructor.name === 'MockAccount') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
          success: true,
          rewardType,
          dropBurned: dropAmount,
          transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`
        };
      }

      const txnHash = await this.submitTransaction(account, payload);
      
      return {
        success: true,
        rewardType,
        dropBurned: dropAmount,
        transactionHash: txnHash
      };

    } catch (error) {
      console.error('Reward redemption error:', error);
      return {
        success: false,
        rewardType,
        dropBurned: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Convert DROP to DRF (100 DROP = 1 DRF)
  async convertDropToDrf(
    account: any,
    dropAmount: number
  ): Promise<{ success: boolean; drfReceived: number; transactionHash?: string; error?: string }> {
    try {
      if (dropAmount < 100) {
        throw new Error('Minimum 100 DROP tokens required for conversion');
      }

      const amountMicrotokens = Math.floor(dropAmount * 1_000_000);
      
      const payload: TransactionPayload = {
        type: "entry_function_payload", 
        function: `${this.contractAddress}::convert_drop_to_drf`,
        type_arguments: [],
        arguments: [amountMicrotokens.toString()]
      };

      // For demo mode, simulate transaction
      if (!account || account.constructor.name === 'MockAccount') {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const drfReceived = Math.floor(dropAmount / 100);
        return {
          success: true,
          drfReceived,
          transactionHash: `0x${Math.random().toString(16).substr(2, 64)}`
        };
      }

      const txnHash = await this.submitTransaction(account, payload);
      const drfReceived = Math.floor(dropAmount / 100);
      
      return {
        success: true,
        drfReceived,
        transactionHash: txnHash
      };

    } catch (error) {
      console.error('DROP to DRF conversion error:', error);
      return {
        success: false,
        drfReceived: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  // Get platform statistics
  async getPlatformStats(): Promise<PlatformStats | null> {
    try {
      // In production, this would query the blockchain
      // For demo, return mock data
      return {
        totalDropMinted: 1_234_567,
        totalDropBurned: 234_567,
        totalReceiptsProcessed: 45_678,
        drfTreasuryBalance: 750_000_000,
        testnetDrfDistributed: 1_234_567,
        testnetDrfLimit: 250_000_000
      };
    } catch (error) {
      console.error('Error fetching platform stats:', error);
      return null;
    }
  }

  // Get user token balances
  async getUserBalances(accountAddress: string): Promise<{
    dropBalance: number;
    drfBalance: number;
  }> {
    try {
      // In production, this would query the user's token balances
      // For demo, return random values
      return {
        dropBalance: Math.floor(Math.random() * 1000) + 100,
        drfBalance: Math.floor(Math.random() * 50) + 10
      };
    } catch (error) {
      console.error('Error fetching user balances:', error);
      return { dropBalance: 0, drfBalance: 0 };
    }
  }

  // Submit transaction helper
  private async submitTransaction(account: any, payload: TransactionPayload): Promise<string> {
    try {
      if (account.signAndSubmitTransaction) {
        // Use wallet adapter method
        return await account.signAndSubmitTransaction(payload);
      } else {
        // Fallback to direct submission
        const response = await fetch(`${this.rpcUrl}/transactions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sender: account.address(),
            sequence_number: "0", // This should be fetched from account
            max_gas_amount: "2000",
            gas_unit_price: "100",
            expiration_timestamp_secs: Math.floor(Date.now() / 1000) + 600,
            payload
          })
        });

        if (!response.ok) {
          throw new Error(`Transaction failed: ${response.statusText}`);
        }

        const result = await response.json();
        return result.hash;
      }
    } catch (error) {
      console.error('Transaction submission error:', error);
      throw error;
    }
  }

  // Utility to check transaction status
  async getTransactionStatus(txnHash: string): Promise<{
    success: boolean;
    status?: string;
    error?: string;
  }> {
    try {
      const response = await fetch(`${this.rpcUrl}/transactions/by_hash/${txnHash}`);
      
      if (!response.ok) {
        throw new Error('Transaction not found');
      }

      const txn = await response.json();
      
      return {
        success: txn.success,
        status: txn.vm_status
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Export singleton instance
export const dropifyContract = new DropifyContract();
