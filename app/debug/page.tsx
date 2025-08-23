'use client';

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold text-cyan-400 mb-8">Debug Page</h1>
      <p className="text-lg">If you can see this page, the Next.js app is working.</p>
      <p className="text-sm text-gray-400 mt-4">
        This is a simple page without any complex imports to test if the server is running.
      </p>
    </div>
  );
}
