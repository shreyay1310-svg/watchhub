import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure environment variables from server/.env are loaded if not already present
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
}

// Prevent multiple instances of Prisma Client in development / testing
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Connect to Microsoft SQL Server 2025 via Prisma
 */
export const connectDB = async () => {
  try {
    await prisma.$connect();
    // Validate live database communication
    const result = await prisma.$queryRaw`SELECT 1 AS healthy;`;
    if (result && result.length > 0) {
      console.log('[Database] Microsoft SQL Server 2025 (WatchHubDB) connected successfully via Prisma.');
    }
    return prisma;
  } catch (error) {
    console.error('[Database Fatal Error] Failed to connect to WatchHubDB via Prisma:', error.message);
    throw error;
  }
};

/**
 * Disconnect from Microsoft SQL Server for graceful shutdown
 */
export const disconnectDB = async () => {
  try {
    await prisma.$disconnect();
    console.log('[Database] Prisma Client disconnected cleanly.');
  } catch (error) {
    console.error('[Database Error] Error disconnecting Prisma Client:', error.message);
  }
};

/**
 * Standard Prisma database error handler for Express routes
 */
export const handlePrismaError = (error, res) => {
  console.error('[Prisma Error]', error.code || error.message);
  
  if (error.code === 'P2002') {
    const fields = error.meta?.target || 'field';
    return res.status(409).json({
      status: 'fail',
      message: `A record with this ${fields} already exists.`,
    });
  }
  
  if (error.code === 'P2025') {
    return res.status(404).json({
      status: 'fail',
      message: 'The requested resource was not found.',
    });
  }
  
  if (error.code === 'P2003') {
    return res.status(400).json({
      status: 'fail',
      message: 'Referential integrity violation: linked foreign entity does not exist.',
    });
  }
  
  return res.status(500).json({
    status: 'error',
    message: error.message || 'Internal database operation error.',
  });
};

/**
 * Reusable pagination utility for Prisma findMany queries
 */
export const paginate = async (modelDelegate, { page = 1, limit = 20, where = {}, include = null, select = null, orderBy = { createdAt: 'desc' } } = {}) => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * pageSize;

  const queryOptions = {
    where,
    skip,
    take: pageSize,
    orderBy,
  };

  if (include) queryOptions.include = include;
  if (select) queryOptions.select = select;

  const [totalCount, items] = await Promise.all([
    modelDelegate.count({ where }),
    modelDelegate.findMany(queryOptions),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    items,
    pagination: {
      totalItems: totalCount,
      totalPages,
      currentPage: pageNum,
      pageSize,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
    },
  };
};

export default prisma;
