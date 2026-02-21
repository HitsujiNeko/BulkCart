'use client';

import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Navigation } from '@/components/layout/navigation';
import { supabase } from '@/lib/supabase/client';

export interface AppLayoutClientProps {
  isPro: boolean;
  userEmail?: string;
  children: React.ReactNode;
}

export function AppLayoutClient({ isPro, userEmail, children }: AppLayoutClientProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header isPro={isPro} userEmail={userEmail} onLogout={handleLogout} />

      {/* Main Content + Navigation */}
      <div className="flex">
        {/* Sidebar (デスクトップのみ) */}
        <Navigation />

        {/* Main Content */}
        <main className="flex-1 md:ml-64 pb-16 md:pb-0">
          <div className="container py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
