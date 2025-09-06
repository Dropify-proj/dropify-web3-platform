// Testnet DRF Reward System Integration
// For Next.js frontend integration with the dual token contract

import React from 'react';

export interface TestnetDRFStatus {
  isActive: boolean;
  distributed: number;
  limit: number;
  pointsPerDRF: number;
  remainingDRF: number;
  progressPercentage: number;
}

export interface ReceiptScanResult {
  dropEarned: number;
  drfEarned: number;
  pointsEarned: number;
  transactionHash: string;
  timestamp: number;
}

export class TestnetDRFManager {
  private contractAddress: string;
  private client: any; // Supra client

  constructor(contractAddress: string, client: any) {
    this.contractAddress = contractAddress;
    this.client = client;
  }

  /**
   * Get current testnet DRF distribution status
   */
  async getTestnetStatus(): Promise<TestnetDRFStatus> {
    try {
      const [isActive, distributed, limit, pointsPerDRF] = await this.client.view({
        function: `${this.contractAddress}::dual_token::get_testnet_drf_status`,
        arguments: [this.contractAddress],
        type_arguments: [],
      });

      const remaining = await this.client.view({
        function: `${this.contractAddress}::dual_token::get_remaining_testnet_drf`,
        arguments: [this.contractAddress],
        type_arguments: [],
      });

      const progressPercentage = (distributed / limit) * 100;

      return {
        isActive,
        distributed: distributed / 100000000, // Convert from 8 decimals
        limit: limit / 100000000, // Convert from 8 decimals
        pointsPerDRF,
        remainingDRF: remaining[0] / 100000000, // Convert from 8 decimals
        progressPercentage,
      };
    } catch (error) {
      console.error('Error fetching testnet status:', error);
      throw error;
    }
  }

  /**
   * Calculate DRF reward for given points
   */
  async calculateDRFReward(points: number): Promise<number> {
    try {
      const result = await this.client.view({
        function: `${this.contractAddress}::dual_token::calculate_drf_reward`,
        arguments: [this.contractAddress, points],
        type_arguments: [],
      });

      return result[0] / 100000000; // Convert from 8 decimals to readable format
    } catch (error) {
      console.error('Error calculating DRF reward:', error);
      return 0;
    }
  }

  /**
   * Scan receipt and earn both DROP and DRF tokens
   */
  async scanReceiptWithDRF(
    userAccount: any,
    receiptHash: string,
    purchaseAmountCents: number
  ): Promise<ReceiptScanResult> {
    try {
      // First, calculate expected rewards
      const expectedDRF = await this.calculateDRFReward(purchaseAmountCents);
      
      const payload = {
        function: `${this.contractAddress}::dual_token::scan_receipt`,
        arguments: [
          receiptHash,
          purchaseAmountCents,
          this.contractAddress
        ],
        type_arguments: [],
      };

      const transaction = await this.client.generateTransaction(userAccount, payload);
      const signedTransaction = await this.client.signTransaction(userAccount, transaction);
      const result = await this.client.submitTransaction(signedTransaction);
      
      // Wait for transaction confirmation
      await this.client.waitForTransaction(result.hash);

      // Parse transaction events to get actual rewards
      const txnData = await this.client.getTransactionByHash(result.hash);
      const receiptEvent = txnData.events?.find((event: any) => 
        event.type.includes('ReceiptReward')
      );

      if (receiptEvent) {
        return {
          dropEarned: parseFloat(receiptEvent.data.drop_earned) / 100000000,
          drfEarned: parseFloat(receiptEvent.data.drf_earned) / 100000000,
          pointsEarned: parseFloat(receiptEvent.data.points_earned),
          transactionHash: result.hash,
          timestamp: parseFloat(receiptEvent.data.timestamp),
        };
      }

      throw new Error('Receipt scan event not found');
    } catch (error) {
      console.error('Error scanning receipt:', error);
      throw error;
    }
  }

  /**
   * Format DRF distribution progress for UI display
   */
  formatProgress(status: TestnetDRFStatus): string {
    const remainingMillions = status.remainingDRF / 1000000;
    const distributedMillions = status.distributed / 1000000;
    
    return `${distributedMillions.toFixed(1)}M / 250M DRF distributed (${remainingMillions.toFixed(1)}M remaining)`;
  }

  /**
   * Check if testnet distribution is still active
   */
  async isTestnetActive(): Promise<boolean> {
    const status = await this.getTestnetStatus();
    return status.isActive && status.remainingDRF > 0;
  }

  /**
   * Get user's potential DRF earnings for a purchase amount
   */
  async getEarningPreview(purchaseAmountCents: number): Promise<{
    dropTokens: number;
    drfTokens: number;
    points: number;
    worthInDollars: number;
  }> {
    try {
      const status = await this.getTestnetStatus();
      const points = purchaseAmountCents; // 1 point per cent
      const drfTokens = status.isActive ? await this.calculateDRFReward(points) : 0;
      
      // Calculate DROP tokens (1% of purchase amount by default)
      const dropTokens = purchaseAmountCents * 0.01;
      
      // Estimate value (approximate values for preview)
      const worthInDollars = (dropTokens * 0.01) + (drfTokens * 0.10); // Rough estimates
      
      return {
        dropTokens,
        drfTokens,
        points,
        worthInDollars,
      };
    } catch (error) {
      console.error('Error getting earning preview:', error);
      return {
        dropTokens: 0,
        drfTokens: 0,
        points: 0,
        worthInDollars: 0,
      };
    }
  }
}

// React Hook for testnet DRF integration
export function useTestnetDRF(contractAddress: string, client: any) {
  const [status, setStatus] = React.useState<TestnetDRFStatus | null>(null);
  const [loading, setLoading] = React.useState(false);
  
  const drfManager = React.useMemo(
    () => new TestnetDRFManager(contractAddress, client),
    [contractAddress, client]
  );

  const refreshStatus = React.useCallback(async () => {
    try {
      setLoading(true);
      const newStatus = await drfManager.getTestnetStatus();
      setStatus(newStatus);
    } catch (error) {
      console.error('Error refreshing DRF status:', error);
    } finally {
      setLoading(false);
    }
  }, [drfManager]);

  React.useEffect(() => {
    refreshStatus();
    
    // Refresh every 30 seconds
    const interval = setInterval(refreshStatus, 30000);
    return () => clearInterval(interval);
  }, [refreshStatus]);

  return {
    status,
    loading,
    refreshStatus,
    drfManager,
    isActive: status?.isActive && (status?.remainingDRF || 0) > 0,
    progressPercentage: status?.progressPercentage || 0,
  };
}

export default TestnetDRFManager;
