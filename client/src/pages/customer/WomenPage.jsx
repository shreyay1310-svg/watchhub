import React, { useEffect } from 'react';
import CategoryCatalogPage from './CategoryCatalogPage';

export const WomenPage = () => {
  useEffect(() => {
    document.title = "Women's Elegant & Diamond Watches | WatchHub";
    window.scrollTo(0, 0);
  }, []);

  return <CategoryCatalogPage pageKey="women" />;
};

export default WomenPage;
