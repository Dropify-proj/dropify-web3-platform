'use client';

import { useState, useRef } from 'react';
import { useWallet } from '../../lib/wallet-context-build-safe';

interface CameraCapture {
  id: string;
  timestamp: number;
  imageData: string;
  processingStatus: 'capturing' | 'analyzing' | 'processed' | 'error';
  merchant?: string;
  amount?: number;
  items?: string[];
  dropEarned?: number;
  transactionHash?: string;
}

export default function ReceiptCameraPage() {
  const { isConnected, dropBalance, scanReceipt } = useWallet();
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedReceipts, setCapturedReceipts] = useState<CameraCapture[]>([]);
  const [currentCapture, setCurrentCapture] = useState<CameraCapture | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setShowCamera(true);
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Could not access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Set canvas size to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw the current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get image data
    const imageData = canvas.toDataURL('image/jpeg', 0.8);

    // Create new capture record
    const newCapture: CameraCapture = {
      id: `capture_${Date.now()}`,
      timestamp: Date.now(),
      imageData,
      processingStatus: 'analyzing'
    };

    setCurrentCapture(newCapture);
    setIsCapturing(true);
    stopCamera();

    // Simulate AI processing
    processReceipt(newCapture);
  };

  const processReceipt = async (capture: CameraCapture) => {
    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock AI results
      const mockResults = {
        merchant: ['Starbucks', 'Target', 'Walmart', 'CVS', 'McDonald\'s'][Math.floor(Math.random() * 5)],
        amount: Math.floor(Math.random() * 10000) + 500, // $5-$105
        items: [
          'Coffee, Pastry',
          'Groceries, Household Items',
          'Electronics, Clothing',
          'Pharmacy, Snacks',
          'Fast Food, Beverages'
        ][Math.floor(Math.random() * 5)].split(', ')
      };

      const dropEarned = Math.floor(mockResults.amount / 100); // 1 DROP per dollar spent

      // Update capture with results
      const updatedCapture: CameraCapture = {
        ...capture,
        processingStatus: 'processed',
        merchant: mockResults.merchant,
        amount: mockResults.amount,
        items: mockResults.items,
        dropEarned
      };

      // If connected to wallet, submit to blockchain
      if (isConnected) {
        try {
          const receiptHash = `0x${Date.now().toString(16)}${Math.random().toString(16).substr(2, 8)}`;
          const txHash = await scanReceipt(receiptHash, mockResults.amount);
          updatedCapture.transactionHash = txHash;
        } catch (error) {
          console.error('Blockchain submission failed:', error);
        }
      }

      setCurrentCapture(updatedCapture);
      setCapturedReceipts(prev => [updatedCapture, ...prev]);
      setIsCapturing(false);

    } catch (error) {
      setCurrentCapture({
        ...capture,
        processingStatus: 'error'
      });
      setIsCapturing(false);
    }
  };

  const retakePhoto = () => {
    setCurrentCapture(null);
    setIsCapturing(false);
    startCamera();
  };

  const uploadFromGallery = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageData = event.target?.result as string;
          const newCapture: CameraCapture = {
            id: `upload_${Date.now()}`,
            timestamp: Date.now(),
            imageData,
            processingStatus: 'analyzing'
          };
          setCurrentCapture(newCapture);
          setIsCapturing(true);
          processReceipt(newCapture);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center p-8 bg-black/50 backdrop-blur-xl rounded-2xl border border-cyan-400/30 max-w-md">
          <div className="text-6xl mb-6">📱</div>
          <h2 className="text-2xl font-bold text-white mb-4">Connect to Start Scanning</h2>
          <p className="text-gray-400 mb-6">
            Sign in with your email or connect your wallet to start earning DROP tokens from receipts and contribute to revolutionary consumer insights
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-4">
            📱 Receipt Scanner
          </h1>
          <p className="text-gray-400 text-lg">
            Upload receipts → Earn DROP tokens → Redeem for rewards
          </p>
          <p className="text-cyan-400 text-sm mt-2">
            🚀 Revolutionary receipts-to-rewards platform powered by anonymous data insights
          </p>
          
          {/* Balance Display */}
          <div className="mt-6 inline-flex items-center bg-cyan-500/20 border border-cyan-500/30 px-6 py-3 rounded-full">
            <div className="w-4 h-4 bg-cyan-400 rounded-full mr-3"></div>
            <span className="text-cyan-400 font-semibold">Balance: {dropBalance.toLocaleString()} DROP</span>
          </div>
        </div>

        {/* Camera Interface */}
        {!showCamera && !currentCapture && (
          <div className="bg-black/30 p-8 rounded-2xl border border-gray-700/50 text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📸</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Scan</h2>
            <p className="text-gray-400 mb-8">
              Upload receipts to earn DROP tokens and power anonymous consumer insights for businesses
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
              <button
                onClick={startCamera}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:scale-105 transition-transform"
              >
                <span className="text-xl">📱</span>
                Open Camera
              </button>
              
              <button
                onClick={uploadFromGallery}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-xl hover:scale-105 transition-transform"
              >
                <span className="text-xl">🖼️</span>
                Upload Image
              </button>
            </div>
          </div>
        )}

        {/* Camera View */}
        {showCamera && (
          <div className="bg-black rounded-2xl overflow-hidden mb-8">
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full h-96 object-cover"
                autoPlay
                playsInline
                muted
              />
              
              {/* Camera Overlay */}
              <div className="absolute inset-0 border-4 border-cyan-400/50 rounded-lg m-8">
                <div className="absolute top-4 left-4 right-4 text-center">
                  <div className="bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg inline-block">
                    <span className="text-cyan-400 text-sm font-medium">
                      📄 Position receipt within frame
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Capture Button */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                <button
                  onClick={capturePhoto}
                  className="w-16 h-16 bg-white rounded-full border-4 border-cyan-400 flex items-center justify-center text-2xl hover:scale-110 transition-transform"
                >
                  📸
                </button>
              </div>
              
              {/* Close Button */}
              <button
                onClick={stopCamera}
                className="absolute top-4 right-4 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Processing Screen */}
        {currentCapture && currentCapture.processingStatus === 'analyzing' && (
          <div className="bg-black/30 p-8 rounded-2xl border border-yellow-400/30 text-center mb-8">
            <div className="w-24 h-24 border-4 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-white mb-4">🤖 AI Processing Receipt...</h2>
            <p className="text-gray-400 mb-4">
              Our advanced AI extracts anonymous purchase insights while calculating your DROP rewards
            </p>
            <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 max-w-md mx-auto">
              <div className="text-sm text-yellow-200">
                ✓ Receipt image processed<br/>
                ✓ Anonymous data extracted for insights<br/>
                ⏳ Calculating DROP rewards...
              </div>
            </div>
          </div>
        )}

        {/* Processing Results */}
        {currentCapture && currentCapture.processingStatus === 'processed' && (
          <div className="bg-black/30 p-8 rounded-2xl border border-green-400/30 mb-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Receipt Processed Successfully!</h2>
              <p className="text-gray-400">Review the details and claim your rewards</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Receipt Preview */}
              <div className="bg-black/20 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4">📄 Receipt Image</h3>
                <img 
                  src={currentCapture.imageData} 
                  alt="Captured receipt" 
                  className="w-full h-64 object-cover rounded-lg border border-gray-600"
                />
              </div>

              {/* Extracted Details */}
              <div className="bg-black/20 p-4 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4">🤖 Extracted Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Store:</span>
                    <span className="text-white font-medium">{currentCapture.merchant}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Amount:</span>
                    <span className="text-white font-medium">${(currentCapture.amount! / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Items:</span>
                    <span className="text-white font-medium">{currentCapture.items?.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Date:</span>
                    <span className="text-white font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Reward Calculation */}
                <div className="mt-6 bg-gradient-to-br from-green-500/20 to-green-600/20 p-4 rounded-xl border border-green-400/30">
                  <h4 className="text-lg font-semibold text-white mb-2">💰 Your Reward</h4>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400 mb-1">
                      +{currentCapture.dropEarned} DROP
                    </div>
                    <div className="text-sm text-green-300">
                      Reward Rate: 1 DROP earned per $1 spent
                    </div>
                    {currentCapture.transactionHash && (
                      <div className="text-xs text-gray-400 mt-2">
                        TX: {currentCapture.transactionHash.substring(0, 20)}...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setCurrentCapture(null)}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-xl hover:scale-105 transition-transform"
              >
                ✨ Scan Another Receipt
              </button>
              <button
                onClick={retakePhoto}
                className="px-6 py-3 bg-gray-600 text-white font-medium rounded-xl hover:bg-gray-700 transition-colors"
              >
                📸 Retake Photo
              </button>
            </div>
          </div>
        )}

        {/* Error State */}
        {currentCapture && currentCapture.processingStatus === 'error' && (
          <div className="bg-black/30 p-8 rounded-2xl border border-red-400/30 text-center mb-8">
            <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">❌</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Processing Failed</h2>
            <p className="text-gray-400 mb-6">
              We couldn't process this receipt. Please try again with a clearer image.
            </p>
            <button
              onClick={retakePhoto}
              className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-xl hover:scale-105 transition-transform"
            >
              📸 Try Again
            </button>
          </div>
        )}

        {/* Recent Captures */}
        {capturedReceipts.length > 0 && (
          <div className="bg-black/30 p-8 rounded-2xl border border-gray-700/50">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">📋 Recent Captures</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {capturedReceipts.slice(0, 6).map((capture) => (
                <div key={capture.id} className="bg-black/20 p-4 rounded-xl border border-gray-600/30">
                  <img 
                    src={capture.imageData} 
                    alt="Receipt" 
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <div className="text-sm">
                    <div className="text-white font-medium">{capture.merchant}</div>
                    <div className="text-gray-400">${(capture.amount! / 100).toFixed(2)}</div>
                    <div className="text-green-400">+{capture.dropEarned} DROP</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
}
