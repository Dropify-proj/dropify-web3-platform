// Safe localStorage utilities for SSR compatibility

export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') {
      return null;
    }
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('localStorage.getItem failed:', error);
      return null;
    }
  },

  setItem: (key: string, value: string): boolean => {
    if (typeof window === 'undefined') {
      return false;
    }
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('localStorage.setItem failed:', error);
      return false;
    }
  },

  removeItem: (key: string): boolean => {
    if (typeof window === 'undefined') {
      return false;
    }
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('localStorage.removeItem failed:', error);
      return false;
    }
  },

  clear: (): boolean => {
    if (typeof window === 'undefined') {
      return false;
    }
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.warn('localStorage.clear failed:', error);
      return false;
    }
  }
};

export default safeLocalStorage;
