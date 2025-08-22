'use client';

// Temporarily disable Privy to isolate the issue
interface PrivyWrapperProps {
  children: React.ReactNode;
}

export default function PrivyWrapper({ children }: PrivyWrapperProps) {
  // Temporary fallback - just render children without Privy
  return (
    <div>
      {children}
    </div>
  );
}
