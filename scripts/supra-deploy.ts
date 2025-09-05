#!/usr/bin/env ts-node

import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';

const execAsync = promisify(exec);

// Supra Testnet Configuration
const TESTNET_CONFIG = {
  chainId: 6,
  rpcUrl: "https://testnet-rpc.supra.com",
  faucetUrl: "https://testnet-faucet.supra.com",
  explorerUrl: "https://testnet-explorer.supra.com"
};

interface DeploymentResult {
  success: boolean;
  contractAddress?: string;
  transactionHash?: string;
  error?: string;
}

class SupraTestnetDeployer {
  private contractPath: string;
  private configPath: string;

  constructor() {
    this.contractPath = path.join(process.cwd(), 'contracts');
    this.configPath = path.join(this.contractPath, 'Move.toml');
  }

  // Check if Supra CLI is installed
  async checkSupraCLI(): Promise<boolean> {
    try {
      await execAsync('supra --version');
      console.log('✅ Supra CLI found');
      return true;
    } catch (error) {
      console.error('❌ Supra CLI not found. Please install it from https://docs.supra.com');
      return false;
    }
  }

  // Initialize wallet if needed
  async initializeWallet(): Promise<string | null> {
    try {
      console.log('🔍 Checking for existing wallet...');
      
      // Try to get existing account
      const { stdout } = await execAsync('supra account list');
      
      if (stdout.includes('No accounts found') || stdout.trim() === '') {
        console.log('📝 Creating new testnet wallet...');
        
        // Create new account
        const createResult = await execAsync('supra account create');
        console.log('Wallet creation result:', createResult.stdout);
        
        // Get the created account address
        const listResult = await execAsync('supra account list');
        const addressMatch = listResult.stdout.match(/0x[a-fA-F0-9]+/);
        
        if (addressMatch) {
          const address = addressMatch[0];
          console.log(`✅ New wallet created: ${address}`);
          
          // Fund the account from testnet faucet
          console.log('💰 Requesting testnet tokens...');
          await this.requestTestnetTokens(address);
          
          return address;
        }
      } else {
        // Use existing account
        const addressMatch = stdout.match(/0x[a-fA-F0-9]+/);
        if (addressMatch) {
          const address = addressMatch[0];
          console.log(`✅ Using existing wallet: ${address}`);
          return address;
        }
      }
    } catch (error) {
      console.error('❌ Error with wallet setup:', error);
    }
    
    return null;
  }

  // Request testnet tokens from faucet
  async requestTestnetTokens(address: string): Promise<void> {
    try {
      console.log(`🚰 Requesting testnet SUPRA tokens for ${address}...`);
      
      // Use Supra CLI faucet command
      await execAsync(`supra faucet request ${address}`);
      
      console.log('✅ Testnet tokens requested successfully');
      console.log('⏳ Tokens should arrive within 1-2 minutes');
      
    } catch (error) {
      console.warn('⚠️ Auto-faucet failed. Please visit the faucet manually:');
      console.log(`🌐 ${TESTNET_CONFIG.faucetUrl}`);
      console.log(`📍 Address: ${address}`);
    }
  }

  // Compile the Move contract
  async compileContract(): Promise<boolean> {
    try {
      console.log('🔨 Compiling Move contract...');
      
      const { stdout, stderr } = await execAsync('supra move compile', {
        cwd: this.contractPath
      });
      
      if (stderr && stderr.includes('error')) {
        console.error('❌ Compilation failed:', stderr);
        return false;
      }
      
      console.log('✅ Contract compiled successfully');
      return true;
    } catch (error) {
      console.error('❌ Compilation error:', error);
      return false;
    }
  }

  // Deploy contract to testnet
  async deployContract(deployerAddress: string): Promise<DeploymentResult> {
    try {
      console.log('🚀 Deploying contract to Supra Testnet...');
      
      const { stdout, stderr } = await execAsync(
        `supra move publish --network testnet --sender ${deployerAddress}`,
        { cwd: this.contractPath }
      );
      
      if (stderr && stderr.includes('error')) {
        return {
          success: false,
          error: stderr
        };
      }
      
      // Extract transaction hash and contract address from output
      const txHashMatch = stdout.match(/Transaction hash: (0x[a-fA-F0-9]+)/);
      const contractMatch = stdout.match(/Contract address: (0x[a-fA-F0-9]+)/);
      
      const result: DeploymentResult = {
        success: true,
        transactionHash: txHashMatch ? txHashMatch[1] : undefined,
        contractAddress: contractMatch ? contractMatch[1] : `${deployerAddress}::dropify_dual_token`
      };
      
      console.log('✅ Contract deployed successfully!');
      console.log(`📍 Contract Address: ${result.contractAddress}`);
      console.log(`🔗 Transaction: ${TESTNET_CONFIG.explorerUrl}/tx/${result.transactionHash}`);
      
      return result;
      
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown deployment error'
      };
    }
  }

  // Update environment variables with deployed addresses
  async updateEnvironment(contractAddress: string, deployerAddress: string): Promise<void> {
    const envPath = path.join(process.cwd(), '.env.local');
    
    const envContent = `# Supra Testnet Configuration - Updated ${new Date().toISOString()}
NEXT_PUBLIC_SUPRA_CHAIN_ID=6
NEXT_PUBLIC_SUPRA_RPC_URL=${TESTNET_CONFIG.rpcUrl}
NEXT_PUBLIC_SUPRA_EXPLORER_URL=${TESTNET_CONFIG.explorerUrl}
NEXT_PUBLIC_SUPRA_FAUCET_URL=${TESTNET_CONFIG.faucetUrl}

# Deployed Contract Information
NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}
NEXT_PUBLIC_CONTRACT_OWNER=${deployerAddress}

# Environment
NEXT_PUBLIC_ENVIRONMENT=testnet
NEXT_PUBLIC_IS_DEMO=false

# Platform Configuration
NEXT_PUBLIC_PLATFORM_NAME=Dropify
NEXT_PUBLIC_PLATFORM_DESCRIPTION=Transforming everyday purchases into valuable digital assets
`;

    fs.writeFileSync(envPath, envContent);
    console.log('✅ Environment variables updated');
  }

  // Main deployment process
  async deploy(): Promise<void> {
    console.log('🚀 Starting Dropify Testnet Deployment...\n');
    
    // Step 1: Check CLI
    if (!(await this.checkSupraCLI())) {
      process.exit(1);
    }
    
    // Step 2: Setup wallet
    const deployerAddress = await this.initializeWallet();
    if (!deployerAddress) {
      console.error('❌ Failed to setup wallet');
      process.exit(1);
    }
    
    // Step 3: Compile contract
    if (!(await this.compileContract())) {
      process.exit(1);
    }
    
    // Step 4: Deploy contract
    const deployResult = await this.deployContract(deployerAddress);
    
    if (!deployResult.success) {
      console.error('❌ Deployment failed:', deployResult.error);
      process.exit(1);
    }
    
    // Step 5: Update environment
    if (deployResult.contractAddress) {
      await this.updateEnvironment(deployResult.contractAddress, deployerAddress);
    }
    
    console.log('\n🎉 Dropify is now live on Supra Testnet!');
    console.log('\n📋 Next steps:');
    console.log('1. Start your development server: npm run dev');
    console.log('2. Test wallet connection and transactions');
    console.log('3. Share your demo link with users');
    console.log(`4. Monitor transactions: ${TESTNET_CONFIG.explorerUrl}`);
  }
}

// Run deployment if called directly
if (require.main === module) {
  const deployer = new SupraTestnetDeployer();
  deployer.deploy().catch(console.error);
}

export { SupraTestnetDeployer };
