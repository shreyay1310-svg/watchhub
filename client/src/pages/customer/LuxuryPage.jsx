import React, { useEffect } from 'react';
import CategoryCatalogPage from './CategoryCatalogPage';

export const LuxuryPage = () => {
  useEffect(() => {
    document.title = 'Swiss Haute Horlogerie & Luxury Vault | WatchHub';
    window.scrollTo(0, 0);
  }, []);

  return <CategoryCatalogPage pageKey="luxury" />;
};

export default LuxuryPage;
