import React, { useEffect } from 'react';
import CategoryCatalogPage from './CategoryCatalogPage';

export const SportsPage = () => {
  useEffect(() => {
    document.title = 'Sports, Diver & Racing Timepieces | WatchHub';
    window.scrollTo(0, 0);
  }, []);

  return <CategoryCatalogPage pageKey="sports" />;
};

export default SportsPage;
