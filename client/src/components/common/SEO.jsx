import React, { useEffect } from 'react';

/**
 * Enterprise SEO Head & Structured Data Manager
 * Handles Open Graph, Twitter Cards, Canonical links, and Schema.org JSON-LD microdata
 */
export const SEO = ({
  title = 'WatchHub – Luxury Watches, Horology Atelier & Customization',
  description = 'Explore WatchHub for authentic luxury watches from Rolex, Omega, Patek Philippe, and TAG Heuer. Experience our 3D Watch Customizer Studio and Horology Atelier.',
  keywords = 'luxury watches, rolex, omega, patek philippe, mechanical watches, buy watches online india, custom watches',
  canonical = 'https://watchhub.in/',
  ogImage = 'https://watchhub.in/images/hero/hero_rolex_submariner.jpg',
  ogType = 'website',
  noindex = false,
  structuredData = null,
}) => {
  useEffect(() => {
    // 1. Update Title
    const fullTitle = title.includes('WatchHub') ? title : `${title} | WatchHub Luxury Watches`;
    document.title = fullTitle;

    // Helper to create or update meta tags
    const setMetaTag = (attrName, attrValue, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 2. Standard Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);
    setMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    setMetaTag('name', 'author', 'WatchHub Luxury Horology Ltd.');

    // 3. Canonical Link Tag
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', canonical);

    // 4. Open Graph Tags
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonical);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:site_name', 'WatchHub');
    setMetaTag('property', 'og:locale', 'en_IN');

    // 5. Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);
    setMetaTag('name', 'twitter:site', '@WatchHubOfficial');

    // 6. Schema.org JSON-LD Structured Data
    const scriptId = 'watchhub-page-structured-data';
    let scriptEl = document.getElementById(scriptId);
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    // Default Organization & Website Schema fallback
    const defaultSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': 'https://watchhub.in/#organization',
          name: 'WatchHub',
          url: 'https://watchhub.in/',
          logo: {
            '@type': 'ImageObject',
            url: 'https://watchhub.in/icons/icon-512x512.png',
            width: 512,
            height: 512,
          },
          sameAs: [
            'https://instagram.com/watchhub',
            'https://twitter.com/watchhub',
            'https://facebook.com/watchhub',
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+91-1800-WATCHHUB',
            contactType: 'Customer Support',
            areaServed: 'IN',
            availableLanguage: ['English', 'Hindi'],
          },
        },
        {
          '@type': 'WebSite',
          '@id': 'https://watchhub.in/#website',
          url: 'https://watchhub.in/',
          name: 'WatchHub',
          publisher: { '@id': 'https://watchhub.in/#organization' },
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://watchhub.in/products?search={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        },
      ],
    };

    const finalSchema = structuredData
      ? {
          '@context': 'https://schema.org',
          '@graph': [...defaultSchema['@graph'], ...(Array.isArray(structuredData) ? structuredData : [structuredData])],
        }
      : defaultSchema;

    scriptEl.textContent = JSON.stringify(finalSchema, null, 2);

    return () => {
      // Optional cleanup on unmount
    };
  }, [title, description, keywords, canonical, ogImage, ogType, noindex, structuredData]);

  return null;
};

export default SEO;
