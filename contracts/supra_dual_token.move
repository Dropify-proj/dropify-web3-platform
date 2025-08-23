module dropify::dual_token {
    use std::string::{Self, String};
    use std::signer;
    use std::vector;
    use std::error;
    use std::option::{Self, Option};
    
    // Supra-specific imports
    use supra_framework::coin::{Self, Coin, BurnCapability, FreezeCapability, MintCapability};
    use supra_framework::event::{Self, EventHandle};
    use supra_framework::account::{Self, SignerCapability};
    use supra_framework::resource_account;
    use supra_framework::timestamp;
    use supra_framework::table::{Self, Table};

    // Error codes
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_INSUFFICIENT_BALANCE: u64 = 2;
    const E_INVALID_AMOUNT: u64 = 3;
    const E_TOKEN_NOT_INITIALIZED: u64 = 4;
    const E_ALREADY_INITIALIZED: u64 = 5;
    const E_INSUFFICIENT_DROP_FOR_BURN: u64 = 6;
    const E_RECEIPT_ALREADY_PROCESSED: u64 = 7;
    const E_INVALID_MULTIPLIER: u64 = 8;

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
        processed_receipts: Table<String, bool>, // Track processed receipts
        admin_address: address,
    }

    // Receipt scanning reward structure
    struct ReceiptReward has copy, drop {
        user: address,
        receipt_hash: String,
        purchase_amount: u64, // In cents
        drop_earned: u64,
        timestamp: u64,
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

    // Treasury transfer event
    struct TreasuryTransfer has copy, drop {
        from: address,
        to: address,
        amount: u64,
        token_type: String,
        timestamp: u64,
    }

    // Events
    struct TokenEvents has key {
        receipt_scanned_events: EventHandle<ReceiptReward>,
        reward_redeemed_events: EventHandle<RewardRedemption>,
        business_partnership_events: EventHandle<BusinessPartnership>,
        treasury_transfer_events: EventHandle<TreasuryTransfer>,
    }

    // Initialize the dual token system
    public entry fun initialize(
        admin: &signer,
    ) {
        let admin_addr = signer::address_of(admin);
        assert!(!exists<TokenCaps>(admin_addr), error::already_exists(E_ALREADY_INITIALIZED));

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

        // Create resource account for contract operations
        let resource_signer_cap = resource_account::retrieve_resource_account_cap(admin, admin_addr);

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
            processed_receipts: table::new(),
            admin_address: admin_addr,
        });

        move_to(admin, TokenEvents {
            receipt_scanned_events: account::new_event_handle<ReceiptReward>(admin),
            reward_redeemed_events: account::new_event_handle<RewardRedemption>(admin),
            business_partnership_events: account::new_event_handle<BusinessPartnership>(admin),
            treasury_transfer_events: account::new_event_handle<TreasuryTransfer>(admin),
        });
    }

    // Scan receipt and mint DROP tokens
    public entry fun scan_receipt(
        user: &signer,
        receipt_hash: String,
        purchase_amount: u64, // In cents
        admin_addr: address,
    ) acquires TokenCaps, PlatformTreasury, TokenEvents {
        let user_addr = signer::address_of(user);
        
        // Check if receipt already processed
        let treasury = borrow_global_mut<PlatformTreasury>(admin_addr);
        assert!(!table::contains(&treasury.processed_receipts, receipt_hash), error::invalid_argument(E_RECEIPT_ALREADY_PROCESSED));
        
        // Calculate DROP reward based on purchase amount and multiplier
        assert!(purchase_amount > 0, error::invalid_argument(E_INVALID_AMOUNT));
        let drop_earned = (purchase_amount * treasury.reward_multiplier) / 10000;
        
        // Mint DROP tokens to user
        let token_caps = borrow_global<TokenCaps>(admin_addr);
        let drop_coins = coin::mint<DROP>(drop_earned, &token_caps.drop_mint_cap);
        
        // Register user for DROP if not already registered
        if (!coin::is_account_registered<DROP>(user_addr)) {
            coin::register<DROP>(user);
        };
        
        coin::deposit<DROP>(user_addr, drop_coins);
        
        // Mark receipt as processed
        table::add(&mut treasury.processed_receipts, receipt_hash, true);
        
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
            timestamp: timestamp::now_seconds(),
        });
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
        assert!(coin::balance<DROP>(user_addr) >= drop_amount, error::invalid_argument(E_INSUFFICIENT_DROP_FOR_BURN));
        assert!(drop_amount > 0, error::invalid_argument(E_INVALID_AMOUNT));
        
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

    // Business advertising payment with DRF
    public entry fun purchase_advertising(
        business: &signer,
        drf_amount: u64,
        ad_duration: u64, // In seconds
        admin_addr: address,
    ) acquires PlatformTreasury, TokenEvents {
        let business_addr = signer::address_of(business);
        
        // Check business has sufficient DRF balance
        assert!(coin::balance<DRF>(business_addr) >= drf_amount, error::invalid_argument(E_INSUFFICIENT_BALANCE));
        assert!(drf_amount > 0 && ad_duration > 0, error::invalid_argument(E_INVALID_AMOUNT));
        
        // Transfer DRF to treasury
        let drf_payment = coin::withdraw<DRF>(business, drf_amount);
        let treasury = borrow_global_mut<PlatformTreasury>(admin_addr);
        coin::merge(&mut treasury.drf_treasury, drf_payment);
        
        // Emit event
        let events = borrow_global_mut<TokenEvents>(admin_addr);
        event::emit_event(&mut events.business_partnership_events, BusinessPartnership {
            business: business_addr,
            drf_spent: drf_amount,
            ad_duration,
            timestamp: timestamp::now_seconds(),
        });
    }

    // Admin function to transfer treasury funds
    public entry fun transfer_treasury(
        admin: &signer,
        to: address,
        amount: u64,
        is_drf: bool, // true for DRF, false for DROP minting
    ) acquires TokenCaps, PlatformTreasury, TokenEvents {
        let admin_addr = signer::address_of(admin);
        let treasury = borrow_global_mut<PlatformTreasury>(admin_addr);
        
        // Only admin can transfer treasury funds
        assert!(admin_addr == treasury.admin_address, error::permission_denied(E_NOT_AUTHORIZED));
        assert!(amount > 0, error::invalid_argument(E_INVALID_AMOUNT));
        
        let token_caps = borrow_global<TokenCaps>(admin_addr);
        let events = borrow_global_mut<TokenEvents>(admin_addr);
        
        if (is_drf) {
            // Transfer DRF from treasury
            assert!(coin::value(&treasury.drf_treasury) >= amount, error::invalid_argument(E_INSUFFICIENT_BALANCE));
            let drf_transfer = coin::extract(&mut treasury.drf_treasury, amount);
            
            // Register recipient if needed
            if (!coin::is_account_registered<DRF>(to)) {
                let resource_signer = account::create_signer_with_capability(&token_caps.resource_signer_cap);
                coin::register<DRF>(&resource_signer);
            };
            
            coin::deposit<DRF>(to, drf_transfer);
            
            event::emit_event(&mut events.treasury_transfer_events, TreasuryTransfer {
                from: admin_addr,
                to,
                amount,
                token_type: string::utf8(b"DRF"),
                timestamp: timestamp::now_seconds(),
            });
        } else {
            // Mint new DROP tokens
            let drop_transfer = coin::mint<DROP>(amount, &token_caps.drop_mint_cap);
            
            // Register recipient if needed
            if (!coin::is_account_registered<DROP>(to)) {
                let resource_signer = account::create_signer_with_capability(&token_caps.resource_signer_cap);
                coin::register<DROP>(&resource_signer);
            };
            
            coin::deposit<DROP>(to, drop_transfer);
            treasury.total_drop_minted = treasury.total_drop_minted + amount;
            
            event::emit_event(&mut events.treasury_transfer_events, TreasuryTransfer {
                from: admin_addr,
                to,
                amount,
                token_type: string::utf8(b"DROP"),
                timestamp: timestamp::now_seconds(),
            });
        };
    }

    // Admin function to update reward multiplier
    public entry fun update_reward_multiplier(
        admin: &signer,
        new_multiplier: u64,
    ) acquires PlatformTreasury {
        let admin_addr = signer::address_of(admin);
        let treasury = borrow_global_mut<PlatformTreasury>(admin_addr);
        
        // Only admin can update multiplier
        assert!(admin_addr == treasury.admin_address, error::permission_denied(E_NOT_AUTHORIZED));
        assert!(new_multiplier <= 10000, error::invalid_argument(E_INVALID_MULTIPLIER)); // Max 100%
        
        treasury.reward_multiplier = new_multiplier;
    }

    // View functions
    #[view]
    public fun get_drop_balance(account: address): u64 {
        if (coin::is_account_registered<DROP>(account)) {
            coin::balance<DROP>(account)
        } else {
            0
        }
    }

    #[view]
    public fun get_drf_balance(account: address): u64 {
        if (coin::is_account_registered<DRF>(account)) {
            coin::balance<DRF>(account)
        } else {
            0
        }
    }

    #[view]
    public fun get_treasury_stats(admin_addr: address): (u64, u64, u64, u64, u64) acquires PlatformTreasury {
        let treasury = borrow_global<PlatformTreasury>(admin_addr);
        (
            coin::value(&treasury.drf_treasury),
            treasury.total_drop_minted,
            treasury.total_drop_burned,
            treasury.total_receipts_processed,
            treasury.reward_multiplier
        )
    }

    #[view]
    public fun is_receipt_processed(admin_addr: address, receipt_hash: String): bool acquires PlatformTreasury {
        let treasury = borrow_global<PlatformTreasury>(admin_addr);
        table::contains(&treasury.processed_receipts, receipt_hash)
    }
}
