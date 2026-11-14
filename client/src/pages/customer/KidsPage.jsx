import React, { useEffect } from 'react';
import CategoryCatalogPage from './CategoryCatalogPage';

export const KidsPage = () => {
  useEffect(() => {
    document.title = "Kids' Educational & Superhero Watches | WatchHub";
    window.scrollTo(0, 0);
  }, []);

  return <CategoryCatalogPage pageKey="kids" />;
};

export default KidsPage;
