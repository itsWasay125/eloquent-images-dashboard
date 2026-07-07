import React, { useEffect, useState } from "react";

const EloquentImage = ({ alt, className = "", fallback = "Image unavailable", src }) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return <div className={`eloquent-image-fallback ${className}`}>{fallback}</div>;
  }

  return (
    <img
      alt={alt}
      className={className}
      loading="lazy"
      src={src}
      onError={() => setFailed(true)}
    />
  );
};

export default EloquentImage;
