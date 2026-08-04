// Data for the Flutter Accessibility Issues dashboard.
// Every issue below is sourced from a real, publicly accessible thread/doc
// (see the `sources` array on each entry) gathered from flutter/flutter
// GitHub issues, developer blogs, and docs.flutter.dev.
const ISSUES = [
  // ---------------------------------------------------------------- Perceivable
  {
    id: "P1",
    principle: "Perceivable",
    title: "Custom-painted widgets are invisible to screen readers",
    description:
      "Widgets that paint their own content (CustomPaint, terminals, custom charts, canvas-based UI) don't automatically populate the semantics tree. Screen readers perceive them as a single unlabeled image or an empty region.",
    platforms: ["Android", "iOS"],
    wcag: ["1.1.1 Non-text Content (A)", "4.1.2 Name, Role, Value (A)"],
    sources: [
      { label: "flutter_server_box #983", url: "https://github.com/lollipopkit/flutter_server_box/issues/983" },
      { label: "Flutter accessibility docs", url: "https://docs.flutter.dev/ui/accessibility" },
    ],
    solution:
      "Wrap custom-rendered regions in an explicit Semantics widget with label/value/hint, or provide a parallel \"reader mode\" that exposes the same information as accessible text or standard widgets.",
  },
  {
    id: "P2",
    principle: "Perceivable",
    title: "Default Material theme fails WCAG contrast minimums",
    description:
      "Flutter's default light/dark ThemeData color schemes (including FloatingActionButton.extended) don't meet the 4.5:1 text contrast ratio WCAG requires, so apps built on unmodified defaults ship with contrast issues for low-vision users out of the box.",
    platforms: ["All"],
    wcag: ["1.4.3 Contrast (Minimum) (AA)", "1.4.11 Non-text Contrast (AA)"],
    sources: [
      { label: "flutter/flutter #63428", url: "https://github.com/flutter/flutter/issues/63428" },
      { label: "flutter/flutter #19891", url: "https://github.com/flutter/flutter/issues/19891" },
    ],
    solution:
      "Define an explicit ColorScheme (e.g. Material 3 ColorScheme.fromSeed with contrast-checked colors) instead of relying on framework defaults, and verify with a contrast checker before shipping.",
  },
  {
    id: "P3",
    principle: "Perceivable",
    title: "No automatic support for OS-level high-contrast mode (Windows)",
    description:
      "Flutter doesn't detect or react to the Windows \"high contrast\" accessibility setting the way native apps do, so users who rely on that OS feature get no adaptation inside a Flutter desktop app.",
    platforms: ["Windows Desktop"],
    wcag: ["1.4.3 Contrast (Minimum) (AA)", "1.4.11 Non-text Contrast (AA)"],
    sources: [
      { label: "flutter/flutter #109802", url: "https://github.com/flutter/flutter/issues/109802" },
      { label: "flutter/website #9769", url: "https://github.com/flutter/website/issues/9769" },
    ],
    solution:
      "Detect the platform contrast preference where a plugin exposes it and swap in a high-contrast ThemeData manually — there is currently no built-in automatic switch.",
  },
  {
    id: "P4",
    principle: "Perceivable",
    title: "Fixed-size widgets clip text when the user increases system font size",
    description:
      "Widgets with hardcoded pixel/dp dimensions (e.g. a 56dp AppBar) don't grow when the user scales up system text size for accessibility, so titles and labels get cropped or truncated at larger text-scale settings.",
    platforms: ["Android", "iOS"],
    wcag: ["1.4.4 Resize Text (AA)", "1.4.10 Reflow (AA)"],
    sources: [
      { label: "flutter/flutter #12311", url: "https://github.com/flutter/flutter/issues/12311" },
      { label: "flutter/flutter #42696", url: "https://github.com/flutter/flutter/issues/42696" },
    ],
    solution:
      "Avoid hardcoded SizedBox/fixed heights around text; use Flexible/FittedBox/scroll views so layout can absorb growth, and test manually at a textScaleFactor of 2.0–3.0 before release.",
  },
  {
    id: "P5",
    principle: "Perceivable",
    title: "RichText/TextSpan doesn't scale with accessibility text size",
    description:
      "Unlike the plain Text widget, RichText does not automatically respond to the system text-scale setting, producing inconsistent font sizes across text on the same screen for users who've increased their font size.",
    platforms: ["Android", "iOS"],
    wcag: ["1.4.4 Resize Text (AA)"],
    sources: [{ label: "flutter/flutter #61452", url: "https://github.com/flutter/flutter/issues/61452" }],
    solution:
      "Explicitly apply MediaQuery.textScalerOf(context) to every TextStyle/TextSpan fontSize used inside a RichText.",
  },
  {
    id: "P6",
    principle: "Perceivable",
    title: "RTL layouts and text don't always mirror correctly",
    description:
      "Text alignment and layout in right-to-left locales can render incorrectly, often because developers use literal left/right properties (TextAlign.left) instead of direction-aware equivalents, producing visually and semantically wrong layouts for RTL users.",
    platforms: ["All"],
    wcag: ["1.3.2 Meaningful Sequence (A)"],
    sources: [{ label: "flutter/flutter #122500", url: "https://github.com/flutter/flutter/issues/122500" }],
    solution:
      "Use TextAlign.start/end and EdgeInsetsDirectional/AlignmentDirectional instead of left/right, set Directionality explicitly, and test in an actual RTL locale rather than a visually mirrored preview.",
  },
  {
    id: "P7",
    principle: "Perceivable",
    title: "Table widget doesn't expose table semantics",
    description:
      "Flutter's Table widget doesn't emit row/column semantics, so screen reader users can't use standard table-navigation gestures or commands to move across rows and columns of tabular data.",
    platforms: ["All"],
    wcag: ["1.3.1 Info and Relationships (A)"],
    sources: [
      { label: "Top 10 Flutter Web accessibility issues", url: "https://cleancodestack.com/top-10-flutter-web-accessibility-issues/" },
    ],
    solution:
      "For data-heavy tables, supplement with explicit Semantics labels per cell describing row/column context (e.g. \"Row 2, Revenue: $500\"), since there's no built-in table role to rely on.",
  },
  {
    id: "P8",
    principle: "Perceivable",
    title: "Dense custom controls linearize into meaningless sequences",
    description:
      "Grid-like custom UI — permission-switch grids, icon-only virtual keyboards, dashboards of bare numbers — gets read out by screen readers as a flat sequence of \"unlabeled button\" or raw digits, losing the context a sighted user gets from layout.",
    platforms: ["Android", "iOS"],
    wcag: ["1.3.1 Info and Relationships (A)", "2.4.6 Headings and Labels (AA)"],
    sources: [
      { label: "flutter_server_box #983", url: "https://github.com/lollipopkit/flutter_server_box/issues/983" },
      { label: "gskinner: screen reader experience", url: "https://blog.gskinner.com/archives/2022/09/flutter-crafting-a-great-experience-for-screen-readers.html" },
    ],
    solution:
      "Combine related values into single semantic nodes with contextual labels (\"CPU: 2.5%\" not just \"2.5%\"), and add explicit labels to icon-only controls rather than relying on visual position to convey meaning.",
  },

  // ------------------------------------------------------------------ Operable
  {
    id: "O1",
    principle: "Operable",
    title: "Enter key doesn't activate controls, only Space does",
    description:
      "Buttons and other activatable widgets respond to the Space key but not Enter, diverging from standard web/ARIA conventions where both should trigger activation — a real gap for keyboard-only and switch-device users.",
    platforms: ["Web", "Desktop"],
    wcag: ["2.1.1 Keyboard (A)"],
    sources: [{ label: "flutter/flutter #71998", url: "https://github.com/flutter/flutter/issues/71998" }],
    solution:
      "Bind an explicit Enter (LogicalKeyboardKey.enter) handler via Shortcuts/Actions on custom interactive widgets rather than assuming default key handling covers it.",
  },
  {
    id: "O2",
    principle: "Operable",
    title: "FocusTraversalGroup produces illogical traversal order in lists/grids",
    description:
      "Wrapping a ListView/GridView in FocusTraversalGroup often doesn't traverse in visual/logical order via arrow keys — items get skipped or ordered unexpectedly, especially with FABs positioned before long scrollable content.",
    platforms: ["Web", "Desktop"],
    wcag: ["2.4.3 Focus Order (A)"],
    sources: [
      { label: "flutter/flutter #184077", url: "https://github.com/flutter/flutter/issues/184077" },
      { label: "flutter/flutter #67814", url: "https://github.com/flutter/flutter/issues/67814" },
      { label: "flutter/flutter #159490", url: "https://github.com/flutter/flutter/issues/159490" },
    ],
    solution:
      "Wrap widgets in an explicit FocusTraversalOrder/NumericFocusOrder to force the intended sequence, and re-test after any layout change since traversal order isn't guaranteed to track visual order automatically.",
  },
  {
    id: "O3",
    principle: "Operable",
    title: "NumericFocusOrder + prefix/suffix icons get wrong focus order",
    description:
      "A TextField with prefixIcon/suffixIcon inside a FocusTraversalGroup using NumericFocusOrder lets the icon widgets steal focus out of the intended numeric sequence.",
    platforms: ["Web", "Desktop"],
    wcag: ["2.4.3 Focus Order (A)"],
    sources: [{ label: "flutter/flutter #127991", url: "https://github.com/flutter/flutter/issues/127991" }],
    solution:
      "Wrap the icon widgets in ExcludeFocusTraversal so they don't compete with the numerically-ordered sequence (a community-reported mitigation, not an official fix).",
  },
  {
    id: "O4",
    principle: "Operable",
    title: "Screen readers can't reach items scrolled out of a virtualized list",
    description:
      "ListView only builds semantics nodes for currently-rendered children, so TalkBack/VoiceOver/web screen readers can't list or focus items that are scrolled out of the viewport — users can't swipe-navigate past what's currently visible.",
    platforms: ["Android", "iOS", "Web"],
    wcag: ["2.4.3 Focus Order (A)", "4.1.2 Name, Role, Value (A)"],
    sources: [
      { label: "flutter/flutter #160217", url: "https://github.com/flutter/flutter/issues/160217" },
      { label: "flutter/flutter #40419", url: "https://github.com/flutter/flutter/issues/40419" },
      { label: "flutter/flutter #65253", url: "https://github.com/flutter/flutter/issues/65253" },
      { label: "flutter/flutter #127393", url: "https://github.com/flutter/flutter/issues/127393" },
    ],
    solution:
      "No complete fix exists; mitigate by programmatically scrolling the target into view before it needs AT focus, or use a non-virtualized Column + SingleChildScrollView for short lists where virtualization isn't needed for performance.",
  },
  {
    id: "O5",
    principle: "Operable",
    title: "Large unfocusable items can trap screen-reader swipe navigation",
    description:
      "When a big unfocusable widget (e.g. an AspectRatio image box) fills the entire visible scroll area of a ListView, TalkBack/VoiceOver swipe navigation can't move past it to reach other list items — a de facto focus trap.",
    platforms: ["Android", "iOS"],
    wcag: ["2.1.2 No Keyboard Trap (A)"],
    sources: [
      { label: "flutter/flutter #144367", url: "https://github.com/flutter/flutter/issues/144367" },
      { label: "flutter/flutter #173080", url: "https://github.com/flutter/flutter/issues/173080" },
    ],
    solution:
      "Give large decorative/media widgets appropriate Semantics (or exclude them) so they don't consume the entire scrollable viewport as a single unskippable stop; test swipe navigation on long lists explicitly — this has reportedly affected production apps on Flutter 3.19/3.20.",
  },
  {
    id: "O6",
    principle: "Operable",
    title: "Framework doesn't move input focus with all AT navigation commands (desktop)",
    description:
      "With JAWS, NVDA, or Windows Narrator, Flutter's input focus only updates via the Tab key — not via arrow keys or other screen-reader navigation commands — breaking parity between what the screen reader announces as focused and what the app treats as focused.",
    platforms: ["Web", "Windows Desktop"],
    wcag: ["2.4.3 Focus Order (A)", "4.1.2 Name, Role, Value (A)"],
    sources: [{ label: "flutter/flutter #83809", url: "https://github.com/flutter/flutter/issues/83809" }],
    solution:
      "No full fix is available; test explicitly with JAWS/NVDA/Narrator rather than assuming Tab-only testing covers real assistive-technology navigation patterns.",
  },
  {
    id: "O7",
    principle: "Operable",
    title: "VoiceOver focus jumps unexpectedly after setState()",
    description:
      "On iOS, calling setState() (e.g. after pressing an increment button) can cause VoiceOver's accessibility focus to snap back to an earlier element instead of remaining logically placed, disrupting the reading order for the user.",
    platforms: ["iOS"],
    wcag: ["2.4.3 Focus Order (A)", "3.2.1 On Focus (A)"],
    sources: [{ label: "flutter/flutter #104176", url: "https://github.com/flutter/flutter/issues/104176" }],
    solution:
      "No definitive fix; minimize unnecessary widget-tree rebuilds around interactive controls, and consider Semantics(sortKey:) or explicit FocusNode management to keep the intended element focused after state changes.",
  },
  {
    id: "O8",
    principle: "Operable",
    title: "Screen-reader focus resets to the top of a route after navigating back",
    description:
      "After swiping through elements, pushing a new route, and popping back, VoiceOver/TalkBack lands focus at the very beginning of the previous route instead of where the user left off, forcing them to re-navigate from scratch.",
    platforms: ["iOS", "Web"],
    wcag: ["2.4.3 Focus Order (A)"],
    sources: [
      { label: "flutter/flutter #118397 (fixed)", url: "https://github.com/flutter/flutter/issues/118397" },
      { label: "flutter/flutter #122876", url: "https://github.com/flutter/flutter/issues/122876" },
    ],
    solution:
      "Update to a Flutter version that includes the #118397 fix; for custom navigation flows, explicitly restore focus to the last-focused node with FocusNode.requestFocus() after a route pop.",
  },
  {
    id: "O9",
    principle: "Operable",
    title: "VoiceOver can't scroll a custom GestureDetector-built scrollable",
    description:
      "A hand-rolled scrollable built directly on GestureDetector (instead of Flutter's built-in scrollables) doesn't respond to VoiceOver's three-finger swipe scroll gesture, leaving screen-reader users unable to scroll that content at all.",
    platforms: ["iOS"],
    wcag: ["2.1.1 Keyboard (A)", "2.5.1 Pointer Gestures (A)"],
    sources: [{ label: "flutter/flutter #83699", url: "https://github.com/flutter/flutter/issues/83699" }],
    solution:
      "Prefer Flutter's built-in scrollable widgets (ListView, SingleChildScrollView, Scrollable) over custom GestureDetector-based scroll logic — they already implement the correct scrollUp/scrollDown semantics actions.",
  },
  {
    id: "O10",
    principle: "Operable",
    title: "WebView blocks or breaks accessibility navigation",
    description:
      "An embedded webview_flutter instance can intercept screen-reader swipe navigation to sibling widgets (like a back button); VoiceOver touch-exploration inside the WebView only supports discrete swiping rather than continuous exploration, and screen readers may fail to read the WebView's HTML content at all.",
    platforms: ["iOS", "Android"],
    wcag: ["2.1.1 Keyboard (A)", "4.1.2 Name, Role, Value (A)"],
    sources: [
      { label: "flutter/flutter #87030", url: "https://github.com/flutter/flutter/issues/87030" },
      { label: "flutter/flutter #151822", url: "https://github.com/flutter/flutter/issues/151822" },
      { label: "flutter/flutter #129108", url: "https://github.com/flutter/flutter/issues/129108" },
    ],
    solution:
      "No confirmed fix; where possible render critical content as native Flutter widgets instead of inside a WebView, and explicitly test assistive-technology navigation around any embedded WebView.",
  },
  {
    id: "O11",
    principle: "Operable",
    title: "Missing visible keyboard focus indicators on web/desktop",
    description:
      "Material widgets don't consistently draw a visible focus ring when navigated via keyboard on web or desktop, making it hard for low-vision and keyboard-only users to tell which control currently has focus.",
    platforms: ["Web", "Desktop"],
    wcag: ["2.4.7 Focus Visible (AA)", "2.4.13 Focus Appearance (AAA)"],
    sources: [{ label: "flutter/flutter #120425", url: "https://github.com/flutter/flutter/issues/120425" }],
    solution:
      "Add an explicit focus decoration (border/outline) via a Focus widget's onFocusChange or a FocusNode listener, since Material 3's built-in focus-ring support is incomplete; tracked as an open feature request.",
  },
  {
    id: "O12",
    principle: "Operable",
    title: "Dropdown/Menu/Link widgets miss ARIA roles and keyboard patterns on web",
    description:
      "Flutter's Link, Menu, MenuAnchor, DropdownMenu, and similar widgets don't expose the ARIA roles or full keyboard interaction patterns that native HTML equivalents provide automatically, so web screen-reader and keyboard users get an incomplete experience relative to native web apps.",
    platforms: ["Web"],
    wcag: ["4.1.2 Name, Role, Value (A)", "2.1.1 Keyboard (A)"],
    sources: [
      { label: "flutter/flutter #157210", url: "https://github.com/flutter/flutter/issues/157210" },
      { label: "flutter/flutter #157177", url: "https://github.com/flutter/flutter/issues/157177" },
      { label: "flutter/flutter #40101", url: "https://github.com/flutter/flutter/issues/40101" },
    ],
    solution:
      "Keep the Flutter SDK current — several of these have partial framework fixes landing over time; for critical web flows, consider testing against native <select>/<a> behavior as the accessibility bar.",
  },
  {
    id: "O13",
    principle: "Operable",
    title: "Nested Navigators can drop preceding widgets from the accessibility tree",
    description:
      "Widgets placed before a nested Navigator in the widget tree can become invisible to screen readers entirely, breaking the logical content flow for assistive-technology users even though the widgets render visually.",
    platforms: ["All"],
    wcag: ["1.3.2 Meaningful Sequence (A)", "4.1.2 Name, Role, Value (A)"],
    sources: [
      { label: "Top 10 Flutter Web accessibility issues", url: "https://cleancodestack.com/top-10-flutter-web-accessibility-issues/" },
    ],
    solution:
      "Avoid placing meaningful interactive content as a sibling immediately before a nested Navigator; if unavoidable, verify with the Semantics Debugger (DevTools) that the widget still appears in the tree once the Navigator is inserted.",
  },

  // ------------------------------------------------------------ Understandable
  {
    id: "U1",
    principle: "Understandable",
    title: "Semantics(header: true) is ignored by TalkBack",
    description:
      "Marking a widget as header: true in Semantics should make TalkBack announce it as a heading, but Android's isHeading logic now requires an explicit headingLevel greater than 0, with no fallback to the boolean flag — so headers silently stop being announced as headers.",
    platforms: ["Android"],
    wcag: ["2.4.6 Headings and Labels (AA)", "4.1.2 Name, Role, Value (A)"],
    sources: [{ label: "flutter/flutter #179678", url: "https://github.com/flutter/flutter/issues/179678" }],
    solution:
      "Set an explicit headingLevel (e.g. 1) on Semantics instead of relying on the boolean header flag, until the framework restores the fallback behavior.",
  },
  {
    id: "U2",
    principle: "Understandable",
    title: "IconButton announced incorrectly or too verbosely by TalkBack",
    description:
      "On Android 13+, an IconButton without an explicit label triggers TalkBack's own icon-detection heuristics, producing a verbose or simply wrong announcement instead of the label the developer intended.",
    platforms: ["Android"],
    wcag: ["4.1.2 Name, Role, Value (A)", "1.1.1 Non-text Content (A)"],
    sources: [{ label: "flutter/flutter #147045", url: "https://github.com/flutter/flutter/issues/147045" }],
    solution:
      "Always provide an explicit tooltip or Semantics(label:) on IconButton so TalkBack doesn't fall back to guessing from the icon asset.",
  },
  {
    id: "U3",
    principle: "Understandable",
    title: "DropdownMenu announces the wrong (last) option instead of the selection",
    description:
      "VoiceOver and TalkBack announce the last item in a DropdownMenu's option list rather than the value the user actually selected, misleading users about the current state of the control.",
    platforms: ["iOS", "Android"],
    wcag: ["4.1.2 Name, Role, Value (A)", "3.3.2 Labels or Instructions (A)"],
    sources: [{ label: "flutter/flutter #133742", url: "https://github.com/flutter/flutter/issues/133742" }],
    solution:
      "Update to a Flutter version including the fix (PR #156709) — there's no reliable app-level workaround for versions predating it.",
  },
  {
    id: "U4",
    principle: "Understandable",
    title: "TextField becomes invisible to TalkBack when suffixIcon is an IconButton",
    description:
      "A TextField with an IconButton as its suffixIcon can become completely invisible to TalkBack — the field stops being announced as an edit box at all, and users can't interact with it via screen reader.",
    platforms: ["Android"],
    wcag: ["4.1.2 Name, Role, Value (A)"],
    sources: [{ label: "flutter/flutter #151980", url: "https://github.com/flutter/flutter/issues/151980" }],
    solution:
      "No confirmed workaround at time of report (open issue); if hit, try a plain Icon plus a separate adjacent button outside the TextField's semantics scope, and re-test after each Flutter upgrade.",
  },
  {
    id: "U5",
    principle: "Understandable",
    title: "Form field errors aren't re-announced on refocus, or get over-announced",
    description:
      "When a user tabs away from and back to a form field with a validation error, TalkBack/VoiceOver doesn't re-announce the error on refocus, so users may miss why a field is invalid — and in multi-field forms, concatenated error text can be over-announced all at once.",
    platforms: ["Android", "iOS"],
    wcag: ["3.3.1 Error Identification (A)", "3.3.3 Error Suggestion (AA)"],
    sources: [
      { label: "flutter/flutter #91472", url: "https://github.com/flutter/flutter/issues/91472" },
      { label: "flutter/flutter PR #156399", url: "https://github.com/flutter/flutter/pull/156399" },
    ],
    solution:
      "Keep each field's errorText focused and singular rather than concatenating multiple errors into one string, and consider an explicit SemanticsService.announce() call when a field gains focus while invalid.",
  },
  {
    id: "U6",
    principle: "Understandable",
    title: "Live regions re-announce even when content hasn't changed (Android)",
    description:
      "A Semantics live region can re-announce its content every time a dialog closes, even though the underlying text didn't actually change — creating noisy, redundant announcements that native Android live regions wouldn't produce.",
    platforms: ["Android"],
    wcag: ["4.1.3 Status Messages (AA)"],
    sources: [
      { label: "flutter/flutter #166258", url: "https://github.com/flutter/flutter/issues/166258" },
      { label: "flutter/flutter PR #165531", url: "https://github.com/flutter/flutter/pull/165531" },
    ],
    solution:
      "Update to a Flutter version including the error-text live-region fix; in custom live regions, only call SemanticsService.announce() when the value has actually changed, rather than on every rebuild.",
  },
  {
    id: "U7",
    principle: "Understandable",
    title: "Live regions don't work at all on macOS",
    description:
      "The liveRegion semantics flag — meant to trigger an automatic, non-intrusive VoiceOver announcement when content changes without moving focus (loading states, validation errors) — doesn't work on macOS desktop, so state changes go completely unannounced.",
    platforms: ["macOS Desktop"],
    wcag: ["4.1.3 Status Messages (AA)"],
    sources: [{ label: "flutter/flutter #167318", url: "https://github.com/flutter/flutter/issues/167318" }],
    solution:
      "No fix confirmed; on macOS specifically, consider explicitly moving focus to the changed content as a fallback, since passive live-region announcement isn't available.",
  },

  // ------------------------------------------------------------------- Robust
  {
    id: "R1",
    principle: "Robust",
    title: "Custom/gesture-based tap targets aren't reliably exposed as an accessible action",
    description:
      "Widgets wrapped only in a bare GestureDetector, InkWell, or IconButton without explicit Semantics don't reliably expose a discoverable \"tap\" action — semantics-based widget test finders miss them, the same underlying gap that leaves them under-exposed to real assistive technology.",
    platforms: ["All"],
    wcag: ["4.1.2 Name, Role, Value (A)"],
    sources: [{ label: "flutter/flutter #126059", url: "https://github.com/flutter/flutter/issues/126059" }],
    solution:
      "Wrap custom tappable widgets in an explicit Semantics(onTap:, button: true, label:) rather than relying on the gesture handler alone to imply the action.",
  },
  {
    id: "R2",
    principle: "Robust",
    title: "Flutter Web accessibility is opt-in, not on by default",
    description:
      "For performance reasons, Flutter's web accessibility tree isn't built by default — a screen-reader user landing on a Flutter Web app must first find and activate a semantics-enabling control before the accessibility tree even exists, unlike native HTML which is accessible immediately.",
    platforms: ["Web"],
    wcag: ["4.1.2 Name, Role, Value (A)"],
    sources: [
      { label: "Flutter Web accessibility docs", url: "https://docs.flutter.dev/ui/accessibility/web-accessibility" },
      { label: "flutter/flutter #98160", url: "https://github.com/flutter/flutter/issues/98160" },
    ],
    solution:
      "Call SemanticsBinding.instance.ensureSemantics() programmatically at app startup so screen-reader users don't have to manually discover and activate the \"Enable accessibility\" control.",
  },
  {
    id: "R3",
    principle: "Robust",
    title: "DOM-based automated scanners give Flutter Web apps a false \"perfect score\"",
    description:
      "Because Flutter Web paints everything into a canvas (or an opaque semantics shim), DOM-based tools like Lighthouse, axe-core, WAVE, and Pa11y can't see the real UI at all and report a clean accessibility pass even when the app is unusable with an actual screen reader.",
    platforms: ["Web"],
    wcag: ["4.1.2 Name, Role, Value (A)"],
    sources: [
      { label: "\"Lighthouse gives your Flutter app a perfect a11y score — it's lying\"", url: "https://dev.to/sahland/lighthouse-gives-your-flutter-app-a-perfect-accessibility-score-its-lying-51f2" },
    ],
    solution:
      "Don't rely on Lighthouse/axe-core/WAVE for Flutter Web audits; use widget-test-based auditing that walks the live semantics tree, and always manually test with a real screen reader before shipping.",
  },
  {
    id: "R4",
    principle: "Robust",
    title: "Announcements are inconsistently read across web screen readers",
    description:
      "SemanticsService.announce and live-region-based announcements aren't consistently read by all screen readers on Flutter Web — some announcements are silently dropped, particularly when the same message is announced twice in a row, because NVDA/JAWS need special \"permanent live region\" handling that isn't uniformly implemented.",
    platforms: ["Web"],
    wcag: ["4.1.3 Status Messages (AA)"],
    sources: [
      { label: "flutter/flutter #142250", url: "https://github.com/flutter/flutter/issues/142250" },
      { label: "flutter/flutter #110204", url: "https://github.com/flutter/flutter/issues/110204" },
      { label: "flutter/engine PR #38015", url: "https://github.com/flutter/engine/pull/38015" },
    ],
    solution:
      "Vary announcement text slightly if the same message must repeat (identical repeated text can be swallowed), and test announcements specifically with NVDA and JAWS, not just VoiceOver/TalkBack.",
  },
  {
    id: "R5",
    principle: "Robust",
    title: "Building the semantics tree adds real per-frame performance overhead",
    description:
      "Enabling and maintaining the semantics tree has measurable per-frame cost, which is historically why Flutter doesn't turn it on by default; dense screens with many nested Semantics/MergeSemantics nodes can cause jank, especially while scrolling.",
    platforms: ["All"],
    wcag: ["Infrastructure — supports 4.1.2 / 4.1.3 compliance without regressing performance"],
    sources: [{ label: "flutter/flutter #150234", url: "https://github.com/flutter/flutter/issues/150234" }],
    solution:
      "Prefer fewer, richer semantic nodes over many small ones; use ExcludeSemantics for purely decorative content and MergeSemantics to group related meaning; profile in release mode (Flutter 3.32+ reportedly cut semantics-tree build time substantially).",
  },
  {
    id: "R6",
    principle: "Robust",
    title: "The framework's own contrast-testing utility has known gaps",
    description:
      "Flutter's built-in accessibility-guideline contrast test doesn't always produce correct results — for example, text inside MergeSemantics needs special-casing, and some text that shouldn't count toward semantics still gets tested — leading to false positives or negatives on contrast checks run in CI.",
    platforms: ["All"],
    wcag: ["1.4.3 Contrast (Minimum) (AA)"],
    sources: [{ label: "flutter/flutter #50376", url: "https://github.com/flutter/flutter/issues/50376" }],
    solution:
      "Don't treat a pass from Flutter's built-in contrast test as definitive; supplement with a third-party scanner (e.g. accessibility_tools or flutter_accessibility_scanner) that walks the live widget tree, plus a manual visual contrast check for critical text.",
  },
];

const PRINCIPLE_INFO = {
  Perceivable: {
    letter: "P",
    tagline: "Information and UI components must be presentable to users in ways they can perceive.",
  },
  Operable: {
    letter: "O",
    tagline: "UI components and navigation must be operable via keyboard, switch, and assistive-technology input.",
  },
  Understandable: {
    letter: "U",
    tagline: "Information and the operation of the UI must be understandable, with predictable, well-labeled behavior.",
  },
  Robust: {
    letter: "R",
    tagline: "Content must be robust enough to be interpreted reliably by assistive technologies and tooling.",
  },
};
