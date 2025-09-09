/// <reference types="react" />
/// <reference types="react-dom" />
/// <reference types="node" />

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // Allow any data attributes
    [key: `data-${string}`]: any;
  }
}

declare module 'react-dom/client' {
  export * from 'react-dom';
}

// Global type extensions
declare global {
  interface Window {
    ethereum?: any;
  }
}

export {};
