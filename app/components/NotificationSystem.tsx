/**
 * Enhanced Notification System for Referrals
 * Real-time notifications and celebration effects
 */

'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';

// Notification types
export type NotificationType = 'referral_earned' | 'referral_joined' | 'challenge_completed' | 'badge_earned' | 'milestone_reached';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  isRead: boolean;
  data?: any;
}

// Notification context
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Notification Provider Component
export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      isRead: false,
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Auto-remove after 30 seconds for non-important notifications
    if (notification.type !== 'milestone_reached' && notification.type !== 'badge_earned') {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, 30000);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

// Hook to use notifications
export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// Floating Notification Component
export function FloatingNotification({ notification, onClose }: {
  notification: Notification;
  onClose: () => void;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'referral_earned': return '💰';
      case 'referral_joined': return '👋';
      case 'challenge_completed': return '🎯';
      case 'badge_earned': return '🏆';
      case 'milestone_reached': return '🎉';
      default: return '📢';
    }
  };

  const getColors = (type: NotificationType) => {
    switch (type) {
      case 'referral_earned': return 'from-green-400 to-emerald-500';
      case 'referral_joined': return 'from-blue-400 to-cyan-500';
      case 'challenge_completed': return 'from-purple-400 to-pink-500';
      case 'badge_earned': return 'from-yellow-400 to-orange-500';
      case 'milestone_reached': return 'from-red-400 to-pink-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 transform transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={`bg-gradient-to-r ${getColors(notification.type)} rounded-lg shadow-lg p-4 max-w-sm text-white`}>
        <div className="flex items-start space-x-3">
          <span className="text-2xl">{getIcon(notification.type)}</span>
          <div className="flex-1">
            <h3 className="font-bold text-sm">{notification.title}</h3>
            <p className="text-sm opacity-90">{notification.message}</p>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-white/70 hover:text-white"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

// Notification Bell Icon Component
export function NotificationBell() {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <span className="text-2xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Mark all read
                </button>
              )}
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications yet
              </div>
            ) : (
              notifications.slice(0, 10).map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                    !notification.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-lg">{getIcon(notification.type)}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 text-sm">
                        {notification.title}
                      </h4>
                      <p className="text-gray-600 text-sm">{notification.message}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {notifications.length > 10 && (
            <div className="p-3 text-center border-t border-gray-200">
              <button className="text-sm text-blue-600 hover:text-blue-800">
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Celebration Animation Component
export function CelebrationAnimation({ 
  isVisible, 
  onComplete, 
  type = 'referral_earned' 
}: {
  isVisible: boolean;
  onComplete: () => void;
  type?: NotificationType;
}) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onComplete, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  const getAnimation = () => {
    switch (type) {
      case 'referral_earned':
        return (
          <div className="text-6xl animate-bounce">
            💰🎉💎
          </div>
        );
      case 'badge_earned':
        return (
          <div className="text-6xl animate-spin">
            🏆✨🌟
          </div>
        );
      case 'milestone_reached':
        return (
          <div className="text-6xl animate-pulse">
            🚀🎊🏅
          </div>
        );
      default:
        return (
          <div className="text-6xl animate-bounce">
            🎉✨🎊
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 text-center shadow-2xl">
        {getAnimation()}
        <h2 className="text-2xl font-bold text-gray-800 mt-4">
          {type === 'referral_earned' && 'Referral Reward Earned!'}
          {type === 'badge_earned' && 'New Badge Unlocked!'}
          {type === 'milestone_reached' && 'Milestone Reached!'}
        </h2>
        <p className="text-gray-600 mt-2">
          {type === 'referral_earned' && 'You\'ve earned 5 DRF tokens!'}
          {type === 'badge_earned' && 'Keep up the great work!'}
          {type === 'milestone_reached' && 'You\'re on fire!'}
        </p>
      </div>
    </div>
  );
}

// Notification Manager Hook
export function useReferralNotifications() {
  const { addNotification } = useNotifications();
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationType, setCelebrationType] = useState<NotificationType>('referral_earned');

  const notifyReferralEarned = (drfAmount: number, referredUser: string) => {
    addNotification({
      type: 'referral_earned',
      title: 'Referral Reward Earned! 💰',
      message: `You earned ${drfAmount} DRF tokens! ${referredUser.slice(0, 8)}... scanned their first receipt.`,
      data: { drfAmount, referredUser }
    });
    
    setCelebrationType('referral_earned');
    setShowCelebration(true);
  };

  const notifyReferralJoined = (newUser: string) => {
    addNotification({
      type: 'referral_joined',
      title: 'New Referral Joined! 👋',
      message: `${newUser.slice(0, 8)}... joined using your referral link. They need to scan a receipt to earn you 5 DRF!`,
      data: { newUser }
    });
  };

  const notifyBadgeEarned = (badge: string) => {
    addNotification({
      type: 'badge_earned',
      title: 'New Badge Earned! 🏆',
      message: `Congratulations! You've unlocked the "${badge}" badge.`,
      data: { badge }
    });
    
    setCelebrationType('badge_earned');
    setShowCelebration(true);
  };

  const notifyMilestone = (milestone: string, details: string) => {
    addNotification({
      type: 'milestone_reached',
      title: `Milestone Reached! 🎉`,
      message: `${milestone}: ${details}`,
      data: { milestone, details }
    });
    
    setCelebrationType('milestone_reached');
    setShowCelebration(true);
  };

  return {
    notifyReferralEarned,
    notifyReferralJoined,
    notifyBadgeEarned,
    notifyMilestone,
    showCelebration,
    celebrationType,
    hideCelebration: () => setShowCelebration(false)
  };
}

// Helper function to get notification icon
function getIcon(type: NotificationType): string {
  switch (type) {
    case 'referral_earned': return '💰';
    case 'referral_joined': return '👋';
    case 'challenge_completed': return '🎯';
    case 'badge_earned': return '🏆';
    case 'milestone_reached': return '🎉';
    default: return '📢';
  }
}
