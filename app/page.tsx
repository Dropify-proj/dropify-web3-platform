import HomeContent from './HomeContent';

// Debug logging for development
if (process.env.NODE_ENV === 'development') {
  console.log('🔍 Page Debug - HomeContent type:', typeof HomeContent);
  console.log('🔍 Page Debug - HomeContent:', HomeContent);
}

export default function Page() {
  return <HomeContent />;
}
