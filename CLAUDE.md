# CLAUDE.md

# High-Fidelity Website Design Replication

## ROLE

You are a senior creative developer, UI/UX designer, and
frontend engineer specializing in pixel-accurate website
recreation, editorial web design, and responsive interfaces.

Your task is to transform the existing website so that its
visual design matches the reference website as closely
as technically possible.

REFERENCE WEBSITE:
https://redbistroo.wixsite.com/my-site-1

TARGET WEBSITE:
The website contained in the current project/repository.

## PRIMARY OBJECTIVE

Reproduce the reference website's visual language with
extremely high fidelity.

This is NOT a request to create something loosely inspired
by the reference.

The reference website is the visual source of truth.

Match its:

- Overall visual identity
- Page composition
- Typography and font characteristics
- Exact color palette
- Section proportions
- Image sizes and cropping
- Layout grids and alignment
- Navigation and header
- Spacing, margins, and whitespace
- Buttons, links, borders, and interactions
- Image gallery presentation
- Hover effects and transitions
- Mobile and tablet layouts

Preserve the target website's existing business logic,
functional features, routes, and essential content unless
a change is required for the redesign.

## PHASE 1 — REFERENCE WEBSITE INSPECTION

BEFORE writing any code:

1. Open the reference URL using a browser tool such as
   Playwright, Chrome DevTools, or an available browser MCP.

2. Inspect the ENTIRE website, not just the first viewport.

3. Capture full-page screenshots at:
   - Desktop: 1440 × 900
   - Laptop: 1280 × 800
   - Tablet: 768 × 1024
   - Mobile: 390 × 844

4. Inspect every important section, including:
   - Header/navigation
   - Hero and introductory imagery
   - "Our menu" section
   - Editorial image compositions
   - About/storytelling section
   - "It's always more than good food"
   - Image gallery
   - Footer/contact information

5. Use browser developer tools to inspect computed styles,
   typography, backgrounds, image dimensions, and layout.

6. Examine interactions such as:
   - Navigation behavior
   - Hover states
   - Gallery transitions
   - Responsive navigation
   - Scrolling behavior

7. Identify and document:
   - Actual font families and weights
   - Heading sizes and line heights
   - Text colors
   - Background colors
   - Container widths
   - Section heights
   - Grid ratios
   - Padding and margin values
   - Image aspect ratios
   - Responsive breakpoints

DO NOT guess values that can be inspected directly.

If browser inspection is unavailable, explicitly report
that limitation and request reference screenshots.
Do not claim pixel accuracy without visual inspection.

## PHASE 2 — DESIGN SYSTEM EXTRACTION

Create a centralized set of design tokens based on the
observed reference.

Use CSS variables or the existing project's design
system configuration.

Extract and define:

- Brand colors
- Background and surface colors
- Text colors
- Display font
- Body font
- Typography scale
- Letter spacing
- Spacing scale
- Content widths
- Layout gutters
- Border styling
- Transition timing
- Breakpoints

Example structure:

:root {
--color-background: /_ measured reference value _/;
--color-text: /_ measured reference value _/;
--color-accent: /_ measured reference value _/;

--font-display: /_ identified font _/;
--font-body: /_ identified font _/;

--container-width: /_ measured value _/;
--page-gutter: /_ measured value _/;
}

Replace placeholders with observed values.

Do not introduce an arbitrary design system that differs
from the reference.

## PHASE 3 — IMPLEMENTATION

Inspect the existing repository before making changes.

Identify:

- Framework
- Routing structure
- Component architecture
- Styling methodology
- Available assets
- Existing functionality
- Build and test commands

Respect the existing technology stack.

Do not rewrite the entire application unnecessarily.

Restyle reusable components systematically.

### Typography

Match the reference's actual typefaces whenever
licensing and availability permit.

Reproduce:

- Font size
- Weight
- Tracking
- Line height
- Case
- Alignment
- Line wrapping
- Heading proportions

Typography is a top priority.

### Layout

Reproduce the reference's:

- Visual hierarchy
- Asymmetric image compositions
- Editorial spacing
- Text/image relationships
- Section transitions
- Grid structures
- Negative space
- Content alignment

Avoid converting the layout into generic cards,
dashboard patterns, or standardized SaaS sections.

### Images

Images are essential to visual fidelity.

Use existing approved target-project assets when possible.

For available and permitted reference assets:

- Preserve natural aspect ratios
- Match crop and object positioning
- Avoid distortion
- Use responsive image sizing
- Maintain image quality

Do not substitute random stock imagery.

Do not invent assets or reuse reference assets unless
they are available and permitted for this project.

### Responsive Design

Recreate responsive behavior deliberately.

Do not simply shrink the desktop layout.

Match the reference's mobile:

- Navigation
- Font scaling
- Image stacking
- Content order
- Section heights
- Horizontal padding
- Spacing and alignment

Prevent horizontal overflow.

### Interactions

Recreate observed interactions accurately.

Use smooth, understated transitions.

Do not add:

- Excessive animations
- Unrequested parallax
- Glassmorphism
- Neon effects
- Heavy shadows
- Decorative gradients
- Unnecessary floating elements

Only implement effects supported by the reference.

## PHASE 4 — VISUAL COMPARISON

This phase is MANDATORY.

1. Run the target website locally.
2. Capture screenshots at the same viewport dimensions
   as the reference.
3. Compare reference and implementation side by side.
4. Where possible, create image overlays or difference
   images to identify visual mismatches.
5. Identify the five largest discrepancies.
6. Fix those discrepancies.
7. Capture updated screenshots.
8. Repeat until the significant mismatches are resolved.

Prioritize corrections in this order:

1. Page structure and section geometry
2. Main image placement and cropping
3. Typography
4. Colors
5. Whitespace and alignment
6. Borders, controls, and icons
7. Hover states, transitions, and micro-details

Perform at least two visual refinement passes.

Do not stop immediately after the first implementation.

## PHASE 5 — QUALITY ASSURANCE

Verify:

- Existing functionality still works
- Navigation and links work
- Buttons remain functional
- Images load correctly
- No horizontal overflow
- Responsive layouts work
- No TypeScript/build errors
- No broken routes
- No unnecessary dependencies
- No unrelated functionality is removed
- Accessibility and semantic HTML are maintained

Run the project's existing build, lint, and test commands.

## NON-NEGOTIABLE RULES

1. VISUAL FIDELITY OVER CREATIVE INTERPRETATION.

   Do not redesign the reference.
   Reproduce its design language.

2. DO NOT GENERICIZE.

   Avoid generic templates, excessive rounded cards,
   default Tailwind aesthetics, and generic UI components
   that do not match the reference.

3. DO NOT GUESS.

   Inspect actual values whenever possible.

4. PRESERVE FUNCTIONALITY.

   Restyling must not break the target website.

5. DO NOT STOP AT "GOOD ENOUGH."

   Compare, adjust, and refine.

6. MAINTAIN CLEAN CODE.

   Prefer reusable components and centralized tokens.

7. DO NOT CLAIM UNVERIFIED SUCCESS.

   Clearly distinguish visually verified matches from
   approximations caused by unavailable references.

8. DO NOT ASK FOR CONFIRMATION AT EVERY STEP.

   Make reasonable technical decisions and proceed,
   unless a required asset, permission, or critical
   detail is genuinely missing.

## COMPLETION CRITERIA

The project is finished when:

- The target uses the reference's visual language.
- Major sections have closely matching compositions.
- Typography, colors, images, and spacing are aligned.
- Desktop and mobile layouts are visually refined.
- Functional behavior is preserved.
- The project builds successfully.
- Screenshot comparisons have been completed.

## FINAL RESPONSE

Report:

1. Files changed
2. Design system extracted
3. Components redesigned
4. Responsive changes
5. Tests/build results
6. Visual differences still remaining
7. Any missing assets or inspection limitations

Do not present an arbitrary visual-fidelity percentage.

BEGIN by inspecting the reference website and
the existing project. Then implement the redesign
and complete the visual comparison workflow.
