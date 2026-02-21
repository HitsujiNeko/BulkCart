'use client';

import Link from 'next/link';
import { User, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface HeaderProps {
  isPro?: boolean;
  userEmail?: string;
  onLogout?: () => void;
}

export function Header({ isPro = false, userEmail, onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        {/* ロゴ */}
        <Link href="/plan/current" className="flex items-center gap-2 font-bold text-xl">
          <span className="text-2xl">🍱</span>
          <span className="text-foreground">BulkCart</span>
        </Link>

        {/* スペーサー */}
        <div className="flex-1" />

        {/* Pro Badge */}
        {isPro && (
          <Badge variant="default" className="mr-3 bg-primary text-primary-foreground">
            Pro
          </Badge>
        )}

        {/* ユーザーメニュー */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-secondary"
              aria-label="ユーザーメニュー"
            >
              <User size={20} className="text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {userEmail && (
              <>
                <div className="px-2 py-1.5 text-sm text-muted-foreground">
                  {userEmail}
                </div>
                <DropdownMenuSeparator />
              </>
            )}
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                <Settings size={16} />
                <span>設定</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onLogout}
              className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut size={16} />
              <span>ログアウト</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
