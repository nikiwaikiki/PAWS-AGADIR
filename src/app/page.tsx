'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/lib/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  PawPrint,
  AlertTriangle,
  Dog,
  Heart,
  ArrowRight,
  HandHeart,
  MapPin,
  Shield,
} from 'lucide-react';

const FEATURES = [
  {
    key: 'taggedDogs',
    icon: PawPrint,
    href: '/dogs',
    color: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
  },
  {
    key: 'sos',
    icon: AlertTriangle,
    href: '/report',
    color: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
  },
  {
    key: 'reportStray',
    icon: Dog,
    href: '/report',
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
  },
  {
    key: 'adopt',
    icon: Heart,
    href: '/adoption',
    color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400',
  },
];

export default function HomePage() {
  const { t } = useTranslation();
  const { user, isHelper } = useAuth();

  return (
    <div className="flex flex-col">
      <section className="relative flex min-h-[70vh] items-end overflow-hidden">
        <Image
          src="/hero-dog.jpg"
          alt="Dog rescue in Agadir"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="container relative z-10 px-4 pb-12 pt-24 md:pb-16">
          <div className="max-w-3xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-white/80">
              Agadir - Taghazout, Morocco
            </p>
            <h1 className="mb-4 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              Save The Paws <span className="text-primary">Agadir</span>
            </h1>
            <p className="mb-6 text-lg text-white/90 md:text-xl">
              Community platform for rescuing and protecting stray dogs. Report dogs in need,
              track vaccinations, and connect with local helpers.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/dogs">
                <Button size="lg" className="gap-2">
                  <PawPrint className="h-5 w-5" />
                  View Dogs
                </Button>
              </Link>
              <Link href={user ? '/report' : '/auth'}>
                <Button size="lg" variant="secondary" className="gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Report Dog
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container px-4 py-12 md:py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">Our Mission</h2>
          <p className="text-lg text-muted-foreground">
            We protect stray dogs in the Agadir-Taghazout region through community-driven
            rescue efforts. Track vaccinated dogs, report emergencies, and connect with
            volunteers committed to animal welfare.
          </p>
        </div>
      </section>

      <section className="container px-4 py-12 md:py-16">
        <h2 className="mb-8 text-center text-3xl font-bold">How It Works</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link key={feature.key} href={feature.href}>
                <Card className="h-full transition-all hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className={`mb-4 inline-flex rounded-lg p-3 ${feature.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">
                      {t(`landing.features.${feature.key}.title`)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t(`landing.features.${feature.key}.description`)}
                    </p>
                    <div className="mt-4 flex items-center text-sm font-medium text-primary">
                      Learn more <ArrowRight className="ml-1 h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y bg-muted/50 py-12 md:py-16">
        <div className="container px-4 text-center">
          <div className="mx-auto mb-6 inline-flex rounded-full bg-primary/10 p-4">
            <HandHeart className="h-10 w-10 text-primary" />
          </div>
          <h2 className="mb-4 text-3xl font-bold">Support Our Work</h2>
          <p className="mx-auto mb-6 max-w-2xl text-lg text-muted-foreground">
            Your donations help us provide medical care, food, and shelter for rescued dogs.
            Every contribution makes a difference in saving lives.
          </p>
          <Button size="lg" className="gap-2">
            <Heart className="h-5 w-5" />
            Donate Now
          </Button>
        </div>
      </section>

      {!isHelper && (
        <section className="container px-4 py-12 md:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-3xl font-bold">Become a Helper</h2>
            <p className="mb-6 text-lg text-muted-foreground">
              Join our team of volunteers and help protect stray dogs in your community.
              Assist with rescues, vaccinations, and finding homes for dogs in need.
            </p>
            <Link href={user ? '/become-helper' : '/auth'}>
              <Button size="lg" variant="outline" className="gap-2">
                Apply Now <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
