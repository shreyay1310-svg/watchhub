import React, { useEffect } from 'react';
import CategoryCatalogPage from './CategoryCatalogPage';

export const LimitedEditionPage = () => {
  useEffect(() => {
    document.title = 'Exclusive Limited Edition & Skeleton Watches | WatchHub';
    window.scrollTo(0, 0);
  }, []);

  return <CategoryCatalogPage pageKey="limited-edition" />;
};

export default LimitedEditionPage;
