# WATCHHUB ATELIER — CSS CONFLICT REPORT

## 1. Resolution of Layout Overlaps & Collisions

1. **Z-Index Layering**:
   - `Sticky Top Headers`: Assigned `z-20` / `z-30` within their respective layout scopes.
   - `Global Modals & Overlays`: Assigned `z-50`.
   - `Background Elements` (`CursorGlow`, `ParticleBackground`): Enforced `pointer-events-none` with `z-0`.

2. **Viewport Overflow & Stacking**:
   - Resolved nested `min-h-screen` inner containers by decoupling `InventoryManagerDashboardPage` from `RoleDashboard.jsx`.
   - Each role's main scrollable container manages its own `overflow-y-auto` without competing outer scrollbars.

3. **Responsive Width Constraints**:
   - Desktop: Sidebars fixed/collapsible with explicit width transitions (`lg:pl-64` / `lg:pl-20`).
   - Mobile: Drawers render as slide-over dialogs with backdrop dismissal, cleanly unmounting on route changes.
