import React, { useEffect } from 'react';
import CategoryCatalogPage from './CategoryCatalogPage';

export const MenPage = () => {
  useEffect(() => {
    document.title = "Men's Luxury Watches & Chronographs | WatchHub";
    window.scrollTo(0, 0);
  }, []);

  return <CategoryCatalogPage pageKey="men" />;
};

export default MenPage;
