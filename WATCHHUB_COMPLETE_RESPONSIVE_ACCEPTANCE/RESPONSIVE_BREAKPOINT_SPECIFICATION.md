# RESPONSIVE BREAKPOINT SPECIFICATION

## 1. Supported Viewports & Breakpoint Rules

| Device Class | Viewport Dimensions | Tailwind Breakpoint | Layout Adaptations |
|---|---|---|---|
| **Ultra-Wide Desktop** | `1920 × 1080` | `2xl` (`>= 1536px`) | Full desktop sidebar, 4-column KPI grids, maximum chart visual fidelity |
| **Standard Desktop** | `1440 × 900`, `1366 × 768` | `xl` (`>= 1280px`) | Docked sidebar (expanded), dual column tables & analytics |
| **Laptop / Small Desktop** | `1280 × 800`, `1024 × 768` | `lg` (`>= 1024px`) | Collapsible sidebar (`w-20` or `w-64`), wrapped search bar |
| **Tablet Portrait / Large Mobile** | `768 × 1024`, `820 × 1180` | `md` (`>= 768px`) | Off-canvas sliding drawer with dark backdrop; 2-column KPI grid |
| **Standard Mobile** | `430 × 932`, `390 × 844`, `375 × 812`, `360 × 800` | `sm` / Base (`< 640px`) | 1-column stacked cards, hamburger drawer, horizontal table scroll containers |
| **Compact Mobile** | `320 × 720` | Base (`< 360px`) | Ultra-compact controls, swipeable role tabs, touch targets >= 44px |

## 2. Zero Horizontal Overflow Rule
- Root app container enforces `overflow-x-hidden`.
- All tables are encapsulated in `<div className="overflow-x-auto">`.
- Grid containers declare `min-w-0` to eliminate content blowouts.
