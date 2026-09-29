---
name: Personalised Fitness Assistant
description: A personal training ledger for food, exercise, and the numbers they add up to.
colors:
  ink: "#161a22"
  ink-soft: "#565a52"
  paper: "#f2f1ec"
  paper-line: "#dedbd1"
  paper-card: "#fbfaf6"
  logged: "#2f5d42"
  logged-soft: "#e3ece6"
  flag: "#b3261e"
  flag-soft: "#f8e6e4"
  gold: "#a8791f"
  gold-soft: "#f3e9d3"
typography:
  body:
    fontFamily: "IBM Plex Sans, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontWeight: 400
  heading:
    fontFamily: "IBM Plex Sans, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontWeight: 700
    letterSpacing: "-0.01em"
rounded:
  sm: "4px"
  md: "8px"
spacing:
  row: "10px 2px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.sm}"
    padding: "0.85rem 1.4rem"
  button-primary-hover:
    backgroundColor: "{colors.logged}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    padding: "0.85rem 1.4rem"
---

# Design System: The Training Log

## Overview

**Creative North Star: "The Training Log"**

This is a personal training ledger, not a fitness-app dashboard. The product's
real mechanism — connecting food, exercise, and body metrics into one
accountable daily record — is rendered as ruled rows, dated section tabs, and
a small persistent coded legend, the way a gym logbook or lab result sheet
works: values live in a fixed structure the reader already trusts, and color
carries meaning rather than decoration.

The system deliberately refuses the category default for this kind of app
(a hero photo of an athletic body, rounded stat cards, progress rings) in
favor of restraint: a cool paper ground, ink-navy structure, and exactly two
semantic colors — forest green for a logged/confirmed state, and red
reserved *only* for something flagged or over target. Nothing else is
red. Photography that stands in for editorial content ("Clippings", the
macro-section imagery) is desaturated to sit inside the ink-and-paper
material world; genuine user-submitted content (the community Posts feed)
stays in full color, because it is real, not decorative.

**Key Characteristics:**
- Ruled ledger rows as the base list primitive, everywhere a list of entries appears.
- A coded legend that decodes every symbol/color once per surface, rather than relying on memorized color meaning.
- Flat by default — borders and rules carry structure, not shadows.
- One typeface family for everything; hierarchy comes from weight and scale, not a second display face.
- Red is a flag, never a brand color.

## Colors

A restrained, mostly-achromatic palette — ink on paper — with two colors that
carry state, not brand identity.

### Primary
- **Ink** (`#161a22`): all structural text, borders, active button fills, and the navbar/footer. This is the system's only "loud" color, and it's a near-black, not a brand hue.

### Secondary
- **Logged Green** (`#2f5d42`): the confirmed/logged/within-target state. Used for totals within goal, the "Sign In" button hover, and the carbs slice of the macro chart. Never used decoratively.
- **Flag Red** (`#b3261e`): reserved *only* for something wrong or over target — form/network errors, an over-target ledger total. **The Red-Pen Rule.** If a use of red isn't marking something the user needs to act on, it's the wrong color.
- **Gold** (`#a8791f`): the fats slice of the macro chart and rare milestone accents. Used sparingly, never as a primary action color.

### Neutral
- **Ink-Soft** (`#565a52`): secondary text, timestamps, placeholder-weight labels — tinted from the ink hue, never a flat gray.
- **Paper** (`#f2f1ec`): the page ground. Deliberately a cool paper-gray, not the warm cream a "warm subject" would default to.
- **Paper Line** (`#dedbd1`): hairline dividers between ledger rows.
- **Paper Card** (`#fbfaf6`): the surface color for cards, form panels, and dropdowns — barely lighter than Paper, just enough to read as a distinct plane.

## Typography

**Body & Display Font:** IBM Plex Sans (with Helvetica Neue, Helvetica, Arial, sans-serif fallback)

**Character:** One workhorse grotesk carries the whole system — headings are the same face at heavier weight and larger scale, never a second "display" face. This is a deliberate Operate-mode choice: the product is used to complete tasks (logging, calculating), so typographic energy goes into legibility and tabular alignment, not personality.

### Hierarchy
- **Display** (700, `clamp(2.5rem, 5vw, 3.75rem)`, line-height 0.98): the cover-page headline only ("Eat. Train. Keep the record.").
- **Headline** (700, `clamp(1.9rem, 3.5vw, 2.5rem)`): section titles ("Clippings", "Today", page `<h1>`s).
- **Title** (700, 1.25–2rem): card and panel headings (Macro Calculator, Results).
- **Body** (400, 0.85–1rem): all paragraph and label text.
- **Numerals** (`.num` / `.tabular`): tabular-figure numerals (`font-variant-numeric: tabular-nums`) on every measurement — calories, macros, dates, times — so figures actually align in a column like a real ledger.

### Named Rules
**The One Face Rule.** Every weight and size on the page comes from IBM Plex Sans. A second typeface is a costume the system doesn't wear.

## Layout

Pages are centered, single-column content (max-width 480–1180px depending on surface) rather than full-bleed dashboard grids. The core list primitive — the ledger row — reads top-to-bottom with a rule above the first row and a heavier double rule at the running total. Section chrome (navbar, footer) spans full width; content does not.

**Responsive:** the navbar collapses its tab links behind the burger menu at 800px; the landing cover page drops from a two-column grid to single-column at 860px. Ledger rows reflow their inline content but keep the fixed-width time/hour column.

## Elevation & Depth

**The Flat-By-Default Rule.** Surfaces are flat: structure comes from a 1px ink border or a rule, not a shadow. The only shadows in the system are on floating overlays that must visually separate from the page underneath them (the search-results dropdown, the account dropdown, the mobile sidebar scrim) — depth is functional (this thing is above that thing), never decorative.

## Shapes

Corners are small and consistent: 4px (`--radius-sm`) on inputs, buttons, and small chips; 8px (`--radius-md`) on cards and panels. Nothing uses a fully-rounded pill except the shared `.btn` component, which is deliberately soft against the otherwise square-cornered ledger world — the interactive/actionable layer reads distinct from the informational layer. No asymmetric or "blob" radii anywhere.

## Components

### Buttons
- **Shape:** fully rounded (999px via `border-radius` on `.btn`), 1.5px ink border.
- **Primary** (`.btn-primary`): ink fill, paper text. Hover/focus shifts fill to Logged Green.
- **Secondary** (`.btn-secondary`): transparent fill, ink border and text. Hover/focus fills ink.
- Both lift 2px on hover and settle 1px on active press.

### Ledger Row
The system's signature component, used for the food log's hourly entries, the cover page's sample day, and any other running list. A flex row with a fixed-width leading time/label column, flexible description, and a right-aligned tabular-numeral value; a `.ledger-total` row closes the list with a heavier top rule and bold weight. `.is-flagged` adds a 2px Flag-Red left border for an over-target row.

### Day Balance
The food log's daily statement: three figures (Eaten / Daily target / Remaining or Over target) on a Paper Card panel, a flat 8px calorie meter (ink fill, Flag Red once over target), and a macro split bar with a coded legend (protein = Ink, carbs = Logged Green, fat = Gold — the same mapping as the macro calculator chart). Remaining is Logged Green; Over target is Flag Red.

### Meal Section
Food log entries grouped by time of day (Breakfast until 11 AM, Lunch 11–3, Snacks 3–6, Dinner after 6). A heading row with the meal's hour range, its kcal subtotal and an outlined "Add food" button (which rotates its plus into a close mark when open), over an ink rule and ledger rows. Each row keeps the exact time in the leading column. Adding happens inline in a Paper Card panel under the meal — never a modal.

### Measurement Inputs
Numeric fields show their unit (cm, kg, g) inside the right edge of the input, with a hint line below giving the unit in words and an example. Out-of-range values show the hint in Flag Red with a red input border.

### BMI Scale
A read-only BMI reading (value + WHO band name) with a flat banded track (15–40), band ticks and an ink marker. Band names are neutral text: BMI is information, not an error, so no band is colored red or green.

### Index Row
The "table of contents" pattern used on the Today page: a full-width row linking into a section, with a bold title, a muted one-line sub-description, and a trailing arrow. Hover fills with Paper Card.

### Tab Navigation
Text links with a 2px bottom border that fills on hover/active — used for the navbar's Home/Workouts links and the login page's Sign In / Create Account tabs. No pill or background-fill hover state; the underline is the only affordance.

### Cards / Containers
- **Corner Style:** 8px (`--radius-md`).
- **Background:** Paper Card, on the Paper page ground.
- **Border:** 1px ink, always — this system does not use shadow-only cards.

### Inputs / Fields
- **Style:** Paper background, 1px ink border, 4px radius.
- **Focus:** 2px ink outline, 1–2px offset (no glow/color-shift).
- **Error:** the containing form shows a Flag-Red toast (`.error-message`) rather than a red input border.

### Navigation
A masthead layout: tab links left, the logo mark + "PERSONALISED FITNESS ASSISTANT" wordmark centered, account/burger right, on a sticky Paper bar with a 1px ink bottom border. The logo mark is grayscale-filtered (it ships as a full-color gradient PNG; until it's redrawn as a proper ink mark, it's desaturated to sit inside the system rather than clashing with it).

## Do's and Don'ts

### Do:
- **Do** use tabular numerals (`.num`) on every measurement so figures align in columns.
- **Do** keep Flag Red exclusive to something the user needs to act on.
- **Do** use the ledger-row pattern for any new list of entries, rather than a card grid.
- **Do** grayscale/desaturate stock or decorative photography so it sits inside the ink-and-paper world.

### Don't:
- **Don't** introduce a second display typeface. Hierarchy comes from weight and scale within IBM Plex Sans.
- **Don't** use Flag Red, Logged Green, or Gold decoratively — each is a state, not a brand accent.
- **Don't** add drop shadows to cards or panels; use a 1px ink border instead.
- **Don't** desaturate genuine user-submitted content (the Posts feed) — that's real content, not editorial decoration.
- **Don't** use a rounded/pill shape outside the `.btn` component; the informational layer (rows, cards) stays square-cornered.
