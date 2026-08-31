---
name: Trailmark Visual Identity
colors:
  surface: '#fbf8fb'
  surface-dim: '#dcd9dc'
  surface-bright: '#fbf8fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f5'
  surface-container: '#f0edf0'
  surface-container-high: '#eae7ea'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#45464d'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#76777e'
  outline-variant: '#c6c6ce'
  surface-tint: '#535e7a'
  primary: '#010a22'
  on-primary: '#ffffff'
  primary-container: '#16213a'
  on-primary-container: '#7e88a7'
  inverse-primary: '#bbc6e7'
  secondary: '#1a6a5b'
  on-secondary: '#ffffff'
  secondary-container: '#a7f1de'
  on-secondary-container: '#237061'
  tertiary: '#110a00'
  on-tertiary: '#ffffff'
  tertiary-container: '#2e1f00'
  on-tertiary-container: '#ac8225'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d9e2ff'
  primary-fixed-dim: '#bbc6e7'
  on-primary-fixed: '#101b34'
  on-primary-fixed-variant: '#3c4661'
  secondary-fixed: '#a7f1de'
  secondary-fixed-dim: '#8bd4c3'
  on-secondary-fixed: '#00201a'
  on-secondary-fixed-variant: '#005144'
  tertiary-fixed: '#ffdea4'
  tertiary-fixed-dim: '#f0bf5c'
  on-tertiary-fixed: '#261900'
  on-tertiary-fixed-variant: '#5d4200'
  background: '#fbf8fb'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
typography:
  display-lg:
    fontFamily: sourceSerif4
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: sourceSerif4
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: sourceSerif4
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: sourceSerif4
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  headline-lg-mobile:
    fontFamily: sourceSerif4
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max-width: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  trail-width: 4px
---

## Brand & Style

The design system is rooted in the "Ink & Canvas" philosophy—a marriage between the tactile permanence of traditional scholarship and the fluid precision of modern AI. It aims to evoke the feeling of an academic journal reimagined for the digital age: professional, focused, and deeply intentional.

### Personality
The UI is characterized by a "Safe" and institutional aesthetic. It avoids the neon-heavy, high-gloss trends of modern SaaS in favor of a grounded, editorial feel. The emotional response should be one of quiet confidence, scholarly focus, and clarity.

### Design Movement: Modern Academic
The style blends **Minimalism** with **Tactile/Skeuomorphic** nuances. While the interface is clean and whitespace-heavy, it utilizes subtle paper-like textures and "ink-on-paper" contrast ratios to reduce eye strain during deep study sessions. The "Learning Trail" concept is the central metaphor, using thin, purposeful lines and organic connections to visualize educational progress.

## Colors

The palette is derived from classic archival materials.

- **Ink (Primary):** `#16213A` is used for high-level navigation, sidebars, and primary headings. It provides a heavy, authoritative anchor to the experience.
- **Canvas (Background):** `#F3F4EE` replaces standard white for the main viewport, providing a warm, low-glare surface that feels like premium stationery.
- **Trail Accent (Action):** `#2F7A6B` is reserved for progress indicators, primary CTAs, and active "trail" paths. It signifies growth and movement.
- **Highlights (Achievement):** `#C89B3C` is used sparingly for badges, certification milestones, and gamified "Aha!" moments for motivation-dependent learners.
- **Surfaces:** Pure `#FFFFFF` is used strictly for cards and elevated components to separate active content from the canvas.

## Typography

This design system uses a high-contrast typographic pairing to distinguish between "Content" and "Interface."

- **The Voice (Headlines):** `Source Serif 4` provides an authoritative, scholarly tone. Its slightly taller x-height ensures readability while maintaining a classic editorial character.
- **The Utility (Body/Labels):** `Inter` is used for all functional text, data displays, and interactive labels. It provides a neutral, efficient counterpoint to the serif headings.

**Scale & Rhythm:**
Use large display sizes for chapter titles and trail milestones. Labels should use increased letter-spacing and uppercase styling when used as section headers or metadata indicators to maintain a disciplined, organized feel.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** approach for content readability, centered on the "Canvas" background.

### The Learning Trail Layout
The central interface feature is a vertical or horizontal spine (4px width) that connects content nodes.
- **Desktop:** A 12-column grid. The "Learning Trail" typically occupies a 2-column offset or remains centered to allow for deep-focus reading.
- **Sidebars:** Fixed at 280px, using the "Ink" (`#16213A`) background to separate navigation from the learning area.
- **Mobile:** Reflows to a single column with a 16px margin. The trail moves to the left edge to maximize space for text cards.

**Spacing Rhythm:**
Utilize an 8px base unit. Component internal padding should be generous (24px or 32px) to reinforce the "uncluttered" educational atmosphere.

## Elevation & Depth

This design system avoids heavy shadows and floating effects, favoring **Tonal Layers** and **Low-Contrast Outlines**.

- **Level 0 (Canvas):** `#F3F4EE`. The base layer where all learning happens.
- **Level 1 (Cards/Surfaces):** `#FFFFFF`. Used for instructional units and assessment cards. These feature a 1px border in a darkened version of the canvas color (`#E2E3D9`) instead of a shadow.
- **Level 2 (Interactive/Hover):** A very soft, diffused ambient shadow (8% opacity, 12px blur, no offset) is applied only when a user interacts with a trail node or card.
- **Level 3 (Overlays/Modals):** High-contrast "Ink" borders (2px) are used for modals to create a "pinned to the page" aesthetic.

## Shapes

The shape language is conservative and disciplined. A **Soft (0.25rem)** roundedness is applied to standard components to prevent the UI from feeling sharp or aggressive, while maintaining the structured feel of a printed book.

- **Standard Buttons/Inputs:** 4px (0.25rem) radius.
- **Trail Nodes (Milestones):** Circular (pill-shaped) to represent "stops" on a journey.
- **Progress Bars:** Fully rounded (pill) to denote fluid movement.
- **Assessment Cards:** 8px (0.5rem) radius to create a distinct container feel against the canvas.

## Components

### The Learning Trail (Signature Component)
A vertical or horizontal line in `Trail Accent`. Completed nodes are filled solid; current nodes have an animated "pulse" outer ring; future nodes are outlined.

### Conversational Interface
Chat bubbles do not use high-contrast colors. The AI's responses appear on a very light tint of the `Trail Accent` color, while the user's input appears in a simple outlined box. The focus is on typography, not the container.

### Adaptive Assessment Cards
These cards change border weight based on the learner persona:
- **Digger Mode:** Cards expand to show "Further Reading" and "Citations" in `body-sm`.
- **Surface Mode:** Cards collapse into bulleted summaries.
- **Motivation Mode:** Cards feature a `Muted Gold` top-border when a question is answered correctly.

### Buttons & Inputs
- **Primary Action:** Solid `Trail Accent` with white `Inter` text.
- **Secondary/Ghost:** Outlined with `Ink` primary color.
- **Inputs:** Minimalist bottom-border only or very light 1px grey border, evocative of a lined notebook.

### Progress Dashboard
Uses a combination of `Muted Gold` for achievements and `Trail Accent` for time-based progress. Data visualization should use clean lines and avoid heavy fills or gradients.