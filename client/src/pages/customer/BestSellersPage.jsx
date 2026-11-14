import React, { useEffect } from 'react';
import CategoryCatalogPage from './CategoryCatalogPage';

export const BestSellersPage = () => {
  useEffect(() => {
    document.title = 'Most Coveted Best Sellers | WatchHub Luxury Horology';
    window.scrollTo(0, 0);
  }, []);

  return <CategoryCatalogPage pageKey="best-sellers" />;
};

export default BestSellersPage;
