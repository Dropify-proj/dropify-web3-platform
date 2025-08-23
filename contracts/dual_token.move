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

    // Events
    struct TokenEvents has key {
        receipt_scanned_events: EventHandle<ReceiptReward>,
        reward_redeemed_events: EventHandle<RewardRedemption>,
        business_partnership_events: EventHandle<BusinessPartnership>,
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
        });

        move_to(admin, TokenEvents {
            receipt_scanned_events: account::new_event_handle<ReceiptReward>(admin),
            reward_redeemed_events: account::new_event_handle<RewardRedemption>(admin),
            business_partnership_events: account::new_event_handle<BusinessPartnership>(admin),
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
        
        // Calculate DROP reward based on purchase amount and multiplier
        let treasury = borrow_global_mut<PlatformTreasury>(admin_addr);
        let drop_earned = (purchase_amount * treasury.reward_multiplier) / 10000;
        
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
}
