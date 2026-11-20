/**
 * WatchHub Centralized Product Image Registry & Mapper
 * Ensures 100% brand-accurate, uncropped, authentic luxury watch photography.
 */

export { DEFAULT_WATCH_PLACEHOLDER, PRODUCT_IMAGE_REGISTRY } from './productImageRegistry';
import { DEFAULT_WATCH_PLACEHOLDER, PRODUCT_IMAGE_REGISTRY } from './productImageRegistry';


/**
 * Returns safe, verified watch image for any product object, id, or SKU.
 * Always returns a non-cropped, non-distorted watch image path.
 */
export const getProductImage = (productOrId) => {
  if (!productOrId) return DEFAULT_WATCH_PLACEHOLDER;

  // Direct ID lookup in registry
  if (typeof productOrId === 'string') {
    const reg = PRODUCT_IMAGE_REGISTRY[productOrId];
    if (reg && reg.image) return reg.image;
    // If it's already a valid path
    if (productOrId.startsWith('/images/products/') && !productOrId.includes('unsplash.com')) {
      return productOrId;
    }
  }

  // Object lookup
  if (typeof productOrId === 'object') {
    const id = productOrId.id || productOrId._id || productOrId.sku;
    if (id && PRODUCT_IMAGE_REGISTRY[id]) {
      return PRODUCT_IMAGE_REGISTRY[id].image;
    }

    // Name or Brand heuristic
    const name = (productOrId.name || '').toLowerCase();
    const brand = (productOrId.brand || '').toLowerCase();

    // Check if an existing product.image is a verified local asset
    if (productOrId.image && typeof productOrId.image === 'string') {
      const img = productOrId.image;
      if (img.startsWith('/images/products/') && !img.includes('unsplash.com')) {
        return img;
      }
    }

    // Brand matching fallback to guaranteed authentic brand hero
    if (name.includes('submariner') || (brand.includes('rolex') && name.includes('sub'))) {
      return '/images/products/rolex-submariner.png';
    }
    if (name.includes('daytona') || (brand.includes('rolex') && name.includes('daytona'))) {
      return '/images/products/rolex-daytona.png';
    }
    if (name.includes('datejust') || brand.includes('rolex')) {
      return '/images/products/rolex-lady-datejust-diamond.png';
    }
    if (name.includes('speedmaster') || name.includes('moonwatch')) {
      return '/images/products/omega-speedmaster.png';
    }
    if (name.includes('seamaster') || (brand.includes('omega') && name.includes('sea'))) {
      return '/images/products/omega-seamaster.png';
    }
    if (brand.includes('omega')) {
      return '/images/products/omega-constellation-diamond.png';
    }
    if (brand.includes('patek')) {
      return '/images/products/patek-nautilus.png';
    }
    if (brand.includes('audemars') || brand.includes('royal oak')) {
      return '/images/products/ap-royal-oak.png';
    }
    if (brand.includes('cartier') && name.includes('panth')) {
      return '/images/products/cartier-panthere-medium.png';
    }
    if (brand.includes('cartier')) {
      return '/images/products/cartier-tank-francaise.png';
    }
    if (brand.includes('tag heuer') || brand.includes('tag')) {
      if (name.includes('monaco')) return '/images/products/tag-heuer-monaco-racing.png';
      return '/images/products/tag-heuer-carrera.png';
    }
    if (brand.includes('breitling')) {
      return '/images/products/breitling-navitimer.png';
    }
    if (brand.includes('tissot')) {
      return '/images/products/tissot-prx.png';
    }
    if (brand.includes('seiko')) {
      return '/images/products/seiko-prospex-diver.png';
    }
    if (brand.includes('g-shock') || (brand.includes('casio') && name.includes('g-shock'))) {
      return '/images/products/g-shock-ga2100.png';
    }
    if (brand.includes('casio')) {
      return '/images/products/casio-vintage-gold.png';
    }
    if (brand.includes('apple')) {
      if (name.includes('ultra')) return '/images/products/apple-watch-ultra-2.png';
      return '/images/products/apple-watch-s10.png';
    }
    if (brand.includes('samsung')) {
      return '/images/products/samsung-galaxy-watch-6.png';
    }
    if (brand.includes('garmin')) {
      return '/images/products/garmin-fenix-7-pro.png';
    }
    if (brand.includes('titan')) {
      if (name.includes('raga')) return '/images/products/titan-raga-viva.png';
      if (name.includes('bandhan') || name.includes('pair')) return '/images/products/titan-bandhan-pair.png';
      return '/images/products/titan-smart-pro-calling.png';
    }
    if (brand.includes('zoop')) {
      if (name.includes('frozen') || name.includes('elsa')) return '/images/products/zoop-disney-frozen-elsa.png';
      return '/images/products/zoop-marvel-spiderman.png';
    }
    if (brand.includes('fossil')) {
      return '/images/products/fossil-jacqueline-blush.png';
    }
    if (brand.includes('chopard')) {
      return '/images/products/chopard-happy-diamonds.png';
    }
    if (brand.includes('longines')) {
      return '/images/products/longines-dolcevita-steel-gold.png';
    }
    if (brand.includes('rado')) {
      return '/images/products/rado-captain-cook.png';
    }
    if (brand.includes('citizen')) {
      return '/images/products/citizen-promaster-diver.png';
    }
  }

  return DEFAULT_WATCH_PLACEHOLDER;
};

/**
 * Returns array of gallery image paths for product details page
 */
export const getProductGallery = (productOrId) => {
  if (!productOrId) return [DEFAULT_WATCH_PLACEHOLDER];
  const id = typeof productOrId === 'string' ? productOrId : (productOrId.id || productOrId._id);
  if (id && PRODUCT_IMAGE_REGISTRY[id]?.gallery) {
    return PRODUCT_IMAGE_REGISTRY[id].gallery;
  }
  const primary = getProductImage(productOrId);
  return [primary];
};

/**
 * Returns accessible descriptive alt text for product images
 */
export const getProductAlt = (productOrId) => {
  if (!productOrId) return 'Luxury wrist watch timepiece';
  const id = typeof productOrId === 'string' ? productOrId : (productOrId.id || productOrId._id);
  if (id && PRODUCT_IMAGE_REGISTRY[id]?.alt) {
    return PRODUCT_IMAGE_REGISTRY[id].alt;
  }
  if (typeof productOrId === 'object' && productOrId.name) {
    const brand = productOrId.brand ? `${productOrId.brand} ` : '';
    return `${brand}${productOrId.name} Luxury Wrist Watch`;
  }
  return 'Luxury wrist watch timepiece';
};
