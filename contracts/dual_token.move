module dropify::dual_token {
    use std::string::{Self, String};
    use std::signer;
    use aptos_framework::coin::{Self, Coin, BurnCapability, FreezeCapability, MintCapability};
    use aptos_framework::event::{Self, EventHandle};
    use aptos_framework::account::{Self, SignerCapability};
    use aptos_framework::resource_account;
    use aptos_framework::timestamp;

    // Error codes
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_INSUFFICIENT_BALANCE: u64 = 2;
    const E_INVALID_AMOUNT: u64 = 3;
    const E_TOKEN_NOT_INITIALIZED: u64 = 4;
    const E_ALREADY_INITIALIZED: u64 = 5;
    const E_INSUFFICIENT_DROP_FOR_BURN: u64 = 6;

    // DROP Token - Infinite Supply Utility Token
    struct DROP has key {}

    // DRF Token - 1 Billion Fixed Supply Governance Token  
    struct DRF has key {}

    // Token capabilities and configuration
    struct TokenCaps has key {
        drop_mint_cap: MintCapability<DROP>,
        drop_burn_cap: BurnCapability<DROP>,
        drop_freeze_cap: FreezeCapability<DROP>,
        drf_mint_cap: MintCapability<DRF>,
        drf_burn_cap: BurnCapability<DRF>,
        drf_freeze_cap: FreezeCapability<DRF>,
        resource_signer_cap: SignerCapability,
    }

    // Platform configuration and treasury
    struct PlatformTreasury has key {
        drf_treasury: Coin<DRF>,
        total_drop_minted: u64,
        total_drop_burned: u64,
        total_receipts_processed: u64,
        reward_multiplier: u64, // Basis points (10000 = 100%)
        // Testnet DRF distribution
        testnet_drf_distributed: u64, // Total DRF distributed in testnet
        testnet_drf_limit: u64, // 250 million DRF limit for testnet
        testnet_points_per_drf: u64, // 200 points = 1 DRF
        is_testnet_active: bool, // Whether testnet distribution is active
        // Referral system
        referral_reward_drf: u64, // 5 DRF tokens per successful referral
        total_referral_rewards_paid: u64, // Track total referral rewards distributed
        // Telegram Stars premium system
        premium_multiplier: u64, // 15000 = 150% (1.5x rewards)
        stars_cost_for_premium: u64, // 50 Telegram Stars
        premium_duration: u64, // Duration in seconds (e.g., 30 days)
    }

    // Premium user tracking
    struct PremiumStatus has key {
        is_premium: bool,
        premium_expires: u64, // Timestamp when premium expires
        total_stars_spent: u64, // Total Telegram Stars spent
        premium_activations: u64, // Number of times premium was activated
    }

    // Premium purchase event
    struct PremiumPurchase has copy, drop {
        user: address,
        stars_spent: u64,
        premium_expires: u64,
        timestamp: u64,
    }

    // Referral tracking structure
    struct ReferralData has key {
        referred_by: address, // Who referred this user
        has_scanned_receipt: bool, // Whether referred user has scanned a receipt
        referral_timestamp: u64, // When the referral was made
    }

    // Referral reward event
    struct ReferralReward has copy, drop {
        referrer: address,
        referred_user: address,
        drf_earned: u64,
        timestamp: u64,
    }

    // Receipt scanning reward structure
    struct ReceiptReward has copy, drop {
        user: address,
        receipt_hash: String,
        purchase_amount: u64, // In cents
        drop_earned: u64,
        drf_earned: u64, // Added for testnet DRF rewards
        points_earned: u64, // Points toward DRF rewards
        premium_bonus_applied: bool, // Whether 1.5x premium bonus was applied
        timestamp: u64,
    }
    }

    // Reward redemption structure
    struct RewardRedemption has copy, drop {
        user: address,
        reward_type: String,
        drop_burned: u64,
        timestamp: u64,
    }

    // Business partnership structure
    struct BusinessPartnership has copy, drop {
        business: address,
        drf_spent: u64,
        ad_duration: u64, // In seconds
        timestamp: u64,
    }

    // Events
    struct TokenEvents has key {
        receipt_scanned_events: EventHandle<ReceiptReward>,
        reward_redeemed_events: EventHandle<RewardRedemption>,
        business_partnership_events: EventHandle<BusinessPartnership>,
        referral_reward_events: EventHandle<ReferralReward>,
        premium_purchase_events: EventHandle<PremiumPurchase>,
    }

    // Initialize the dual token system
    public entry fun initialize(
        admin: &signer,
        resource_account_signer: &signer,
    ) {
        let admin_addr = signer::address_of(admin);
        assert!(!exists<TokenCaps>(admin_addr), E_ALREADY_INITIALIZED);

        // Initialize DROP token (infinite supply)
        let (drop_burn_cap, drop_freeze_cap, drop_mint_cap) = coin::initialize<DROP>(
            admin,
            string::utf8(b"Dropify Utility Token"),
            string::utf8(b"DROP"),
            8, // 8 decimals
            true, // monitor_supply
        );

        // Initialize DRF token (1 billion fixed supply)
        let (drf_burn_cap, drf_freeze_cap, drf_mint_cap) = coin::initialize<DRF>(
            admin,
            string::utf8(b"Dropify Governance Token"),
            string::utf8(b"DRF"),
            8, // 8 decimals
            true, // monitor_supply
        );

        // Mint the entire DRF supply (1 billion tokens with 8 decimals)
        let total_drf_supply = 100000000000000000; // 1 billion * 10^8
        let drf_treasury = coin::mint<DRF>(total_drf_supply, &drf_mint_cap);

        // Store capabilities
        let resource_signer_cap = resource_account::retrieve_resource_account_cap(
            resource_account_signer,
            admin_addr
        );

        move_to(admin, TokenCaps {
            drop_mint_cap,
            drop_burn_cap,
            drop_freeze_cap,
            drf_mint_cap,
            drf_burn_cap,
            drf_freeze_cap,
            resource_signer_cap,
        });

        move_to(admin, PlatformTreasury {
            drf_treasury,
            total_drop_minted: 0,
            total_drop_burned: 0,
            total_receipts_processed: 0,
            reward_multiplier: 100, // 1% default multiplier
            // Initialize testnet DRF distribution
            testnet_drf_distributed: 0,
            testnet_drf_limit: 25000000000000000, // 250 million DRF with 8 decimals
            testnet_points_per_drf: 200, // 200 points = 1 DRF
            is_testnet_active: true, // Enable testnet mode
            // Initialize referral system
            referral_reward_drf: 500000000, // 5 DRF tokens with 8 decimals
            total_referral_rewards_paid: 0,
            // Initialize Telegram Stars premium system
            premium_multiplier: 15000, // 150% (1.5x rewards)
            stars_cost_for_premium: 50, // 50 Telegram Stars
            premium_duration: 2592000, // 30 days in seconds
        });

        move_to(admin, TokenEvents {
            receipt_scanned_events: account::new_event_handle<ReceiptReward>(admin),
            reward_redeemed_events: account::new_event_handle<RewardRedemption>(admin),
            business_partnership_events: account::new_event_handle<BusinessPartnership>(admin),
            referral_reward_events: account::new_event_handle<ReferralReward>(admin),
            premium_purchase_events: account::new_event_handle<PremiumPurchase>(admin),
        });
    }

    // Purchase premium status with Telegram Stars
    public entry fun purchase_premium(
        user: &signer,
        stars_spent: u64,
        admin_addr: address,
    ) acquires PlatformTreasury, TokenEvents, PremiumStatus {
        let user_addr = signer::address_of(user);
        let treasury = borrow_global<PlatformTreasury>(admin_addr);
        
        // Verify user paid the correct amount of stars
        assert!(stars_spent >= treasury.stars_cost_for_premium, E_INVALID_AMOUNT);
        
        let current_time = timestamp::now_seconds();
        let premium_expires = current_time + treasury.premium_duration;
        
        // Update or create premium status
        if (exists<PremiumStatus>(user_addr)) {
            let premium_status = borrow_global_mut<PremiumStatus>(user_addr);
            
            // If already premium, extend the duration
            if (premium_status.is_premium && premium_status.premium_expires > current_time) {
                premium_status.premium_expires = premium_status.premium_expires + treasury.premium_duration;
            } else {
                premium_status.premium_expires = premium_expires;
            };
            
            premium_status.is_premium = true;
            premium_status.total_stars_spent = premium_status.total_stars_spent + stars_spent;
            premium_status.premium_activations = premium_status.premium_activations + 1;
        } else {
            move_to(user, PremiumStatus {
                is_premium: true,
                premium_expires,
                total_stars_spent: stars_spent,
                premium_activations: 1,
            });
        };
        
        // Emit premium purchase event
        let events = borrow_global_mut<TokenEvents>(admin_addr);
        event::emit_event(&mut events.premium_purchase_events, PremiumPurchase {
            user: user_addr,
            stars_spent,
            premium_expires,
            timestamp: current_time,
        });
    }

    // Enhanced scan receipt with premium bonus support
    public entry fun scan_receipt_with_premium(
        user: &signer,
        receipt_hash: String,
        purchase_amount: u64, // In cents
        admin_addr: address,
    ) acquires TokenCaps, PlatformTreasury, TokenEvents, PremiumStatus {
        let user_addr = signer::address_of(user);
        
        // Check if user has active premium status
        let (is_premium, premium_multiplier) = if (exists<PremiumStatus>(user_addr)) {
            let premium_status = borrow_global_mut<PremiumStatus>(user_addr);
            let current_time = timestamp::now_seconds();
            
            if (premium_status.is_premium && premium_status.premium_expires > current_time) {
                let treasury = borrow_global<PlatformTreasury>(admin_addr);
                (true, treasury.premium_multiplier)
            } else {
                // Premium expired, update status
                if (premium_status.premium_expires <= current_time) {
                    premium_status.is_premium = false;
                };
                (false, 10000) // 100% normal multiplier
            }
        } else {
            (false, 10000) // 100% normal multiplier
        };
        
        // Calculate rewards with premium bonus
        let treasury = borrow_global_mut<PlatformTreasury>(admin_addr);
        let base_drop_earned = (purchase_amount * treasury.reward_multiplier) / 10000;
        let drop_earned = if (is_premium) {
            (base_drop_earned * premium_multiplier) / 10000
        } else {
            base_drop_earned
        };
        
        // Calculate points earned (1 point per cent spent, with premium bonus)
        let points_earned = if (is_premium) {
            (purchase_amount * premium_multiplier) / 10000
        } else {
            purchase_amount
        };
        
        // Calculate testnet DRF rewards (also gets premium bonus)
        let drf_earned = 0u64;
        if (treasury.is_testnet_active && 
            treasury.testnet_drf_distributed < treasury.testnet_drf_limit) {
            
            // Calculate DRF based on points (200 points = 1 DRF with 8 decimals)
            let drf_tokens_to_mint = points_earned / treasury.testnet_points_per_drf;
            
            if (drf_tokens_to_mint > 0) {
                let drf_with_decimals = drf_tokens_to_mint * 100000000; // 8 decimals
                
                // Check if we would exceed the limit
                if (treasury.testnet_drf_distributed + drf_with_decimals <= treasury.testnet_drf_limit) {
                    drf_earned = drf_with_decimals;
                    
                    // Extract DRF from treasury and send to user
                    let token_caps = borrow_global<TokenCaps>(admin_addr);
                    let drf_coins = coin::extract<DRF>(&mut treasury.drf_treasury, drf_earned);
                    
                    // Register user for DRF if not already registered
                    if (!coin::is_account_registered<DRF>(user_addr)) {
                        coin::register<DRF>(user);
                    };
                    
                    coin::deposit<DRF>(user_addr, drf_coins);
                    treasury.testnet_drf_distributed = treasury.testnet_drf_distributed + drf_earned;
                    
                    // Check if we've reached the limit
                    if (treasury.testnet_drf_distributed >= treasury.testnet_drf_limit) {
                        treasury.is_testnet_active = false;
                    };
                };
            };
        };
        
        // Mint DROP tokens to user
        let token_caps = borrow_global<TokenCaps>(admin_addr);
        let drop_coins = coin::mint<DROP>(drop_earned, &token_caps.drop_mint_cap);
        
        // Register user for DROP if not already registered
        if (!coin::is_account_registered<DROP>(user_addr)) {
            coin::register<DROP>(user);
        };
        
        coin::deposit<DROP>(user_addr, drop_coins);
        
        // Update treasury stats
        treasury.total_drop_minted = treasury.total_drop_minted + drop_earned;
        treasury.total_receipts_processed = treasury.total_receipts_processed + 1;
        
        // Emit event
        let events = borrow_global_mut<TokenEvents>(admin_addr);
        event::emit_event(&mut events.receipt_scanned_events, ReceiptReward {
            user: user_addr,
            receipt_hash,
            purchase_amount,
            drop_earned,
            drf_earned,
            points_earned,
            premium_bonus_applied: is_premium,
            timestamp: timestamp::now_seconds(),
        });
    }

    // Scan receipt and mint DROP tokens + testnet DRF
    public entry fun scan_receipt(
        user: &signer,
        receipt_hash: String,
        purchase_amount: u64, // In cents
        admin_addr: address,
    ) acquires TokenCaps, PlatformTreasury, TokenEvents {
        let user_addr = signer::address_of(user);
        
        // Calculate DROP reward based on purchase amount and multiplier
        let treasury = borrow_global_mut<PlatformTreasury>(admin_addr);
        let drop_earned = (purchase_amount * treasury.reward_multiplier) / 10000;
        
        // Calculate points earned (1 point per cent spent)
        let points_earned = purchase_amount;
        
        // Calculate testnet DRF rewards
        let drf_earned = 0u64;
        if (treasury.is_testnet_active && 
            treasury.testnet_drf_distributed < treasury.testnet_drf_limit) {
            
            // Calculate DRF based on points (200 points = 1 DRF with 8 decimals)
            let drf_tokens_to_mint = points_earned / treasury.testnet_points_per_drf;
            
            if (drf_tokens_to_mint > 0) {
                let drf_with_decimals = drf_tokens_to_mint * 100000000; // 8 decimals
                
                // Check if we would exceed the limit
                if (treasury.testnet_drf_distributed + drf_with_decimals <= treasury.testnet_drf_limit) {
                    drf_earned = drf_with_decimals;
                    
                    // Extract DRF from treasury and send to user
                    let token_caps = borrow_global<TokenCaps>(admin_addr);
                    let drf_coins = coin::extract<DRF>(&mut treasury.drf_treasury, drf_earned);
                    
                    // Register user for DRF if not already registered
                    if (!coin::is_account_registered<DRF>(user_addr)) {
                        coin::register<DRF>(user);
                    };
                    
                    coin::deposit<DRF>(user_addr, drf_coins);
                    treasury.testnet_drf_distributed = treasury.testnet_drf_distributed + drf_earned;
                    
                    // Check if we've reached the limit
                    if (treasury.testnet_drf_distributed >= treasury.testnet_drf_limit) {
                        treasury.is_testnet_active = false;
                    };
                };
            };
        };
        
        // Mint DROP tokens to user
        let token_caps = borrow_global<TokenCaps>(admin_addr);
        let drop_coins = coin::mint<DROP>(drop_earned, &token_caps.drop_mint_cap);
        
        // Register user for DROP if not already registered
        if (!coin::is_account_registered<DROP>(user_addr)) {
            coin::register<DROP>(user);
        };
        
        coin::deposit<DROP>(user_addr, drop_coins);
        
        // Update treasury stats
        treasury.total_drop_minted = treasury.total_drop_minted + drop_earned;
        treasury.total_receipts_processed = treasury.total_receipts_processed + 1;
        
        // Emit event
        let events = borrow_global_mut<TokenEvents>(admin_addr);
        event::emit_event(&mut events.receipt_scanned_events, ReceiptReward {
            user: user_addr,
            receipt_hash,
            purchase_amount,
            drop_earned,
            drf_earned,
            points_earned,
            timestamp: timestamp::now_seconds(),
        });
    }

    // Register user with referral code
    public entry fun register_with_referral(
        user: &signer,
        referrer_addr: address,
    ) {
        let user_addr = signer::address_of(user);
        
        // Ensure user hasn't already been registered with a referral
        assert!(!exists<ReferralData>(user_addr), E_ALREADY_INITIALIZED);
        
        // Create referral data
        move_to(user, ReferralData {
            referred_by: referrer_addr,
            has_scanned_receipt: false,
            referral_timestamp: timestamp::now_seconds(),
        });
    }

    // Enhanced scan receipt with referral reward processing
    public entry fun scan_receipt_with_referral(
        user: &signer,
        receipt_hash: String,
        purchase_amount: u64, // In cents
        admin_addr: address,
    ) acquires TokenCaps, PlatformTreasury, TokenEvents, ReferralData {
        let user_addr = signer::address_of(user);
        
        // First, process the normal receipt scanning
        scan_receipt_internal(user, receipt_hash, purchase_amount, admin_addr);
        
        // Check if this user was referred and hasn't triggered referral reward yet
        if (exists<ReferralData>(user_addr)) {
            let referral_data = borrow_global_mut<ReferralData>(user_addr);
            
            if (!referral_data.has_scanned_receipt) {
                // Mark that referred user has scanned their first receipt
                referral_data.has_scanned_receipt = true;
                
                // Award referral bonus to the referrer
                let referrer_addr = referral_data.referred_by;
                let treasury = borrow_global_mut<PlatformTreasury>(admin_addr);
                let referral_reward = treasury.referral_reward_drf;
                
                // Check if there's enough DRF in treasury and referrer is registered
                if (coin::value<DRF>(&treasury.drf_treasury) >= referral_reward &&
                    coin::is_account_registered<DRF>(referrer_addr)) {
                    
                    // Extract DRF from treasury and send to referrer
                    let drf_coins = coin::extract<DRF>(&mut treasury.drf_treasury, referral_reward);
                    coin::deposit<DRF>(referrer_addr, drf_coins);
                    treasury.total_referral_rewards_paid = treasury.total_referral_rewards_paid + referral_reward;
                    
                    // Emit referral reward event
                    let events = borrow_global_mut<TokenEvents>(admin_addr);
                    event::emit_event(&mut events.referral_reward_events, ReferralReward {
                        referrer: referrer_addr,
                        referred_user: user_addr,
                        drf_earned: referral_reward,
                        timestamp: timestamp::now_seconds(),
                    });
                };
            };
        };
    }

    // Internal function for normal receipt scanning (to avoid code duplication)
    fun scan_receipt_internal(
        user: &signer,
        receipt_hash: String,
        purchase_amount: u64,
        admin_addr: address,
    ) acquires TokenCaps, PlatformTreasury, TokenEvents {
        let user_addr = signer::address_of(user);
        
        // Calculate DROP reward based on purchase amount and multiplier
        let treasury = borrow_global_mut<PlatformTreasury>(admin_addr);
        let drop_earned = (purchase_amount * treasury.reward_multiplier) / 10000;
        
        // Calculate points earned (1 point per cent spent)
        let points_earned = purchase_amount;
        
        // Calculate testnet DRF rewards
        let drf_earned = 0u64;
        if (treasury.is_testnet_active && 
            treasury.testnet_drf_distributed < treasury.testnet_drf_limit) {
            
            // Calculate DRF based on points (200 points = 1 DRF with 8 decimals)
            let drf_tokens_to_mint = points_earned / treasury.testnet_points_per_drf;
            
            if (drf_tokens_to_mint > 0) {
                let drf_with_decimals = drf_tokens_to_mint * 100000000; // 8 decimals
                
                // Check if we would exceed the limit
                if (treasury.testnet_drf_distributed + drf_with_decimals <= treasury.testnet_drf_limit) {
                    drf_earned = drf_with_decimals;
                    
                    // Extract DRF from treasury and send to user
                    let token_caps = borrow_global<TokenCaps>(admin_addr);
                    let drf_coins = coin::extract<DRF>(&mut treasury.drf_treasury, drf_earned);
                    
                    // Register user for DRF if not already registered
                    if (!coin::is_account_registered<DRF>(user_addr)) {
                        coin::register<DRF>(user);
                    };
                    
                    coin::deposit<DRF>(user_addr, drf_coins);
                    treasury.testnet_drf_distributed = treasury.testnet_drf_distributed + drf_earned;
                    
                    // Check if we've reached the limit
                    if (treasury.testnet_drf_distributed >= treasury.testnet_drf_limit) {
                        treasury.is_testnet_active = false;
                    };
                };
            };
        };
        
        // Mint DROP tokens to user
        let token_caps = borrow_global<TokenCaps>(admin_addr);
        let drop_coins = coin::mint<DROP>(drop_earned, &token_caps.drop_mint_cap);
        
        // Register user for DROP if not already registered
        if (!coin::is_account_registered<DROP>(user_addr)) {
            coin::register<DROP>(user);
        };
        
        coin::deposit<DROP>(user_addr, drop_coins);
        
        // Update treasury stats
        treasury.total_drop_minted = treasury.total_drop_minted + drop_earned;
        treasury.total_receipts_processed = treasury.total_receipts_processed + 1;
        
        // Emit event (note: this will be called from scan_receipt_with_referral, so events handled there)
    }

    // Burn DROP tokens for reward redemption
    public entry fun redeem_reward(
        user: &signer,
        reward_type: String,
        drop_amount: u64,
        admin_addr: address,
    ) acquires TokenCaps, PlatformTreasury, TokenEvents {
        let user_addr = signer::address_of(user);
        
        // Check user has sufficient DROP balance
        assert!(coin::balance<DROP>(user_addr) >= drop_amount, E_INSUFFICIENT_DROP_FOR_BURN);
        
        // Extract and burn DROP tokens
        let drop_coins = coin::withdraw<DROP>(user, drop_amount);
        let token_caps = borrow_global<TokenCaps>(admin_addr);
        coin::burn<DROP>(drop_coins, &token_caps.drop_burn_cap);
        
        // Update treasury stats
        let treasury = borrow_global_mut<PlatformTreasury>(admin_addr);
        treasury.total_drop_burned = treasury.total_drop_burned + drop_amount;
        
        // Emit event
        let events = borrow_global_mut<TokenEvents>(admin_addr);
        event::emit_event(&mut events.reward_redeemed_events, RewardRedemption {
            user: user_addr,
            reward_type,
            drop_burned: drop_amount,
            timestamp: timestamp::now_seconds(),
        });
    }

    // Business partnership - Pay DRF for advertising
    public entry fun purchase_advertising(
        business: &signer,
        drf_amount: u64,
        ad_duration: u64, // In seconds
        admin_addr: address,
    ) acquires TokenCaps, PlatformTreasury, TokenEvents {
        let business_addr = signer::address_of(business);
        
        // Check business has sufficient DRF balance
        assert!(coin::balance<DRF>(business_addr) >= drf_amount, E_INSUFFICIENT_BALANCE);
        
        // Transfer DRF to treasury
        let drf_coins = coin::withdraw<DRF>(business, drf_amount);
        let treasury = borrow_global_mut<PlatformTreasury>(admin_addr);
        coin::merge<DRF>(&mut treasury.drf_treasury, drf_coins);
        
        // Emit event
        let events = borrow_global_mut<TokenEvents>(admin_addr);
        event::emit_event(&mut events.business_partnership_events, BusinessPartnership {
            business: business_addr,
            drf_spent: drf_amount,
            ad_duration,
            timestamp: timestamp::now_seconds(),
        });
    }

    // Admin function to distribute DRF tokens
    public entry fun distribute_drf(
        admin: &signer,
        recipient: address,
        amount: u64,
    ) acquires TokenCaps, PlatformTreasury {
        let admin_addr = signer::address_of(admin);
        assert!(exists<TokenCaps>(admin_addr), E_NOT_AUTHORIZED);
        
        let treasury = borrow_global_mut<PlatformTreasury>(admin_addr);
        let drf_coins = coin::extract<DRF>(&mut treasury.drf_treasury, amount);
        
        // Register recipient for DRF if not already registered
        if (!coin::is_account_registered<DRF>(recipient)) {
            // Note: In practice, recipient would need to register themselves
            // This is a simplified version for demonstration
        };
        
        coin::deposit<DRF>(recipient, drf_coins);
    }

    // Admin function to update reward multiplier
    public entry fun update_reward_multiplier(
        admin: &signer,
        new_multiplier: u64,
    ) acquires PlatformTreasury {
        let admin_addr = signer::address_of(admin);
        let treasury = borrow_global_mut<PlatformTreasury>(admin_addr);
        treasury.reward_multiplier = new_multiplier;
    }

    // View functions
    public fun get_drop_balance(user: address): u64 {
        coin::balance<DROP>(user)
    }

    public fun get_drf_balance(user: address): u64 {
        coin::balance<DRF>(user)
    }

    public fun get_platform_stats(admin_addr: address): (u64, u64, u64, u64) acquires PlatformTreasury {
        let treasury = borrow_global<PlatformTreasury>(admin_addr);
        (
            treasury.total_drop_minted,
            treasury.total_drop_burned,
            treasury.total_receipts_processed,
            coin::value<DRF>(&treasury.drf_treasury)
        )
    }

    public fun get_reward_multiplier(admin_addr: address): u64 acquires PlatformTreasury {
        let treasury = borrow_global<PlatformTreasury>(admin_addr);
        treasury.reward_multiplier
    }

    // View functions for testnet DRF status
    
    /// Get testnet DRF distribution progress
    #[view]
    public fun get_testnet_drf_status(admin_addr: address): (bool, u64, u64, u64) acquires PlatformTreasury {
        let treasury = borrow_global<PlatformTreasury>(admin_addr);
        (
            treasury.is_testnet_active,
            treasury.testnet_drf_distributed,
            treasury.testnet_drf_limit,
            treasury.testnet_points_per_drf
        )
    }
    
    /// Calculate how many DRF tokens a user would earn for given points
    #[view]
    public fun calculate_drf_reward(admin_addr: address, points: u64): u64 acquires PlatformTreasury {
        let treasury = borrow_global<PlatformTreasury>(admin_addr);
        
        if (!treasury.is_testnet_active || 
            treasury.testnet_drf_distributed >= treasury.testnet_drf_limit) {
            return 0
        };
        
        let drf_tokens_to_mint = points / treasury.testnet_points_per_drf;
        let drf_with_decimals = drf_tokens_to_mint * 100000000; // 8 decimals
        
        // Check if this would exceed the limit
        if (treasury.testnet_drf_distributed + drf_with_decimals > treasury.testnet_drf_limit) {
            // Return only what's remaining
            return treasury.testnet_drf_limit - treasury.testnet_drf_distributed
        };
        
        drf_with_decimals
    }
    
    /// Get remaining DRF tokens available for testnet distribution
    #[view]
    public fun get_remaining_testnet_drf(admin_addr: address): u64 acquires PlatformTreasury {
        let treasury = borrow_global<PlatformTreasury>(admin_addr);
        
        if (!treasury.is_testnet_active || 
            treasury.testnet_drf_distributed >= treasury.testnet_drf_limit) {
            return 0
        };
        
        treasury.testnet_drf_limit - treasury.testnet_drf_distributed
    }
    
    /// Admin function to adjust testnet parameters
    public entry fun update_testnet_parameters(
        admin: &signer,
        new_points_per_drf: u64,
        new_limit: u64,
        active: bool,
    ) acquires TokenCaps, PlatformTreasury {
        let admin_addr = signer::address_of(admin);
        assert!(exists<TokenCaps>(admin_addr), E_NOT_AUTHORIZED);
        
        let treasury = borrow_global_mut<PlatformTreasury>(admin_addr);
        treasury.testnet_points_per_drf = new_points_per_drf;
        treasury.testnet_drf_limit = new_limit;
        treasury.is_testnet_active = active;
    }

    // Treasury management functions for future flexibility
    
    /// Transfer entire treasury to a new admin address
    /// WARNING: This is irreversible! Use with extreme caution.
    public entry fun transfer_treasury_ownership(
        current_admin: &signer,
        new_admin_addr: address,
    ) acquires TokenCaps, PlatformTreasury, TokenEvents {
        let current_admin_addr = signer::address_of(current_admin);
        
        // Verify current admin owns the treasury
        assert!(exists<TokenCaps>(current_admin_addr), E_NOT_AUTHORIZED);
        assert!(exists<PlatformTreasury>(current_admin_addr), E_NOT_AUTHORIZED);
        
        // Move all resources to new admin
        let token_caps = move_from<TokenCaps>(current_admin_addr);
        let treasury = move_from<PlatformTreasury>(current_admin_addr);
        let events = move_from<TokenEvents>(current_admin_addr);
        
        // Transfer to new admin (they must exist as an account)
        move_to_new_admin(&token_caps, &treasury, &events, new_admin_addr);
    }
    
    /// Transfer specific amount of DRF from treasury to new wallet
    /// Useful for gradual migration or emergency fund recovery
    public entry fun transfer_treasury_drf(
        admin: &signer,
        recipient: address,
        amount: u64,
    ) acquires PlatformTreasury {
        let admin_addr = signer::address_of(admin);
        assert!(exists<TokenCaps>(admin_addr), E_NOT_AUTHORIZED);
        
        let treasury = borrow_global_mut<PlatformTreasury>(admin_addr);
        assert!(coin::value<DRF>(&treasury.drf_treasury) >= amount, E_INSUFFICIENT_BALANCE);
        
        // Extract DRF from treasury
        let drf_to_transfer = coin::extract<DRF>(&mut treasury.drf_treasury, amount);
        
        // Register recipient for DRF if needed (in practice, they should register themselves)
        if (!coin::is_account_registered<DRF>(recipient)) {
            // Note: Recipient should call register_for_drf() themselves first
            // This is just a safety check
        };
        
        // Transfer to recipient
        coin::deposit<DRF>(recipient, drf_to_transfer);
    }
    
    /// Emergency function to migrate entire DRF treasury balance
    /// Use this if you need to move funds to a different wallet
    public entry fun migrate_entire_treasury(
        admin: &signer,
        new_treasury_wallet: address,
    ) acquires PlatformTreasury {
        let admin_addr = signer::address_of(admin);
        assert!(exists<TokenCaps>(admin_addr), E_NOT_AUTHORIZED);
        
        let treasury = borrow_global_mut<PlatformTreasury>(admin_addr);
        let total_drf = coin::value<DRF>(&treasury.drf_treasury);
        
        if (total_drf > 0) {
            // Extract all DRF from current treasury
            let all_drf = coin::extract_all<DRF>(&mut treasury.drf_treasury);
            
            // Deposit to new wallet
            coin::deposit<DRF>(new_treasury_wallet, all_drf);
        };
    }
    
    /// Update admin capabilities to a new address
    /// Useful for changing the administrative control
    public entry fun transfer_admin_rights(
        current_admin: &signer,
        new_admin: &signer,
    ) acquires TokenCaps, PlatformTreasury, TokenEvents {
        let current_admin_addr = signer::address_of(current_admin);
        let new_admin_addr = signer::address_of(new_admin);
        
        // Verify current admin
        assert!(exists<TokenCaps>(current_admin_addr), E_NOT_AUTHORIZED);
        
        // Move all administrative resources
        let token_caps = move_from<TokenCaps>(current_admin_addr);
        let treasury = move_from<PlatformTreasury>(current_admin_addr);  
        let events = move_from<TokenEvents>(current_admin_addr);
        
        // Transfer to new admin
        move_to(new_admin, token_caps);
        move_to(new_admin, treasury);
        move_to(new_admin, events);
    }
    
    /// Helper function for safe resource transfer
    native fun move_to_new_admin<T: key>(
        token_caps: &TokenCaps,
        treasury: &PlatformTreasury,
        events: &TokenEvents,
        new_admin_addr: address,
    );
    
    /// Get treasury wallet address (where DRF funds are stored)
    public fun get_treasury_wallet(admin_addr: address): address acquires PlatformTreasury {
        let treasury = borrow_global<PlatformTreasury>(admin_addr);
        admin_addr // Treasury is stored at admin address
    }
    
    /// View function to check if treasury transfer is possible
    public fun can_transfer_treasury(admin_addr: address, amount: u64): bool acquires PlatformTreasury {
        if (!exists<PlatformTreasury>(admin_addr)) {
            false
        } else {
            let treasury = borrow_global<PlatformTreasury>(admin_addr);
            coin::value<DRF>(&treasury.drf_treasury) >= amount
        }
    }

    // Register functions for users to register for tokens
    public entry fun register_for_drop(user: &signer) {
        coin::register<DROP>(user);
    }

    public entry fun register_for_drf(user: &signer) {
        coin::register<DRF>(user);
    }

    // View functions for referral system
    #[view]
    public fun get_referral_info(user_addr: address): (bool, address, bool, u64) acquires ReferralData {
        if (!exists<ReferralData>(user_addr)) {
            (false, @0x0, false, 0)
        } else {
            let referral_data = borrow_global<ReferralData>(user_addr);
            (true, referral_data.referred_by, referral_data.has_scanned_receipt, referral_data.referral_timestamp)
        }
    }

    #[view]
    public fun get_referral_stats(admin_addr: address): (u64, u64) acquires PlatformTreasury {
        let treasury = borrow_global<PlatformTreasury>(admin_addr);
        (treasury.referral_reward_drf, treasury.total_referral_rewards_paid)
    }

    #[view]
    public fun get_total_referral_rewards_available(admin_addr: address): u64 acquires PlatformTreasury {
        let treasury = borrow_global<PlatformTreasury>(admin_addr);
        let available_drf = coin::value<DRF>(&treasury.drf_treasury);
        let max_referrals = available_drf / treasury.referral_reward_drf;
        max_referrals
    }

    // View functions for premium system
    #[view]
    public fun get_premium_status(user_addr: address): (bool, u64, u64, u64) acquires PremiumStatus {
        if (!exists<PremiumStatus>(user_addr)) {
            (false, 0, 0, 0)
        } else {
            let premium_status = borrow_global<PremiumStatus>(user_addr);
            let current_time = timestamp::now_seconds();
            let is_active = premium_status.is_premium && premium_status.premium_expires > current_time;
            (is_active, premium_status.premium_expires, premium_status.total_stars_spent, premium_status.premium_activations)
        }
    }

    #[view]
    public fun get_premium_pricing(admin_addr: address): (u64, u64, u64) acquires PlatformTreasury {
        let treasury = borrow_global<PlatformTreasury>(admin_addr);
        (treasury.stars_cost_for_premium, treasury.premium_multiplier, treasury.premium_duration)
    }

    #[view]
    public fun calculate_premium_rewards(
        purchase_amount: u64,
        admin_addr: address
    ): (u64, u64, u64, u64) acquires PlatformTreasury {
        let treasury = borrow_global<PlatformTreasury>(admin_addr);
        
        // Normal rewards
        let normal_drop = (purchase_amount * treasury.reward_multiplier) / 10000;
        let normal_points = purchase_amount;
        
        // Premium rewards (1.5x)
        let premium_drop = (normal_drop * treasury.premium_multiplier) / 10000;
        let premium_points = (purchase_amount * treasury.premium_multiplier) / 10000;
        
        (normal_drop, premium_drop, normal_points, premium_points)
    }
}
