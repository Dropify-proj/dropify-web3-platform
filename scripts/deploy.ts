import { AptosClient, AptosAccount, HexString } from "aptos";
import { DropifyContractClient } from "@/lib/dropify-contract-clean";

// Configuration validation
const SUPRA_RPC_URL = process.env.NEXT_PUBLIC_SUPRA_RPC_URL || "https://testnet.supra.com/rpc/v1";
const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY;

// Pre-deployment validation
function validateEnvironment() {
  console.log("🔍 Validating deployment environment...");
  
  const errors = [];
  
  if (!ADMIN_PRIVATE_KEY) {
    errors.push("❌ ADMIN_PRIVATE_KEY environment variable is required");
  }
  
  if (!SUPRA_RPC_URL.includes("supra.com")) {
    errors.push("❌ Invalid Supra RPC URL format");
  }
  
  if (ADMIN_PRIVATE_KEY && ADMIN_PRIVATE_KEY.length !== 66) {
    errors.push("❌ Admin private key should be 66 characters (0x + 64 hex chars)");
  }
  
  if (errors.length > 0) {
    console.error("🚨 Environment validation failed:");
    errors.forEach(error => console.error(error));
    console.error("\n📋 Please check PRE_DEPLOYMENT_CHECKLIST.md for setup instructions");
    process.exit(1);
  }
  
  console.log("✅ Environment validation passed");
}

async function deployContract() {
  console.log("🚀 Starting Dropify Smart Contract Deployment...");
  
  // Validate environment first
  validateEnvironment();

  try {
    // Initialize client and accounts
    const client = new AptosClient(SUPRA_RPC_URL);
    const adminAccount = AptosAccount.fromPrivateKeyHex(ADMIN_PRIVATE_KEY);
    
    console.log(`📝 Admin Account: ${adminAccount.address()}`);
    
    // Check admin account balance
    try {
      const adminBalance = await client.getAccountBalance(adminAccount.address());
      console.log(`💰 Admin Balance: ${adminBalance} APT`);
      
      if (adminBalance < 1000000) { // 0.01 APT minimum
        console.log("💸 Funding admin account...");
        await client.fundAccount(adminAccount.address(), 100000000); // 1 APT
      }
    } catch (error) {
      console.log("💸 Admin account not found, funding...");
      await client.fundAccount(adminAccount.address(), 100000000); // 1 APT
    }

    // Create resource account for the contract
    console.log("🏗️  Creating resource account...");
    const resourceAccountPayload = {
      type: "entry_function_payload",
      function: "0x1::resource_account::create_resource_account_and_fund",
      type_arguments: [],
      arguments: [
        Array.from(new TextEncoder().encode("dropify")), // seed
        "100000000" // 1 APT funding
      ],
    };

    const resourceTxnRequest = await client.generateTransaction(adminAccount.address(), resourceAccountPayload);
    const signedResourceTxn = await client.signTransaction(adminAccount, resourceTxnRequest);
    const resourceTxnResult = await client.submitTransaction(signedResourceTxn);
    await client.waitForTransaction(resourceTxnResult.hash);
    
    console.log(`✅ Resource account created: ${resourceTxnResult.hash}`);

    // Calculate resource account address
    const resourceAccountSeed = new TextEncoder().encode("dropify");
    const resourceAddress = AptosAccount.getResourceAccountAddress(
      adminAccount.address(),
      resourceAccountSeed
    );
    console.log(`📍 Resource Account Address: ${resourceAddress}`);

    // Deploy the contract (this would typically be done via Move CLI)
    console.log("📦 Contract deployment via Move CLI required:");
    console.log(`   aptos move publish --package-dir ./contracts --named-addresses dropify=${resourceAddress} --profile admin`);
    
    // Initialize the contract once deployed
    console.log("🔧 Contract initialization will be available after deployment...");
    
    // Create a mock resource account for initialization (in practice, use the actual deployed address)
    const mockResourceAccount = new AptosAccount();
    
    console.log("\n🎯 Deployment Summary:");
    console.log(`   Admin Address: ${adminAccount.address()}`);
    console.log(`   Resource Address: ${resourceAddress}`);
    console.log(`   RPC URL: ${SUPRA_RPC_URL}`);
    console.log("\n📋 Next Steps:");
    console.log("1. Deploy the Move contract using the Aptos CLI");
    console.log("2. Update NEXT_PUBLIC_CONTRACT_ADDRESS in .env.local");
    console.log("3. Run the initialization script");
    
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

async function initializeContract() {
  console.log("🔧 Initializing Dropify Smart Contract...");
  
  if (!ADMIN_PRIVATE_KEY) {
    console.error("❌ ADMIN_PRIVATE_KEY environment variable is required");
    process.exit(1);
  }

  try {
    const adminAccount = AptosAccount.fromPrivateKeyHex(ADMIN_PRIVATE_KEY);
    const contractClient = new DropifyContractClient();
    
    // Create a mock resource account (in practice, this would be the deployed contract address)
    const resourceAccount = new AptosAccount();
    
    console.log("🚀 Initializing dual token system...");
    const initHash = await contractClient.initialize(adminAccount, resourceAccount);
    
    console.log(`✅ Contract initialized successfully!`);
    console.log(`   Transaction Hash: ${initHash}`);
    console.log(`   Admin Address: ${adminAccount.address()}`);
    
    // Test the contract
    console.log("🧪 Running basic tests...");
    
    // Get initial platform stats
    const stats = await contractClient.getPlatformStats();
    console.log("📊 Initial Platform Stats:", stats);
    
    console.log("✅ Smart contract is ready for use!");
    
  } catch (error) {
    console.error("❌ Initialization failed:", error);
    process.exit(1);
  }
}

// Check command line arguments
const command = process.argv[2];

if (command === "deploy") {
  deployContract();
} else if (command === "init") {
  initializeContract();
} else {
  console.log("Usage:");
  console.log("  npm run deploy-contract     - Deploy the smart contract");
  console.log("  npm run init-contract      - Initialize the deployed contract");
  console.log("\nMake sure to set ADMIN_PRIVATE_KEY in your .env.local file");
}
