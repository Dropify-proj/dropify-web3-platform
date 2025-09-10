import { EnhancedWalletProvider } from '@/lib/enhanced-wallet-context';
import HomeContent from './HomeContent';

export default function Page() {
  return (
    <EnhancedWalletProvider>
      <HomeContent />
    </EnhancedWalletProvider>
  );
}
