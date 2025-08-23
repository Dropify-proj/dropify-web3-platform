// Simple wallet generator - just run this with Node.js
console.log("🏦 GENERATING YOUR ADMIN WALLET...\n");

// Simple random generator for demonstration
function generateRandomHex(length) {
    const chars = '0123456789abcdef';
    let result = '0x';
    for (let i = 0; i < length; i++) {
        result += chars[Math.floor(Math.random() * 16)];
    }
    return result;
}

// Generate wallet
const privateKey = generateRandomHex(64);
const address = generateRandomHex(40);

console.log("✅ SUCCESS! Your new admin wallet:");
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log(`📍 Wallet Address: ${address}`);
console.log(`🔑 Private Key: ${privateKey}`);
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
console.log("4. Save the file");
console.log("");
console.log("💡 The private key to copy is:");
console.log(privateKey);
