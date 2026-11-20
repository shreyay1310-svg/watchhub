# WATCHHUB ATELIER — BUTTON AND LINK TEST MATRIX

This matrix records every interactive control verified during live browser testing in Google Chrome.

---

### Interactive Control Verification Table

| # | Control Description | Screen | User Interaction | Expected Behavior | Actual Behavior | API Route / Side-Effect | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | Explore Collection CTA | Homepage | Click | Navigate to catalog | Navigated to `/products` | `/api/products` | **PASS** |
| **02** | Search Input Submit | Navbar | Keypress (Enter) | Filter products by query | Rendered Rolex catalog | `/api/products?search=Rolex` | **PASS** |
| **03** | Brand Filter: Rolex | Catalog Page | Click | Filter by brand | Displayed matching items | Client & API filter | **PASS** |
| **04** | Sort Selector | Catalog Page | Change selection | Reorder items by price | Ordered items ascending | Client-side sort | **PASS** |
| **05** | Add to Wishlist | Product Details | Click | Toggle wishlist state | Wishlist count badge +1 | `/api/users/wishlist` | **PASS** |
| **06** | Add to Bag CTA | Product Details | Click | Insert into active cart | Cart count badge +1 | CartContext state | **PASS** |
| **07** | Quantity Increment | Cart Page | Click (+) | Increase item quantity | Subtotal recomputed | CartContext state | **PASS** |
| **08** | Apply Coupon (WATCHLUX40)| Cart Page | Click | Deduct 40% discount | Discount applied | `/api/payments/validate-coupon` | **PASS** |
| **09** | Armoured Delivery Option | Checkout Page | Click (Radio) | Add ₹3,500 secure courier | Grand total updated | Client-side fee calc | **PASS** |
| **10** | Confirm & Pay Securely | Checkout Page | Click | Initialize Razorpay Order| Backend order initiated | `/api/payments/create-order` | **PASS** |
| **11** | Password Sign In | Login Page | Submit Form | Issue JWT access & refresh | Dispatched auth tokens | `/api/auth/login` | **PASS** |
| **12** | Request OTP Login | Login Page | Submit Form | Send 6-digit OTP code | Dispatched OTP service | `/api/auth/send-otp` | **PASS** |
| **13** | Register Atelier Account | Signup Page | Submit Form | Create User in MSSQL | User created & logged in | `/api/auth/register` | **PASS** |
| **14** | Send Recovery Code | Forgot Password | Submit Form | Non-enumerating reset | 200 OK + cooldown | `/api/auth/forgot-password` | **PASS** |
| **15** | Reset Password CTA | Reset Password | Submit Form | Hash password with bcrypt| MSSQL credential update | `/api/auth/reset-password` | **PASS** |
| **16** | Edit Profile Name | Customer Account | Click | Update customer metadata | Updated name saved | `/api/users/profile` | **PASS** |
| **17** | Add Saved Address | Customer Account | Submit Form | Persist delivery address | Stored in Addresses table| `/api/users/addresses` | **PASS** |
| **18** | Track Another Parcel | Tracking Page | Click | Load query consignment | Consignment rendered | `/api/tracking/:awb` | **PASS** |
| **19** | Adjust Inventory Stock | Inventory Portal| Submit Modal | Update warehouse count | MSSQL stock updated | `/api/inventory/adjust-stock` | **PASS** |
| **20** | Open Support Ticket | Support Portal | Click | Open customer drawer | Ticket history loaded | `/api/support` | **PASS** |

---

### Control Reliability Summary
- **Total Tested Controls**: 20
- **Controls Passing First Run**: 18
- **Controls Passing After Defect Fix**: 20
- **Broken / Dead Links**: 0
- **Orphan Buttons / Missing Handlers**: 0
- **Evidence Reference**: [button_and_link_inventory.json](file:///c:/Users/shrey/OneDrive/Desktop/watchHub/WATCHHUB_LIVE_TEST_EVIDENCE/11_BUG_REGISTER/button_and_link_inventory.json)
