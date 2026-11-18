import React, { useState } from 'react';
import { getProductImage, getProductAlt, DEFAULT_WATCH_PLACEHOLDER } from '../../utils/productImageMap';

/**
 * Universal WatchHub Product Image Component
 * 
 * Guarantees:
 * 1. 100% Uncropped Watch Visibility (dial, bezel, crown, strap/bracelet visible)
 * 2. object-fit: contain; object-position: center
 * 3. Lazy loading + smooth shimmer skeleton placeholder
 * 4. Automatic error fallback to authentic watch silhouette
 * 5. Accessible alt text compliant with screen readers
 */
export const ProductImage = ({
  product,
  src,
  alt,
  className = '',
  containerClassName = '',
  aspectRatio = 'aspect-square',
  hoverZoom = false,
  dropShadow = true,
  onClick,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Compute resolved image source
  const resolvedSrc = error
    ? DEFAULT_WATCH_PLACEHOLDER
    : (src || getProductImage(product));

  // Compute resolved alt text
  const resolvedAlt = alt || getProductAlt(product);

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden flex items-center justify-center select-none bg-gradient-to-b from-[#070e1b] via-[#050a14] to-[#02050b] ${aspectRatio} ${containerClassName}`}
    >
      {/* Loading Skeleton Shimmer */}
      {!loaded && !error && (
        <div className="absolute inset-0 bg-[#0d1627] animate-pulse flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border border-watch-gold/20 border-t-watch-gold animate-spin" />
        </div>
      )}

      {/* Complete Uncropped Watch Photography */}
      <img
        src={resolvedSrc}
        alt={resolvedAlt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (!error) {
            setError(true);
            setLoaded(true);
          }
        }}
        className={`max-w-full max-h-full w-auto h-auto object-contain object-center block mx-auto transition-all duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        } ${hoverZoom ? 'group-hover:scale-105' : ''} ${
          dropShadow ? 'filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)]' : ''
        } ${className}`}
      />
    </div>
  );
};

export default ProductImage;
