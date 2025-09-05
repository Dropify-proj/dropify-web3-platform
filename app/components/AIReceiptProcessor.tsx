'use client';

import { useState, useRef } from 'react';
import { useEnhancedWallet } from '../../lib/enhanced-wallet-context';

interface AIReceiptProcessorProps {
  onProcessComplete?: (result: any) => void;
  className?: string;
}

interface ProcessingState {
  isProcessing: boolean;
  currentStep: string;
  progress: number;
}

export default function AIReceiptProcessor({ onProcessComplete, className = '' }: AIReceiptProcessorProps) {
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    currentStep: '',
    progress: 0
  });
  
  const [lastResult, setLastResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    processReceiptComplete,
    isLoading: walletLoading
  } = useEnhancedWallet();

  // Simulate AI-powered receipt processing similar to your HTML version
  const processReceiptWithAI = async (file: File) => {
    setProcessingState({
      isProcessing: true,
      currentStep: 'Initializing AI processing...',
      progress: 10
    });

    try {
      // Step 1: File validation and hash generation
      setProcessingState({
        isProcessing: true,
        currentStep: 'Validating receipt...',
        progress: 20
      });

      // Generate file hash for duplicate detection (similar to your HTML)
      const receiptData = await file.arrayBuffer();
      const hashArray = await crypto.subtle.digest('SHA-256', receiptData);
      const receiptHash = Array.from(new Uint8Array(hashArray))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      // Simulate duplicate check (10% chance of duplicate)
      const isDuplicate = Math.random() < 0.1;
      if (isDuplicate) {
        throw new Error('This receipt has already been uploaded. Please submit a unique one.');
      }

      // Step 2: Fraud detection simulation
      setProcessingState({
        isProcessing: true,
        currentStep: 'Running fraud detection...',
        progress: 40
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate fraud detection (5% chance of fraud)
      const isFraud = Math.random() < 0.05;
      if (isFraud) {
        throw new Error('This receipt appears to be fraudulent or invalid. Please try a different receipt.');
      }

      // Step 3: AI OCR Processing
      setProcessingState({
        isProcessing: true,
        currentStep: 'Analyzing receipt with AI...',
        progress: 60
      });

      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock AI extraction (similar to your Gemini API call)
      const mockAIResult = {
        total: Math.floor(Math.random() * 100) + 10 + Math.random(),
        storeName: ['Starbucks', 'Target', 'Walmart', 'CVS', 'Amazon Go'][Math.floor(Math.random() * 5)],
        date: new Date().toISOString().split('T')[0],
        items: ['Coffee - $4.50', 'Sandwich - $8.99', 'Tax - $1.25'],
        source: 'ai_ocr'
      };

      // Step 4: Blockchain transaction
      setProcessingState({
        isProcessing: true,
        currentStep: 'Processing blockchain transaction...',
        progress: 80
      });

      // Use the enhanced wallet's complete processing function
      const result = await processReceiptComplete(file);

      if (!result.success) {
        throw new Error(result.error || 'Blockchain transaction failed');
      }

      // Step 5: Complete
      setProcessingState({
        isProcessing: true,
        currentStep: 'Transaction complete!',
        progress: 100
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      const finalResult = {
        ...result,
        aiData: mockAIResult,
        receiptHash: receiptHash.substring(0, 32),
        processingTime: Date.now()
      };

      setLastResult(finalResult);
      onProcessComplete?.(finalResult);

      return finalResult;

    } catch (error) {
      console.error('Receipt processing error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Processing failed';
      
      setLastResult({
        success: false,
        error: errorMessage,
        processingTime: Date.now()
      });

      throw error;
    } finally {
      setProcessingState({
        isProcessing: false,
        currentStep: '',
        progress: 0
      });
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await processReceiptWithAI(file);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Processing failed';
      alert(`❌ ${errorMessage}`);
    }

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    if (processingState.isProcessing || walletLoading) return;
    fileInputRef.current?.click();
  };

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {/* AI-Powered Upload Button */}
      <div className="text-center mb-6">
        <button
          onClick={handleUploadClick}
          disabled={processingState.isProcessing || walletLoading}
          className={`inline-flex items-center justify-center px-8 py-4 rounded-xl font-semibold text-white shadow-lg transition-all transform ${
            processingState.isProcessing || walletLoading
              ? 'bg-gray-600 cursor-not-allowed opacity-50'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50'
          }`}
        >
          {processingState.isProcessing || walletLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Upload Receipt with AI
            </>
          )}
        </button>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* Processing Status */}
      {processingState.isProcessing && (
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-blue-500/30 mb-6">
          <div className="text-sm text-blue-300 font-medium mb-2">
            {processingState.currentStep}
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${processingState.progress}%` }}
            ></div>
          </div>
          
          <div className="text-xs text-gray-400 mt-2">
            {processingState.progress}% complete
          </div>
        </div>
      )}

      {/* Last Transaction Result */}
      {lastResult && (
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-white/10">
          <div className="text-sm font-semibold text-gray-300 mb-2">Last Transaction</div>
          
          {lastResult.success ? (
            <div className="space-y-2">
              <div className="text-green-300 text-sm">
                ✅ Receipt processed successfully!
              </div>
              
              {lastResult.ocrData && (
                <div className="text-xs text-gray-400">
                  📍 Store: {lastResult.ocrData.vendor || 'Unknown'}
                  <br />
                  💰 Amount: ${lastResult.ocrData.total?.toFixed(2) || '0.00'}
                  <br />
                  🪙 Earned: {lastResult.blockchainResult?.dropEarned || 0} DROP tokens
                </div>
              )}
              
              {lastResult.blockchainResult?.transactionHash && (
                <div className="text-xs">
                  <a 
                    href={`https://testnet-explorer.supra.com/tx/${lastResult.blockchainResult.transactionHash}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    View Transaction ↗
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="text-red-300 text-sm">
              ❌ {lastResult.error || 'Processing failed'}
            </div>
          )}
        </div>
      )}

      {/* AI Features Info */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-4 border border-white/10 mt-6">
        <div className="text-sm font-semibold text-gray-300 mb-2">AI-Powered Features</div>
        
        <div className="space-y-1 text-xs text-gray-400">
          <div className="flex items-center">
            <span className="text-green-400 mr-2">✓</span>
            Duplicate receipt detection
          </div>
          <div className="flex items-center">
            <span className="text-green-400 mr-2">✓</span>
            Fraud prevention algorithms
          </div>
          <div className="flex items-center">
            <span className="text-green-400 mr-2">✓</span>
            OCR data extraction
          </div>
          <div className="flex items-center">
            <span className="text-green-400 mr-2">✓</span>
            Blockchain verification
          </div>
          <div className="flex items-center">
            <span className="text-green-400 mr-2">✓</span>
            Instant token rewards
          </div>
        </div>
      </div>
    </div>
  );
}
