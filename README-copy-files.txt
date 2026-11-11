LYCOS BLANZA PORTFOLIO — V10 SCROLL-FORMED LB + GRAY PETALS

HOW TO INSTALL
1. Open your existing portfolio project (the folder containing package.json).
2. Copy the app/ folder from this ZIP into your project.
3. Choose MERGE/REPLACE for matching files. Do not delete your current app/ or public/ folders.
4. Run: npm run dev
5. Hard refresh: Ctrl + Shift + R.

FILES INCLUDED (ONLY UPDATED FILES)
- app/page.tsx                 Adds the tasteful SVG petal layer and live scroll label.
- app/use-portfolio-motion.ts Restores genuine wheel/touch/keyboard SCRUBBING for LB.
- app/portrait-signals.ts     Keeps the LB clearly visible when fully assembled.
- app/gray-petal-fall.tsx     NEW: decorative grayscale sakura petals.
- app/globals.css             Adds petal animation and assembly progress UI.

BEHAVIOR
- Motion is ON by default via your existing motion-preference.tsx (V9).
- At the top of Home, scrolling first advances the tangled threads into a finished LB.
- During LB assembly, Home remains one screen tall and does not advance to About.
- Once LB is complete, the NEXT scroll gesture moves to About normally.
- Upward scroll before completion reverses the assembling LB.
- Touch swiping and scrolling keys can also form LB.
- ESC, the navigation, and CTAs may skip the assembly so visitors are never trapped.
- The LB remains assembled after completion; it does NOT fade away.
- On page open, a one-time set of muted gray sakura petals drifts downward.
- Motion off hides petals and removes any scrolling lock.
- Existing portrait, CV/resume, Credentials, and document dock remain untouched.

NOTE
This is a source-only patch designed for your existing V9 project. No public/ assets are replaced.
