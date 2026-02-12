import { useState, useRef, useEffect } from "react";
import { Camera, Upload, X, Loader2, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { compressImage } from "@/lib/compressImage";
import { useOfflineContext } from "@/contexts/OfflineContext";
import { useTranslation } from "react-i18next";

interface PhotoUploadProps {
  onPhotoUploaded: (url: string) => void;
  currentPhotoUrl?: string;
}

/** Convert a compressed File to a base64 data URL for offline storage. */
async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("FileReader failed"));
    reader.readAsDataURL(file);
  });
}

const PhotoUpload = ({ onPhotoUploaded, currentPhotoUrl }: PhotoUploadProps) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isOnline } = useOfflineContext();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null);
  const [error, setError] = useState<string | null>(null);
  const [sizeInfo, setSizeInfo] = useState<string | null>(null);
  const [offlineSaved, setOfflineSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreviewUrl(currentPhotoUrl || null);
  }, [currentPhotoUrl]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(t('photoUpload.invalidType'));
      return;
    }

    setError(null);
    setSizeInfo(null);
    setOfflineSaved(false);
    setIsUploading(true);

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      // Always compress first (works offline -- pure canvas operation)
      const compressed = await compressImage(file, {
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.82,
        mimeType: "image/jpeg",
      });

      const origMB = (file.size / 1024 / 1024).toFixed(1);
      const compMB = (compressed.size / 1024 / 1024).toFixed(1);
      if (compressed.size < file.size) {
        setSizeInfo(`${t('photoUpload.optimized')}: ${origMB}MB → ${compMB}MB`);
      }

      if (isOnline && user?.id) {
        // ONLINE: Upload to Supabase Storage
        const fileExt = compressed.name.split(".").pop() || "jpg";
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { data, error: uploadError } = await supabase.storage
          .from("dog-photos")
          .upload(fileName, compressed, {
            cacheControl: "3600",
            upsert: false,
            contentType: compressed.type,
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from("dog-photos").getPublicUrl(data.path);
        onPhotoUploaded(urlData.publicUrl);
      } else {
        // OFFLINE: Convert to base64 data URL for offline queue storage
        const dataUrl = await fileToDataUrl(compressed);
        onPhotoUploaded(dataUrl);
        setOfflineSaved(true);
      }
    } catch (err) {
      console.error("Upload error:", err);
      // Fallback: if online upload fails, try offline mode
      try {
        const compressed = await compressImage(file, {
          maxWidth: 1600,
          maxHeight: 1600,
          quality: 0.82,
          mimeType: "image/jpeg",
        });
        const dataUrl = await fileToDataUrl(compressed);
        onPhotoUploaded(dataUrl);
        setOfflineSaved(true);
      } catch {
        setError(t('photoUpload.uploadError'));
        setPreviewUrl(null);
        setSizeInfo(null);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setPreviewUrl(null);
    setSizeInfo(null);
    setOfflineSaved(false);
    onPhotoUploaded("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative">
          <img
            src={previewUrl}
            alt={t('photoUpload.preview')}
            className="w-full h-48 object-cover rounded-lg border border-border"
          />
          {isUploading && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center rounded-lg">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}
          {!isUploading && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={handleRemovePhoto}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      ) : (
        <div
          onClick={triggerFileInput}
          className="w-full h-48 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-secondary/30 transition-colors"
        >
          <div className="flex gap-2">
            <Camera className="w-8 h-8 text-muted-foreground" />
            <Upload className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">{t('photoUpload.takeOrUpload')}</p>
            <p className="text-xs text-muted-foreground">{t('photoUpload.tapHere')}</p>
          </div>
        </div>
      )}

      {sizeInfo && <p className="text-xs text-muted-foreground">{sizeInfo}</p>}

      {offlineSaved && (
        <div className="flex items-center gap-2 text-xs text-warning">
          <WifiOff className="w-3 h-3" />
          <span>{t('photoUpload.savedOffline')}</span>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!previewUrl && (
        <div className="flex gap-2">
          <Button type="button" variant="outline" className="flex-1 gap-2" onClick={triggerFileInput}>
            <Camera className="w-4 h-4" />
            {t('photoUpload.camera')}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1 gap-2"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.removeAttribute("capture");
                fileInputRef.current.click();
                setTimeout(() => {
                  fileInputRef.current?.setAttribute("capture", "environment");
                }, 100);
              }
            }}
          >
            <Upload className="w-4 h-4" />
            {t('photoUpload.gallery')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;
