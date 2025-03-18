import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './OptimizedImage.module.css';

// Imagens de fallback por tipo
const FALLBACK_IMAGES = {
  exterior: '/images/fallbacks/restaurant-exterior.jpg',
  interior: '/images/fallbacks/restaurant-interior.jpg',
  food: '/images/fallbacks/food-dish.jpg',
  default: '/images/fallbacks/restaurant-default.jpg'
};

const OptimizedImage = ({
  src,
  alt,
  type = 'default',
  width,
  height,
  layout = 'responsive',
  priority = false,
  objectFit = 'cover',
  quality = 75,
  className = '',
  placeholderColor = '#f0f0f0',
  blur = true,
  sizes = '(max-width: 768px) 100vw, 50vw',
  onError,
  onLoad,
  ...props
}) => {
  // Estados para controlar carregamento e erros
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);
  const [blurDataURL, setBlurDataURL] = useState(
    `data:image/svg+xml;base64,${Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width || 100}" height="${height || 100}"><rect width="100%" height="100%" fill="${placeholderColor}"/></svg>`
    ).toString('base64')}`
  );

  // Define a proporção de aspecto para evitar layout shift (CLS)
  const aspectRatio = width && height ? width / height : 16 / 9;

  // Atualiza a fonte da imagem quando src muda
  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  // Função para lidar com erros de carregamento de imagem
  const handleError = () => {
    console.warn(`Erro ao carregar imagem: ${src}`);
    setHasError(true);
    setImgSrc(FALLBACK_IMAGES[type] || FALLBACK_IMAGES.default);
    
    if (typeof onError === 'function') {
      onError();
    }
  };

  // Função para lidar com carregamento bem-sucedido
  const handleLoad = () => {
    setIsLoading(false);
    
    if (typeof onLoad === 'function') {
      onLoad();
    }
  };

  // Classes CSS condicionais
  const imageClasses = [
    styles.optimizedImage,
    isLoading ? styles.loading : '',
    hasError ? styles.error : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={styles.imageWrapper}
      style={{ 
        aspectRatio: `${aspectRatio}`,
        position: 'relative',
        overflow: 'hidden'
      }}
      data-testid="image-wrapper"
    >
      {/* Skeleton loading durante carregamento */}
      {isLoading && (
        <div 
          className={styles.skeleton}
          style={{ backgroundColor: placeholderColor }}
          data-testid="image-skeleton"
        />
      )}
      
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        layout={layout}
        objectFit={objectFit}
        priority={priority}
        quality={quality}
        className={imageClasses}
        onError={handleError}
        onLoad={handleLoad}
        sizes={sizes}
        placeholder={blur ? 'blur' : 'empty'}
        blurDataURL={blur ? blurDataURL : undefined}
        {...props}
      />
      
      {/* Indicador visual de erro quando houver falha (além da imagem de fallback) */}
      {hasError && (
        <div className={styles.errorIndicator} data-testid="error-indicator">
          <span role="img" aria-label="Erro ao carregar imagem">⚠️</span>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage; 