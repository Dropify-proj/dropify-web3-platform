#!/usr/bin/env node

/**
 * DROPIFY INVESTOR DEMO LAUNCHER
 * Professional Demo Environment Setup
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 DROPIFY INVESTOR DEMO LAUNCHER');
console.log('==================================');
console.log('');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
    console.error('❌ Please run this from the project root directory');
    process.exit(1);
}

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
    console.log('📦 Installing dependencies...');
    const install = spawn('npm', ['install'], { 
        stdio: 'inherit',
        shell: true 
    });
    
    install.on('close', (code) => {
        if (code === 0) {
            startDemo();
        } else {
            console.error('❌ Failed to install dependencies');
            process.exit(1);
        }
    });
} else {
    startDemo();
}

function startDemo() {
    console.log('');
    console.log('🎯 LAUNCHING DROPIFY DEMO...');
    console.log('');
    console.log('📱 Demo Features:');
    console.log('   • Seamless Web2→Web3 Onboarding');
    console.log('   • Revolutionary Wallet Generation');
    console.log('   • Supra L1 Integration');
    console.log('   • Professional UI/UX');
    console.log('');
    console.log('🌐 Starting development server...');
    console.log('   Demo will be available at: http://localhost:3000');
    console.log('');
    console.log('💡 For investors:');
    console.log('   • Show the seamless onboarding flow');
    console.log('   • Demonstrate wallet generation');
    console.log('   • Highlight the Web2→Web3 bridge');
    console.log('');
    
    // Start the development server
    const dev = spawn('npm', ['run', 'dev'], { 
        stdio: 'inherit',
        shell: true 
    });
    
    dev.on('close', (code) => {
        console.log('\n🏁 Demo session ended');
    });
    
    // Handle Ctrl+C gracefully
    process.on('SIGINT', () => {
        console.log('\n\n🛑 Shutting down demo...');
        dev.kill();
        process.exit(0);
    });
}
