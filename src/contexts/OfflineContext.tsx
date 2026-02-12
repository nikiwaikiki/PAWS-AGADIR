import React, { createContext, useContext, useEffect, useCallback, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useOffline, OfflineReport } from '@/hooks/useOffline';
import { Dog, DbDog, mapDbDogToDog } from '@/types/dog';

interface OfflineContextType {
  isOnline: boolean;
  offlineQueue: OfflineReport[];
  pendingCount: number;
  lastSyncTime: number | null;
  cachedDogs: Dog[];
  addReportToQueue: (data: OfflineReport['data']) => OfflineReport;
  syncQueue: () => Promise<void>;
  isSyncing: boolean;
}

const OfflineContext = createContext<OfflineContextType | null>(null);

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const {
    isOnline,
    offlineQueue,
    pendingCount,
    lastSyncTime,
    cacheDogs,
    getCachedDogs,
    addToQueue,
    removeFromQueue,
    updateQueueStatus,
  } = useOffline();

  const [cachedDogs, setCachedDogs] = useState<Dog[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Load cached dogs on mount
  useEffect(() => {
    setCachedDogs(getCachedDogs());
  }, [getCachedDogs]);

  // Fetch and cache dogs when online
  const fetchAndCacheDogs = useCallback(async () => {
    if (!isOnline || !supabase) return;

    try {
      const { data, error } = await supabase
        .from('dogs_public')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const dogs = (data as DbDog[]).map(mapDbDogToDog);
      cacheDogs(dogs);
      setCachedDogs(dogs);
      console.log('[Offline] Fetched and cached dogs');
    } catch (e) {
      console.error('[Offline] Failed to fetch dogs:', e);
    }
  }, [isOnline, cacheDogs]);

  // Fetch dogs when coming back online
  useEffect(() => {
    if (isOnline) {
      fetchAndCacheDogs();
    }
  }, [isOnline, fetchAndCacheDogs]);

  // Sync offline queue when back online
  const syncQueue = useCallback(async () => {
    if (!isOnline || !supabase || pendingCount === 0) return;

    setIsSyncing(true);
    console.log('[Offline] Starting queue sync, pending:', pendingCount);

    for (const report of offlineQueue) {
      if (report.status !== 'pending' && report.status !== 'failed') continue;
      if (report.retryCount >= 3) continue; // Max retries

      updateQueueStatus(report.id, 'syncing');

      try {
        const formData = report.data;
        const isAutoApproved = formData.reportType === 'save';

        // If photo is a base64 data URL (offline capture), upload it first
        let photoUrl = formData.photo || null;
        if (photoUrl && photoUrl.startsWith('data:image/')) {
          try {
            const response = await fetch(photoUrl);
            const blob = await response.blob();
            const ext = blob.type === 'image/webp' ? 'webp' : 'jpg';
            const fileName = `${formData.reportedBy}/${Date.now()}.${ext}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
              .from('dog-photos')
              .upload(fileName, blob, {
                cacheControl: '3600',
                upsert: false,
                contentType: blob.type,
              });

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage.from('dog-photos').getPublicUrl(uploadData.path);
            photoUrl = urlData.publicUrl;
            console.log('[Offline] Uploaded offline photo:', fileName);
          } catch (photoErr) {
            console.error('[Offline] Failed to upload photo, proceeding without:', photoErr);
            photoUrl = null;
          }
        }

        const { error } = await supabase
          .from('dogs')
          .insert({
            name: formData.name,
            ear_tag: formData.earTag,
            photo_url: photoUrl,
            latitude: formData.latitude,
            longitude: formData.longitude,
            location: formData.location,
            is_vaccinated: formData.isVaccinated,
            vaccination1_date: formData.vaccination1Date || null,
            vaccination2_date: formData.vaccination2Date || null,
            additional_info: formData.additionalInfo || null,
            reported_by: formData.reportedBy,
            is_approved: isAutoApproved,
            report_type: formData.reportType,
            urgency_level: formData.urgencyLevel || null,
          });

        if (error) throw error;

        removeFromQueue(report.id);
        console.log('[Offline] Synced report:', report.id);
      } catch (e) {
        console.error('[Offline] Failed to sync report:', report.id, e);
        updateQueueStatus(report.id, 'failed');
      }
    }

    setIsSyncing(false);
    
    // Refresh cached dogs after sync
    await fetchAndCacheDogs();
  }, [isOnline, offlineQueue, pendingCount, updateQueueStatus, removeFromQueue, fetchAndCacheDogs]);

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && pendingCount > 0) {
      syncQueue();
    }
  }, [isOnline, pendingCount, syncQueue]);

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        offlineQueue,
        pendingCount,
        lastSyncTime,
        cachedDogs,
        addReportToQueue: addToQueue,
        syncQueue,
        isSyncing,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
}

export function useOfflineContext() {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOfflineContext must be used within OfflineProvider');
  }
  return context;
}
