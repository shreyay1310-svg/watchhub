import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to Database & Start HTTP Server
const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`[WatchHub Server] Running on http://localhost:${PORT}`);
    console.log(`[WatchHub Server] Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log('\n[WatchHub Server] Shutting down gracefully...');
    server.close(() => {
      console.log('[WatchHub Server] Closed out remaining connections.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
};

startServer();

