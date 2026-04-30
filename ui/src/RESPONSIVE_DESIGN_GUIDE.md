# Responsive Design Guide

## Breakpoints
- **Mobile**: < 640px (Tailwind `sm`)
- **Tablet**: 640px - 1024px (Tailwind `md` to `lg`)
- **Desktop**: >= 1024px (Tailwind `lg`)

## Grid Layouts

### Stat Cards (4-column on desktop)
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {/* Cards */}
</div>
```

### 3-Column Section
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Sections */}
</div>
```

### 2-Column Section
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Sections */}
</div>
```

## Tables on Mobile
- Use horizontal scroll container with `overflow-x-auto`
- Don't hide columns, let user scroll
- Implement sticky left column (optional, complex)
- Ensure table font is readable at smaller sizes

```jsx
<div className="overflow-x-auto">
  <table className="w-full text-xs sm:text-sm">
    {/* Table content */}
  </table>
</div>
```

## Padding & Spacing
- Mobile: p-3 (12px), gap-3 (12px), gap-4 max (16px)
- Tablet+: p-6 (24px), gap-4 to gap-6 (16-24px)

## Typography Scaling
- H1: `text-2xl sm:text-3xl`
- H2: `text-lg sm:text-xl`
- Buttons: `text-xs sm:text-sm`

## Modals & Overlays
- Always full viewport on mobile for accessibility
- Desktop: center with max-width-md or max-width-lg
- Ensure scrollable content on small screens

## Common Responsive Patterns

### Header with Title + Button
```jsx
<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
  <h1 className="text-2xl sm:text-3xl font-bold">Title</h1>
  <button>Action</button>
</div>
```

### Flex Row (Stack on Mobile)
```jsx
<div className="flex flex-col sm:flex-row gap-4">
  <div className="flex-1">Left</div>
  <div className="flex-1">Right</div>
</div>
```

## Testing
- Test at: 375px (mobile), 768px (tablet), 1280px (desktop)
- Use Chrome DevTools responsive mode
- Test portrait and landscape orientations
- Verify touch targets are >= 44px on mobile

## Implementation Checklist
- [ ] All grid layouts use responsive grid-cols
- [ ] Tables use overflow-x-auto
- [ ] Padding uses sm: variants for mobile
- [ ] Typography scales with sm: variants
- [ ] Buttons are large enough for touch (44px+)
- [ ] No horizontal scrolling on main content
- [ ] Modals are full-screen on mobile
