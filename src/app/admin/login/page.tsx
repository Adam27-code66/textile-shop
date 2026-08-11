'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPageRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#08090C] flex items-center justify-center text-white text-xs">
      <div className="flex flex-col items-center gap-2">
        <div className="w-6 h-6 border-2 border-[#8B3DFF] border-t-transparent rounded-full animate-spin" />
        <p className="text-[#A6A6B0]">Redirecting to unified Sign In page...</p>
      </div>
    </div>
  );
}
