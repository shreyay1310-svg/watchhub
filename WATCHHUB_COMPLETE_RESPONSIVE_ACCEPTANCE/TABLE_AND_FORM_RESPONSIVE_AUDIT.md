# TABLE AND FORM RESPONSIVE AUDIT

## 1. Table Audit & Hardening
Every tabular component across the application has been audited and verified:
- **`StoreAdminShopmaxDashboard.jsx`**: Recent Orders & Top Watches wrapped in `overflow-x-auto custom-scrollbar` with `min-w-0` grid items.
- **`ReportsAnalyticsModule.jsx`**: Wrapped in `overflow-x-auto` with `min-w-[600px]`.
- **`SettingsAuditModule.jsx`**: Audit logs table wrapped in `overflow-x-auto` with `min-w-[650px]`.
- **`POSCheckoutModals.jsx` & `POSManagerModals.jsx`**: Line items invoice table wrapped in `overflow-x-auto` with `min-w-[480px]`.
- **`DiySizeGuideModal.jsx`**: Wrist measurement guide wrapped in `overflow-x-auto`.
- **`TeamPermissionsModule.jsx`**: Staff access table rendered with image avatars and horizontal scroll safety.

## 2. Form & Modal Controls
- All input fields declare responsive font sizing (`text-sm` or `text-xs`) with touch-friendly heights (`h-10` to `h-12`).
- Mobile keyboards use appropriate types: `type="email"`, `type="tel"`, `type="password"`, `type="number"`.
- Modals declare `max-h-[90vh] overflow-y-auto w-full max-w-lg sm:max-w-xl mx-4` to ensure dialogs never exceed screen bounds.
