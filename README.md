# Flutter Accessibility Issues

A dashboard cataloging known, recurring accessibility issues in Flutter (Dart) app
development, organized by the WCAG **POUR** principles — Perceivable, Operable,
Understandable, Robust — with a suggested Flutter-specific fix or mitigation for each.

**Live dashboard:** https://arctouch-stellalunardeli1.github.io/flutter-a11y-issues/

## What this is

Flutter developers have documented a recurring set of accessibility gaps across the
[flutter/flutter GitHub issue tracker](https://github.com/flutter/flutter/issues),
developer blogs, and Flutter's own docs — things like semantics not being generated for
custom-painted widgets, focus order breaking inside `FocusTraversalGroup`, screen readers
losing focus after navigation, and text-scaling clipping fixed-size widgets. This project
pulls those together into one place, maps each issue to the relevant WCAG success
criteria, and pairs it with a concrete workaround or fix pattern.

## Reference guidelines

- [WCAG 2.1](https://www.w3.org/TR/WCAG21/) / [WCAG 2.2](https://www.w3.org/TR/WCAG22/) (W3C)
- [Guia WCAG — quick reference](https://guia-wcag.com)
- [MagentaA11y](https://www.magentaa11y.com) — native mobile accessibility checklists (T-Mobile)
- [Flutter accessibility docs](https://docs.flutter.dev/ui/accessibility-and-internationalization/accessibility)

## Methodology

Issues were gathered by searching:
1. `flutter/flutter` GitHub issues tagged or discussing accessibility, semantics, TalkBack,
   VoiceOver, and screen reader behavior.
2. Community write-ups — dev.to/Medium articles, real-app accessibility audits, and
   blog posts documenting Flutter-specific accessibility pain points.
3. WCAG 2.1/2.2 and MagentaA11y to build the POUR classification framework and to source
   accurate Flutter API guidance (`Semantics`, `MergeSemantics`, `ExcludeSemantics`,
   `FocusTraversalGroup`, `SemanticsService.announce`, etc.) for the suggested solutions.

Every issue entry links back to its original source (a GitHub issue, PR, or article) —
see `assets/data.js` for the full dataset. This is a snapshot, not an exhaustive or
continuously-updated list: some linked issues may have been fixed in newer Flutter
releases by the time you read this, so always verify against the current Flutter
changelog and test with real assistive technology before treating any entry as still open.

## Structure

```
index.html        Dashboard shell (filters, layout, accessible markup)
assets/style.css  Styling (light/dark theme aware, visible focus states)
assets/data.js    The issue dataset (title, description, platforms, WCAG refs, sources, solution)
assets/app.js     Filtering/search/rendering logic
```

## Running locally

No build step — just serve the directory statically, e.g.:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Contributing

Found an issue that's missing, or one that's since been fixed upstream? Open a PR
against `assets/data.js` with a link to a real source (GitHub issue, doc, or article).
