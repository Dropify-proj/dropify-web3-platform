'use client';

import { useState } from 'react';
// Temporary import for demo mode
import { useWallet } from '@/lib/wallet-context';

export default function TreasuryManagement() {
  const { 
    isConnected, 
    drfBalance, 
    account,
    connectWallet,
  } = useWallet();

  const [transferAmount, setTransferAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [newAdminAddress, setNewAdminAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const showMessage = (message: string, isError = false) => {
    if (isError) {
      setErrorMessage(message);
      setSuccessMessage('');
    } else {
      setSuccessMessage(message);
      setErrorMessage('');
    }
    setTimeout(() => {
      setSuccessMessage('');
      setErrorMessage('');
    }, 5000);
  };

  const handleTransferDRF = async () => {
    if (!isConnected || !account) {
      showMessage('Please connect your wallet first', true);
      return;
    }

    if (!transferAmount || !recipientAddress) {
      showMessage('Please enter amount and recipient address', true);
      return;
    }

    setIsLoading(true);
    try {
      // This would use the treasury management functions
      // const result = await dropifyContract.transferTreasuryDRF(account, recipientAddress, parseInt(transferAmount));
      
      showMessage(`Successfully transferred ${transferAmount} DRF to ${recipientAddress}`);
      setTransferAmount('');
      setRecipientAddress('');
    } catch (error) {
      showMessage('Failed to transfer DRF', true);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMigrateEntireTreasury = async () => {
    if (!isConnected || !account) {
      showMessage('Please connect your wallet first', true);
      return;
    }

    if (!recipientAddress) {
      showMessage('Please enter recipient address', true);
      return;
    }

    const confirmed = window.confirm(
      '⚠️ WARNING: This will transfer ALL treasury funds! This action cannot be undone. Are you absolutely sure?'
    );

    if (!confirmed) return;

    setIsLoading(true);
    try {
      // This would use the treasury management functions
      // const result = await dropifyContract.migrateEntireTreasury(account, recipientAddress);
      
      showMessage(`Successfully migrated entire treasury to ${recipientAddress}`);
      setRecipientAddress('');
    } catch (error) {
      showMessage('Failed to migrate treasury', true);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTransferAdminRights = async () => {
    if (!isConnected || !account) {
      showMessage('Please connect your wallet first', true);
      return;
    }

    if (!newAdminAddress) {
      showMessage('Please enter new admin address', true);
      return;
    }

    const confirmed = window.confirm(
      '🔥 CRITICAL WARNING: This will transfer ALL administrative control! You will lose access to treasury management, token minting, and all admin functions. This action cannot be undone. Are you absolutely certain?'
    );

    if (!confirmed) return;

    setIsLoading(true);
    try {
      // This would use the treasury management functions
      // const result = await dropifyContract.transferAdminRights(account, newAdminAddress);
      
      showMessage(`Successfully transferred admin rights to ${newAdminAddress}. You no longer have administrative access.`);
      setNewAdminAddress('');
    } catch (error) {
      showMessage('Failed to transfer admin rights', true);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-6">Treasury Management</h1>
          <p className="text-gray-400 mb-8">Connect your admin wallet to manage treasury</p>
          <button
            onClick={connectWallet}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Connect Admin Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">🏦 Treasury Management</h1>
        
        {/* Current Treasury Status */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Current Treasury Status</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="text-gray-400">Treasury DRF Balance</div>
              <div className="text-3xl font-bold text-green-400">{drfBalance.toLocaleString()} DRF</div>
            </div>
            <div>
              <div className="text-gray-400">Admin Address</div>
              <div className="text-sm text-blue-400 font-mono break-all">{account?.address()}</div>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="bg-green-900/50 border border-green-700 text-green-300 p-4 rounded-lg mb-6">
            ✅ {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-lg mb-6">
            ❌ {errorMessage}
          </div>
        )}

        {/* Transfer Specific Amount */}
        <div className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">💸 Transfer Specific DRF Amount</h2>
          <p className="text-gray-400 mb-6">Transfer a specific amount of DRF from treasury to another wallet</p>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-white mb-2">Amount (DRF)</label>
              <input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                placeholder="Enter DRF amount"
              />
            </div>
            <div>
              <label className="block text-white mb-2">Recipient Address</label>
              <input
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
                placeholder="0x..."
              />
            </div>
          </div>
          
          <button
            onClick={handleTransferDRF}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {isLoading ? 'Processing...' : 'Transfer DRF'}
          </button>
        </div>

        {/* Migrate Entire Treasury */}
        <div className="bg-gray-900/50 border border-orange-700 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-orange-400 mb-4">⚠️ Migrate Entire Treasury</h2>
          <p className="text-gray-400 mb-6">
            <strong>WARNING:</strong> This will transfer ALL DRF from the treasury to a new wallet. Use this for emergency fund recovery or complete treasury migration.
          </p>
          
          <div className="mb-6">
            <label className="block text-white mb-2">New Treasury Wallet Address</label>
            <input
              type="text"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
              placeholder="0x..."
            />
          </div>
          
          <button
            onClick={handleMigrateEntireTreasury}
            disabled={isLoading}
            className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {isLoading ? 'Processing...' : 'Migrate Entire Treasury'}
          </button>
        </div>

        {/* Transfer Admin Rights */}
        <div className="bg-gray-900/50 border border-red-700 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-red-400 mb-4">🔥 Transfer Administrative Control</h2>
          <p className="text-gray-400 mb-6">
            <strong>CRITICAL WARNING:</strong> This will transfer ALL administrative rights including treasury control, token minting/burning capabilities, and platform management. This action is IRREVERSIBLE and you will lose all access.
          </p>
          
          <div className="mb-6">
            <label className="block text-white mb-2">New Admin Address</label>
            <input
              type="text"
              value={newAdminAddress}
              onChange={(e) => setNewAdminAddress(e.target.value)}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-red-500"
              placeholder="0x..."
            />
          </div>
          
          <button
            onClick={handleTransferAdminRights}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {isLoading ? 'Processing...' : 'Transfer Admin Rights (IRREVERSIBLE)'}
          </button>
        </div>

        {/* Safety Notice */}
        <div className="mt-8 bg-yellow-900/30 border border-yellow-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-yellow-400 mb-3">🛡️ Security Best Practices</h3>
          <ul className="text-gray-400 space-y-2">
            <li>• Always verify recipient addresses multiple times before transferring</li>
            <li>• Test with small amounts first when possible</li>
            <li>• Keep backup admin keys in secure storage</li>
            <li>• Document all treasury transfers for record keeping</li>
            <li>• Never share your admin private keys with anyone</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
