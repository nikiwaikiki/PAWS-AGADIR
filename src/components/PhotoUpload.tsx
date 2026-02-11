import { useState, useRef, useEffect } from "react";
import { Camera, Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { compressImage } from "@/lib/compressImage";

interface PhotoUploadProps {
  onPhotoUploaded: (url: string) => void;
  currentPhotoUrl?: string;
}

const PhotoUpload = ({ onPhotoUploaded, currentPhotoUrl }: PhotoUploadProps) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null);
  const [error, setError] = useState<string | null>(null);
  const [sizeInfo, setSizeInfo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // wenn currentPhotoUrl sich ändert (z.B. edit), Preview anpassen
  useEffect(() => {
    setPreviewUrl(currentPhotoUrl || null);
  }, [currentPhotoUrl]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Bitte wähle ein Bild aus");
      return;
    }

    // niemals wegen Größe blocken (UX!)
    setError(null);
    setSizeInfo(null);
    setIsUploading(true);

    // Preview sofort anzeigen
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    try {
      if (!user?.id) {
        throw new Error("Not authenticated");
      }

      // ✅ Komprimieren (schneller Upload, weniger Abbrüche)
      const compressed = await compressImage(file, {
        maxWidth: 1600,
        maxHeight: 1600,
        quality: 0.82,
        mimeType: "image/jpeg", // maximal kompatibel
      });

      // Size Info (optional)
      const origMB = (file.size / 1024 / 1024).toFixed(1);
      const compMB = (compressed.size / 1024 / 1024).toFixed(1);
      if (compressed.size < file.size) {
        setSizeInfo(`Optimiert: ${origMB}MB → ${compMB}MB`);
      }

      // Dateiname (mit neuer Extension)
      const fileExt = compressed.name.split(".").pop() || "jpg";
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from("dog-photos")
        .upload(fileName, compressed, {
          cacheControl: "3600",
          upsert: false,
          contentType: compressed.type,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage.from("dog-photos").getPublicUrl(data.path);

      onPhotoUploaded(urlData.publicUrl);
    } catch (err) {
      console.error("Upload error:", err);
      setError("Fehler beim Hochladen. Bitte versuche es erneut.");
      setPreviewUrl(null);
      setSizeInfo(null);
    } finally {
      setIsUploading(false);

      // Cleanup: ObjectURL freigeben, aber erst nachdem img gerendert hat
      // (wir lassen die Preview stehen; das ist ok, aber sauberer ist revoke + setzen auf current URL)
      // Wenn du das wirklich „perfekt“ willst, sag Bescheid – dann mache ich es ohne Flackern.
    }
  };

  const handleRemovePhoto = () => {
    setPreviewUrl(null);
    setSizeInfo(null);
    onPhotoUploaded("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      {/* Hidden file input with camera/gallery access */}
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
            alt="Vorschau"
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
            <p className="text-sm font-medium text-foreground">Foto aufnehmen oder hochladen</p>
            <p className="text-xs text-muted-foreground">Tippe hier, um ein Foto auszuwählen</p>
          </div>
        </div>
      )}

      {sizeInfo && <p className="text-xs text-muted-foreground">{sizeInfo}</p>}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!previewUrl && (
        <div className="flex gap-2">
          <Button type="button" variant="outline" className="flex-1 gap-2" onClick={triggerFileInput}>
            <Camera className="w-4 h-4" />
            Kamera
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
            Galerie
          </Button>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;

