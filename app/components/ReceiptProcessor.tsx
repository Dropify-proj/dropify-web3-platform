'use client';

import { useState, useRef } from 'react';

interface ProcessedReceipt {
  id: string;
  storeName: string;
  total: number;
  tokensEarned: number;
  date: string;
  items: Array<{
    name: string;
    price: number;
    tokens: number;
  }>;
}

export default function ReceiptProcessor() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedReceipt, setProcessedReceipt] = useState<ProcessedReceipt | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setIsProcessing(true);
    setProcessedReceipt(null);

    // Simulate receipt processing
    setTimeout(() => {
      const mockReceipt: ProcessedReceipt = {
        id: `receipt_${Date.now()}`,
        storeName: "Target Store #1234",
        total: 45.67,
        tokensEarned: 46,
        date: new Date().toLocaleDateString(),
        items: [
          { name: "Organic Bananas", price: 3.99, tokens: 4 },
          { name: "Greek Yogurt", price: 5.49, tokens: 5 },
          { name: "Whole Grain Bread", price: 4.29, tokens: 4 },
          { name: "Fresh Spinach", price: 2.99, tokens: 3 },
          { name: "Chicken Breast", price: 12.99, tokens: 13 },
          { name: "Olive Oil", price: 8.99, tokens: 9 },
          { name: "Brown Rice", price: 3.99, tokens: 4 },
          { name: "Almond Milk", price: 2.94, tokens: 4 }
        ]
      };

      setProcessedReceipt(mockReceipt);
      setIsProcessing(false);
    }, 3000);
  };

  const openFileSelector = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Upload Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Upload Your Receipt
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
          Scan or upload a photo of your receipt to earn Drop Tokens
        </p>

        {/* File Upload Area */}
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
            dragActive
              ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20'
              : 'border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50'
          } hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 backdrop-blur-sm`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>

            <div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">
                Drop your receipt here, or{' '}
                <button
                  onClick={openFileSelector}
                  className="text-blue-600 hover:text-blue-700 underline font-semibold"
                >
                  browse files
                </button>
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Support for JPG, PNG, and PDF files up to 10MB
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Secure Processing
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Instant Rewards
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                No Personal Data Stored
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Processing Animation */}
      {isProcessing && (
        <div className="text-center py-12">
          <div className="inline-flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gradient-to-r from-cyan-600 to-purple-600"></div>
            <div className="space-y-2">
              <p className="text-lg font-medium bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Processing your receipt...
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Analyzing items and calculating your rewards
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {processedReceipt && (
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl shadow-xl border border-cyan-200/50 dark:border-purple-700/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">Receipt Processed!</h3>
                <p className="text-cyan-100">
                  {processedReceipt.storeName} • {processedReceipt.date}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{processedReceipt.tokensEarned}</div>
                <div className="text-cyan-100">Drop Tokens Earned</div>
              </div>
            </div>
          </div>

          {/* Receipt Details */}
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Items List */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Items Scanned
                </h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {processedReceipt.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          ${item.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-purple-600 dark:text-purple-400">
                          +{item.tokens} tokens
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Summary
                </h4>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 p-4 rounded-lg border border-cyan-200/50 dark:border-cyan-700/50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-700 dark:text-gray-300">Total Amount</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        ${processedReceipt.total.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">Items Count</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {processedReceipt.items.length} items
                      </span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20 p-4 rounded-lg border border-purple-200/50 dark:border-purple-700/50">
                    <div className="text-center">
                      <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                        {processedReceipt.tokensEarned}
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 font-medium">
                        Drop Tokens Earned
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        ≈ 1 token per $1 spent
                      </div>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-cyan-700 hover:via-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                    Claim Rewards
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* How It Works */}
      <div className="text-center">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
          How It Works
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-cyan-200/50 dark:border-cyan-700/50">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">1</span>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Upload Receipt</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Take a photo or upload an image of your receipt from any store
            </p>
          </div>

          <div className="p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-blue-200/50 dark:border-blue-700/50">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">2</span>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">AI Processing</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Our AI analyzes your receipt and identifies all items and prices
            </p>
          </div>

          <div className="p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-purple-200/50 dark:border-purple-700/50">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold">3</span>
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Earn Tokens</h4>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Receive Drop Tokens that can be redeemed for exclusive rewards
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
