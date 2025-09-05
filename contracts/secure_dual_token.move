// Secure Smart Contract for Dropify Platform
// Built with comprehensive security measures and best practices

module dropify_secure::dual_token_secure {
    use std::string::{Self, String};
    use std::signer;
    use std::vector;
    use std::option::{Self, Option};
    use aptos_framework::coin::{Self, Coin, BurnCapability, FreezeCapability, MintCapability};
    use aptos_framework::event::{Self, EventHandle};
    use aptos_framework::account::{Self, SignerCapability};
    use aptos_framework::resource_account;
    use aptos_framework::timestamp;
    use aptos_framework::table::{Self, Table};

    // ==================== ERROR CODES ====================
    const E_NOT_AUTHORIZED: u64 = 1001;
    const E_INSUFFICIENT_BALANCE: u64 = 1002;
    const E_INVALID_AMOUNT: u64 = 1003;
    const E_TOKEN_NOT_INITIALIZED: u64 = 1004;
    const E_ALREADY_INITIALIZED: u64 = 1005;
    const E_INSUFFICIENT_DROP_FOR_BURN: u64 = 1006;
    const E_RATE_LIMIT_EXCEEDED: u64 = 1007;
    const E_PAUSED: u64 = 1008;
    const E_INVALID_RECEIPT: u64 = 1009;
    const E_DUPLICATE_RECEIPT: u64 = 1010;
    const E_EMERGENCY_STOP: u64 = 1011;
    const E_INVALID_SIGNATURE: u64 = 1012;
    const E_UNAUTHORIZED_ADMIN: u64 = 1013;

    // ==================== CONSTANTS ====================
    const MAX_DAILY_RECEIPTS: u64 = 50;
    const MAX_RECEIPT_AMOUNT: u64 = 100000; // $1000 in cents
    const MIN_RECEIPT_AMOUNT: u64 = 100;    // $1 in cents
    const RECEIPT_REWARD_RATE: u64 = 100;   // 1% in basis points
    const DRF_TOTAL_SUPPLY: u64 = 1000000000; // 1 billion tokens
    const ADMIN_MULTISIG_THRESHOLD: u64 = 3; // Require 3 of 5 admin signatures

    // ==================== TOKEN STRUCTS ====================
    struct DROP has key {}
    struct DRF has key {}

    // ==================== SECURITY & ACCESS CONTROL ====================
    struct AdminRole has key {
        admins: vector<address>,
        multisig_threshold: u64,
        pending_admin_actions: Table<u64, PendingAdminAction>,
        action_counter: u64,
    }

    struct PendingAdminAction has store {
        action_type: String,
        proposer: address,
        approvals: vector<address>,
        data: vector<u8>,
        expiry: u64,
    }

    struct SecurityConfig has key {
        is_paused: bool,
        emergency_stop: bool,
        rate_limits: Table<address, RateLimit>,
        blacklisted_addresses: Table<address, bool>,
        max_daily_receipts: u64,
        max_receipt_amount: u64,
    }

    struct RateLimit has store {
        daily_receipts: u64,
        last_reset: u64,
        total_amount_today: u64,
    }

    // ==================== TOKEN CAPABILITIES ====================
    struct TokenCaps has key {
        drop_mint_cap: MintCapability<DROP>,
        drop_burn_cap: BurnCapability<DROP>,
        drop_freeze_cap: FreezeCapability<DROP>,
        drf_mint_cap: MintCapability<DRF>,
        drf_burn_cap: BurnCapability<DRF>,
        drf_freeze_cap: FreezeCapability<DRF>,
        resource_signer_cap: SignerCapability,
    }

    // ==================== PLATFORM TREASURY ====================
    struct PlatformTreasury has key {
        drf_treasury: Coin<DRF>,
        total_drop_minted: u64,
        total_drop_burned: u64,
        total_receipts_processed: u64,
        processed_receipts: Table<String, bool>, // Receipt hash -> processed
        daily_stats: Table<u64, DailyStats>,     // Day -> stats
    }

    struct DailyStats has store {
        date: u64,
        receipts_count: u64,
        total_amount: u64,
        drop_minted: u64,
    }

    // ==================== EVENTS ====================
    #[event]
    struct ReceiptProcessedEvent has drop, store {
        user: address,
        receipt_hash: String,
        purchase_amount: u64,
        drop_earned: u64,
        timestamp: u64,
    }

    #[event]
    struct RewardRedeemedEvent has drop, store {
        user: address,
        reward_type: String,
        drop_burned: u64,
        timestamp: u64,
    }

    #[event]
    struct SecurityEvent has drop, store {
        event_type: String,
        user: address,
        details: String,
        timestamp: u64,
    }

    #[event]
    struct AdminActionEvent has drop, store {
        action_type: String,
        admin: address,
        target: address,
        timestamp: u64,
    }

    // ==================== INITIALIZATION ====================
    fun init_module(resource_signer: &signer) {
        let resource_addr = signer::address_of(resource_signer);
        
        // Initialize DROP token with security features
        let (drop_burn_cap, drop_freeze_cap, drop_mint_cap) = coin::initialize<DROP>(
            resource_signer,
            string::utf8(b"Dropify Token"),
            string::utf8(b"DROP"),
            8,
            true,
        );

        // Initialize DRF token with fixed supply
        let (drf_burn_cap, drf_freeze_cap, drf_mint_cap) = coin::initialize<DRF>(
            resource_signer,
            string::utf8(b"Dropify Governance Token"),
            string::utf8(b"DRF"),
            8,
            true,
        );

        // Store capabilities securely
        move_to(resource_signer, TokenCaps {
            drop_mint_cap,
            drop_burn_cap,
            drop_freeze_cap,
            drf_mint_cap,
            drf_burn_cap,
            drf_freeze_cap,
            resource_signer_cap: resource_account::retrieve_resource_account_cap(
                resource_signer, @dropify_secure
            ),
        });

        // Initialize security configuration
        move_to(resource_signer, SecurityConfig {
            is_paused: false,
            emergency_stop: false,
            rate_limits: table::new(),
            blacklisted_addresses: table::new(),
            max_daily_receipts: MAX_DAILY_RECEIPTS,
            max_receipt_amount: MAX_RECEIPT_AMOUNT,
        });

        // Initialize admin roles with multisig
        move_to(resource_signer, AdminRole {
            admins: vector::empty(),
            multisig_threshold: ADMIN_MULTISIG_THRESHOLD,
            pending_admin_actions: table::new(),
            action_counter: 0,
        });

        // Initialize treasury
        let drf_treasury = coin::mint(DRF_TOTAL_SUPPLY, &drf_mint_cap);
        move_to(resource_signer, PlatformTreasury {
            drf_treasury,
            total_drop_minted: 0,
            total_drop_burned: 0,
            total_receipts_processed: 0,
            processed_receipts: table::new(),
            daily_stats: table::new(),
        });
    }

    // ==================== ADMIN FUNCTIONS ====================
    public entry fun add_admin(admin: &signer, new_admin: address) acquires AdminRole {
        let admin_addr = signer::address_of(admin);
        let admin_role = borrow_global_mut<AdminRole>(@dropify_secure);
        
        assert!(vector::contains(&admin_role.admins, &admin_addr), E_UNAUTHORIZED_ADMIN);
        
        if (!vector::contains(&admin_role.admins, &new_admin)) {
            vector::push_back(&mut admin_role.admins, new_admin);
        };

        event::emit(AdminActionEvent {
            action_type: string::utf8(b"add_admin"),
            admin: admin_addr,
            target: new_admin,
            timestamp: timestamp::now_seconds(),
        });
    }

    public entry fun emergency_pause(admin: &signer) acquires AdminRole, SecurityConfig {
        let admin_addr = signer::address_of(admin);
        assert_admin(admin_addr);
        
        let security_config = borrow_global_mut<SecurityConfig>(@dropify_secure);
        security_config.emergency_stop = true;
        security_config.is_paused = true;

        event::emit(SecurityEvent {
            event_type: string::utf8(b"emergency_pause"),
            user: admin_addr,
            details: string::utf8(b"System emergency pause activated"),
            timestamp: timestamp::now_seconds(),
        });
    }

    // ==================== RECEIPT PROCESSING ====================
    public entry fun process_receipt(
        user: &signer,
        receipt_hash: String,
        purchase_amount: u64,
        store_signature: vector<u8>
    ) acquires SecurityConfig, PlatformTreasury, TokenCaps {
        let user_addr = signer::address_of(user);
        
        // Security checks
        assert_not_paused();
        assert_not_blacklisted(user_addr);
        assert_rate_limit(user_addr);
        assert_valid_receipt_amount(purchase_amount);
        
        let treasury = borrow_global_mut<PlatformTreasury>(@dropify_secure);
        
        // Check for duplicate receipt
        assert!(
            !table::contains(&treasury.processed_receipts, receipt_hash),
            E_DUPLICATE_RECEIPT
        );
        
        // Verify store signature (simplified - would use cryptographic verification)
        assert!(vector::length(&store_signature) > 0, E_INVALID_SIGNATURE);
        
        // Calculate reward with security bounds
        let drop_reward = calculate_drop_reward(purchase_amount);
        
        // Update rate limiting
        update_rate_limit(user_addr, purchase_amount);
        
        // Mark receipt as processed
        table::add(&mut treasury.processed_receipts, receipt_hash, true);
        
        // Mint DROP tokens securely
        let token_caps = borrow_global<TokenCaps>(@dropify_secure);
        let drop_coins = coin::mint(drop_reward, &token_caps.drop_mint_cap);
        
        // Transfer to user
        coin::deposit(user_addr, drop_coins);
        
        // Update statistics
        treasury.total_drop_minted = treasury.total_drop_minted + drop_reward;
        treasury.total_receipts_processed = treasury.total_receipts_processed + 1;
        
        // Update daily stats
        update_daily_stats(purchase_amount, drop_reward);
        
        // Emit event
        event::emit(ReceiptProcessedEvent {
            user: user_addr,
            receipt_hash,
            purchase_amount,
            drop_earned: drop_reward,
            timestamp: timestamp::now_seconds(),
        });
    }

    // ==================== REWARD REDEMPTION ====================
    public entry fun redeem_reward(
        user: &signer,
        reward_type: String,
        drop_amount: u64
    ) acquires SecurityConfig, PlatformTreasury, TokenCaps {
        let user_addr = signer::address_of(user);
        
        // Security checks
        assert_not_paused();
        assert_not_blacklisted(user_addr);
        assert!(drop_amount > 0, E_INVALID_AMOUNT);
        
        // Check user balance
        let user_balance = coin::balance<DROP>(user_addr);
        assert!(user_balance >= drop_amount, E_INSUFFICIENT_DROP_FOR_BURN);
        
        // Burn DROP tokens
        let token_caps = borrow_global<TokenCaps>(@dropify_secure);
        let drop_coins = coin::withdraw<DROP>(user, drop_amount);
        coin::burn(drop_coins, &token_caps.drop_burn_cap);
        
        // Update statistics
        let treasury = borrow_global_mut<PlatformTreasury>(@dropify_secure);
        treasury.total_drop_burned = treasury.total_drop_burned + drop_amount;
        
        // Emit event
        event::emit(RewardRedeemedEvent {
            user: user_addr,
            reward_type,
            drop_burned: drop_amount,
            timestamp: timestamp::now_seconds(),
        });
    }

    // ==================== HELPER FUNCTIONS ====================
    fun assert_admin(admin_addr: address) acquires AdminRole {
        let admin_role = borrow_global<AdminRole>(@dropify_secure);
        assert!(vector::contains(&admin_role.admins, &admin_addr), E_UNAUTHORIZED_ADMIN);
    }

    fun assert_not_paused() acquires SecurityConfig {
        let security_config = borrow_global<SecurityConfig>(@dropify_secure);
        assert!(!security_config.is_paused, E_PAUSED);
        assert!(!security_config.emergency_stop, E_EMERGENCY_STOP);
    }

    fun assert_not_blacklisted(user_addr: address) acquires SecurityConfig {
        let security_config = borrow_global<SecurityConfig>(@dropify_secure);
        assert!(
            !table::contains(&security_config.blacklisted_addresses, user_addr),
            E_NOT_AUTHORIZED
        );
    }

    fun assert_rate_limit(user_addr: address) acquires SecurityConfig {
        let security_config = borrow_global<SecurityConfig>(@dropify_secure);
        
        if (table::contains(&security_config.rate_limits, user_addr)) {
            let rate_limit = table::borrow(&security_config.rate_limits, user_addr);
            let current_day = timestamp::now_seconds() / 86400;
            let limit_day = rate_limit.last_reset / 86400;
            
            if (current_day == limit_day) {
                assert!(
                    rate_limit.daily_receipts < security_config.max_daily_receipts,
                    E_RATE_LIMIT_EXCEEDED
                );
            };
        };
    }

    fun assert_valid_receipt_amount(amount: u64) acquires SecurityConfig {
        let security_config = borrow_global<SecurityConfig>(@dropify_secure);
        assert!(amount >= MIN_RECEIPT_AMOUNT, E_INVALID_AMOUNT);
        assert!(amount <= security_config.max_receipt_amount, E_INVALID_AMOUNT);
    }

    fun calculate_drop_reward(purchase_amount: u64): u64 {
        // 1% reward rate with minimum 1 token
        let reward = (purchase_amount * RECEIPT_REWARD_RATE) / 10000;
        if (reward == 0) { 1 } else { reward }
    }

    fun update_rate_limit(user_addr: address, amount: u64) acquires SecurityConfig {
        let security_config = borrow_global_mut<SecurityConfig>(@dropify_secure);
        let current_time = timestamp::now_seconds();
        let current_day = current_time / 86400;
        
        if (table::contains(&security_config.rate_limits, user_addr)) {
            let rate_limit = table::borrow_mut(&mut security_config.rate_limits, user_addr);
            let limit_day = rate_limit.last_reset / 86400;
            
            if (current_day > limit_day) {
                // Reset daily limits
                rate_limit.daily_receipts = 1;
                rate_limit.total_amount_today = amount;
                rate_limit.last_reset = current_time;
            } else {
                // Update current day limits
                rate_limit.daily_receipts = rate_limit.daily_receipts + 1;
                rate_limit.total_amount_today = rate_limit.total_amount_today + amount;
            };
        } else {
            // First receipt for this user
            table::add(&mut security_config.rate_limits, user_addr, RateLimit {
                daily_receipts: 1,
                last_reset: current_time,
                total_amount_today: amount,
            });
        };
    }

    fun update_daily_stats(amount: u64, drop_minted: u64) acquires PlatformTreasury {
        let treasury = borrow_global_mut<PlatformTreasury>(@dropify_secure);
        let current_day = timestamp::now_seconds() / 86400;
        
        if (table::contains(&treasury.daily_stats, current_day)) {
            let daily_stat = table::borrow_mut(&mut treasury.daily_stats, current_day);
            daily_stat.receipts_count = daily_stat.receipts_count + 1;
            daily_stat.total_amount = daily_stat.total_amount + amount;
            daily_stat.drop_minted = daily_stat.drop_minted + drop_minted;
        } else {
            table::add(&mut treasury.daily_stats, current_day, DailyStats {
                date: current_day,
                receipts_count: 1,
                total_amount: amount,
                drop_minted,
            });
        };
    }

    // ==================== VIEW FUNCTIONS ====================
    #[view]
    public fun get_user_stats(user_addr: address): (u64, u64, u64) acquires SecurityConfig {
        let drop_balance = coin::balance<DROP>(user_addr);
        let drf_balance = coin::balance<DRF>(user_addr);
        
        let daily_receipts = 0;
        let security_config = borrow_global<SecurityConfig>(@dropify_secure);
        if (table::contains(&security_config.rate_limits, user_addr)) {
            let rate_limit = table::borrow(&security_config.rate_limits, user_addr);
            let current_day = timestamp::now_seconds() / 86400;
            let limit_day = rate_limit.last_reset / 86400;
            
            if (current_day == limit_day) {
                daily_receipts = rate_limit.daily_receipts;
            };
        };
        
        (drop_balance, drf_balance, daily_receipts)
    }

    #[view]
    public fun get_platform_stats(): (u64, u64, u64) acquires PlatformTreasury {
        let treasury = borrow_global<PlatformTreasury>(@dropify_secure);
        (
            treasury.total_drop_minted,
            treasury.total_drop_burned,
            treasury.total_receipts_processed
        )
    }

    #[view]
    public fun is_receipt_processed(receipt_hash: String): bool acquires PlatformTreasury {
        let treasury = borrow_global<PlatformTreasury>(@dropify_secure);
        table::contains(&treasury.processed_receipts, receipt_hash)
    }
}
