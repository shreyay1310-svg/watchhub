import { prisma } from '../config/prisma.js';

// Helper to format Prisma Product into standard Store & API Product format
const mapPrismaProduct = (p) => {
  const images = p.productImages && p.productImages.length > 0
    ? p.productImages.map((img) => img.imageUrl)
    : [p.imageUrl || '/images/products/featured_rolex_submariner.jpg'];

  const primaryImage = images[0];
  const stock = p.inventory && p.inventory.length > 0
    ? p.inventory.reduce((sum, inv) => sum + inv.currentStock, 0)
    : 10;

  const cost = Number(p.costPrice || Math.round(Number(p.price) * 0.65));
  const price = Number(p.price);
  const original = Number(p.originalPrice || price);

  return {
    id: p.productId,
    productId: p.productId,
    name: p.name,
    sku: p.sku,
    category: p.category?.name || 'Luxury',
    brand: p.brand?.name || 'Swiss Horology',
    price,
    originalPrice: original,
    costPrice: cost,
    discount: Number(p.discountPercentage || (original > price ? Math.round(((original - price) / original) * 100) : 0)),
    stock,
    status: p.isActive ? (stock === 0 ? 'Out of Stock' : 'Active') : 'Draft',
    rating: 4.8,
    reviewsCount: 120,
    isFeatured: p.isFeatured,
    image: primaryImage,
    images,
    specifications: {
      caseMaterial: p.caseMaterial || 'Stainless Steel',
      dialColor: p.dialColor || 'Black',
      strapMaterial: p.strapMaterial || 'Steel / Leather',
      movementType: p.movementType || 'Automatic',
      waterResistance: p.waterResistance || '100M Water Resistant',
      gender: p.gender || 'Men',
    },
    description: p.description || p.name,
    createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
  };
};

// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const { status, category, brand, search, featured } = req.query;

    const dbProducts = await prisma.product.findMany({
      include: {
        brand: true,
        category: true,
        productImages: { orderBy: { displayOrder: 'asc' } },
        inventory: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    let list = dbProducts.map(mapPrismaProduct);

    if (status && status !== 'All') {
      list = list.filter((p) => p.status.toLowerCase() === status.toLowerCase());
    }
    if (category && category !== 'All') {
      list = list.filter((p) => p.category.toLowerCase().includes(category.toLowerCase()));
    }
    if (brand && brand !== 'All') {
      list = list.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
    }
    if (featured === 'true') {
      list = list.filter((p) => p.isFeatured);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }

    const total = dbProducts.length;
    const active = list.filter((p) => p.status === 'Active').length;
    const draft = list.filter((p) => p.status === 'Draft').length;
    const outOfStock = list.filter((p) => p.stock === 0 || p.status === 'Out of Stock').length;

    return res.status(200).json({
      status: 'success',
      count: list.length,
      data: list,
      stats: {
        total,
        active,
        draft,
        outOfStock,
        averageRating: 4.8,
      },
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        OR: [{ productId: id }, { sku: id.toUpperCase() }],
      },
      include: {
        brand: true,
        category: true,
        productImages: true,
        inventory: true,
      },
    });

    if (!product) {
      return res.status(404).json({ status: 'fail', message: 'Product not found.' });
    }

    return res.status(200).json({ status: 'success', data: mapPrismaProduct(product) });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// POST /api/products
export const createProduct = async (req, res) => {
  try {
    const { name, sku, price, brand, category } = req.body;
    if (!name || !sku || !price || !brand || !category) {
      return res.status(400).json({
        status: 'fail',
        message: 'Name, SKU, Brand, Category and Selling Price are required.',
      });
    }

    const cleanSku = sku.toUpperCase().trim();
    const existing = await prisma.product.findUnique({ where: { sku: cleanSku } });
    if (existing) {
      return res.status(400).json({
        status: 'fail',
        message: `SKU "${sku}" already exists! Please use a unique SKU.`,
      });
    }

    // Resolve Brand
    const brandSlug = brand.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const dbBrand = await prisma.brand.upsert({
      where: { slug: brandSlug },
      update: {},
      create: { slug: brandSlug, name: brand },
    });

    // Resolve Category
    const categorySlug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const dbCategory = await prisma.category.upsert({
      where: { categorySlug },
      update: {},
      create: { categorySlug, name: category },
    });

    const original = Number(req.body.originalPrice) || Number(price);
    const cost = Number(req.body.costPrice) || Math.round(Number(price) * 0.65);
    const discount = original > Number(price) ? Math.round(((original - Number(price)) / original) * 100) : 0;

    const defaultWh = await prisma.warehouse.findFirst({ where: { isActive: true } });

    const newProd = await prisma.product.create({
      data: {
        name,
        sku: cleanSku,
        brandId: dbBrand.brandId,
        categoryId: dbCategory.categoryId,
        price: Number(price),
        originalPrice: original,
        costPrice: cost,
        discountPercentage: discount,
        description: req.body.description || 'WatchHub Certified Luxury Timepiece.',
        caseMaterial: req.body.caseMaterial || 'Stainless Steel',
        dialColor: req.body.dialColor || 'Black',
        strapMaterial: req.body.strapMaterial || 'Steel / Leather',
        waterResistance: req.body.waterResistance || '100M Water Resistant',
        movementType: req.body.movementType || 'Automatic Chronometer',
        gender: req.body.gender || 'Men',
        isFeatured: Boolean(req.body.isFeatured),
        isActive: req.body.status !== 'Draft',
        productImages: {
          create: {
            imageUrl: req.body.image || '/images/products/featured_rolex_submariner.jpg',
            displayOrder: 1,
            isPrimary: true,
          },
        },
        inventory: defaultWh ? {
          create: {
            warehouseId: defaultWh.warehouseId,
            currentStock: Number(req.body.stock) || 10,
          },
        } : undefined,
      },
      include: {
        brand: true,
        category: true,
        productImages: true,
        inventory: true,
      },
    });

    return res.status(201).json({
      status: 'success',
      message: 'Product created successfully.',
      data: mapPrismaProduct(newProd),
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.product.findFirst({
      where: { OR: [{ productId: id }, { sku: id.toUpperCase() }] },
    });

    if (!existing) {
      return res.status(404).json({ status: 'fail', message: 'Product not found.' });
    }

    const updated = await prisma.product.update({
      where: { productId: existing.productId },
      data: {
        name: req.body.name || undefined,
        price: req.body.price !== undefined ? Number(req.body.price) : undefined,
        originalPrice: req.body.originalPrice !== undefined ? Number(req.body.originalPrice) : undefined,
        isFeatured: req.body.isFeatured !== undefined ? Boolean(req.body.isFeatured) : undefined,
        description: req.body.description || undefined,
        updatedAt: new Date(),
      },
      include: {
        brand: true,
        category: true,
        productImages: true,
        inventory: true,
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Product updated successfully.',
      data: mapPrismaProduct(updated),
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.product.findFirst({
      where: { OR: [{ productId: id }, { sku: id.toUpperCase() }] },
    });

    if (!existing) {
      return res.status(404).json({ status: 'fail', message: 'Product not found.' });
    }

    // Cascade delete related images and inventory first
    await prisma.productImage.deleteMany({ where: { productId: existing.productId } });
    await prisma.inventory.deleteMany({ where: { productId: existing.productId } });
    await prisma.product.delete({ where: { productId: existing.productId } });

    return res.status(200).json({
      status: 'success',
      message: 'Product deleted successfully.',
    });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};

// POST /api/products/bulk
export const bulkProductsAction = async (req, res) => {
  try {
    const { action, ids } = req.body;

    if (action === 'delete' && Array.isArray(ids)) {
      await prisma.productImage.deleteMany({ where: { productId: { in: ids } } });
      await prisma.inventory.deleteMany({ where: { productId: { in: ids } } });
      await prisma.product.deleteMany({ where: { productId: { in: ids } } });
      return res.status(200).json({ status: 'success', message: `${ids.length} products deleted.` });
    }

    if (action === 'activate' && Array.isArray(ids)) {
      await prisma.product.updateMany({
        where: { productId: { in: ids } },
        data: { isActive: true },
      });
      return res.status(200).json({ status: 'success', message: `${ids.length} products activated.` });
    }

    if (action === 'deactivate' && Array.isArray(ids)) {
      await prisma.product.updateMany({
        where: { productId: { in: ids } },
        data: { isActive: false },
      });
      return res.status(200).json({ status: 'success', message: `${ids.length} products moved to draft.` });
    }

    if (action === 'feature' && Array.isArray(ids)) {
      await prisma.product.updateMany({
        where: { productId: { in: ids } },
        data: { isFeatured: true },
      });
      return res.status(200).json({ status: 'success', message: `${ids.length} products marked as featured.` });
    }

    return res.status(400).json({ status: 'fail', message: 'Invalid bulk action.' });
  } catch (err) {
    return res.status(500).json({ status: 'error', message: err.message });
  }
};
