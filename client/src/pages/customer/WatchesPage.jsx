import React, { useEffect } from 'react';
import CategoryCatalogPage from './CategoryCatalogPage';

export const WatchesPage = () => {
  useEffect(() => {
    document.title = 'All Watches & Masterpieces | WatchHub Luxury Horology';
    window.scrollTo(0, 0);
  }, []);

  return <CategoryCatalogPage pageKey="watches" />;
};

export default WatchesPage;
