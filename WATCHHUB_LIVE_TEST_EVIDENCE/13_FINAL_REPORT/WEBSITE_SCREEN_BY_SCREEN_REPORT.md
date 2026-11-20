# WATCHHUB ATELIER — WEBSITE SCREEN-BY-SCREEN REPORT

This document presents the detailed visual and functional verification of every screen rendered in Google Chrome on [http://localhost:5173](http://localhost:5173).

---

### 1. Screen Verification Matrix

| # | Screen Name | Route | Viewport | Visual Status | Functional Assessment | Screenshot Reference |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | Homepage | `/` | 1920x1080 | PASS | Luxury carousel, brand insignia, hero typography render properly. | [01_homepage.png](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/WATCHHUB_LIVE_TEST_EVIDENCE/02_WEBSITE_DESKTOP_SCREENSHOTS/01_homepage.png) |
| **02** | Search Results | `/products?search=Rolex` | 1920x1080 | PASS | Filtered catalog displays authentic Rolex timepieces. | [02_search_results.png](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/WATCHHUB_LIVE_TEST_EVIDENCE/02_WEBSITE_DESKTOP_SCREENSHOTS/02_search_results.png) |
| **03** | Product Catalog | `/products` | 1920x1080 | PASS | 33 products retrieved with category tabs and brand sidebar. | [03_product_catalog.png](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/WATCHHUB_LIVE_TEST_EVIDENCE/02_WEBSITE_DESKTOP_SCREENSHOTS/03_product_catalog.png) |
| **04** | Product Details | `/product/1` | 1920x1080 | PASS | High-res horology gallery, calibre specifications, Add to Bag CTA. | [04_product_details.png](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/WATCHHUB_LIVE_TEST_EVIDENCE/02_WEBSITE_DESKTOP_SCREENSHOTS/04_product_details.png) |
| **05** | Cart Page | `/cart` | 1920x1080 | PASS | Item listing, quantity increments, coupon discount engine. | [05_cart_with_coupon.png](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/WATCHHUB_LIVE_TEST_EVIDENCE/02_WEBSITE_DESKTOP_SCREENSHOTS/05_cart_with_coupon.png) |
| **06** | Checkout Page | `/checkout` | 1920x1080 | PASS | Multi-step checkout, Google Maps picker, Armoured courier fee. | [06_checkout_page.png](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/WATCHHUB_LIVE_TEST_EVIDENCE/02_WEBSITE_DESKTOP_SCREENSHOTS/06_checkout_page.png) |
| **07** | Login Page | `/login` | 1920x1080 | PASS | Dual auth tabs (Password + OTP), credential error handling. | [07_login_page.png](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/WATCHHUB_LIVE_TEST_EVIDENCE/02_WEBSITE_DESKTOP_SCREENSHOTS/07_login_page.png) |
| **08** | Signup Page | `/signup` | 1920x1080 | PASS | Inline collector form validation, instant feedback. | [08_signup_page.png](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/WATCHHUB_LIVE_TEST_EVIDENCE/02_WEBSITE_DESKTOP_SCREENSHOTS/08_signup_page.png) |
| **09** | Forgot Password | `/forgot-password` | 1920x1080 | PASS | Non-enumerating email submission, 60s cooldown countdown. | [09_forgot_password.png](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/WATCHHUB_LIVE_TEST_EVIDENCE/02_WEBSITE_DESKTOP_SCREENSHOTS/09_forgot_password.png) |
| **10** | Reset Password | `/reset-password` | 1920x1080 | PASS | 6-digit OTP code entry, password strength indicator. | [10_reset_password.png](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/WATCHHUB_LIVE_TEST_EVIDENCE/02_WEBSITE_DESKTOP_SCREENSHOTS/10_reset_password.png) |
| **11** | Customer Account | `/account` | 1920x1080 | PASS | Collector profile management, saved addresses, order history. | [11_customer_account.png](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/WATCHHUB_LIVE_TEST_EVIDENCE/02_WEBSITE_DESKTOP_SCREENSHOTS/11_customer_account.png) |
| **12** | Delivery Tracking | `/tracking/WH20261125` | 1920x1080 | PASS | Live courier status, delivery timeline, Delhivery courier metadata. | [12_tracking_page.png](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/WATCHHUB_LIVE_TEST_EVIDENCE/02_WEBSITE_DESKTOP_SCREENSHOTS/12_tracking_page.png) |

---

### 2. Operational Dashboards

| Portal | Route | Visual Status | Live Data Verification | Screenshot |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | `/dashboard/super-admin` | PASS | Live Gross Revenue (₹44,76,397), 33 Catalog Products. | [01_super_admin_dashboard.png](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/WATCHHUB_LIVE_TEST_EVIDENCE/05_ADMIN_WORKFLOW/01_super_admin_dashboard.png) |
| **Store Admin** | `/dashboard/store-admin` | PASS | Daily store fulfillment queue, POS terminal launcher. | [02_store_admin_dashboard.png](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/WATCHHUB_LIVE_TEST_EVIDENCE/05_ADMIN_WORKFLOW/02_store_admin_dashboard.png) |
| **Inventory** | `/inventory` | PASS | 36 warehouse stock allocations, inward restock requests. | [03_inventory_dashboard.png](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/WATCHHUB_LIVE_TEST_EVIDENCE/05_ADMIN_WORKFLOW/03_inventory_dashboard.png) |
| **Delivery** | `/delivery` | PASS | Live dispatch queue, courier partner assignments, GPS routes. | [04_delivery_dashboard.png](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/WATCHHUB_LIVE_TEST_EVIDENCE/05_ADMIN_WORKFLOW/04_delivery_dashboard.png) |
| **Support** | `/support` | PASS | Escalation drawer, customer ticket resolution, refund portal. | [05_support_dashboard.png](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/WATCHHUB_LIVE_TEST_EVIDENCE/05_ADMIN_WORKFLOW/05_support_dashboard.png) |

---

### 3. Responsive Breakpoint Auditing

- **iPhone X / 11 (375x812)**: Tested homepage, catalog, cart and checkout. Hamburger navigation triggers smoothly, typography wraps without overflow, touch targets conform to 44x44px.
  - Evidence: [01_homepage_mobile_375x812.png](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/WATCHHUB_LIVE_TEST_EVIDENCE/03_WEBSITE_MOBILE_SCREENSHOTS/01_homepage_mobile_375x812.png)
  - Evidence: [02_catalog_mobile_375x812.png](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/WATCHHUB_LIVE_TEST_EVIDENCE/03_WEBSITE_MOBILE_SCREENSHOTS/02_catalog_mobile_375x812.png)
- **iPhone 14 / 15 (390x844)**: Catalog layout renders in single-column luxury view with clear CTA buttons.
  - Evidence: [05_homepage_mobile_390x844.png](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/WATCHHUB_LIVE_TEST_EVIDENCE/03_WEBSITE_MOBILE_SCREENSHOTS/05_homepage_mobile_390x844.png)
- **iPad / Tablet (768x1024)**: Catalog displays 2-column grid with side drawer filters available.
  - Evidence: [06_catalog_tablet_768x1024.png](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/WATCHHUB_LIVE_TEST_EVIDENCE/03_WEBSITE_MOBILE_SCREENSHOTS/06_catalog_tablet_768x1024.png)
