import dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to Database & Start HTTP Server with Socket.IO
const startServer = async () => {
  await connectDB();

  const httpServer = http.createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: [
        process.env.CLIENT_URL || 'http://localhost:5173',
        'https://watchhub-store-silk.vercel.app',
        'http://localhost:3000',
        'http://localhost:5174',
      ],
      credentials: true,
      methods: ['GET', 'POST'],
    },
  });

  // Attach io to express app so REST routes can emit socket events
  app.set('io', io);

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);

    // Join room for real-time order tracking: room format track_<orderId>
    socket.on('join_tracking', (orderId) => {
      if (orderId) {
        const room = `track_${orderId}`;
        socket.join(room);
        console.log(`[Socket.IO] Client ${socket.id} joined tracking room: ${room}`);
      }
    });

    // Handle rider GPS location streaming
    socket.on('rider_location', (data) => {
      if (data?.orderId) {
        const room = `track_${data.orderId}`;
        // Broadcast location update to all clients listening to this order
        io.to(room).emit('rider_location_update', {
          ...data,
          serverTimestamp: new Date().toISOString(),
        });
        console.log(`[Socket.IO] Broadcasted GPS update for order ${data.orderId}: (${data.lat}, ${data.lng})`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  const server = httpServer.listen(PORT, () => {
    console.log(`[WatchHub Server] Running on http://localhost:${PORT}`);
    console.log(`[WatchHub Server] Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`[WatchHub Server] Socket.IO Live GPS Tracking ready.`);
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

