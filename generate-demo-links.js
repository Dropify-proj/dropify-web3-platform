#!/usr/bin/env node

// Demo Link Generator for Dropify Platform
console.log('🚀 Dropify Platform - Live Demo Links Generator\n');

const os = require('os');
const networkInterfaces = os.networkInterfaces();

// Find the main network interface (usually WiFi or Ethernet)
let localIP = 'localhost';
Object.keys(networkInterfaces).forEach(interfaceName => {
  const interfaces = networkInterfaces[interfaceName];
  interfaces.forEach(interface => {
    if (interface.family === 'IPv4' && !interface.internal) {
      localIP = interface.address;
    }
  });
});

console.log('📍 Your Dropify Platform Demo Links:');
console.log('=' * 50);
console.log(`🏠 Local Access: http://localhost:3000`);
console.log(`🌐 Network Access: http://${localIP}:3000`);
console.log('');

console.log('🎯 Demo Pages:');
console.log(`   • Main Dashboard: http://${localIP}:3000/dashboard`);
console.log(`   • Interactive Demo: http://${localIP}:3000/drop-tokens`);
console.log(`   • Receipt Scanner: http://${localIP}:3000/scan`);
console.log(`   • Investor Pitch: http://${localIP}:3000/pitch-deck`);
console.log(`   • Database Test: http://${localIP}:3000/database-test`);
console.log(`   • System Status: http://${localIP}:3000/status`);
console.log('');

console.log('📱 Mobile Demo Links:');
console.log(`   • QR Code: Generate QR for http://${localIP}:3000/dashboard`);
console.log(`   • Share Link: Send http://${localIP}:3000/drop-tokens to investors`);
console.log('');

console.log('🔗 Professional Demo Setup:');
console.log('   1. Ensure your dev server is running (npm run dev)');
console.log('   2. Share the Network Access link with investors');
console.log('   3. They can access from any device on the same network');
console.log('   4. Demo works on mobile, tablet, and desktop');
console.log('');

console.log('⚡ Quick Demo Flow:');
console.log('   1. Start at /dashboard - Show full platform overview');
console.log('   2. Click "Sign Up" - Demonstrate user onboarding');
console.log('   3. Visit /drop-tokens - Interactive receipt-to-rewards demo');
console.log('   4. Show /pitch-deck - Full investor presentation');
console.log('   5. Test /database-test - Technical integration proof');
console.log('');

console.log('🎬 Professional Presentation Tips:');
console.log('   • Use /pitch-deck for formal investor presentations');
console.log('   • Use /dashboard for product demonstrations');
console.log('   • Use /drop-tokens for interactive user experience demos');
console.log('   • Use /database-test to show technical capabilities');
console.log('');

console.log(`🌟 Your Network IP: ${localIP}`);
console.log('   Share this IP with demo participants on the same network!');
