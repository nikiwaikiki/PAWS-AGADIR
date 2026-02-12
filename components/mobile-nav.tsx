'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Dog, MapPin, PlusCircle, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-provider';

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/dogs', icon: Dog, label: 'Dogs' },
    { href: '/map', icon: MapPin, label: 'Map', protected: true },
    { href: '/report', icon: PlusCircle, label: 'Report', protected: true },
    {
      href: user ? '/dashboard' : '/auth',
      icon: User,
      label: user ? 'Profile' : 'Login',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          if (item.protected && !user) return null;

          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
