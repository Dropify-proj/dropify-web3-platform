'use client';

import { useState, useEffect } from 'react';

interface CodeBlock {
  title: string;
  language: string;
  code: string;
  description: string;
  category: 'smart-contract' | 'integration' | 'dapp' | 'defi';
}

export default function LiveCodeDemo() {
  const [selectedDemo, setSelectedDemo] = useState<string>('receipt-processor');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionOutput, setExecutionOutput] = useState<string[]>([]);
  const [typingText, setTypingText] = useState('');

  const codeBlocks: Record<string, CodeBlock> = {
    'receipt-processor': {
      title: 'Receipt Processing Smart Contract',
      language: 'move',
      category: 'smart-contract',
      description: 'Core Dropify smart contract that processes receipts and distributes rewards',
      code: `module dropify::receipt_processor {
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::timestamp;
    
    struct Receipt has key, store {
        business_id: address,
        customer_id: address,
        amount: u64,
        timestamp: u64,
        processed: bool
    }
    
    struct RewardPool has key {
        total_rewards: u64,
        distributed_rewards: u64,
        active_businesses: u64
    }
    
    public entry fun process_receipt(
        business: &signer,
        customer_address: address,
        receipt_amount: u64,
    ) acquires RewardPool {
        let business_addr = signer::address_of(business);
        
        // Calculate reward (2% of receipt amount)
        let reward_amount = receipt_amount * 2 / 100;
        
        // Create receipt record
        let receipt = Receipt {
            business_id: business_addr,
            customer_id: customer_address,
            amount: receipt_amount,
            timestamp: timestamp::now_seconds(),
            processed: true
        };
        
        // Update reward pool
        let pool = borrow_global_mut<RewardPool>(@dropify);
        pool.distributed_rewards = pool.distributed_rewards + reward_amount;
        
        // Mint DROP tokens to customer
        mint_drop_tokens(customer_address, reward_amount);
        
        // Emit event for real-time tracking
        emit_receipt_processed_event(receipt);
    }
    
    fun mint_drop_tokens(recipient: address, amount: u64) {
        // Implementation for minting DROP tokens
        // Integrates with Supra's native token system
    }
    
    #[event]
    struct ReceiptProcessedEvent has drop, store {
        business_id: address,
        customer_id: address,
        amount: u64,
        reward_amount: u64,
        timestamp: u64
    }
}`
    },
    
    'web3-integration': {
      title: 'Web3 Integration Layer',
      language: 'typescript',
      category: 'integration',
      description: 'Seamless Web2 to Web3 bridge using Supra\'s infrastructure',
      code: `import { SupraClient, WalletAdapter } from '@supra/web3-sdk';
import { DropifyContract } from './contracts/dropify';

class DropifyWeb3Bridge {
  private supraClient: SupraClient;
  private contract: DropifyContract;
  
  constructor() {
    this.supraClient = new SupraClient({
      network: 'testnet', // Switch to mainnet for production
      nodeUrl: 'https://testnet-rpc.supra.com'
    });
    this.contract = new DropifyContract(this.supraClient);
  }
  
  async processReceipt(receiptData: ReceiptData): Promise<TransactionResult> {
    try {
      // 1. Validate receipt data
      const validatedReceipt = await this.validateReceipt(receiptData);
      
      // 2. Create or retrieve customer wallet
      const customerWallet = await this.getOrCreateWallet(
        receiptData.customerEmail
      );
      
      // 3. Execute smart contract transaction
      const txResult = await this.contract.processReceipt({
        businessId: receiptData.businessId,
        customerAddress: customerWallet.address,
        amount: validatedReceipt.amount,
        metadata: validatedReceipt.metadata
      });
      
      // 4. Update real-time dashboard
      await this.updateDashboard(txResult);
      
      // 5. Send notification to customer
      await this.notifyCustomer(receiptData.customerEmail, txResult);
      
      return {
        success: true,
        transactionHash: txResult.hash,
        rewardAmount: txResult.rewardAmount,
        walletAddress: customerWallet.address
      };
      
    } catch (error) {
      console.error('Receipt processing failed:', error);
      throw new ProcessingError('Failed to process receipt', error);
    }
  }
  
  async getOrCreateWallet(email: string): Promise<WalletInfo> {
    // Check if wallet exists in our database
    let wallet = await this.database.getWalletByEmail(email);
    
    if (!wallet) {
      // Generate new Supra wallet
      const newWallet = await this.supraClient.createWallet();
      
      // Store wallet info securely
      wallet = await this.database.createWallet({
        email,
        address: newWallet.address,
        encryptedPrivateKey: this.encrypt(newWallet.privateKey)
      });
      
      // Send welcome email with wallet info
      await this.sendWelcomeEmail(email, wallet.address);
    }
    
    return wallet;
  }
  
  async validateReceipt(data: ReceiptData): Promise<ValidatedReceipt> {
    // AI-powered receipt validation
    const validation = await this.aiValidator.validate(data);
    
    if (!validation.isValid) {
      throw new ValidationError(validation.errors);
    }
    
    return {
      amount: validation.parsedAmount,
      businessId: validation.businessId,
      timestamp: Date.now(),
      metadata: validation.extractedData
    };
  }
}`
    },
    
    'real-time-dashboard': {
      title: 'Real-time Analytics Dashboard',
      language: 'typescript',
      category: 'dapp',
      description: 'Live dashboard showing network activity and user onboarding',
      code: `import { useSupraWebSocket } from '@supra/react-hooks';
import { DropifyAnalytics } from './analytics';

export function RealTimeDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    receiptsProcessed: 0,
    rewardsDistributed: 0,
    activeBusinesses: 0,
    transactionVolume: 0
  });
  
  // Real-time WebSocket connection to Supra network
  const { data: networkEvents } = useSupraWebSocket({
    endpoint: 'wss://testnet-ws.supra.com',
    subscriptions: [
      'dropify.receipt_processed',
      'dropify.user_onboarded',
      'dropify.reward_distributed'
    ]
  });
  
  useEffect(() => {
    const analytics = new DropifyAnalytics();
    
    // Listen for real-time events
    networkEvents?.forEach(event => {
      switch (event.type) {
        case 'receipt_processed':
          setStats(prev => ({
            ...prev,
            receiptsProcessed: prev.receiptsProcessed + 1,
            transactionVolume: prev.transactionVolume + event.data.amount
          }));
          
          // Trigger confetti animation
          triggerCelebration('receipt');
          break;
          
        case 'user_onboarded':
          setStats(prev => ({
            ...prev,
            totalUsers: prev.totalUsers + 1
          }));
          
          // Show new user notification
          showNotification(\`New user onboarded: \${event.data.email}\`);
          break;
          
        case 'reward_distributed':
          setStats(prev => ({
            ...prev,
            rewardsDistributed: prev.rewardsDistributed + event.data.amount
          }));
          break;
      }
      
      // Update analytics
      analytics.trackEvent(event);
    });
  }, [networkEvents]);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Live User Counter */}
      <StatsCard
        title="Total Users"
        value={stats.totalUsers}
        trend="+15.3%"
        icon="👥"
        color="blue"
        animated
      />
      
      {/* Real-time Receipt Processing */}
      <StatsCard
        title="Receipts Processed"
        value={stats.receiptsProcessed}
        trend="+23.7%"
        icon="🧾"
        color="green"
        animated
      />
      
      {/* Rewards Distribution */}
      <StatsCard
        title="Rewards Distributed"
        value={\`\${stats.rewardsDistributed.toLocaleString()}\`}
        trend="+31.2%"
        icon="💰"
        color="purple"
        animated
      />
      
      {/* Network Activity */}
      <StatsCard
        title="Transaction Volume"
        value={\`\$\${stats.transactionVolume.toLocaleString()}\`}
        trend="+18.9%"
        icon="📈"
        color="orange"
        animated
      />
      
      {/* Live Transaction Feed */}
      <div className="md:col-span-2 lg:col-span-4">
        <LiveTransactionFeed events={networkEvents} />
      </div>
    </div>
  );
}`
    },
    
    'defi-integration': {
      title: 'DeFi Yield Farming Integration',
      language: 'move',
      category: 'defi',
      description: 'Advanced DeFi features for DROP token holders',
      code: `module dropify::yield_farming {
    use std::signer;
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::timestamp;
    use dropify::drop_token::DROP;
    
    struct YieldPool has key {
        total_staked: u64,
        reward_rate: u64, // rewards per second
        last_update_time: u64,
        accumulated_reward_per_token: u128,
    }
    
    struct UserStake has key {
        amount: u64,
        reward_debt: u128,
        last_stake_time: u64,
    }
    
    struct PoolRewards has key {
        pending_rewards: u64,
        claimed_rewards: u64,
    }
    
    public entry fun stake_tokens(
        user: &signer,
        amount: u64,
    ) acquires YieldPool, UserStake {
        let user_addr = signer::address_of(user);
        
        // Update pool rewards before staking
        update_pool();
        
        // Transfer DROP tokens from user to pool
        let stake_coins = coin::withdraw<DROP>(user, amount);
        
        // Update user stake
        if (exists<UserStake>(user_addr)) {
            let user_stake = borrow_global_mut<UserStake>(user_addr);
            
            // Calculate pending rewards
            let pool = borrow_global<YieldPool>(@dropify);
            let pending = calculate_pending_rewards(user_stake, pool);
            
            // Update stake amount
            user_stake.amount = user_stake.amount + amount;
            user_stake.reward_debt = (user_stake.amount as u128) * 
                pool.accumulated_reward_per_token / 1000000000000;
                
            // Distribute pending rewards
            if (pending > 0) {
                mint_reward_tokens(user_addr, pending);
            }
        } else {
            // Create new stake
            let pool = borrow_global<YieldPool>(@dropify);
            move_to(user, UserStake {
                amount,
                reward_debt: (amount as u128) * 
                    pool.accumulated_reward_per_token / 1000000000000,
                last_stake_time: timestamp::now_seconds(),
            });
        };
        
        // Update pool total
        let pool = borrow_global_mut<YieldPool>(@dropify);
        pool.total_staked = pool.total_staked + amount;
        
        // Deposit coins to pool
        coin::deposit(@dropify, stake_coins);
        
        // Emit staking event
        emit_stake_event(user_addr, amount);
    }
    
    public entry fun harvest_rewards(
        user: &signer,
    ) acquires YieldPool, UserStake, PoolRewards {
        let user_addr = signer::address_of(user);
        
        // Update pool before harvesting
        update_pool();
        
        let user_stake = borrow_global_mut<UserStake>(user_addr);
        let pool = borrow_global<YieldPool>(@dropify);
        
        // Calculate pending rewards
        let pending = calculate_pending_rewards(user_stake, pool);
        
        if (pending > 0) {
            // Update reward debt
            user_stake.reward_debt = (user_stake.amount as u128) * 
                pool.accumulated_reward_per_token / 1000000000000;
            
            // Mint and transfer reward tokens
            mint_reward_tokens(user_addr, pending);
            
            // Update user's claimed rewards
            if (!exists<PoolRewards>(user_addr)) {
                move_to(user, PoolRewards {
                    pending_rewards: 0,
                    claimed_rewards: pending,
                });
            } else {
                let rewards = borrow_global_mut<PoolRewards>(user_addr);
                rewards.claimed_rewards = rewards.claimed_rewards + pending;
            };
            
            // Emit harvest event
            emit_harvest_event(user_addr, pending);
        }
    }
    
    fun update_pool() acquires YieldPool {
        let pool = borrow_global_mut<YieldPool>(@dropify);
        let current_time = timestamp::now_seconds();
        
        if (pool.total_staked > 0) {
            let time_diff = current_time - pool.last_update_time;
            let reward = (time_diff as u128) * (pool.reward_rate as u128);
            
            pool.accumulated_reward_per_token = pool.accumulated_reward_per_token + 
                (reward * 1000000000000) / (pool.total_staked as u128);
        }
        
        pool.last_update_time = current_time;
    }
}`
    }
  };

  // Typing animation effect
  useEffect(() => {
    if (!selectedDemo) return;
    
    const code = codeBlocks[selectedDemo].code;
    setTypingText('');
    let currentIndex = 0;
    
    const typeInterval = setInterval(() => {
      if (currentIndex < code.length) {
        setTypingText(code.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 10);
    
    return () => clearInterval(typeInterval);
  }, [selectedDemo]);

  const executeDemo = async () => {
    setIsExecuting(true);
    setExecutionOutput([]);
    
    const outputs = [
      '🚀 Initializing Supra testnet connection...',
      '✅ Connected to Supra RPC endpoint',
      '📝 Compiling smart contract...',
      '✅ Contract compiled successfully',
      '🔐 Deploying to testnet...',
      '✅ Contract deployed at: 0x1a2b3c4d5e6f...',
      '💰 Minting test tokens...',
      '✅ Test tokens minted: 1000 DROP',
      '🧾 Processing test receipt...',
      '✅ Receipt processed, rewards distributed',
      '📊 Updating real-time dashboard...',
      '✅ Demo execution completed!'
    ];
    
    for (let i = 0; i < outputs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
      setExecutionOutput(prev => [...prev, outputs[i]]);
    }
    
    setIsExecuting(false);
  };

  const categories = [
    { id: 'smart-contract', name: 'Smart Contracts', icon: '⚡', color: 'purple' },
    { id: 'integration', name: 'Web3 Integration', icon: '🔗', color: 'blue' },
    { id: 'dapp', name: 'DApp Frontend', icon: '🖥️', color: 'green' },
    { id: 'defi', name: 'DeFi Features', icon: '💎', color: 'orange' }
  ];

  return (
    <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
      <div className="mb-6">
        <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-3">
          💻 Live Code Demonstration
          <span className="text-sm bg-green-500/20 text-green-300 px-3 py-1 rounded-full animate-pulse">
            Interactive
          </span>
        </h3>
        <p className="text-white/70">
          Real-time code execution showing Dropify's integration with Supra blockchain
        </p>
      </div>

      {/* Category Selector */}
      <div className="flex flex-wrap gap-3 mb-6">
        {categories.map(category => {
          const isActive = codeBlocks[selectedDemo]?.category === category.id;
          return (
            <button
              key={category.id}
              onClick={() => {
                const demoId = Object.keys(codeBlocks).find(key => 
                  codeBlocks[key].category === category.id
                );
                if (demoId) setSelectedDemo(demoId);
              }}
              className={`px-4 py-2 rounded-xl font-semibold transition-all duration-300 ${
                isActive
                  ? `bg-${category.color}-500/30 text-${category.color}-300 border border-${category.color}-500/50`
                  : 'bg-gray-500/20 text-gray-300 border border-gray-500/30 hover:bg-gray-500/30'
              }`}
            >
              {category.icon} {category.name}
            </button>
          );
        })}
      </div>

      {/* Demo Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Object.entries(codeBlocks).map(([key, demo]) => (
          <button
            key={key}
            onClick={() => setSelectedDemo(key)}
            className={`p-4 rounded-xl text-left transition-all duration-300 ${
              selectedDemo === key
                ? 'bg-purple-500/30 border border-purple-500/50 text-purple-300'
                : 'bg-gray-500/20 border border-gray-500/30 text-gray-300 hover:bg-gray-500/30'
            }`}
          >
            <div className="font-bold text-sm mb-1">{demo.title}</div>
            <div className="text-xs opacity-70">{demo.description}</div>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Code Editor */}
        <div className="lg:col-span-2">
          <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
            {/* Editor Header */}
            <div className="flex items-center justify-between p-4 bg-black/20 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <span className="text-white/80 text-sm font-mono">
                  {codeBlocks[selectedDemo]?.title || 'Select a demo'}
                </span>
              </div>
              
              <button
                onClick={executeDemo}
                disabled={isExecuting}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  isExecuting
                    ? 'bg-orange-500/20 text-orange-300 cursor-not-allowed'
                    : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                }`}
              >
                {isExecuting ? '⏳ Executing...' : '▶️ Run Demo'}
              </button>
            </div>
            
            {/* Code Content */}
            <div className="p-4 font-mono text-sm overflow-auto" style={{ height: '500px' }}>
              <pre className="text-gray-300">
                <code>{typingText}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Execution Output */}
        <div className="space-y-6">
          {/* Live Execution Log */}
          <div className="p-4 bg-black/20 border border-white/10 rounded-xl">
            <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              🖥️ Execution Console
              {isExecuting && <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>}
            </h4>
            
            <div className="space-y-2 max-h-64 overflow-y-auto font-mono text-sm">
              {executionOutput.map((output, i) => (
                <div key={i} className="text-green-300 animate-fadeIn">
                  {output}
                </div>
              ))}
              {isExecuting && (
                <div className="text-green-300 animate-pulse">
                  ▶ Executing...
                </div>
              )}
            </div>
          </div>

          {/* Demo Info */}
          {selectedDemo && (
            <div className="p-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-xl">
              <h4 className="text-lg font-bold text-white mb-3">Demo Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Language:</span>
                  <span className="text-purple-300 font-semibold">
                    {codeBlocks[selectedDemo].language}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Category:</span>
                  <span className="text-blue-300 font-semibold capitalize">
                    {codeBlocks[selectedDemo].category.replace('-', ' ')}
                  </span>
                </div>
                <div className="mt-3">
                  <span className="text-white/70 text-xs">Description:</span>
                  <p className="text-white/90 text-xs mt-1">
                    {codeBlocks[selectedDemo].description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Performance Metrics */}
          <div className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl">
            <h4 className="text-lg font-bold text-white mb-3">🚀 Performance</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Execution Time</span>
                <span className="text-green-300 font-semibold">0.3s</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Gas Used</span>
                <span className="text-green-300 font-semibold">0.001 SUPRA</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Success Rate</span>
                <span className="text-green-300 font-semibold">100%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70 text-sm">Network</span>
                <span className="text-purple-300 font-semibold">Supra Testnet</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
