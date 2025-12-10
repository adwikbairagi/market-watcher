# S&P 500 Stock Market Dashboard - Design Guidelines

## Design Approach: Data-Focused Dashboard System
**Selected Approach:** Design System (Financial Data Application)  
**References:** Modern fintech dashboards (Robinhood, Yahoo Finance, Trading platforms)  
**Principles:** Data clarity, efficient scanning, professional precision, theme-aware design

## Layout System

**Spacing Units:** Use Tailwind units of 2, 4, 6, and 8 (p-2, m-4, gap-6, py-8)  
**Container Strategy:**
- Full-width application with max-w-7xl centered container
- Dashboard sections use px-4 md:px-6 lg:px-8 for consistent edge spacing
- Dense information layout - no wasted vertical space

**Grid Structure:**
- Header: Full-width sticky bar (S&P 500 index, theme toggle, export button)
- Controls Row: Top N input OR manual selection + time period buttons (flex wrap on mobile)
- Statistics Cards: 3-column grid (Average, High, Low) - stack on mobile
- Performance Banner: Full-width comparison strip
- Chart Section: Full-width with responsive height (min-h-96)
- Data Table: Full-width scrollable container

## Typography

**Font Stack:** 
- Primary: Inter or IBM Plex Sans (professional, number-optimized)
- Monospace: IBM Plex Mono for numeric values

**Hierarchy:**
- App Title/S&P 500 Value: text-2xl md:text-3xl font-bold
- Section Headers: text-lg font-semibold
- Metric Labels: text-sm font-medium uppercase tracking-wide
- Large Numbers: text-3xl md:text-4xl font-bold (statistics cards)
- Table Headers: text-xs font-semibold uppercase
- Table Data: text-sm (company names), text-base font-mono (prices/percentages)
- Performance Text: text-base font-medium

## Component Library

### Header Bar
- Sticky positioning (sticky top-0 z-50)
- Contains: S&P 500 index value + daily % change, theme toggle button, CSV export button
- Height: h-16
- Shadow/border for separation

### Control Panel
- Two-mode selection UI with clear visual toggle between "Top N" and "Manual Select"
- Top N Mode: Number input with label "Show top __ companies by price"
- Manual Mode: Instruction text "Select specific companies from table below"
- Time Period Buttons: Inline group (1D, 5D, 1M, 1Y, 5Y) with active state styling
- Layout: flex flex-wrap gap-4 items-center justify-between
- Padding: py-6

### Statistics Cards
- Grid: grid-cols-1 md:grid-cols-3 gap-4
- Card structure: Rounded borders, padding p-6
- Each contains: Label (top), Large number (center), Small trend indicator
- Compact but readable spacing

### Performance Banner
- Full-width strip between stats and chart
- Contains: S&P % change, User selection % change, Comparison text
- Layout: flex justify-between items-center
- Padding: py-4 px-6
- Typography emphasis on the outperform/underperform text

### Chart Container
- Full-width with padding p-6
- Fixed aspect ratio container for Chart.js
- Height: h-96 md:h-[28rem]
- Chart legend positioned at top
- Grid lines for readability

### Data Table
- Sticky header row
- Columns: Checkbox (manual mode only), Company Name, Ticker, Price, Daily Change (%), Sort icons
- Row height: h-12 for comfortable scanning
- Alternating row treatment for readability
- Hover state for rows
- Search input positioned above table (w-full md:w-96)
- Virtual scrolling container with max-height

### Buttons & Controls
- Primary Action: Rounded-md px-4 py-2 font-medium
- Icon Buttons: p-2 rounded-full (theme toggle)
- Time Period Pills: px-3 py-1.5 rounded-full text-sm
- CSV Export: Standard button with download icon

### Error States
- Centered card layout with error icon
- Message text-lg with retry button below
- Padding: p-12
- Max-width: max-w-md mx-auto

## Responsive Behavior

**Mobile (< 768px):**
- Stack statistics cards vertically
- Time period buttons wrap to 2 rows
- Table becomes horizontally scrollable
- Chart height reduces to h-72
- Hide less critical columns in table (show name, price, change only)

**Tablet (768px - 1024px):**
- 2-column statistics grid with 3rd card spanning full width
- Comfortable spacing throughout

**Desktop (> 1024px):**
- Full 3-column statistics layout
- All table columns visible
- Optimal chart proportions

## Interactions

**Minimal Animations:**
- Smooth theme transitions (transition-colors duration-200)
- Button hover states (no color shift, use opacity/border changes)
- Table row hover (subtle background shift)
- Chart updates with 300ms easing
- NO scroll animations, parallax, or decorative motion

## Accessibility
- Consistent focus indicators on all interactive elements
- Semantic HTML table structure with proper headers
- ARIA labels for icon-only buttons
- Keyboard navigation for all controls
- High contrast maintained in both themes
- Form inputs with associated labels

## Theme Implementation
- Theme toggle in header (sun/moon icon)
- Both themes maintain identical spacing, typography, and layout
- Number legibility prioritized in both modes
- Chart adapts grid/axis styling per theme