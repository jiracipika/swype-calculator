# Swype Calculator - Architecture Plan

## Vision

A revolutionary calculator app inspired by Swype keyboard, where you drag/swipe your finger across a number/operator grid to build expressions. Fast, fluid, and fun — no tapping required.

## Core Concept

- **Input Method**: Drag finger across a grid of numbers and operators
- **Visual Feedback**: Real-time trail following the finger
- **Calculation**: Expression evaluates on finger release
- **Platforms**: Website (Next.js) + Mobile App (Expo React Native)
- **Design**: Apple-like dainty aesthetic — frosted glass, subtle gradients, smooth animations

---

## Tech Stack

### Monorepo Structure
```
swype-calculator/
├── apps/
│   ├── web/              # Next.js website
│   └── mobile/           # Expo React Native app
├── packages/
│   ├── core/             # Shared calculation & gesture logic
│   ├── ui/               # Shared UI components (buttons, trails)
│   └── config/           # Shared TypeScript, ESLint, etc.
└── turbo.json            # Turborepo config
```

### Web Stack (apps/web)
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + Framer Motion for animations
- **Render**: Canvas API for swipe trails
- **Touch**: Pointer Events API (unified mouse/touch)
- **Deployment**: Vercel

### Mobile Stack (apps/mobile)
- **Framework**: Expo Router v3 (file-based routing)
- **Styling**: React Native Paper + NativeWind (Tailwind for RN)
- **Render**: Reanimated + Gesture Handler for smooth trails
- **Haptics**: Expo Haptics
- **Platform**: iOS + Android (App Store + Play Store)

### Shared Packages
- **@swype-calc/core**: Calculation engine, gesture recognizer, math parser
- **@swype-calc/ui**: Shared React components (Button, Trail, Grid)
- **@swype-calc/types**: TypeScript types and interfaces

---

## Feature List with Priorities

### P0 (MVP - Must Have)
- [x] Basic calculator grid (0-9, +, -, ×, ÷, =, C, ±)
- [x] Touch/swipe input with visual trail
- [x] Expression parsing and evaluation
- [x] Result display (current expression + result preview)
- [x] Backspace/delete gesture
- [x] Clear all gesture
- [x] Apple-like dainty design (frosted glass, gradients, rounded)
- [x] Responsive design (mobile-first, desktop support)

### P1 (Core Features)
- [x] Scientific mode (trig, log, √, ^, π, e, parentheses)
- [x] Calculation history (last 10 expressions)
- [x] History tap to reuse
- [x] Result prediction (show intermediate result while swiping)
- [x] Undo/redo operations
- [x] Copy result to clipboard
- [x] Keyboard input support (web fallback)

### P2 (Enhanced Experience)
- [x] Gesture shortcuts (swipe right for +, swipe left for -, circle for ×, etc.)
- [x] Haptic feedback on mobile (subtle vibration on operator selection)
- [x] Palm rejection (tablets: ignore accidental palm touches)
- [x] Dark mode toggle
- [x] Sound effects (optional toggle)
- [x] Export history (JSON, CSV)
- [x] Settings panel

### P3 (Nice-to-Have)
- [x] Custom themes (color presets)
- [x] Gesture tutorial/intro
- [x] Voice input (mobile only)
- [x] Widget support (iOS/Android)
- [x] Apple Watch app
- [x] Keyboard shortcuts (web: keyboard nav)
- [x] Share expressions (as text/image)

---

## Component Breakdown

### Core Logic (packages/core)
```
packages/core/
├── src/
│   ├── calculator/
│   │   ├── parser.ts          # Parse swipe trail → expression
│   │   ├── evaluator.ts       # Evaluate expression string → number
│   │   └── history.ts         # History management
│   ├── gesture/
│   │   ├── recognizer.ts     # Recognize gestures from touch points
│   │   ├── mapping.ts         # Map gestures → operators
│   │   └── smoothing.ts      # Smooth touch trails (Bézier curves)
│   └── math/
│       ├── basic.ts           # Basic operations
│       ├── scientific.ts      # Scientific functions
│       └── constants.ts       # π, e, etc.
└── index.ts
```

### Shared UI (packages/ui)
```
packages/ui/
├── src/
│   ├── components/
│   │   ├── CalculatorGrid.tsx       # Grid of numbers/operators
│   │   ├── SwipeTrail.tsx           # Visual trail renderer
│   │   ├── Button.tsx               # Individual grid button
│   │   ├── Display.tsx               # Expression/result display
│   │   ├── HistoryPanel.tsx         # History drawer
│   │   └── ModeToggle.tsx           # Basic/Scientific mode switch
│   ├── hooks/
│   │   ├── useSwipe.ts              # Touch/swipe state manager
│   │   ├── useCalculator.ts         # Calculator state & logic
│   │   └── useGesture.ts            # Gesture recognition hook
│   └── styles/
│       ├── colors.ts                # Color palette
│       └── animations.ts            # Shared animation configs
└── index.ts
```

### Web App (apps/web)
```
apps/web/
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Calculator page
│   │   ├── globals.css              # Global styles
│   │   └── api/
│   │       └── health.ts            # Health check endpoint
│   ├── components/
│   │   ├── CanvasTrail.tsx          # Canvas-based trail (web)
│   │   └── KeyboardInput.tsx        # Keyboard fallback support
│   └── lib/
│       └── utils.ts                 # Web-specific utilities
├── package.json
└── next.config.js
```

### Mobile App (apps/mobile)
```
apps/mobile/
├── src/
│   ├── app/
│   │   ├── index.tsx                # Root layout
│   │   ├── _layout.tsx              # App layout
│   │   ├── calculator.tsx           # Calculator screen
│   │   ├── settings.tsx             # Settings screen
│   │   └── history.tsx              # History screen
│   ├── components/
│   │   ├── NativeTrail.tsx          # Reanimated trail (mobile)
│   │   ├── HapticFeedback.tsx       # Haptic wrapper
│   │   └── PalmRejection.tsx        # Palm rejection logic
│   ├── hooks/
│   │   ├── useHaptics.ts            # Haptic feedback hook
│   │   └── usePalmRejection.ts      # Palm rejection hook
│   └── utils/
│       └── mobile.ts                # Mobile-specific utilities
├── app.json                         # Expo config
└── package.json
```

---

## Gesture Mapping

### Grid Layout (Standard)
```
┌─────┬─────┬─────┬─────┐
│ sin │ cos │ tan │  (  │
├─────┼─────┼─────┼─────┤
│  7  │  8  │  9  │  ÷  │
├─────┼─────┼─────┼─────┤
│  4  │  5  │  6  │  ×  │
├─────┼─────┼─────┼─────┤
│  1  │  2  │  3  │  -  │
├─────┼─────┼─────┼─────┤
│  0  │  .  │  C  │  +  │
└─────┴─────┴─────┴─────┘
          =   )
```

### Swipe Shortcuts (Global)
| Gesture | Operation | Description |
|---------|-----------|-------------|
| Swipe right | `+` | Addition |
| Swipe left | `-` | Subtraction |
| Swipe up | `×` | Multiplication |
| Swipe down | `÷` | Division |
| Circle (clockwise) | `=` | Calculate |
| Circle (counter-clockwise) | `C` | Clear |
| Long press | Undo | Undo last operation |
| Double tap | Redo | Redo last operation |
| Pinch out | `(` | Open parenthesis |
| Pinch in | `)` | Close parenthesis |

### Grid-Dependent Gestures
- **Swipe from number to number**: Build multi-digit numbers (e.g., 1→2→3 = 123)
- **Swipe from operator to number**: Apply operator to number
- **Swipe from number to operator**: Apply number to next operator
- **Hover then swipe**: Preview result prediction

### Trail Recognition Algorithm
1. **Capture touch points** at ~60fps (pointermove events)
2. **Apply smoothing** (Bézier curve or Catmull-Rom spline)
3. **Detect gesture** using:
   - Direction vectors (start → end)
   - Curvature analysis (circle detection)
   - Velocity thresholds (tap vs swipe)
4. **Map to operation** based on gesture + grid context
5. **Update expression** and render trail

---

## Design System: Apple-Like Dainty Aesthetic

### Color Palette
```css
--bg-primary: rgba(255, 255, 255, 0.8);
--bg-secondary: rgba(255, 255, 255, 0.6);
--bg-glass: rgba(255, 255, 255, 0.4);
--accent-blue: #007AFF;
--accent-pink: #FF2D55;
--accent-green: #34C759;
--text-primary: #1C1C1E;
--text-secondary: #8E8E93;
--trail-color: rgba(0, 122, 255, 0.6);
```

### Typography
- **Font**: SF Pro (system-ui fallback)
- **Display**: 48px/600 (expression), 64px/700 (result)
- **Buttons**: 28px/500
- **Labels**: 14px/400

### Visual Effects
- **Frosted Glass**: `backdrop-filter: blur(20px)`
- **Subtle Gradients**: `linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%)`
- **Rounded Corners**: 20px (buttons), 30px (panels)
- **Shadows**: `box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1)`
- **Transitions**: `transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)`

### Animation Specs
- **Trail draw**: 16ms per segment (60fps)
- **Button press**: Scale 0.95 → 1.0 over 150ms
- **Mode toggle**: Slide + fade 300ms
- **History panel**: Slide up 400ms

---

## Implementation Order

### Phase 1: Foundation (Week 1-2)
1. **Monorepo setup**
   - Initialize Turborepo
   - Configure workspaces (apps/web, apps/mobile, packages/core, packages/ui)
   - Set up shared TypeScript, ESLint, Prettier

2. **Core calculator logic** (packages/core)
   - Implement `evaluator.ts` (basic + scientific)
   - Implement `parser.ts` (expression string → AST)
   - Implement `history.ts` (stack-based history)

3. **Basic grid UI** (packages/ui)
   - Create `Button.tsx` component
   - Create `CalculatorGrid.tsx` component
   - Implement basic styling (Tailwind)

### Phase 2: Swipe Input (Week 3-4)
4. **Gesture recognition** (packages/core)
   - Implement `recognizer.ts` (touch point capture)
   - Implement `smoothing.ts` (Bézier curves)
   - Implement `mapping.ts` (gesture → operator)

5. **Swipe trail rendering** (packages/ui)
   - Web: `CanvasTrail.tsx` (Canvas API)
   - Mobile: `NativeTrail.tsx` (Reanimated + Gesture Handler)
   - Shared: `useSwipe.ts` hook (state management)

6. **Integration**
   - Connect swipe input to calculator logic
   - Display current expression
   - Implement calculation on release

### Phase 3: Web App (Week 5-6)
7. **Next.js setup** (apps/web)
   - Initialize Next.js 15 with App Router
   - Configure Tailwind CSS
   - Create root layout + page

8. **Web-specific features**
   - Pointer events (unified mouse/touch)
   - Keyboard input support
   - Responsive design (mobile-first → desktop)

### Phase 4: Mobile App (Week 7-8)
9. **Expo setup** (apps/mobile)
   - Initialize Expo Router
   - Configure React Native Paper + NativeWind
   - Set up iOS + Android build configs

10. **Mobile-specific features**
    - Haptic feedback (Expo Haptics)
    - Palm rejection (multi-touch analysis)
    - Gesture shortcuts (swipe right = +, etc.)

### Phase 5: Polish & Launch (Week 9-10)
11. **Enhanced features**
    - Result prediction (intermediate calculation)
    - History panel + reuse
    - Undo/redo
    - Dark mode

12. **Testing & QA**
    - Unit tests (Jest + React Testing Library)
    - E2E tests (Playwright for web, Detox for mobile)
    - Performance profiling (60fps target)

13. **Deployment**
    - Web: Deploy to Vercel
    - Mobile: Build for TestFlight + Play Store (beta)
    - Documentation (README, CONTRIBUTING)

---

## File Structure Summary

```
swype-calculator/
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── components/
│   │   │   └── lib/
│   │   ├── package.json
│   │   └── next.config.js
│   └── mobile/
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   ├── hooks/
│       │   └── utils/
│       ├── app.json
│       └── package.json
├── packages/
│   ├── core/
│   │   ├── src/
│   │   │   ├── calculator/
│   │   │   ├── gesture/
│   │   │   └── math/
│   │   └── index.ts
│   ├── ui/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── styles/
│   │   └── index.ts
│   └── config/
│       ├── package.json
│       └── tsconfig.json
├── package.json
├── turbo.json
└── PLAN.md
```

---

## Success Metrics

- **Performance**: 60fps swipe trail rendering on all devices
- **Accuracy**: 95% gesture recognition accuracy on first try
- **Engagement**: Avg. 5+ calculations per session
- **Reviews**: 4.5+ star rating on App Store/Play Store

---

## Next Steps

1. Run: `npx create-turbo@latest swype-calculator`
2. Initialize workspaces and configure shared packages
3. Start Phase 1: Core calculator logic

**Ready to build? Let's go! 🚀**
