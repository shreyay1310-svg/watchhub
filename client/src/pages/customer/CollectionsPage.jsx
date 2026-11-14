import React, { useEffect } from 'react';
import CategoryCatalogPage from './CategoryCatalogPage';

export const CollectionsPage = () => {
  useEffect(() => {
    document.title = 'Signature Collections & Limited Editions | WatchHub';
    window.scrollTo(0, 0);
  }, []);

  return <CategoryCatalogPage pageKey="collections" />;
};

export default CollectionsPage;
