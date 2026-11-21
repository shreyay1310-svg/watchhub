// Native fetch available in Node.js 18+

async function testStoreAdminApis() {
  // 1. Login as Store Admin
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@watchhub.com', password: 'Admin@123' }),
  });
  const loginData = await loginRes.json();
  const token = loginData.accessToken;
  console.log('Login status:', loginRes.status, 'Token exists:', !!token);

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // 2. Overview
  const overRes = await fetch('http://localhost:5000/api/store-admin/overview', { headers });
  const overData = await overRes.json();
  console.log('Overview:', overRes.status, overData.data?.kpis);

  // 3. Sales Overview Chart
  const salesRes = await fetch('http://localhost:5000/api/store-admin/sales-overview?range=This%20Week', { headers });
  const salesData = await salesRes.json();
  console.log('Sales Overview:', salesRes.status, 'Points:', salesData.data?.chartData?.length);

  // 4. Sales by Channel
  const chanRes = await fetch('http://localhost:5000/api/store-admin/sales-by-channel', { headers });
  const chanData = await chanRes.json();
  console.log('Channels:', chanRes.status, chanData.data?.channels);

  // 5. POS Search
  const posSearchRes = await fetch('http://localhost:5000/api/store-admin/pos/search?query=rolex', { headers });
  const posSearchData = await posSearchRes.json();
  console.log('POS Search "rolex":', posSearchRes.status, 'Results:', posSearchData.data?.length);

  // 6. POS Order Creation
  if (posSearchData.data?.length) {
    const firstProduct = posSearchData.data[0];
    const orderRes = await fetch('http://localhost:5000/api/store-admin/pos/order', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        cartItems: [{ id: firstProduct.id, qty: 1 }],
        customerName: 'Test Walk-in POS Client',
        customerPhone: '9876543210',
        paymentMethod: 'Cash',
      }),
    });
    const orderData = await orderRes.json();
    console.log('POS Order Creation:', orderRes.status, orderData.receipt?.orderNumber, 'Total:', orderData.receipt?.totalAmount);
  }

  // 7. Orders Listing
  const ordersRes = await fetch('http://localhost:5000/api/store-admin/orders?limit=5', { headers });
  const ordersData = await ordersRes.json();
  console.log('Orders listing:', ordersRes.status, 'Count:', ordersData.data?.orders?.length);

  // 8. Customers Listing
  const custRes = await fetch('http://localhost:5000/api/store-admin/customers', { headers });
  const custData = await custRes.json();
  console.log('Customers listing:', custRes.status, 'Count:', custData.data?.length);

  process.exit(0);
}

testStoreAdminApis().catch((e) => {
  console.error('API Test Error:', e);
  process.exit(1);
});
