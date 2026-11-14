import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CategoryCatalogPage from './CategoryCatalogPage';

export const CategoryDetailPage = () => {
  const { categorySlug } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categorySlug]);

  return <CategoryCatalogPage pageKey={categorySlug || 'watches'} />;
};

export default CategoryDetailPage;
