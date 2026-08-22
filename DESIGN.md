---
name: Luminous Professional
colors:
  surface: "#f8f9ff"
  surface-dim: "#d0dbeb"
  surface-bright: "#f8f9ff"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#eef4ff"
  surface-container: "#e4efff"
  surface-container-high: "#dee9fa"
  surface-container-highest: "#d8e3f4"
  on-surface: "#121c28"
  on-surface-variant: "#59413b"
  inverse-surface: "#27313e"
  inverse-on-surface: "#e9f1ff"
  outline: "#8d7169"
  outline-variant: "#e1bfb6"
  surface-tint: "#ad3309"
  primary: "#a93107"
  on-primary: "#ffffff"
  primary-container: "#cb4920"
  on-primary-container: "#fffbff"
  inverse-primary: "#ffb5a0"
  secondary: "#475f87"
  on-secondary: "#ffffff"
  secondary-container: "#b7d0fe"
  on-secondary-container: "#405880"
  tertiary: "#595c5f"
  on-tertiary: "#ffffff"
  tertiary-container: "#727578"
  on-tertiary-container: "#fbfcff"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  primary-fixed: "#ffdbd1"
  primary-fixed-dim: "#ffb5a0"
  on-primary-fixed: "#3b0a00"
  on-primary-fixed-variant: "#862200"
  secondary-fixed: "#d6e3ff"
  secondary-fixed-dim: "#afc7f5"
  on-secondary-fixed: "#001b3d"
  on-secondary-fixed-variant: "#2f476e"
  tertiary-fixed: "#e0e3e6"
  tertiary-fixed-dim: "#c4c7ca"
  on-tertiary-fixed: "#191c1e"
  on-tertiary-fixed-variant: "#44474a"
  background: "#f8f9ff"
  on-background: "#121c28"
  surface-variant: "#d8e3f4"
typography:
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 40px
    fontWeight: "600"
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: "600"
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: "600"
    lineHeight: 32px
  title-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: "500"
    lineHeight: 28px
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  body-sm:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 20px
  label-md:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: "600"
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-padding: 32px
  gutter: 24px
  card-gap: 20px
  margin-mobile: 16px
  max-width: 1440px
---

## Brand & Style

The design system embodies a "Productive Clarity" aesthetic—a sophisticated blend of **Corporate Modern** and **Soft Minimalism**. It targets professional environments that require high information density without the associated cognitive load.

The personality is reliable, precise, and subtly energetic. By utilizing a muted, cool-toned base paired with a high-energy "Safety Orange," the UI directs attention with surgical precision. The visual style features large radii, subtle depth via tonal layering, and an expansive use of negative space to create a "breathing" interface that feels premium and approachable.

## Colors

The palette is anchored by a deep **Cool Grey-Blue** (`#9CA7BA`) used for the application backdrop, which provides a calm, stable foundation. The primary canvas where work happens is a crisp, off-white (`#F5F7FA`) to maintain high contrast for legibility.

- **Primary (Vibrant Orange):** Reserved strictly for calls to action, active states, and critical data points. It is the "heat map" of the UI.
- **Secondary (Steel Blue):** Used for interactive secondary elements, navigation icons, and subtle accents.
- **Neutrals:** A scale of desaturated blues and greys. Text should primarily use a near-black for headlines and a medium-grey for metadata to establish a clear hierarchy.

## Typography

This design system utilizes **Hanken Grotesk** across all roles to ensure a unified, contemporary feel. The typeface’s geometry is clean enough for data-heavy tables but maintains enough character for large display headings.

- **Headlines:** Use tight letter-spacing and semi-bold weights to create a strong visual anchor.
- **Body:** Standard weights with generous line-heights ensure long-form content remains readable.
- **Labels:** Small, all-caps labels with increased tracking are used for "eyebrow" text and table headers to differentiate from interactive body text.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for desktop (centered max-width of 1440px) and transitions to a **Fluid Grid** for mobile devices.

- **The 8px Rule:** All dimensions, padding, and margins must be multiples of 8px to maintain a rhythmic vertical cadence.
- **White Space:** Use generous 32px internal padding for containers to evoke a premium, "uncluttered" feeling.
- **Reflow:** On tablet, the multi-column dashboard should collapse into a single primary column with a secondary sidebar below. On mobile, all cards stack vertically with reduced 16px margins.

## Elevation & Depth

Depth is created through **Tonal Layering** and **Soft Ambient Shadows** rather than harsh borders.

- **Level 0 (Background):** The cool grey-blue base.
- **Level 1 (Canvas):** The primary white surface, which uses a 24px corner radius and no shadow.
- **Level 2 (Floating Cards):** Elements that require focus (like an "Income Tracker" widget) use a very soft, diffused shadow (`0px 4px 20px rgba(0,0,0,0.04)`) to appear slightly lifted.
- **Overlays:** Modals and tooltips use a backdrop blur (12px) to maintain context while isolating the user task.

## Shapes

The shape language is dominated by **Rounded** geometry. This softens the "corporate" nature of the product and makes the interface feel more modern and tactile.

- **Base Radius:** 8px for small components like inputs and buttons.
- **Large Radius:** 24px-32px for main content containers and dashboard widgets.
- **Pill Shapes:** Reserved exclusively for status chips (e.g., "Paid", "Remote") and search bars.

## Components

- **Buttons:** Primary buttons use the Vibrant Orange background with white text. Secondary buttons are ghost-style with a Steel Blue outline.
- **Cards:** Dashboard cards should have a white background, 24px rounded corners, and a subtle inner border (1px solid #EDF0F3).
- **Input Fields:** Search bars and text inputs should be pill-shaped with a light grey fill (`#F0F2F5`) and no border until focused. On focus, use a 2px Steel Blue stroke.
- **Chips/Badges:** Small, pill-shaped tags with low-saturation backgrounds (e.g., a very light blue for "Remote" or a light green for "Paid") and dark text.
- **Progress Bars:** Use a series of vertical ticks for progress visualization, utilizing the primary orange for the "current" or "completed" state and neutral grey for the "remaining" state.
- **Lists:** Clean rows with 1px dividers. Use 48px circular avatars for user profiles to contrast against the square-heavy layout.
