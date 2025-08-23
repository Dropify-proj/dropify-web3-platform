const { AptosAccount } = require("aptos");

// Generate a new admin wallet
function generateAdminWallet() {
  console.log("🏦 Creating your new admin wallet...\n");
  
  // Create new wallet
  const account = new AptosAccount();
  
  console.log("✅ SUCCESS! Your new admin wallet is ready:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`📍 Wallet Address: ${account.address()}`);
  console.log(`🔑 Private Key: ${account.toPrivateKeyObject().privateKeyHex}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("");
  console.log("🔒 SECURITY WARNING:");
  console.log("• NEVER share your private key with anyone");
  console.log("• Save your private key in a secure location");
  console.log("• This private key controls your entire treasury");
  console.log("");
  console.log("📋 NEXT STEPS:");
  console.log("1. Copy the private key above");
  console.log("2. Open .env.local file");
  console.log("3. Paste it after ADMIN_PRIVATE_KEY=");
  console.log("4. Fund this wallet with test tokens");
}

generateAdminWallet();
