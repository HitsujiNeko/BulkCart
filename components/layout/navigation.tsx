'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CalendarDays, ShoppingCart, ClipboardList, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface NavigationItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navigationItems: NavigationItem[] = [
  { href: '/plan/current', label: '献立', icon: CalendarDays },
  { href: '/plan/current/grocery', label: '買い物', icon: ShoppingCart },
  { href: '/plan/current/prep', label: '段取り', icon: ClipboardList },
  { href: '/settings', label: '設定', icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/plan/current') {
      // 献立ページは完全一致
      return pathname === href;
    }
    // その他は prefix match
    return pathname?.startsWith(href);
  };

  return (
    <>
      {/* モバイル: Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t bg-background">
        <div className="flex items-center justify-around h-16">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors',
                  active
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon size={24} strokeWidth={active ? 2.5 : 2} />
                <span className={cn('text-xs', active ? 'font-semibold' : 'font-normal')}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* デスクトップ: Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-16 bottom-0 w-64 border-r bg-background">
        <nav className="flex flex-col gap-2 p-4 w-full">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground font-semibold'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                )}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                <span className="text-base">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
