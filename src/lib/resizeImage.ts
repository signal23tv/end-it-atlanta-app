/** Resize + compress a picked photo in-browser via canvas, so we
 * never ship a full-resolution phone photo through a server action.
 * Cover-crops to a square and returns a JPEG data URL. */
export function resizeImageToDataUrl(file: File, size = 320): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Couldn't read that file."));
    reader.onload = () => {
      img.onerror = () => reject(new Error("That doesn't look like an image."));
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Couldn't process that image."));
          return;
        }
        const scale = Math.max(size / img.width, size / img.height);
        const drawW = img.width * scale;
        const drawH = img.height * scale;
        ctx.drawImage(img, (size - drawW) / 2, (size - drawH) / 2, drawW, drawH);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/** Resize + compress a picked photo for a post attachment. Unlike the
 * avatar helper above, this does NOT crop -- it scales the whole image
 * down to fit within maxDim on its longest edge (if it's already
 * smaller, it's left alone) and returns a JPEG data URL at its real
 * aspect ratio, so a post photo is never cut off. */
export function resizeImageForPost(file: File, maxDim = 1600): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Couldn't read that file."));
    reader.onload = () => {
      img.onerror = () => reject(new Error("That doesn't look like an image."));
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const drawW = Math.round(img.width * scale);
        const drawH = Math.round(img.height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = drawW;
        canvas.height = drawH;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Couldn't process that image."));
          return;
        }
        ctx.drawImage(img, 0, 0, drawW, drawH);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
