/**
 * Centralized Database Connection Adapter for WatchHub
 * Powered by Microsoft SQL Server 2025 & Prisma ORM 6.19.3
 */
import { prisma, connectDB, disconnectDB } from './prisma.js';

export { prisma, connectDB, disconnectDB };
export default connectDB;
