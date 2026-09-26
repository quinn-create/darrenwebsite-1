# Darren Drake website brand guidelines

Five alternative design systems for Codex and Claude Code

September 24, 2026

## Purpose and recommendation

Create five alternative identities for the same Darren Drake law-firm website. The primary conversion is a successfully delivered intake inquiry. Chambers is the recommended starting direction because its restrained composition supports a personal, premium professional impression. This is a design judgment, not evidence that it will convert better. Signal is the boldest option. Build one chosen direction at a time; do not combine all five into one page.

## Firm facts and editorial scope

The public site identifies Darren Drake and emphasizes criminal defense, DUI/DWI, and expungement in the Murfreesboro and Middle Tennessee context. Its biography includes Navy service and community involvement. These are content anchors from the firm site, not independent verification. Preserve the full professional name; do not substitute Quinn Rodriguez or Murfreesboro Legal Group. Reconfirm the legal entity name, contact details, practice scope, current credentials, and any biography statements before launch. [R1–R2]

## A shared site structure

Use Home, Practice Areas, About Darren, and Contact in the main navigation, with one prominent intake CTA. Plan separate Criminal Defense, DUI/DWI, and Expungement pages, plus an intake page and privacy page. Retain useful existing content and map existing URLs before changing routes. The hero must name the attorney, communicate the practice focus, and show the intake action. Keep the phone as a secondary route. Avoid adding unverified services, locations, case results, reviews, awards, or response-time promises. The three-step contact process is: send a brief inquiry; the office reviews it; discuss next steps if the firm can assist. Do not imply automatic acceptance of the matter.

## Brand voice and imagery

Write directly to a person who may be worried or short on time. Use short sentences and concrete next steps. Keep the attorney recognizable through genuine, authorized portraits. Architectural images are supporting context, not proof of court affiliation. Suggested headlines in the five directions are proposed copy for review. Do not turn biography facts into sweeping performance claims. Use one icon family with consistent stroke weight; icons supplement written labels.

## Shared layout and component rules

Use a 12-column desktop grid, an 8-column tablet grid, and a single reading column on phones. Use 20–24 px mobile gutters, 24–32 px desktop grid gaps, and a 4/8/12/16/24/32/48/64/96 px spacing scale. Body text must be at least 17 px; form controls at least 16 px. Primary buttons are at least 52 px tall. Keep paragraphs near 60–70 characters wide. Establish semantic color variables before composing sections, then map imported components to those variables.

## Accessibility and motion

Target WCAG 2.2 AA and test the finished site. Use normal-text contrast of at least 4.5:1; check controls and focus indicators separately. Use at least 44×44 px interaction targets as this project’s design rule. Support keyboard navigation, visible focus, sensible heading order, zoom, and reflow. Animation must never hide or delay essential text. Honor reduced-motion preferences and remove parallax, spatial entrances, and animated decorative backgrounds when requested. No scroll hijacking. [R10–R13]

## Performance and rendering

Target real-user LCP ≤2.5 s, INP ≤200 ms, and CLS ≤0.1 at the 75th percentile; laboratory checks are a launch proxy, not proof of field results. [R14] Use responsive AVIF/WebP images with explicit dimensions. Keep the hero image eager and appropriately prioritized, lazy-load lower images, and load only the necessary font weights. Avoid autoplay video and WebGL. Project budgets: initial mobile transfer around 1 MB or less and initial compressed JavaScript around 200 KB or less where the stack permits. Measure and explain exceptions rather than claiming a guaranteed score.

## Technology and reference use

Inspect the existing repository before choosing a stack. The public site indicates WordPress, but this package does not authorize an automatic migration. If the project is React, use the existing framework with TypeScript where already supported; Tailwind and shadcn components are suitable candidates. For WordPress, translate the selected design into the existing theme or block system. Do not paste React source into PHP templates. Component-library versions, licenses, paid access, and dependencies must be checked at implementation time. Never install every cited library. [R1, R3–R10]

# Intake specification

## The same form across all five designs

Use the same fields and routing for every visual direction so design comparisons remain meaningful. The default is a short single-page form. If a two-step version is selected, step one captures the matter type and step two captures contact details; show named progress and preserve values when moving back. Do not claim one or two steps will perform better without measurement.

## Fields and required choices

Require full name, matter type, preferred contact method, and the contact field for that method. Offer Phone or Email, requiring only the selected one; the alternate channel is optional. Matter choices: Criminal defense, DUI/DWI, Expungement, Other or not sure. County/court, next court date, and a short message are optional. Permit “Not sure” or blank values where appropriate. Limit the message to 1,000 characters and ask for a brief description only. Do not collect Social Security numbers, birth dates, uploads, or a detailed account of alleged conduct in the initial inquiry.

## Visible helper copy

Proposed copy for firm review: “Please share a brief overview and your contact details. Do not include sensitive documents or detailed confidential information in this initial inquiry. Sending this form does not create an attorney-client relationship.” Keep this next to the form, not buried in the footer. Link the real privacy notice. Do not add marketing or text-message consent unless that workflow is actually implemented and its wording has been approved.

## Form states and interaction

Specify default, focus, populated, error, submitting, success, and retry states. Use labels above inputs, descriptive autocomplete values, text-based inline errors, and an error summary that moves focus appropriately. Preserve values on validation or network failure. Announce status updates accessibly. The submit label becomes “Sending…” while a request is pending. Disable duplicate submission; support safe server-side deduplication. Never show success after a timer or merely because a click occurred. [R8, R11–R12]

## Routing and truthful confirmation

Use the firm’s approved intake destination, identified during implementation. Keep secrets server-side. Validate input server-side and apply rate limiting and accessible spam protection. Display success only after the server confirms durable acceptance by the configured system. Suggested confirmation: “Your inquiry was received. Submitting it does not establish representation.” Do not promise a response deadline unless the firm supplies one. If delivery fails, keep the entered values and offer retry plus the verified phone link.

## Mobile and measurement

Use a full-page intake route with a single column, rather than a small modal. Keep any persistent CTA above the safe area, below content, and out of the way of the keyboard. Record only minimal events such as intake_start, intake_step_completed, intake_submit_success, and intake_submit_error; exclude names, contact details, message text, and matter details from analytics. Disable session replay on intake. Measure successful submissions divided by intake starts, mobile abandonment, and error rate. Treat any expected conversion benefit as a hypothesis.

## Release checks

Test keyboard-only completion, screen-reader labels and feedback, 200% zoom and narrow-screen reflow, reduced motion, back navigation, optional and required fields, invalid email or phone values, double-click submission, network failure, and verified delivery to a test destination. Check 390, 768, and 1440 px layouts, plus 320 px reflow. No live inquiries should be used for testing. A design mockup must identify itself as a demo if the form is not connected.

# Higgsfield integrated workflow

Use Higgsfield to establish a visual target before building the website. The default comparison is Chambers and Signal. If the user has already selected a direction, create one concept in that direction instead. The written design and intake rules remain authoritative; a generated picture is a reference, not functioning website code.

## Higgsfield visual concept stage

First read the selected brand direction, shared foundation, and intake specification. Use the connected Higgsfield tools for concept images and supporting media when those tools are available. Check the active account/workspace, available image models, required reference inputs, and estimated credit cost before submitting. Follow the tool's credit-selection requirements. Do not assume a paid subscription includes every feature or unlimited connector usage. Do not submit a paid job again merely because a response timed out; retain its job ID and check its status.

When the user has not chosen a direction, generate one Chambers concept and one Signal concept with the same proposed website content. When a direction has been explicitly chosen, generate only that direction. Default to still images; video is a separate optional asset, not part of the starting workflow. Use a currently supported image model and a supported landscape aspect ratio close to 16:9. Do not hard-code an unverified model ID or credit price.

Create a realistic desktop homepage design study showing the header, hero, main intake CTA, attorney-photo placement, and the start of the practice section. No browser chrome, device frame, perspective angle, or decorative presentation mockup. Use the exact palette and intended font character of the selected guideline. Request its specified headline and CTA; expect generated text or font rendering to need correction in code. Leave a plainly marked photo placeholder unless a genuine authorized portrait of Darren is supplied. Do not generate a substitute person and present him as Darren.

The Chambers concept uses warm ivory #F7F3ED, deep wine #562C39, dark ink #231F20, elegant Cormorant Garamond-style display type, and Manrope-style body type. Show the restrained editorial 6/5 split with a breathing column, tall portrait placement, and “Begin your intake” button. Proposed headline: “A considered approach to your defense.”

The Signal concept uses dark navy #090F1C, surface #131F31, cyan #67E8F9, and a restrained violet #8B5CF6 accent. Show bold Manrope-style type, a 7/5 copy-and-portrait split, controlled background glow, and “Start your intake” button. Proposed headline: “Your next step starts with a conversation.” Motion is specified separately; the still image cannot prove that an animation works.

For Monument, Counsel, or Precision, translate that direction's existing palette, typography, layout, and proposed copy into the same desktop concept composition. Do not import the Chambers or Signal colors into another direction.

Display the returned concepts and label each with its direction and generation ID. Review when the client permits image inspection; otherwise ask the user to identify visible changes and do not claim pixel inspection occurred. If no direction was selected, ask which image to use. If it was already selected, continue without asking for that decision again unless the user requested concept-only work. For the concept-only starter prompt, stop after presenting the requested concepts.

If Higgsfield is not connected, supply the two complete image prompts for the user to run on higgsfield.ai, then use the returned images as references. Continue preparing the design specification while imagery is unavailable. Do not silently substitute another paid generation provider or claim a tool was used when it was not.

## Translate the selected image into implementation instructions

Record the selected direction, concept image, and any requested changes. Write a brief design-lock note: exact color variables; actual font files or documented fallbacks; desktop grid; hero image ratio; CTA position; section sequence; component shapes; mobile rearrangement; and motion limits. Correct misleading or illegible generated text and inaccessible color combinations. The image controls the visual composition only where it agrees with the written accessibility, content, and intake rules.

Build real HTML text, buttons, links, navigation, and form controls. Never use the entire concept image as the homepage. Do not copy an image of a form and call it a working form. Match the selected composition using the approved theme tokens and real responsive layout.

Use 21st.dev and the cited component documentation for suitable UI behavior and source, then adapt them to the locked design. Use Higgsfield for intentional supporting visual assets, not for exact text, accessibility logic, validation, or intake routing. Preserve the motion limits: animation must never obstruct reading or the primary intake action.

## Brand kit and asset handoff

After a direction is chosen, an optional Higgsfield brand kit can record the approved name, colors, typography, tone, logo, and reference imagery. Populate it from the new design, not automatically from the old website. Reuse an existing approved kit when available. A kit is reference data and does not automatically apply CSS to a website.

For each final asset, record its purpose, source or generation ID, filename, dimensions, crop/focal point, mobile treatment, and alternative text or decorative status. Keep genuine attorney photography separate from generated abstract backgrounds. Concept screenshots are design references, not final attorney portraits or production background assets. Deliver the approved concept with the written guidelines to the coding agent; if it cannot access a media link, attach the downloaded image.

## Building and publishing routes

Default route: use Higgsfield for visuals and use Codex or Claude Code in the existing website project for implementation. For an initial design study with no source files, make a separate demonstration project. Preview locally or through an explicitly private review environment. The public URL ddrakelaw.com is content context, not permission or credentials to change the existing website.

Optional route: use Higgsfield's website builder only when the user chooses it as the hosting/build destination. A law-firm marketing website with no visitor-facing AI generation is a standalone website; using AI-made static assets during development does not turn it into an AI-generation app. Read the current website workflow before creating it. Higgsfield deploys to a live public URL; it does not provide a separate private preview through its deploy tool. Community-feed listing is a separate action. Respect any instruction to keep work private; do not deploy as a way of obtaining a supposedly private preview. Do not change the existing domain or add a community listing without the corresponding user instruction.

Finish with the selected reference, the real mobile and desktop implementation, tested intake states, and a clear list of any remaining photos, contact details, or delivery integrations. Never claim that paid generation, website deployment, or form delivery has happened without a successful result.


# Master implementation prompt

Select one direction by name, then use this prompt with the shared requirements and that direction.

You are implementing a complete visual redesign of https://ddrakelaw.com for Darren Drake. Use the selected direction below as a binding design specification. The goal is a usable, successfully delivered intake inquiry. Inspect the repository, current routing, and framework before making implementation choices. Preserve useful existing URLs and content; do not invent professional facts or change the firm identity.

Read the foundation and intake requirements in this file. Implement exactly one direction and its semantic tokens. Reuse the existing stack. Use cited component libraries only where their documented behavior helps; check access, licenses, and dependencies before copying code. Strip demo branding and map every component to this theme. Do not blend the other directions.

Create the homepage, practice-page template, About page styling, mobile navigation, FAQ, and intake interface. Establish spacing, fonts, buttons, fields, focus, errors, loading, success, and mobile behavior as a coherent system. Start with a representative homepage and intake slice, inspect it, then apply it consistently. Use genuine approved images; if none are supplied, reserve the exact aspect ratio and identify missing imagery in the preview and handoff rather than inventing an attorney portrait.

Keep factual statements grounded in approved firm content. Do not add reviews, awards, win rates, specialty certifications, free-consultation offers, or 24/7 claims without support. Treat suggested headlines and helper text as proposed copy. Verify current contact details and destination routing before launch. Never claim that a disconnected demo has received an inquiry.

Test the stated layouts and form states, keyboard use, zoom, reduced motion, contrast, and the actual submission path using test data. Return a reviewable implementation with screenshots, changed-file summary, test results, dependency notes, and unresolved content or integration items. Do not publish merely because the design specification is complete.

Higgsfield workflow: Use Higgsfield to establish a visual target before building the website. The default comparison is Chambers and Signal. If the user has already selected a direction, create one concept in that direction instead. The written design and intake rules remain authoritative; a generated picture is a reference, not functioning website code.
Follow the full Higgsfield integration section before implementation. A concept-only request stops at the concept stage. Preserve the selected theme when a numbered prompt is used.


# 01 Signal

**Modern and flashy — For the strongest contemporary visual impact.

A dark, assertive direction built around oversized typography, authentic portrait photography, and a controlled cyan glow. This satisfies the flashy brief without making someone facing a criminal charge navigate a technology demo.

## Exact design tokens

| Role | Hex |
|---|---|
| background | `#090F1C` |
| surface | `#131F31` |
| text | `#F4F7FC` |
| muted | `#BCC7D8` |
| action | `#67E8F9` |
| on action | `#07111F` |
| border | `#718199` |
| focus | `#67E8F9` |
| decoration | `#8B5CF6` |
| error | `#FF9A9A` |
| success | `#86EFAC` |

Headings: Manrope. Body and UI: Manrope. Headings 700–800; body 400; controls 600. Base radius: 12 px. Container maximum: 1200 px. Primary transition: 420 ms. Decorative color is not an approved text color. Use error and success colors on the base surface only after checking contrast.

## Proposed hero copy

Your next step starts with a conversation.

## Wordmark and identity

Use DARREN DRAKE as a bold two-line wordmark with Attorney at Law below. A simple open-corner frame may become a small DD monogram; keep the full name visible in the header. Use a 24 px exclusion zone around the desktop wordmark and 16 px on mobile. No scales, badges, shields, or implied certification seals.

## Typography

Manrope throughout. Desktop H1 72 px, mobile 40 px, weight 800, line height 1.04, tracking −0.035em. H2 40/30 px; body 18/17 px at 1.65 line height; labels 15 px at weight 600. Limit the hero to three desktop lines. Never animate individual letters or delay readable text.

## Layout and homepage sequence

Use a 7/5 split hero: copy and one intake CTA left, a large genuine attorney portrait right. Place a static violet-to-cyan radial glow behind the photograph, outside text and controls. Follow with three practice links, attorney introduction, the three-step contact process, FAQs, and an intake band. Use 96 px desktop and 56 px mobile section spacing.

## Components and surfaces

Solid cyan primary buttons with dark ink; 52 px minimum height. Service cards use a flat navy surface, a thin border, and a 2 px hover lift. The navbar is solid navy when sticky. Keep FAQs and form fields opaque. Optional gradient edges belong on one hero frame only; do not wrap every card in glow.

## Photography and art direction

Commission a low-key portrait of Darren with direct eye contact and natural expression; crop from waist or chest with clear space toward the headline. Add one restrained local architectural image lower on the page. Avoid handcuffs, police-light montages, artificial courtroom victories, and invented client scenes.

## Motion

Allow one 420 ms entrance with a 12 px rise and 60 ms stagger, maximum three elements. A spotlight may fade in once within 900 ms. Optional border beam makes one pass in under four seconds, then stops. Hover transitions 160 ms. Disable glow animation and all spatial motion under reduced motion; mobile uses a static gradient and no pointer tracking.

## Mobile adaptation

Stack headline, supporting sentence, intake CTA, then portrait. Keep the first CTA visible before the photo. Cap hero portrait height at 320 px and remove ornamental lines. Use an opaque bottom intake button that respects the safe area and disappears while form controls have focus.

## Voice and microcopy

Direct, steady, contemporary. Suggested supporting copy: “Tell Darren Drake about your legal matter and how to reach you.” Use “Start your intake” as the primary CTA. Do not promise outcomes, instant answers, or round-the-clock staffing.

## Component reference recipe

Browse the 21st.dev animated hero and navigation collections for composition. Adapt Aceternity Spotlight to the portrait background. If desired, borrow Magic UI Border Beam for one finite hero-frame accent. Build inputs with shadcn Field. Remove all SaaS badges, dashboards, login links, and pricing sections.

## Do not introduce

No 3D globe, particle field, rotating headline, cursor follower, autoplay video, looping CTA shimmer, floating chat bubble, or page-load intro. A legal intake must remain the most obvious action.

## Direction-specific acceptance

The page remains recognizable with effects disabled: dark navy, bold sans typography, cyan action, asymmetric portrait. At 390 px the headline and primary CTA appear before the portrait. Intake controls have no animated background.

Reference IDs: R3, R4, R5, R6, R8. See the research index. These references are ingredients; the original palette, composition, and copy in this specification are the proposed design system.

# 02 Chambers

**Modern and ultra premium — Recommended overall starting direction.

Quiet luxury expressed through warm ivory, deep wine, generous space, carefully set serif headlines, and exceptional photography. My strongest overall recommendation: personal and composed, with the visual quality of a small premium professional practice.

## Exact design tokens

| Role | Hex |
|---|---|
| background | `#F7F3ED` |
| surface | `#FFFDFA` |
| text | `#231F20` |
| muted | `#665E58` |
| action | `#562C39` |
| on action | `#FFFFFF` |
| border | `#8C8278` |
| focus | `#562C39` |
| decoration | `#B29B75` |
| error | `#A12732` |
| success | `#226345` |

Headings: Cormorant Garamond. Body and UI: Manrope. Headings 500–600; body 400; controls 600. Base radius: 4 px. Container maximum: 1160 px. Primary transition: 280 ms. Decorative color is not an approved text color. Use error and success colors on the base surface only after checking contrast.

## Proposed hero copy

A considered approach to your defense.

## Wordmark and identity

Set Darren Drake in title case with Cormorant Garamond Semibold and a small Manrope Attorney at Law descriptor. Use a plain DD ligature only as a favicon or secondary mark. No crest, ornamental gold rule, or slogan under the logo. Maintain 24 px clear space and a minimum 150 px full-wordmark width.

## Typography

Cormorant Garamond 600 for H1 at 76/46 px, line height 1.02, tracking −0.025em; H2 48/34 px. Manrope body 18/17 px at 1.7; labels and buttons 15 px at 600. Serif appears only in display text and short pull quotes. Avoid thin weights that disappear on mobile.

## Layout and homepage sequence

Use a 6/5 split with one empty grid column separating editorial copy and a tall portrait. Keep the hero background light. Follow with a short personal introduction, vertically numbered practice-area rows, the contact process, FAQs, and a full-width ivory intake section. Section spacing 112 px desktop and 64 px mobile.

## Components and surfaces

Wine buttons with white text, 52 px tall and 4 px corners. Secondary actions are underlined text links. Practice areas are generous ruled rows rather than a wall of cards. Use white fields with dark borders and persistent labels. Let one portrait and the wordmark carry the identity; brass is decorative only.

## Photography and art direction

A warm, naturally lit portrait in a real office, with stone, wood, and uncluttered surroundings. Aim for eye-level conversation rather than a pose of dominance. Use genuine office details sparingly. Avoid stock skyscrapers, luxury cars, club interiors, gavels, and fabricated team photographs.

## Motion

Use 280 ms opacity fades and at most 6 px of vertical reveal on nonessential imagery. Link underlines appear in 140 ms. No parallax, glow, beam, typewriter, or continuously moving background. Reduced motion renders everything static immediately. The premium impression comes from composition and finish.

## Mobile adaptation

Keep the serif H1 at 46 px unless text wraps beyond four lines; then reduce to 40 px. Stack copy and CTA above the portrait. Retain 24 px gutters and 64 px section spacing. The intake page uses a single 640 px maximum column with generous labels and no decorative sidebar.

## Voice and microcopy

Measured, plainspoken, attentive. Suggested supporting copy: “Share a few details about your legal matter to begin the conversation.” Use “Begin your intake” consistently. Avoid “elite,” “exclusive,” “premier,” and language that implies visitors must qualify financially.

## Component reference recipe

Use 21st.dev navigation examples to study simple header proportions and Tailark as a reference for restrained marketing sections. Rebuild the hero around editorial typography and real portrait photography. Use shadcn Field and Accordion for functional controls; remove the libraries’ default rounded SaaS styling.

## Do not introduce

No black-and-gold template clichés, tiny spaced-out body text, low-contrast beige labels, luxury-status claims, animated counters, or oversized image-only hero. Premium must still feel accessible to a worried prospective client.

## Direction-specific acceptance

The page reads as premium before any animation runs. Every normal-sized label meets the contrast target. The serif is reserved for headings, and a visible intake CTA accompanies the first screen of copy.

Reference IDs: R3, R7, R8, R9. See the research index. These references are ingredients; the original palette, composition, and copy in this specification are the proposed design system.

# 03 Monument

**Cinematic and commanding — For a dramatic premium alternative.

A cinematic direction with midnight navy, ivory display typography, and muted brass. Compared with Signal, its energy comes from scale, cropping, and architecture instead of digital effects. It offers a more dramatic version of premium.

## Exact design tokens

| Role | Hex |
|---|---|
| background | `#101B27` |
| surface | `#1B2A39` |
| text | `#FAF7F0` |
| muted | `#C6C9CC` |
| action | `#D5B47C` |
| on action | `#101B27` |
| border | `#778592` |
| focus | `#EAC98C` |
| decoration | `#938471` |
| error | `#FFAAAA` |
| success | `#91DCB1` |

Headings: Bodoni Moda. Body and UI: Inter. Headings 600; body 400; controls 600. Base radius: 2 px. Container maximum: 1240 px. Primary transition: 500 ms. Decorative color is not an approved text color. Use error and success colors on the base surface only after checking contrast.

## Proposed hero copy

Serious attention to your defense.

## Wordmark and identity

Set DARREN DRAKE in a carefully spaced serif wordmark; use Attorney at Law in small Inter below. A spare vertical bar may divide the descriptor from the name in wide layouts. No government-like seal. Use 28 px desktop clear space and never shrink the name below 150 px wide.

## Typography

Bodoni Moda 600 for H1 80/44 px, line height 1.05, tracking −0.02em. H2 46/32 px. Inter for body 18/17 px at 1.65 and controls 16 px. Avoid high-contrast serif strokes below 28 px. Limit all-caps text to the wordmark and short section labels.

## Layout and homepage sequence

An asymmetrical full-width hero combines a portrait panel on the right with a fixed opaque navy copy panel on the left. Do not place essential text over a variable photograph. Follow with a horizontal practice index, an editorial attorney section, process, FAQ, and a high-contrast light intake section. Use 104/60 px section spacing.

## Components and surfaces

Brass buttons with navy text, 54 px tall, almost square corners. Cards become wide dark rows with generous internal padding and simple chevrons. Use a thin brass decorative line as a restrained motif. The intake form switches to ivory with dark text and navy buttons; retain the primary brand typography.

## Photography and art direction

Use one authentic environmental portrait with strong directional light, plus one licensed image of recognizable local architecture if appropriate. Use navy toning without crushing facial detail. Keep photography believable; do not substitute stock people for Darren or suggest affiliation with a court.

## Motion

Permit a 500 ms image opacity reveal and a single 2% image-scale settle, never affecting text. Optional 24 px decorative line reveal lasts 400 ms. No scroll hijacking or cinematic loading screen. At reduced motion, skip reveals and scaling; on mobile, keep all photography static.

## Mobile adaptation

Use copy before image and cap the hero at natural content height. Avoid 100vh sections that bury the CTA. Convert the practice index to stacked links. The light intake section should look like a deliberate continuation, with the same square button shape and clear heading rhythm.

## Voice and microcopy

Confident, specific, controlled. Suggested supporting copy: “Start with the details of your legal matter. Darren Drake can review your inquiry and discuss next steps.” CTA: “Start your intake.” No combat metaphors, intimidating copy, or prediction of results.

## Component reference recipe

Study 21st.dev hero and navigation collections for asymmetrical structure. Use shadcn Accordion and Field for utility. Aceternity Spotlight is optional as a static tonal overlay only; omit it if it obscures the portrait. Author brass dividers with simple CSS rather than importing an effects package.

## Do not introduce

No glossy gold gradients, fake marble texture, courtroom stock montage, burning-red urgency strips, “we win” statements, case-result counters, or background music. This direction should convey preparation and seriousness.

## Direction-specific acceptance

The light intake section is visually connected to the dark site. Main text always sits on an opaque surface. On mobile the primary CTA appears before the cinematic image and no section locks scrolling.

Reference IDs: R3, R4, R8, R9. See the research index. These references are ingredients; the original palette, composition, and copy in this specification are the proposed design system.

# 04 Counsel

**Warm and approachable — For a reassuring personal introduction.

A calm, human direction built around cream, forest green, readable serif headings, and a candid portrait. It is designed for visitors who may be anxious or unsure whether their problem belongs with a criminal defense attorney.

## Exact design tokens

| Role | Hex |
|---|---|
| background | `#F5F5EE` |
| surface | `#FFFFFF` |
| text | `#203831` |
| muted | `#51625B` |
| action | `#285A48` |
| on action | `#FFFFFF` |
| border | `#788B7F` |
| focus | `#285A48` |
| decoration | `#CBB398` |
| error | `#A12732` |
| success | `#226345` |

Headings: Lora. Body and UI: Source Sans 3. Headings 500–600; body 400; controls 600. Base radius: 16 px. Container maximum: 1120 px. Primary transition: 220 ms. Decorative color is not an approved text color. Use error and success colors on the base surface only after checking contrast.

## Proposed hero copy

You do not have to figure out the next step alone.

## Wordmark and identity

Set Darren Drake in Lora Semibold with a clear Source Sans 3 descriptor. Keep the wordmark simple and open; a rounded square DD favicon is optional. Use 24 px clear space. Avoid a handshake icon, tree emblem, or visual language that suggests a therapy or wellness business.

## Typography

Lora 600 for H1 at 58/36 px, line height 1.14 and normal tracking; H2 38/30 px. Source Sans 3 body 19/18 px at 1.65 and labels 16 px at 600. Use sentence case throughout. Aim for 55–65 characters per paragraph line.

## Layout and homepage sequence

Use a 6/6 hero with welcoming copy left and a rounded genuine portrait right. Follow with plain-language practice cards, what happens after contact, a short attorney introduction, FAQs, and the intake form. Use 88/48 px section spacing and avoid long unbroken biography text.

## Components and surfaces

Forest green buttons with white text, 54 px tall and 12 px corners. Cards have 16 px corners, white surfaces, subtle shadows, and meaningful headings. Show the contact process as three numbered blocks. Form fields are large and calm, with examples beneath the labels rather than inside the inputs.

## Photography and art direction

Use natural window light, a real office setting, and a relaxed but professional portrait. Detail photographs can show an actual desk or meeting space without client papers. Avoid staged distressed families, cartoon people, emergency imagery, or stock “happy client” pictures.

## Motion

Use 220 ms opacity transitions and a 2 px hover lift on service cards. The process is static and always visible. Do not use bounce, elastic transitions, floating bubbles, or looping illustrations. Reduced motion removes the lift; mobile shows no reveal sequence.

## Mobile adaptation

Prioritize comfortable 18 px body text, full-width buttons, and readable short paragraphs. Place the contact process above longer biography material. The same intake can use two calm steps with clearly named progress, a Back button, and preserved values. No question advances automatically.

## Voice and microcopy

Supportive without sentimentality. Suggested supporting copy: “Share what you need help with and the best way to reach you.” CTA: “Tell us about your matter.” Use “Not sure” as a matter-type option. Do not imply that submitting the form means representation has begun.

## Component reference recipe

Browse Tailark and 21st.dev navigation or card collections for uncomplicated section structure. Rebuild the shapes with the Counsel tokens and commission genuine photography. Use shadcn Field and Accordion. Avoid importing motion libraries for interactions that CSS can implement.

## Do not introduce

No playful mascots, rounded pill everything, pastel text, stock-family testimonials, chat-style typing bots, emotional countdowns, or vague reassurance about the outcome. Warmth must coexist with clarity and professional seriousness.

## Direction-specific acceptance

The visitor can understand the three next steps without opening an accordion. Labels remain readable on a phone. The page feels like a conversation with a real attorney, and the form does not demand a detailed case narrative.

Reference IDs: R3, R7, R8, R9. See the research index. These references are ingredients; the original palette, composition, and copy in this specification are the proposed design system.

# 05 Precision

**Crisp and modern — For maximum clarity and a lean build.

A disciplined, light design with ink text, cobalt actions, and a strong grid. This is the most economical direction to implement and maintain because hierarchy, spacing, and useful information do the work normally assigned to elaborate effects.

## Exact design tokens

| Role | Hex |
|---|---|
| background | `#F8FAFD` |
| surface | `#FFFFFF` |
| text | `#142238` |
| muted | `#526278` |
| action | `#1746C4` |
| on action | `#FFFFFF` |
| border | `#74839A` |
| focus | `#1746C4` |
| decoration | `#D8E6FF` |
| error | `#A12732` |
| success | `#226345` |

Headings: Inter. Body and UI: Inter. Headings 600–700; body 400; controls 600. Base radius: 8 px. Container maximum: 1184 px. Primary transition: 160 ms. Decorative color is not an approved text color. Use error and success colors on the base surface only after checking contrast.

## Proposed hero copy

A clear first step for your legal matter.

## Wordmark and identity

Use Darren Drake in Inter Semibold with Attorney at Law on a second line or beside it on wide screens. A small DD monogram can be used for the favicon. Keep the wordmark horizontal and understated, with 24 px clear space and no tech-product glyph.

## Typography

Inter 700 for H1 at 64/38 px, line height 1.08 and tracking −0.025em. H2 40/30 px; body 18/17 px at 1.6. Labels 15 px at 600. Use two font weights above the fold and avoid ultra-light headings. Maintain a clear 4 px spacing rhythm.

## Layout and homepage sequence

Use a 7/5 hero: concise copy and one intake action left, compact attorney portrait and name right. Follow with three structured practice cards, a short attorney section, next-step process, FAQs, and an intake CTA. Use 88/48 px section spacing with a consistent 24 px desktop grid gap.

## Components and surfaces

Cobalt primary buttons with white text, 52 px tall and 8 px corners. White service cards use strong headings and a single inline link. The desktop nav and mobile sheet are familiar and restrained. Use explicit field labels, a visible progress indicator if needed, and no gratuitous tabs or dashboards.

## Photography and art direction

A clean, well-lit portrait on a neutral real background is sufficient. Use one additional genuine office image only if it adds context. Consistent photography quality matters more than quantity. Avoid generic business meetings or a stock model acting as the attorney.

## Motion

Use 160 ms color, border, and opacity transitions. No entrance animation is required. If used, restrict reveals to nonessential imagery. No WebGL, parallax, animated gradients, or new animation dependency. Reduced motion leaves static controls with immediate state changes.

## Mobile adaptation

Use a compact 64 px header, 20 px gutters, and a primary CTA before the portrait. Keep the intake in one column. Avoid sticky elements while the keyboard is open. Put the phone link in the menu and next to the form as a secondary route.

## Voice and microcopy

Clear, specific, efficient. Suggested supporting copy: “Tell us the type of matter and how to contact you.” CTA: “Start your intake.” Explain the next step in one sentence, without promising a response time that the firm has not confirmed.

## Component reference recipe

Use Tailark for marketing-section structure and 21st.dev for simple navigation examples. Let shadcn Field and Accordion provide the functional base. Strip demo shadows and adjust every component to the exact Inter type scale, cobalt palette, and 8 px corners.

## Do not introduce

No SaaS pricing tables, dashboard illustrations, fake activity feeds, decorative badges, excessive chips, gray-on-gray text, or form-only homepage. Clarity still needs a visible attorney and human context.

## Direction-specific acceptance

The first screen explains who the site is for and how to begin intake. The page works without decorative JavaScript. The firm does not look like a software company despite the modern component foundation.

Reference IDs: R3, R7, R8, R9. See the research index. These references are ingredients; the original palette, composition, and copy in this specification are the proposed design system.

# How to use the guidelines

# Start here with Higgsfield

Use Higgsfield to establish a visual target before building the website. The default comparison is Chambers and Signal. If the user has already selected a direction, create one concept in that direction instead. The written design and intake rules remain authoritative; a generated picture is a reference, not functioning website code.

## 1 Download one instruction file

Download Darren_Drake_AI_Brand_Guidelines.md. The Word guide is for comparing designs. The ZIP is optional; each numbered AI prompt inside it is already self-contained and includes the Higgsfield workflow.

## 2 Open your building conversation

Attach the Markdown file in ChatGPT Work, or place it in the website project folder used by Codex or Claude Code. Use the AI workspace connected to your Higgsfield account. If no connector is available, ask the AI for image prompts you can paste into Higgsfield manually.

## 3 Create the visual comparison

Send the concept starter prompt below. It requests two still homepage concepts, Chambers and Signal, and pauses for your selection. You do not need the existing website source files to compare visual concepts. A genuine attorney photo is helpful but optional for this stage.

## 4 Choose and correct the concept

Choose one image and give concrete changes, such as a larger intake button or a lighter background. The concept is a visual draft: generated lettering and fonts may not be exact. Keep the approved image available to attach to the next task.

## 5 Start the working website

Send the build prompt below, replace [SELECTED DIRECTION] with the chosen name, and attach the chosen image. Supply the existing website source files if the goal is to edit that site. Otherwise, the AI can build a separate demonstration.

## 6 Review the actual pages

Open the preview and check phone and desktop layouts, navigation, readability, and every intake state. Confirm which photographs, firm facts, and delivery details are still missing. An image of a form is not a submission system.

## 7 Launch when the site is ready

After choosing the final hosting route and testing intake delivery, publish the approved site. Higgsfield hosting is optional. Its deploy action creates a public live site, while a community-feed listing is separate. Keep a local/private preview if you are not ready for a public URL.

## Copy this first

Read Darren_Drake_AI_Brand_Guidelines.md in full, including its Higgsfield integration instructions. Use Higgsfield to create one Chambers homepage concept and one Signal homepage concept for Darren Drake's law firm. Keep the website content comparable. Check the connected workspace, supported image model, and credit estimate before submission, and follow the tool's credit requirements. Create still images only. Use a labeled portrait placeholder unless I supply a genuine approved photograph of Darren. Present both concepts and explain the main visual differences. Stop after showing the concepts so I can choose one. Do not build or deploy a website yet. If Higgsfield is unavailable, give me the two complete prompts to run there manually.

## Copy this after choosing a concept

Use the attached concept image and the [SELECTED DIRECTION] guideline in Darren_Drake_AI_Brand_Guidelines.md. First record the final design decisions, including my changes. Then build a working homepage and intake page using the existing project if available, or a separate demonstration project if it is not. Follow the shared accessibility, mobile, content, and intake requirements. Recreate the design with real text and controls; do not use the concept image as the entire webpage. Use 21st.dev and the referenced libraries where appropriate, and Higgsfield only for intentional supporting visual assets. Keep the preview local or explicitly private and leave ddrakelaw.com unchanged. Show desktop and mobile results. Clearly identify the form as a demo until its delivery destination is configured and tested. Do not publish to Higgsfield or its community feed as part of this preview request.

## Optional direct build

If you already know which direction you want, use that direction’s numbered prompt from the ZIP and say: “Use this selected direction. Create one Higgsfield concept, then build a local or private working preview from it. Do not ask me to choose between the other directions.”

## Higgsfield references

https://higgsfield.ai/skills/website

https://higgsfield.ai/creator-hub/help-center/tools/how-do-i-use-marketing-studio-to-create-video-ads


## Use the Higgsfield workflow

Use Higgsfield to establish a visual target before building the website. The default comparison is Chambers and Signal. If the user has already selected a direction, create one concept in that direction instead. The written design and intake rules remain authoritative; a generated picture is a reference, not functioning website code.

## Choose and attach

Choose one direction. Upload its self-contained markdown prompt to Codex or Claude Code together with the existing website repository and approved brand assets. Use the Word guide to compare the alternatives. The all-in-one markdown includes the shared requirements once; the ZIP contains five standalone prompts plus theme tokens and CSS.

## Build a representative slice first

Ask the AI to implement the selected homepage hero, mobile navigation, one practice section, FAQ, and full intake page. Inspect desktop and mobile screenshots before extending the style to every page. Fix hierarchy, readability, photography, and form behavior first; effects come last. Continue independent implementation when an image or integration detail is missing, using explicit placeholders in the preview.

## Use component prompts deliberately

Open the cited component page, check its current license and dependencies, and use its provided prompt or documented source. Tell the AI exactly which aspect to borrow and which to discard. The selected guideline remains authoritative over a component’s demo colors, fonts, layout copy, and animations. If a component requires payment or access that is unavailable, implement an original equivalent using the project’s existing tools.

## Keep the alternatives separate

If comparing two finalists, use separate branches or previews with identical copy, fields, and content order wherever possible. Do not ask the AI to blend the palettes, radii, or font systems. My recommended first comparison is Chambers versus Signal. Monument is useful if the preferred answer is dramatic premium; Counsel and Precision test warmer and more utilitarian alternatives.

## Finish with reviewable evidence

Require the AI to return screenshots at 390, 768, and 1440 px, a list of changed files, measured contrast pairs, form-test results, and performance observations. It must identify missing assets, unverified firm claims, and any unconnected backend. Do not call the site launch-ready until content, delivery, accessibility, and deployment checks pass. This package is a design specification and contains no deployed website.

# Research and reference index

Reviewed September 24, 2026. Public content and component documentation informed these original design directions. Library previews and installation behavior were not tested inside the firm’s codebase. Several individual 21st.dev search results redirected to missing components; they are intentionally omitted as recommendations. Gallery links below are discovery paths.

## R1 Firm public content

Source for the attorney identity, criminal-defense emphasis, biography themes, and existing navigation. Treat current positions, memberships, and service statements as items to reconfirm before publication.

https://ddrakelaw.com/

## R2 Firm contact page

Source for the current public contact page and message-form structure. Confirm all contact details and routing with the firm before replacing the site.

https://ddrakelaw.com/contact/

## R3 21st.dev

A registry with AI-ready component prompts and editable source. Use its prompt workflow as a component acquisition step, then enforce the selected brand tokens.

https://21st.dev/

## R4 21st.dev hero and navigation collections

Browse for hero compositions. Navigation collection: https://21st.dev/community/components/s/navigation-menu . These are discovery links, not a tested installed component bundle.

https://21st.dev/community/components/s/animated-hero

## R5 Aceternity Spotlight

A documented spotlight effect. Recommended adaptation: a finite reveal or static background accent in Signal; optional static tone in Monument.

https://ui.aceternity.com/components/spotlight

## R6 Magic UI Border Beam

A documented animated container-border effect. Recommended adaptation: a single optional finite pass on the Signal hero frame, away from form controls.

https://magicui.design/docs/components/border-beam

## R7 Tailark

Marketing blocks based on the shadcn registry ecosystem. Use for section structure and restrained composition. Verify access and terms for the particular block before reuse.

https://tailark.com/

## R8 shadcn Field

Field composition with labels, help, grouping, and errors. The selected tokens and testing still determine the quality of the finished form.

https://ui.shadcn.com/docs/components/base/field

## R9 shadcn Accordion

A functional basis for FAQs. Keep critical contact-process information outside collapsed panels.

https://ui.shadcn.com/docs/components/base/accordion

## R10 Motion accessibility

Reference for reduced-motion handling when a selected component uses Motion. Existing package versions determine the correct import paths.

https://motion.dev/docs/react-accessibility

## R11 W3C form labeling

Basis for persistent, programmatically associated labels.

https://www.w3.org/WAI/tutorials/forms/labels/

## R12 W3C form notifications

Basis for clear success and error feedback connected to the relevant fields.

https://www.w3.org/WAI/tutorials/forms/notifications/

## R13 WCAG 2.2

Accessibility target. This guide uses 4.5:1 normal text contrast and a generous 44 px minimum interactive target design rule; a finished site still needs a full accessibility review.

https://www.w3.org/TR/WCAG22/

## R14 Web Vitals

Performance targets for real-user measurement: LCP at most 2.5 seconds, INP at most 200 ms, CLS at most 0.1, evaluated at the 75th percentile.

https://web.dev/articles/vitals

## R15 Google Fonts

Font sourcing directory. Obtain the specified font files and their license files; use documented fallbacks while fonts load.

https://fonts.google.com/

## R16 Higgsfield website builder

Reference for creating websites through a connected AI assistant. In the current connector, deployment makes a public live site; community-feed listing is separate. Use local/private previews when public deployment has not been requested.

https://higgsfield.ai/skills/website

## R17 Higgsfield Marketing Studio

Reference for reusable brand kits. Populate the kit from the selected redesign. Actual model availability, workspace credits, and connector access must be checked before generation.

https://higgsfield.ai/creator-hub/help-center/tools/how-do-i-use-marketing-studio-to-create-video-ads

