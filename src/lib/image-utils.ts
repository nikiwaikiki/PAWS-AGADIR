export async function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error('Failed to read file'));

    reader.onload = (e) => {
      const img = new Image();

      img.onerror = () => reject(new Error('Failed to load image'));

      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };

      img.src = e.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

export async function uploadDogPhoto(file: File, dogId: string): Promise<string | null> {
  try {
    const { supabase } = await import('./supabase-client');
    if (!supabase) {
      console.error('Supabase client not initialized');
      return null;
    }
    
    const compressed = await compressImage(file);
    const fileExt = 'jpg';
    const fileName = `${dogId}-${Date.now()}.${fileExt}`;
    const filePath = `dogs/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('dog-photos')
      .upload(filePath, compressed, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('dog-photos').getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading photo:', error);
    return null;
  }
}
