# DesignStudio

## Current State
New project — no existing application files.

## Requested Changes (Diff)

### Add
- Full Canva-like graphic design platform UI
- Home screen with template gallery (Social Media, Presentations, Posters, Marketing Materials sections)
- Top navigation bar: project name (editable), File/Edit/Resize menus, Undo/Redo, Download/Share buttons, New Project button
- Left sidebar with icon tabs: Templates, Elements, Text, Uploads, Photos, Icons, Backgrounds — each expandable with scrollable thumbnail previews and search
- Central canvas area with drag-and-drop elements, resize handles, rotation, layering, grid guides, snapping, zoom controls, multi-page navigation
- Right properties panel that changes dynamically: text selection shows font/size/color/alignment/spacing/effects; image selection shows filters/brightness/contrast/transparency
- Onboarding flow for new users (simple modal/overlay walkthrough)
- Collaboration UI indicators (avatar presence badges)
- Reusable components: buttons, cards, modals, tooltips
- Interactive states: hover, active selection, drag feedback
- All state managed in localStorage (frontend-only)

### Modify
- N/A

### Remove
- N/A

## Implementation Plan
1. Create main App.tsx routing between Home (gallery) and Editor views
2. Build Home screen with template gallery categories and "New Project" CTA
3. Build Editor layout: TopNav, LeftSidebar, Canvas, RightPanel components
4. Implement canvas with draggable/resizable/rotatable elements using mouse events
5. Left sidebar with tab switching, search, thumbnail grids
6. Right panel with dynamic controls based on selected element type (text vs image)
7. Zoom controls and page navigation
8. Onboarding modal for first-time users
9. localStorage persistence for designs
10. Polish: hover effects, drag feedback, selection handles, tooltips
