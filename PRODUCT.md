# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Individuals who want one place to track food intake, exercise, and macro/calorie
goals: logging meals by time of day, searching exercises, calculating BMI and
macro targets, and sharing progress socially. Secondarily, this build is also
evaluated directly by hiring managers/recruiters as a portfolio piece, so a
person opening the live app cold and judging craft is a real audience for this
redesign, not just the tracked-fitness end user.

## Product Purpose

A personalised fitness assistant: log food consumption hour-by-hour, log
exercises, calculate BMI/macro/calorie targets against a goal (lose / maintain
/ gain / gain muscle), and share progress socially (image posts, likes,
comments). Originally an Aston University final year project; now being
elevated specifically as a portfolio piece.

## Positioning

No unique competitive mechanism was confirmed — the app combines food logging,
a macro/BMI calculator, exercise search, and a social feed in one place. For
this pass the differentiator is craft and cohesion across the whole product,
not a distinct feature claim.

## Operating Context

Browser-based, desktop and mobile. Core loop: sign in → land on home → search
foods and log them at specific hours of the day, or branch to the macro
calculator, exercise search, profile editing, or the social posts feed. Auth is
email/password with a JWT persisted in localStorage. Backend is Express +
MySQL with routes for exercises, food, food logs, posts (image upload via
multer), and user profile.

## Capabilities and Constraints

- Auth: email/password sign in and sign up, client-side validation, JWT in
  localStorage.
- Food logging: per-day, per-hour entries via a food search backed by the
  server's food data controller.
- Macro/BMI calculator: BMI, calorie need (Mifflin-St Jeor), and macro grams by
  goal; renders a live Chart.js pie chart.
- Exercise search: queries exercises by name against the server, renders
  results as cards (MUI-based).
- Posts/social feed: real image upload + description, like/unlike, threaded
  comments — a fully working feature, not a mock.
- Nutrition tips: currently static hard-coded copy, no CMS/API behind it —
  treat as fixed content, do not fabricate additional claims or sources.
- Profile: name, email, birthday, gender, height, weight, BMI, activity level,
  persisted server-side.
- Web only; must work across common desktop and mobile browsers.

## Brand Commitments

- Existing name: "Personalised Fitness Assistant" (page title, footer
  copyright).
- Existing logo: a red-to-orange gradient circular runner mark
  (`client/src/assets/logo.png`).
- Nothing here is locked: the user is explicitly open to revisiting the logo,
  palette, and type choices (including the warm orange/red system already
  built for the landing page) as part of this redesign.

## Evidence on Hand

- Real photo assets for hero/news/macro sections (`client/src/assets/*`) — all
  warm, golden-hour toned.
- Nutrition tips copy is placeholder text, not sourced from a real nutrition
  body — do not extend with invented citations.
- News section headlines are illustrative placeholder editorial copy, not live
  news content.
- No formal brand guideline or additional logo lockups exist beyond the single
  PNG.

## Product Principles

1. One deliberate system across every page — not pages built at different
   times with different conventions.
2. Portfolio-first craft: a hiring manager may open this cold, so first-touch
   surfaces (login, home) and the demonstrable core loop (food log, macro
   calculator, exercises) earn the most attention.
3. Preserve real functionality and data flows — this redesign changes look and
   interaction quality, not what the product does.
4. Identity (logo, palette, type) is open for reconsideration; nothing shipped
   so far is a binding constraint.

## Accessibility & Inclusion

No specific compliance standard was confirmed as required; general contrast,
focus, and keyboard-navigation quality applies as craft floor, not a stated
target.
