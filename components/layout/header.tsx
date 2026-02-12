'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/src/components/ui/button';
import { useAuth } from '@/lib/auth-provider';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { user, signOut, isHelper, isAdmin } = useAuth();
  const pathname = usePathname();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
  ];

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/dogs', label: t('nav.dogs') },
    { href: '/adoption', label: t('nav.adoption') },
    { href: '/info', label: t('nav.info') },
  ];

  if (user) {
    navLinks.push({ href: '/report', label: t('nav.report') });
    navLinks.push({ href: '/map', label: t('nav.map') });
  }

  if (isHelper || isAdmin) {
    navLinks.push({ href: '/dashboard', label: t('nav.dashboard') });
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">
            PAWS Agadir
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === link.href
                  ? 'text-foreground'
                  : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => i18n.changeLanguage(lang.code)}
                  className={cn(
                    i18n.language === lang.code && 'bg-accent'
                  )}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {user ? (
            <div className="hidden items-center gap-2 md:flex">
              <span className="text-sm text-muted-foreground">
                {user.display_name || user.email}
              </span>
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                {t('auth.signOut')}
              </Button>
            </div>
          ) : (
            <Link href="/auth" className="hidden md:block">
              <Button size="sm">{t('auth.signIn')}</Button>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t md:hidden">
          <nav className="container flex flex-col gap-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors',
                  pathname === link.href
                    ? 'text-foreground'
                    : 'text-muted-foreground'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="flex items-center gap-2 border-t pt-4">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      i18n.changeLanguage(lang.code);
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      'text-sm',
                      i18n.language === lang.code
                        ? 'font-bold text-primary'
                        : 'text-muted-foreground'
                    )}
                  >
                    {lang.code.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {user && (
              <Button
                variant="outline"
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                className="mt-2"
              >
                {t('auth.signOut')}
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
