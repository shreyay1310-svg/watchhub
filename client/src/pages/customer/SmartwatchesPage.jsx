import React, { useEffect } from 'react';
import CategoryCatalogPage from './CategoryCatalogPage';

export const SmartwatchesPage = () => {
  useEffect(() => {
    document.title = 'Next-Gen AMOLED Smartwatches & Wearables | WatchHub';
    window.scrollTo(0, 0);
  }, []);

  return <CategoryCatalogPage pageKey="smartwatches" />;
};

export default SmartwatchesPage;
