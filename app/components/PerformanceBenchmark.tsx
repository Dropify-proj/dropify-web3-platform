'use client';

import { useState, useEffect } from 'react';

interface PerformanceMetric {
  name: string;
  supra: number;
  ethereum: number;
  polygon: number;
  solana: number;
  unit: string;
  description: string;
}

export default function PerformanceBenchmark() {
  const [animatedValues, setAnimatedValues] = useState<Record<string, Record<string, number>>>({});
  const [selectedMetric, setSelectedMetric] = useState<string>('');

  const metrics: PerformanceMetric[] = [
    {
      name: 'Transaction Speed',
      supra: 500000,
      ethereum: 15,
      polygon: 7000,
      solana: 65000,
      unit: 'TPS',
      description: 'Transactions processed per second'
    },
    {
      name: 'Block Finality',
      supra: 1.5,
      ethereum: 384,
      polygon: 4.2,
      solana: 2.5,
      unit: 'seconds',
      description: 'Time to achieve transaction finality'
    },
    {
      name: 'Gas Fees',
      supra: 0.001,
      ethereum: 25.50,
      polygon: 0.02,
      solana: 0.00025,
      unit: 'USD',
      description: 'Average transaction cost'
    },
    {
      name: 'Energy Efficiency',
      supra: 99.9,
      ethereum: 35.2,
      polygon: 89.7,
      solana: 87.3,
      unit: '% efficient',
      description: 'Energy efficiency rating'
    },
    {
      name: 'Validator Count',
      supra: 8000,
      ethereum: 500000,
      polygon: 100,
      solana: 2000,
      unit: 'validators',
      description: 'Number of network validators'
    },
    {
      name: 'Smart Contract Throughput',
      supra: 450000,
      ethereum: 12,
      polygon: 6500,
      solana: 50000,
      unit: 'contracts/sec',
      description: 'Smart contracts executed per second'
    }
  ];

  // Animate values on mount
  useEffect(() => {
    const animateValues = () => {
      metrics.forEach(metric => {
        const chains = ['supra', 'ethereum', 'polygon', 'solana'];
        chains.forEach(chain => {
          const targetValue = metric[chain as keyof PerformanceMetric] as number;
          let currentValue = 0;
          const increment = targetValue / 50;
          
          const animationInterval = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
              currentValue = targetValue;
              clearInterval(animationInterval);
            }
            
            setAnimatedValues(prev => ({
              ...prev,
              [metric.name]: {
                ...prev[metric.name],
                [chain]: currentValue
              }
            }));
          }, 30);
        });
      });
    };

    animateValues();
  }, []);

  const getBarWidth = (value: number, maxValue: number) => {
    return (value / maxValue) * 100;
  };

  const getChainColor = (chain: string, isHighlighted: boolean = false) => {
    const colors = {
      supra: isHighlighted ? '#8b5cf6' : '#a855f7',
      ethereum: '#627eea',
      polygon: '#8247e5',
      solana: '#00d4aa'
    };
    return colors[chain as keyof typeof colors];
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === 'TPS' || unit === 'contracts/sec') {
      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
      if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    }
    if (unit === 'USD') return `$${value.toFixed(3)}`;
    if (unit === 'validators') {
      if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toFixed(value < 10 ? 2 : 0);
  };

  const getBestPerformer = (metric: PerformanceMetric) => {
    const chains = ['supra', 'ethereum', 'polygon', 'solana'];
    
    // For gas fees, lower is better
    if (metric.name === 'Gas Fees' || metric.name === 'Block Finality') {
      return chains.reduce((best, chain) => 
        metric[chain as keyof PerformanceMetric] < metric[best as keyof PerformanceMetric] ? chain : best
      );
    }
    
    // For everything else, higher is better
    return chains.reduce((best, chain) => 
      metric[chain as keyof PerformanceMetric] > metric[best as keyof PerformanceMetric] ? chain : best
    );
  };

  return (
    <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
      <div className="mb-6">
        <h3 className="text-2xl font-black text-white mb-2 flex items-center gap-3">
          ⚡ Supra vs Competition Benchmark
          <span className="text-sm bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full">
            Real-time Performance
          </span>
        </h3>
        <p className="text-white/70">
          Comprehensive performance comparison across major blockchain networks
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {metrics.map((metric, index) => {
          const maxValue = Math.max(metric.supra, metric.ethereum, metric.polygon, metric.solana);
          const bestPerformer = getBestPerformer(metric);
          const isSupraBest = bestPerformer === 'supra';

          return (
            <div 
              key={metric.name}
              className={`p-5 bg-gradient-to-br ${
                isSupraBest 
                  ? 'from-purple-500/20 to-pink-500/20 border-purple-500/30' 
                  : 'from-gray-500/10 to-slate-500/10 border-gray-500/20'
              } border rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer`}
              onClick={() => setSelectedMetric(selectedMetric === metric.name ? '' : metric.name)}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-bold text-white flex items-center gap-2">
                    {metric.name}
                    {isSupraBest && <span className="text-purple-400">👑</span>}
                  </h4>
                  <p className="text-white/60 text-sm">{metric.description}</p>
                </div>
                {isSupraBest && (
                  <div className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs font-bold">
                    LEADER
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {(['supra', 'ethereum', 'polygon', 'solana'] as const).map(chain => {
                  const value = animatedValues[metric.name]?.[chain] || 0;
                  const actualValue = metric[chain];
                  const barWidth = getBarWidth(actualValue, maxValue);
                  const isBest = chain === bestPerformer;

                  return (
                    <div key={chain} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className={`text-sm font-semibold capitalize ${
                          chain === 'supra' ? 'text-purple-300' : 'text-white/80'
                        }`}>
                          {chain}
                          {isBest && <span className="ml-1 text-yellow-400">⭐</span>}
                        </span>
                        <span className={`text-sm font-bold ${
                          chain === 'supra' ? 'text-purple-300' : 'text-white/90'
                        }`}>
                          {formatValue(value, metric.unit)} {metric.unit}
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-700/30 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-1000 ease-out"
                          style={{ 
                            width: `${(value / maxValue) * 100}%`,
                            backgroundColor: getChainColor(chain, isBest)
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedMetric === metric.name && (
                <div className="mt-4 p-3 bg-black/20 rounded-lg">
                  <h5 className="text-white font-semibold mb-2">Performance Analysis</h5>
                  <p className="text-white/70 text-sm">
                    {isSupraBest 
                      ? `Supra outperforms all competitors in ${metric.name.toLowerCase()} by ${
                          Math.round(((metric.supra / Math.max(metric.ethereum, metric.polygon, metric.solana)) - 1) * 100)
                        }% on average.`
                      : `While not leading in this metric, Supra excels in overall network efficiency and cost-effectiveness.`
                    }
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Overall Performance Summary */}
      <div className="mt-6 p-5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-xl">
        <h4 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
          🏆 Overall Performance Leader
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {(['supra', 'ethereum', 'polygon', 'solana'] as const).map(chain => {
            const wins = metrics.filter(metric => getBestPerformer(metric) === chain).length;
            const winPercentage = (wins / metrics.length) * 100;
            
            return (
              <div key={chain} className="text-center">
                <div className={`text-2xl font-black ${
                  chain === 'supra' ? 'text-purple-300' : 'text-white/60'
                }`}>
                  {wins}/{metrics.length}
                </div>
                <div className={`text-sm capitalize ${
                  chain === 'supra' ? 'text-purple-300' : 'text-white/60'
                }`}>
                  {chain}
                </div>
                <div className={`text-xs ${
                  chain === 'supra' ? 'text-purple-400' : 'text-white/50'
                }`}>
                  {winPercentage.toFixed(0)}% wins
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 text-center">
          <span className="text-purple-300 font-bold text-lg">
            🚀 Supra leads in {metrics.filter(metric => getBestPerformer(metric) === 'supra').length} out of {metrics.length} key performance metrics
          </span>
        </div>
      </div>
    </div>
  );
}
