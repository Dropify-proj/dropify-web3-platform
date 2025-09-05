'use client';

import { useState, useEffect } from 'react';

interface NetworkNode {
  id: string;
  x: number;
  y: number;
  type: 'user' | 'business' | 'supra' | 'validator';
  connections: string[];
  activity: number;
  label: string;
}

interface Transaction {
  from: string;
  to: string;
  value: number;
  type: 'receipt' | 'reward' | 'enterprise' | 'fee';
  timestamp: number;
}

export default function SupraNetworkVisualizer() {
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isActive, setIsActive] = useState(false);

  // Initialize network nodes
  useEffect(() => {
    const centerX = 300;
    const centerY = 300;
    
    const initialNodes: NetworkNode[] = [
      // Supra core node (center)
      {
        id: 'supra-core',
        x: centerX,
        y: centerY,
        type: 'supra',
        connections: [],
        activity: 0,
        label: 'Supra L1'
      },
      
      // Validator nodes (inner circle)
      ...Array.from({ length: 6 }, (_, i) => {
        const angle = (i * 2 * Math.PI) / 6;
        const radius = 100;
        return {
          id: `validator-${i}`,
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          type: 'validator' as const,
          connections: ['supra-core'],
          activity: 0,
          label: `Validator ${i + 1}`
        };
      }),
      
      // Business nodes (middle circle)
      ...Array.from({ length: 8 }, (_, i) => {
        const angle = (i * 2 * Math.PI) / 8;
        const radius = 180;
        const businesses = ['Starbucks', 'Walmart', 'Target', 'McDonald\'s', 'Amazon', 'Nike', 'Apple', 'Tesla'];
        return {
          id: `business-${i}`,
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          type: 'business' as const,
          connections: ['supra-core', `validator-${i % 6}`],
          activity: 0,
          label: businesses[i]
        };
      }),
      
      // User nodes (outer circle)
      ...Array.from({ length: 16 }, (_, i) => {
        const angle = (i * 2 * Math.PI) / 16;
        const radius = 260;
        return {
          id: `user-${i}`,
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          type: 'user' as const,
          connections: [`business-${i % 8}`, `validator-${i % 6}`],
          activity: 0,
          label: `User ${i + 1}`
        };
      })
    ];

    setNodes(initialNodes);
  }, []);

  // Simulate network activity
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      // Generate random transaction
      const userNodes = nodes.filter(n => n.type === 'user');
      const businessNodes = nodes.filter(n => n.type === 'business');
      
      if (userNodes.length > 0 && businessNodes.length > 0) {
        const fromUser = userNodes[Math.floor(Math.random() * userNodes.length)];
        const toBusiness = businessNodes[Math.floor(Math.random() * businessNodes.length)];
        
        const transactionTypes: Transaction['type'][] = ['receipt', 'reward', 'enterprise', 'fee'];
        const txType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
        
        const newTransaction: Transaction = {
          from: fromUser.id,
          to: toBusiness.id,
          value: Math.floor(Math.random() * 1000) + 100,
          type: txType,
          timestamp: Date.now()
        };

        setTransactions(prev => [newTransaction, ...prev.slice(0, 49)]);

        // Update node activity
        setNodes(prev => prev.map(node => {
          if (node.id === fromUser.id || node.id === toBusiness.id || node.type === 'supra' || node.type === 'validator') {
            return { ...node, activity: Math.min(node.activity + 1, 10) };
          }
          return { ...node, activity: Math.max(node.activity - 0.1, 0) };
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, nodes]);

  const getNodeColor = (node: NetworkNode) => {
    const baseColors = {
      user: '#3b82f6',
      business: '#10b981',
      supra: '#8b5cf6',
      validator: '#f59e0b'
    };
    
    const intensity = Math.min(node.activity / 10, 1);
    const baseColor = baseColors[node.type];
    
    return {
      fill: baseColor,
      opacity: 0.6 + (intensity * 0.4),
      stroke: intensity > 0.5 ? '#ffffff' : baseColor,
      strokeWidth: intensity > 0.5 ? 2 : 1
    };
  };

  const getNodeSize = (node: NetworkNode) => {
    const baseSizes = {
      user: 8,
      business: 12,
      supra: 20,
      validator: 10
    };
    
    return baseSizes[node.type] + (node.activity * 2);
  };

  const getTransactionColor = (type: Transaction['type']) => {
    switch (type) {
      case 'receipt': return '#10b981';
      case 'reward': return '#8b5cf6';
      case 'enterprise': return '#3b82f6';
      case 'fee': return '#f59e0b';
    }
  };

  return (
    <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-black text-white flex items-center gap-3">
          🌐 Supra Network Visualizer
          {isActive && <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>}
        </h3>
        
        <button
          onClick={() => setIsActive(!isActive)}
          className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
            isActive
              ? 'bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30'
              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30'
          }`}
        >
          {isActive ? '⏹️ Stop Network' : '▶️ Start Network'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Network Visualization */}
        <div className="lg:col-span-2">
          <div className="bg-black/20 border border-white/10 rounded-xl p-4" style={{ height: '600px' }}>
            <svg width="100%" height="100%" viewBox="0 0 600 600">
              {/* Connection lines */}
              {nodes.map(node => 
                node.connections.map(connectionId => {
                  const connectedNode = nodes.find(n => n.id === connectionId);
                  if (!connectedNode) return null;
                  
                  return (
                    <line
                      key={`${node.id}-${connectionId}`}
                      x1={node.x}
                      y1={node.y}
                      x2={connectedNode.x}
                      y2={connectedNode.y}
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="1"
                    />
                  );
                })
              )}
              
              {/* Transaction animations */}
              {transactions.slice(0, 10).map((tx, i) => {
                const fromNode = nodes.find(n => n.id === tx.from);
                const toNode = nodes.find(n => n.id === tx.to);
                if (!fromNode || !toNode) return null;
                
                const age = Date.now() - tx.timestamp;
                const opacity = Math.max(1 - (age / 5000), 0);
                
                return (
                  <line
                    key={`tx-${i}`}
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={getTransactionColor(tx.type)}
                    strokeWidth="3"
                    opacity={opacity}
                    strokeDasharray="5,5"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      values="0;-10"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </line>
                );
              })}
              
              {/* Nodes */}
              {nodes.map(node => {
                const style = getNodeColor(node);
                const size = getNodeSize(node);
                
                return (
                  <g key={node.id}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={size}
                      fill={style.fill}
                      opacity={style.opacity}
                      stroke={style.stroke}
                      strokeWidth={style.strokeWidth}
                    />
                    {node.type === 'supra' && (
                      <text
                        x={node.x}
                        y={node.y + 5}
                        textAnchor="middle"
                        fontSize="12"
                        fill="white"
                        fontWeight="bold"
                      >
                        SUPRA
                      </text>
                    )}
                    
                    {/* Activity pulse effect */}
                    {node.activity > 5 && (
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={size}
                        fill="none"
                        stroke={style.fill}
                        strokeWidth="2"
                        opacity="0.8"
                      >
                        <animate
                          attributeName="r"
                          values={`${size};${size + 20};${size}`}
                          dur="2s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.8;0;0.8"
                          dur="2s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Network Statistics and Transaction Feed */}
        <div className="space-y-6">
          {/* Network Stats */}
          <div className="p-4 bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-xl">
            <h4 className="text-lg font-bold text-white mb-4">Network Statistics</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-white/70">Total Nodes</span>
                <span className="text-purple-400 font-semibold">{nodes.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Active Connections</span>
                <span className="text-blue-400 font-semibold">
                  {nodes.reduce((sum, node) => sum + node.connections.length, 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Transactions</span>
                <span className="text-green-400 font-semibold">{transactions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Network Activity</span>
                <span className="text-orange-400 font-semibold">
                  {isActive ? 'High' : 'Idle'}
                </span>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="p-4 bg-gradient-to-br from-gray-500/20 to-slate-500/20 border border-gray-500/30 rounded-xl">
            <h4 className="text-lg font-bold text-white mb-4">Network Legend</h4>
            <div className="space-y-2">
              {[
                { type: 'user', color: '#3b82f6', label: 'Users' },
                { type: 'business', color: '#10b981', label: 'Businesses' },
                { type: 'validator', color: '#f59e0b', label: 'Validators' },
                { type: 'supra', color: '#8b5cf6', label: 'Supra Core' }
              ].map(item => (
                <div key={item.type} className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-white/80 text-sm">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-xl">
            <h4 className="text-lg font-bold text-white mb-4">Recent Transactions</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {transactions.slice(0, 8).map((tx, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-black/20 rounded">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: getTransactionColor(tx.type) }}
                    ></div>
                    <span className="text-white/80 text-sm capitalize">{tx.type}</span>
                  </div>
                  <span className="text-green-400 text-sm font-semibold">{tx.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
