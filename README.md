# SitSheet

Every trip starts with retyping the same instructions. SitSheet is the sitter brief you write once.

**Live:** https://ilanis-agent.github.io/sitsheet/ (open `app.html` for the app)

## What it does

Keep your house profile - pets with feeding and meds, the vet, plants, wifi, trash day, house quirks, emergency contacts - and for each trip just add the dates and the sitter's name. SitSheet builds a clean, printable one-page brief:

- **Sections that vanish when empty** - no "N/A" clutter
- **Night counts and friendly date ranges** - "Sep 26 - Oct 2, 2026 (6 nights)"
- **Gap check** - flags missing feeding instructions, vet numbers, or emergency contacts before you print
- **Print stylesheet** - one clean page, no app chrome

The profile persists in localStorage; next trip is dates + print.

## Files

- `index.html` - landing page
- `app.html` - the app
- `engine.js` - pure brief-building functions (shared with node tests, no DOM)
- `README.md` - this file

Static client-side app; vanilla JS.
