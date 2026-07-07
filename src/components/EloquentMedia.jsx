import React, { useEffect, useState } from "react";

function isVideoSource(src = "", mediaType = "") {
  if (mediaType.startsWith("video/")) return true;
  return /\.(mp4|webm|ogg|mov|m4v)(?:[?#].*)?$/i.test(src);
}

const EloquentMedia = ({
  alt,
  className = "",
  controls = true,
  fallback = "Media unavailable",
  mediaType = "",
  src,
}) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return <div className={`eloquent-image-fallback ${className}`}>{fallback}</div>;
  }

  if (isVideoSource(src, mediaType)) {
    return (
      <video
        aria-label={alt}
        className={className}
        controls={controls}
        onError={() => setFailed(true)}
        playsInline
        preload="metadata"
        src={src}
      />
    );
  }

  return (
    <img
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
      src={src}
    />
  );
};

export default EloquentMedia;
