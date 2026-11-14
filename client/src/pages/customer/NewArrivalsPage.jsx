import React, { useEffect } from 'react';
import CategoryCatalogPage from './CategoryCatalogPage';

export const NewArrivalsPage = () => {
  useEffect(() => {
    document.title = 'New Arrivals & Latest Releases | WatchHub Luxury Horology';
    window.scrollTo(0, 0);
  }, []);

  return <CategoryCatalogPage pageKey="new-arrivals" />;
};

export default NewArrivalsPage;
