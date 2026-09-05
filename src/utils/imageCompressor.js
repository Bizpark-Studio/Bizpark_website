/**
 * Client-Side Image Auto-Compressor Utility
 * 
 * Automatically compresses high-resolution photos using HTML5 Canvas.
 * Reduces file sizes from 5MB-10MB down to ~100-250KB before upload or base64 storage.
 * Ensures compatibility with:
 * - Vercel Serverless payload limits (4.5MB)
 * - Browser LocalStorage quota (5MB)
 * - MongoDB Atlas BSON document limits (16MB)
 * - Ultra-fast web loading speeds
 */

export async function compressImage(file, maxWidth = 1280, quality = 0.78) {
  if (!file || !file.type || !file.type.startsWith('image/')) {
    return file;
  }

  // Preserve SVGs and animated GIFs
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Scale proportionally if width or height exceeds 1280
        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file);
          return;
        }

        // Draw and compress image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to webp if supported, or jpeg for non-transparent images
        const targetMime = 'image/webp';

        canvas.toBlob(
          (blob) => {
            if (blob && (blob.size < file.size || file.type === 'image/png')) {
              const safeName = file.name.replace(/\.[^/.]+$/, '') + '.webp';
              const compressedFile = new File([blob], safeName, {
                type: 'image/webp',
                lastModified: Date.now()
              });
              const oldSizeKb = Math.round(file.size / 1024);
              const newSizeKb = Math.round(compressedFile.size / 1024);
              console.log(`✓ Image optimized: ${file.name} (${oldSizeKb}KB → ${newSizeKb}KB)`);
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          targetMime,
          quality
        );
      };

      img.onerror = () => resolve(file);
      img.src = e.target.result;
    };

    reader.onerror = () => resolve(file);
    reader.readAsDataURL(file);
  });
}
