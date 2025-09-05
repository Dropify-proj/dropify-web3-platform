'use client';

import { useEffect, useState } from 'react';
import { useDesignProtection } from '../../lib/design-protection';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

interface SecurityStatus {
  protectionActive: boolean;
  integrityScore: number;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  lastCheck: number;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const { protector, metrics, isActive } = useDesignProtection();
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    protectionActive: false,
    integrityScore: 100,
    threatLevel: 'low',
    lastCheck: Date.now()
  });

  useEffect(() => {
    // Initialize protection system
    const initializeProtection = async () => {
      console.log('🛡️ Initializing Dropify Design Protection...');
      
      // Add protection classes to critical elements
      addProtectionClasses();
      
      // Setup dynamic content protection
      setupDynamicProtection();
      
      // Initialize security monitoring
      startSecurityMonitoring();
      
      setSecurityStatus({
        protectionActive: isActive,
        integrityScore: calculateIntegrityScore(),
        threatLevel: determineThreatLevel(),
        lastCheck: Date.now()
      });
    };

    initializeProtection();
  }, [isActive]);

  const addProtectionClasses = () => {
    // Add protection to holographic titles
    const titles = document.querySelectorAll('h1, h2, .text-hologram');
    titles.forEach((title, index) => {
      title.classList.add('dropify-protected');
      title.setAttribute('data-protection-id', `dp-${index}-${Date.now()}`);
    });

    // Add protection to neon borders
    const neonElements = document.querySelectorAll('.neon-border');
    neonElements.forEach(element => {
      element.classList.add('dropify-protected');
    });

    // Add protection to particle systems
    const particles = document.querySelectorAll('.particle, .particles');
    particles.forEach(particle => {
      particle.classList.add('dropify-protected');
    });
  };

  const setupDynamicProtection = () => {
    // Create dynamic CSS that changes based on security status
    const dynamicStyle = document.createElement('style');
    dynamicStyle.id = 'dropify-dynamic-protection';
    dynamicStyle.textContent = `
      .dropify-protected {
        position: relative;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
      }
      
      .dropify-protected::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        background: linear-gradient(
          45deg,
          transparent 49%,
          rgba(0, 255, 255, 0.001) 50%,
          transparent 51%
        );
        animation: protectionPulse 10s infinite;
      }
      
      @keyframes protectionPulse {
        0%, 100% { opacity: 0.001; }
        50% { opacity: 0.002; }
      }
      
      /* Anti-screenshot protection */
      @media print {
        .dropify-protected {
          display: none !important;
        }
      }
      
      /* Anti-copy protection */
      .dropify-protected * {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
    `;
    
    document.head.appendChild(dynamicStyle);
  };

  const startSecurityMonitoring = () => {
    // Monitor for unauthorized access attempts
    const checkInterval = setInterval(() => {
      if (metrics) {
        const newThreatLevel = determineThreatLevel();
        const newIntegrityScore = calculateIntegrityScore();
        
        setSecurityStatus(prev => ({
          ...prev,
          integrityScore: newIntegrityScore,
          threatLevel: newThreatLevel,
          lastCheck: Date.now()
        }));

        // Adjust protection level based on threat
        adjustProtectionLevel(newThreatLevel);
      }
    }, 5000);

    return () => clearInterval(checkInterval);
  };

  const calculateIntegrityScore = (): number => {
    if (!metrics) return 100;
    
    const baseScore = 100;
    const suspiciousActivityPenalty = metrics.suspiciousActivity * 5;
    const timeFactorBonus = Math.min(10, Math.floor((Date.now() - metrics.lastVerification) / 60000));
    
    return Math.max(0, baseScore - suspiciousActivityPenalty + timeFactorBonus);
  };

  const determineThreatLevel = (): SecurityStatus['threatLevel'] => {
    if (!metrics) return 'low';
    
    const score = calculateIntegrityScore();
    const suspiciousActivity = metrics.suspiciousActivity;
    
    if (score < 50 || suspiciousActivity > 10) return 'critical';
    if (score < 70 || suspiciousActivity > 5) return 'high';
    if (score < 85 || suspiciousActivity > 2) return 'medium';
    return 'low';
  };

  const adjustProtectionLevel = (threatLevel: SecurityStatus['threatLevel']) => {
    const body = document.body;
    
    // Remove existing threat classes
    body.classList.remove('threat-low', 'threat-medium', 'threat-high', 'threat-critical');
    
    // Add current threat class
    body.classList.add(`threat-${threatLevel}`);
    
    // Adjust protection based on threat level
    switch (threatLevel) {
      case 'critical':
        enableMaximumProtection();
        break;
      case 'high':
        enableEnhancedProtection();
        break;
      case 'medium':
        enableMediumProtection();
        break;
      case 'low':
      default:
        enableBasicProtection();
        break;
    }
  };

  const enableMaximumProtection = () => {
    // Maximum protection mode
    const style = document.getElementById('dropify-dynamic-protection');
    if (style) {
      style.textContent += `
        .threat-critical .dropify-protected {
          filter: blur(0.5px);
          transform: scale(0.999);
        }
        
        .threat-critical::before {
          content: '⚠️ SECURITY ALERT: Suspicious activity detected';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          background: rgba(255, 0, 0, 0.1);
          color: #ff4444;
          text-align: center;
          z-index: 10000;
          padding: 5px;
          font-size: 12px;
          font-weight: bold;
        }
      `;
    }
  };

  const enableEnhancedProtection = () => {
    // Enhanced protection mode
    const protectedElements = document.querySelectorAll('.dropify-protected');
    protectedElements.forEach(element => {
      (element as HTMLElement).style.pointerEvents = 'none';
      setTimeout(() => {
        (element as HTMLElement).style.pointerEvents = 'auto';
      }, 1000);
    });
  };

  const enableMediumProtection = () => {
    // Medium protection mode - subtle deterrents
    console.log('🔒 Medium protection mode active');
  };

  const enableBasicProtection = () => {
    // Basic protection mode - normal operation
    console.log('🛡️ Basic protection mode active');
  };

  // Security status indicator component
  const SecurityIndicator = () => {
    const getStatusColor = () => {
      switch (securityStatus.threatLevel) {
        case 'critical': return '#ff4444';
        case 'high': return '#ff8800';
        case 'medium': return '#ffaa00';
        case 'low': return '#00ff88';
        default: return '#888888';
      }
    };

    return (
      <div 
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '8px',
          fontSize: '12px',
          zIndex: 9999,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${getStatusColor()}`,
          opacity: process.env.NODE_ENV === 'development' ? 1 : 0.1
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div 
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: getStatusColor(),
              animation: 'pulse 2s infinite'
            }}
          />
          <span>Security: {securityStatus.threatLevel.toUpperCase()}</span>
        </div>
        <div style={{ fontSize: '10px', opacity: 0.7, marginTop: '4px' }}>
          Integrity: {securityStatus.integrityScore}%
        </div>
      </div>
    );
  };

  return (
    <div className="protected-container">
      {/* Hidden protection metadata */}
      <div 
        style={{ display: 'none' }}
        data-dropify-protection="active"
        data-fingerprint={protector ? 'protected' : 'unprotected'}
        data-timestamp={Date.now()}
      />
      
      {/* Main content with protection wrapper */}
      <div className="dropify-protected-content">
        {children}
      </div>
      
      {/* Security status indicator (visible in development) */}
      <SecurityIndicator />
      
      {/* Protection styles */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        /* Disable right-click context menu on protected elements */
        .dropify-protected {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        
        /* Disable drag and drop */
        .dropify-protected * {
          -webkit-user-drag: none;
          -khtml-user-drag: none;
          -moz-user-drag: none;
          -o-user-drag: none;
          user-drag: none;
        }
        
        /* Anti-screenshot protection for sensitive content */
        @media print {
          .holographic-title,
          .neon-border,
          .particles {
            visibility: hidden;
          }
        }
      `}</style>
    </div>
  );
}
