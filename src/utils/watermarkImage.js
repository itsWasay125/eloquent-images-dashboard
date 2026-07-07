const WATERMARK_TEXT = "Eloquent Images by Adrian";
const WATERMARK_FONT_FAMILY = '"Vivaldi Std", Vivaldi, "Edwardian Script ITC", cursive';

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`Could not read ${file.name}`));
    };
    image.src = url;
  });
}

function canvasToBlob(canvas, type, quality = 0.92) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Could not apply watermark to the image."));
      },
      type,
      quality
    );
  });
}

function getOutputType(file) {
  return ["image/png", "image/webp", "image/jpeg"].includes(file.type)
    ? file.type
    : "image/jpeg";
}

export async function addGalleryWatermark(file) {
  if (!file?.type?.startsWith("image/")) return file;

  const image = await loadImage(file);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = image.naturalWidth || image.width;
  canvas.height = image.naturalHeight || image.height;

  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

  const baseFontSize = Math.max(36, Math.round(canvas.width * 0.07));
  const maxTextWidth = canvas.width * 0.82;
  let fontSize = baseFontSize;

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  do {
    ctx.font = `${fontSize}px ${WATERMARK_FONT_FAMILY}`;
    fontSize -= 2;
  } while (ctx.measureText(WATERMARK_TEXT).width > maxTextWidth && fontSize > 22);

  const x = canvas.width / 2;
  const y = canvas.height * 0.9;
  const shadowBlur = Math.max(4, Math.round(canvas.width * 0.004));

  ctx.save();
  ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
  ctx.shadowBlur = shadowBlur;
  ctx.shadowOffsetX = Math.max(1, Math.round(canvas.width * 0.002));
  ctx.shadowOffsetY = Math.max(1, Math.round(canvas.width * 0.002));
  ctx.lineWidth = Math.max(1, Math.round(canvas.width * 0.0015));
  ctx.strokeStyle = "rgba(0, 0, 0, 0.28)";
  ctx.fillStyle = "rgba(255, 255, 255, 0.94)";
  ctx.strokeText(WATERMARK_TEXT, x, y, maxTextWidth);
  ctx.fillText(WATERMARK_TEXT, x, y, maxTextWidth);
  ctx.restore();

  const outputType = getOutputType(file);
  const blob = await canvasToBlob(canvas, outputType);

  return new File([blob], file.name, {
    type: outputType,
    lastModified: Date.now(),
  });
}
