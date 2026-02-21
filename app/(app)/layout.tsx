import { createClient } from '@/lib/supabase/server';
import { AppLayoutClient } from '@/components/layout/app-layout-client';
import { redirect } from 'next/navigation';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // TODO: Phase 10.2で課金状態を user_profiles から取得
  const isPro = false;

  return (
    <AppLayoutClient isPro={isPro} userEmail={user.email}>
      {children}
    </AppLayoutClient>
  );
}
