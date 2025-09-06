#!/usr/bin/env ts-node

// Using native fetch API available in Node.js 18+
// No need for node-fetch import

// Supra Testnet Configuration
const TESTNET_CONFIG = {
  rpcUrl: "https://testnet-rpc.supra.com",
  explorerUrl: "https://testnet-explorer.supra.com",
  faucetUrl: "https://testnet-faucet.supra.com",
  chainId: 6
};

interface NetworkHealth {
  isOnline: boolean;
  latency?: number;
  blockHeight?: number;
  error?: string;
}

class TestnetHealthChecker {
  
  // Check if Supra Testnet is accessible
  async checkNetworkHealth(): Promise<NetworkHealth> {
    const startTime = Date.now();
    
    try {
      console.log('🌐 Checking Supra Testnet connectivity...');
      
      // Use AbortSignal.timeout() for native fetch timeout support
      const response = await fetch(TESTNET_CONFIG.rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'supra_getChainInfo',
          params: {},
          id: 1
        }),
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      const latency = Date.now() - startTime;
      
      if (!response.ok) {
        return {
          isOnline: false,
          error: `HTTP ${response.status}: ${response.statusText}`
        };
      }

      const data = await response.json() as any;
      
      return {
        isOnline: true,
        latency,
        blockHeight: data.result?.blockHeight || 0
      };
      
    } catch (error) {
      return {
        isOnline: false,
        latency: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown network error'
      };
    }
  }

  // Check if contract is deployed at expected address
  async checkContractDeployment(contractAddress: string): Promise<boolean> {
    try {
      console.log(`🔍 Checking contract deployment at: ${contractAddress}`);
      
      const response = await fetch(TESTNET_CONFIG.rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'supra_getAccountResource',
          params: {
            address: contractAddress,
            resource_type: `${contractAddress}::DualTokenManager`
          },
          id: 2
        })
      });

      const data = await response.json() as any;
      return data.result && !data.error;
      
    } catch (error) {
      console.error('Contract check error:', error);
      return false;
    }
  }

  // Validate wallet address format
  validateWalletAddress(address: string): boolean {
    // Supra addresses start with 0x and are 40 characters long (excluding 0x)
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  // Get account balance for testing
  async getAccountBalance(address: string): Promise<number> {
    try {
      if (!this.validateWalletAddress(address)) {
        throw new Error('Invalid wallet address format');
      }

      const response = await fetch(TESTNET_CONFIG.rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'supra_getAccountBalance',
          params: {
            address: address
          },
          id: 3
        })
      });

      const data = await response.json() as any;
      
      if (data.result) {
        return parseInt(data.result.balance) || 0;
      }
      
      return 0;
    } catch (error) {
      console.error('Balance check error:', error);
      return 0;
    }
  }

  // Run comprehensive testnet readiness check
  async runFullCheck(): Promise<void> {
    console.log('🚀 Running Dropify Testnet Readiness Check\n');
    
    // 1. Network connectivity
    console.log('1️⃣ Checking network connectivity...');
    const health = await this.checkNetworkHealth();
    
    if (health.isOnline) {
      console.log(`✅ Supra Testnet is online (${health.latency}ms latency)`);
      if (health.blockHeight) {
        console.log(`📊 Current block height: ${health.blockHeight}`);
      }
    } else {
      console.log(`❌ Supra Testnet is not accessible: ${health.error}`);
      return;
    }
    
    // 2. Contract deployment check
    console.log('\n2️⃣ Checking contract deployment...');
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x1::dropify_dual_token";
    const isDeployed = await this.checkContractDeployment(contractAddress);
    
    if (isDeployed) {
      console.log(`✅ Contract deployed at: ${contractAddress}`);
    } else {
      console.log(`⚠️ Contract not found at: ${contractAddress}`);
      console.log('📝 Run deployment script: npm run deploy:testnet');
    }
    
    // 3. Environment configuration
    console.log('\n3️⃣ Checking environment configuration...');
    const requiredEnvVars = [
      'NEXT_PUBLIC_SUPRA_RPC_URL',
      'NEXT_PUBLIC_SUPRA_CHAIN_ID',
      'NEXT_PUBLIC_CONTRACT_ADDRESS'
    ];
    
    let envConfigured = true;
    for (const envVar of requiredEnvVars) {
      if (process.env[envVar]) {
        console.log(`✅ ${envVar}: ${process.env[envVar]}`);
      } else {
        console.log(`❌ ${envVar}: Not configured`);
        envConfigured = false;
      }
    }
    
    if (!envConfigured) {
      console.log('📝 Copy .env.testnet to .env.local and configure');
    }
    
    // 4. Summary
    console.log('\n📋 Testnet Readiness Summary:');
    console.log(`🌐 Network: ${health.isOnline ? '✅ Online' : '❌ Offline'}`);
    console.log(`📦 Contract: ${isDeployed ? '✅ Deployed' : '⚠️ Not Found'}`);
    console.log(`⚙️ Environment: ${envConfigured ? '✅ Configured' : '❌ Missing Config'}`);
    
    if (health.isOnline && isDeployed && envConfigured) {
      console.log('\n🎉 Dropify is ready for Supra Testnet!');
      console.log('\n📋 Next steps:');
      console.log('1. npm run dev (start development server)');
      console.log('2. Connect your Supra wallet');
      console.log('3. Test receipt scanning');
      console.log(`4. Monitor transactions: ${TESTNET_CONFIG.explorerUrl}`);
    } else {
      console.log('\n⚠️ Some issues need to be resolved before going live.');
    }
  }
}

// Example usage for testing specific addresses
export async function testWalletAddress(address: string): Promise<void> {
  const checker = new TestnetHealthChecker();
  
  console.log(`🔍 Testing wallet address: ${address}`);
  
  if (!checker.validateWalletAddress(address)) {
    console.log('❌ Invalid address format');
    return;
  }
  
  const balance = await checker.getAccountBalance(address);
  console.log(`💰 Balance: ${balance} SUPRA`);
  
  if (balance === 0) {
    console.log(`🚰 Request testnet tokens: ${TESTNET_CONFIG.faucetUrl}`);
  }
}

// Run if called directly
if (require.main === module) {
  const checker = new TestnetHealthChecker();
  checker.runFullCheck().catch(console.error);
}

export { TestnetHealthChecker, TESTNET_CONFIG };
