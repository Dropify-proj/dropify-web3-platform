const crypto = require('crypto');

// Generate secure private key
const privateKey = '0x' + crypto.randomBytes(32).toString('hex');

console.log('🔐 SECURE ADMIN WALLET GENERATED');
console.log('================================');
console.log('Private Key:', privateKey);
console.log('');
console.log('⚠️  SAVE THIS KEY SECURELY!');
console.log('This controls your smart contract and treasury.');
console.log('Never share this key with anyone.');
console.log('');
console.log('✅ Copy this key to your .env.local file');
