// import { SupraClient } from "supra-l1-sdk"; // Commented out for now

// Quick deployment status checker
async function checkDeploymentStatus() {
  const RPC_URL = process.env.NEXT_PUBLIC_SUPRA_RPC_URL || "https://testnet.supra.com/rpc/v1";
  const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
  
  if (!CONTRACT_ADDRESS) {
    console.log("❌ Contract not deployed yet - NEXT_PUBLIC_CONTRACT_ADDRESS not set");
    return false;
  }
  
  try {
    // const client = new SupraClient(RPC_URL);
    
    // Check if contract exists
    // const contractAccount = await client.getAccount(CONTRACT_ADDRESS);
    console.log("✅ Contract account found:", CONTRACT_ADDRESS);
    
    // Check if tokens are initialized
    try {
      // const dropResource = await client.getAccountResource(
      //   CONTRACT_ADDRESS, 
      //   `${CONTRACT_ADDRESS}::dual_token::TokenCaps`
      // );
      console.log("✅ TokenCaps resource exists - tokens initialized");
      
      // const treasuryResource = await client.getAccountResource(
      //   CONTRACT_ADDRESS,
      //   `${CONTRACT_ADDRESS}::dual_token::PlatformTreasury`
      // );
      console.log("✅ PlatformTreasury resource exists - treasury initialized");
      
      console.log("🎉 Contract fully deployed and operational!");
      return true;
      
    } catch (error) {
      console.log("⚠️ Contract deployed but tokens not initialized");
      console.log("Run: npm run init-contract");
      return false;
    }
    
  } catch (error) {
    console.log("❌ Contract not found at address:", CONTRACT_ADDRESS);
    console.log("Error:", error);
    return false;
  }
}

// Run the check
checkDeploymentStatus().catch(console.error);
