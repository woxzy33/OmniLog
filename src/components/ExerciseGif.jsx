import React, { useState, useEffect } from 'react';

export default function ExerciseGif({ imageUrl, alt, style }) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!imageUrl) return;
    
    // yuhonas images usually have 0.jpg and 1.jpg
    const hasMultipleFrames = imageUrl.endsWith('0.jpg');
    if (!hasMultipleFrames) return;

    const interval = setInterval(() => {
      setFrame(f => (f === 0 ? 1 : 0));
    }, 800);

    return () => clearInterval(interval);
  }, [imageUrl]);

  if (!imageUrl) return null;

  const currentSrc = frame === 1 ? imageUrl.replace('0.jpg', '1.jpg') : imageUrl;

  return (
    <div style={{ position: 'relative', overflow: 'hidden', ...style }}>
      <img 
        src={currentSrc} 
        alt={alt} 
        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 0.2s' }} 
      />
    </div>
  );
}
