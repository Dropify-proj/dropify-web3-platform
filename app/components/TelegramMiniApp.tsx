'use client';

import { useEffect, useState, createContext, useContext, ReactNode } from 'react';

// Telegram Web App SDK types
interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    start_param?: string;
    auth_date?: number;
  };
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
  };
  BackButton: {
    isVisible: boolean;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
    show: () => void;
    hide: () => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  showPopup: (params: {
    title?: string;
    message: string;
    buttons?: Array<{
      id?: string;
      type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
      text?: string;
    }>;
  }, callback?: (button_id: string) => void) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
  openLink: (url: string) => void;
  openTelegramLink: (url: string) => void;
  shareMessage: (url: string, text?: string) => void;
}

interface TelegramContextType {
  isReady: boolean;
  isTelegramWebApp: boolean;
  user: TelegramUser | null;
  webApp: TelegramWebApp | null;
  theme: any;
  navigateWithHaptic: (path: string) => void;
  showSuccessMessage: (message: string) => void;
  showErrorMessage: (message: string) => void;
  askConfirmation: (message: string, callback: (confirmed: boolean) => void) => void;
}

const TelegramContext = createContext<TelegramContextType>({
  isReady: false,
  isTelegramWebApp: false,
  user: null,
  webApp: null,
  theme: null,
  navigateWithHaptic: () => {},
  showSuccessMessage: () => {},
  showErrorMessage: () => {},
  askConfirmation: () => {},
});

export const useTelegram = () => useContext(TelegramContext);

interface TelegramProviderProps {
  children: ReactNode;
}

export function TelegramProvider({ children }: TelegramProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [isTelegramWebApp, setIsTelegramWebApp] = useState(false);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [theme, setTheme] = useState<any>(null);

  useEffect(() => {
    // Wait for Telegram script to load
    const checkTelegram = () => {
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
        const tg = (window as any).Telegram.WebApp as TelegramWebApp;
        
        setIsTelegramWebApp(true);
        setWebApp(tg);
        setUser(tg.initDataUnsafe.user || null);
        setTheme(tg.themeParams);
        
        // Initialize the app
        tg.ready();
        tg.expand();
        
        setIsReady(true);
      } else {
        // Still mark as ready for non-Telegram usage
        setIsReady(true);
      }
    };

    // Try immediately
    checkTelegram();

    // Also try after a short delay in case script is still loading
    const timeout = setTimeout(checkTelegram, 100);
    
    return () => clearTimeout(timeout);
  }, []);

  const navigateWithHaptic = (path: string) => {
    if (webApp) {
      webApp.HapticFeedback.selectionChanged();
      webApp.MainButton.showProgress();
      
      setTimeout(() => {
        webApp.HapticFeedback.impactOccurred('light');
        window.location.href = path;
      }, 300);
    } else {
      window.location.href = path;
    }
  };

  const showSuccessMessage = (message: string) => {
    if (webApp) {
      webApp.HapticFeedback.notificationOccurred('success');
      webApp.showAlert(message);
    } else {
      alert(message);
    }
  };

  const showErrorMessage = (message: string) => {
    if (webApp) {
      webApp.HapticFeedback.notificationOccurred('error');
      webApp.showAlert(message);
    } else {
      alert(message);
    }
  };

  const askConfirmation = (message: string, callback: (confirmed: boolean) => void) => {
    if (webApp) {
      webApp.HapticFeedback.impactOccurred('medium');
      webApp.showConfirm(message, callback);
    } else {
      const result = confirm(message);
      callback(result);
    }
  };

  const contextValue: TelegramContextType = {
    isReady,
    isTelegramWebApp,
    user,
    webApp,
    theme,
    navigateWithHaptic,
    showSuccessMessage,
    showErrorMessage,
    askConfirmation,
  };

  return (
    <TelegramContext.Provider value={contextValue}>
      {children}
    </TelegramContext.Provider>
  );
}

// Telegram Mini App Header Component
export function TelegramHeader() {
  const { isTelegramWebApp, user } = useTelegram();

  if (!isTelegramWebApp) return null;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 text-center sticky top-0 z-50">
      <div className="flex items-center justify-center gap-3">
        <span className="text-2xl">🚀</span>
        <div>
          <div className="font-bold text-lg">Dropify Mini App</div>
          {user && (
            <div className="text-sm opacity-90">
              Welcome, {user.first_name}! {user.is_premium && '👑'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Telegram-specific action button
interface TelegramButtonProps {
  onClick: () => void;
  children: ReactNode;
  className?: string;
  hapticStyle?: 'light' | 'medium' | 'heavy';
}

export function TelegramButton({ onClick, children, className = '', hapticStyle = 'light' }: TelegramButtonProps) {
  const { webApp } = useTelegram();

  const handleClick = () => {
    if (webApp) {
      webApp.HapticFeedback.impactOccurred(hapticStyle);
    }
    onClick();
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}

// Share to Telegram feature
export function ShareToTelegram({ url, text }: { url: string; text?: string }) {
  const { webApp, isTelegramWebApp } = useTelegram();

  if (!isTelegramWebApp) return null;

  const handleShare = () => {
    if (webApp) {
      webApp.HapticFeedback.impactOccurred('medium');
      const shareText = text || `🚀 Check out Dropify - Revolutionary Receipts-to-Rewards Platform! Earn DROP tokens with every purchase!`;
      webApp.shareMessage(url, shareText);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
    >
      <span>📤</span>
      Share with Friends
    </button>
  );
}

export default TelegramProvider;
