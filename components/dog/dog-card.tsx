'use client';

import Image from 'next/image';
import { MapPin, Calendar, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { DogWithReporter } from '@/lib/types';
import { Card, CardContent } from '@/src/components/ui/card';
import { Badge } from '@/src/components/ui/badge';
import { cn } from '@/lib/utils';

interface DogCardProps {
  dog: DogWithReporter;
  onClick?: () => void;
}

export function DogCard({ dog, onClick }: DogCardProps) {
  const getUrgencyColor = (level?: string | null) => {
    switch (level) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-green-500 text-white';
    }
  };

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case 'sos':
        return 'bg-red-600 text-white';
      case 'save':
        return 'bg-blue-600 text-white';
      case 'vaccination_wish':
        return 'bg-purple-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  return (
    <Card
      className={cn(
        'overflow-hidden transition-all hover:shadow-lg',
        onClick && 'cursor-pointer'
      )}
      onClick={onClick}
    >
      <div className="relative aspect-video w-full">
        {dog.photo_url ? (
          <Image
            src={dog.photo_url}
            alt={dog.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted">
            <span className="text-4xl">🐕</span>
          </div>
        )}

        <div className="absolute right-2 top-2 flex gap-2">
          {dog.report_type && (
            <Badge className={getReportTypeColor(dog.report_type)}>
              {dog.report_type.toUpperCase()}
            </Badge>
          )}
          {dog.urgency_level && (
            <Badge className={getUrgencyColor(dog.urgency_level)}>
              {dog.urgency_level}
            </Badge>
          )}
        </div>

        {!dog.is_approved && (
          <div className="absolute left-2 top-2">
            <Badge variant="secondary">
              <Clock className="mr-1 h-3 w-3" />
              Pending
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg">{dog.name}</h3>
              {dog.ear_tag && (
                <p className="text-sm text-muted-foreground">
                  Tag: {dog.ear_tag}
                </p>
              )}
            </div>
            {dog.is_vaccinated && (
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            )}
          </div>

          {dog.location && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="truncate">{dog.location}</span>
            </div>
          )}

          {dog.vaccination1_date && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Vaccinated: {format(new Date(dog.vaccination1_date), 'MMM dd, yyyy')}
              </span>
            </div>
          )}

          {dog.sponsor_name && (
            <p className="text-sm">
              <span className="font-medium">Sponsor:</span> {dog.sponsor_name}
            </p>
          )}

          {dog.additional_info && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {dog.additional_info}
            </p>
          )}

          {dog.reporter && (
            <p className="text-xs text-muted-foreground">
              Reported by: {dog.reporter.display_name || 'Anonymous'}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
