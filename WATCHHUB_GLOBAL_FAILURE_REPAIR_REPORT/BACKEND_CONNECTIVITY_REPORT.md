# BACKEND CONNECTIVITY REPORT

## 1. Local Architecture
- Frontend: `http://localhost:5173` (Vite client)
- Backend: `http://localhost:5000` (Node.js Express REST API)
- Database: Microsoft SQL Server 2025 on `127.0.0.1:1433` (Database: `WatchHubDB`)
- ORM: Prisma Client 5.x

## 2. Health Endpoint Verification
- Endpoint: `GET /api/health`
- Response:
```json
{
  "status": "ok",
  "service": "WatchHub Horology Atelier API",
  "environment": "development"
}
```
- Round-trip latency: < 5ms.

## 3. Dummy Payment API Verification
- Endpoint: `POST /api/payments/dummy-checkout`
- Payload: `items`, `shippingAddress`, `paymentMethod`, `simulateFailure`
- Verified:
  1. Creates atomic database transaction in SQL Server (`Order`, `OrderItem`, `Payment`, `OrderStatusHistory`).
  2. Test failure toggle returns 400 with expected error without crashing frontend or triggering offline fallback.
  3. Real Razorpay API dependencies completely excised from active checkout.
