# Build brief — AI Interaction Analysis prototype

Drop this in the repo root as `CLAUDE.md` so it's picked up automatically.

---

## What this is

A clickable, static HTML prototype of a proposed Glassbox capability: **AI Interaction Analysis** — monitoring, diagnosing and quantifying failures in a bank's customer-facing AI assistant.

It is shown live during a 45-minute product interview presentation. It must look like a real Glassbox module, not a generic dashboard.

**Audience:** Glassbox product leadership. They know their own UI intimately. Fidelity to their visual language matters more than originality.

**Success:** three screens that hold up on a projector, click through without a stumble, and look like they were designed by the team that built the rest of the product.

---

## Stack — keep it boring

- **Plain static HTML, CSS and vanilla JS.** No framework, no build step, no dependencies.
- One file per screen, plus a shared `styles.css` and `app.js`.
- Google Fonts (Inter + Poppins) via `<link>`. No other external requests.
- Deploys to Vercel as a static site with zero configuration. No `vercel.json` needed.

Rationale: this must not break the morning of the interview. A build step is a liability, not a feature. Do not introduce React, Tailwind, a bundler, or a package.json unless explicitly asked.

```
/
├── index.html          → Screen 1 · AI Interaction Analysis dashboard
├── conversation.html   → Screen 2 · Conversation replay
├── funnel.html         → Screen 3 · Conversational funnel
├── styles.css
├── app.js
├── data.js             → all mock data in one place
└── CLAUDE.md
```

A starting implementation already exists as a single-file mockup — use it as the visual reference and split it into the structure above.

---

## Design tokens — match these exactly

```css
--bg:#F4F4F9         /* page background, very light lavender */
--card:#FFFFFF        --border:#E6E6EF     --border-soft:#F0F0F6
--text:#2E2E42        --dim:#6F6F86        --faint:#9A9AB0
--indigo:#4F46E5      /* primary action + active nav */
--indigo-soft:#EEF0FE --indigo-line:#C9CCFA
--navy:#201F45        /* the vertical Feedback tab only */
--amber:#F0A93B       --amber-soft:#FDF3E0   /* warning-level struggle */
--red:#E04141         --red-soft:#FBE3E3     --red-band:rgba(224,65,65,.16)
--green:#12A57A       --green-soft:#DEF5EC
--yellow-chip:#FAEFC2 --grey-chip:#EEEEF4    --teal:#5BC7C0
```

- **Type:** Inter for UI, Poppins for numerals, scores and metric values. Base size 13px — Glassbox runs dense.
- **Cards:** white, 1px `--border`, 10px radius, near-invisible shadow. No gradients, no heavy shadows.
- **Struggle scores:** always two decimals (`0.62`, `0.71`), always paired with a rank chip (`Poor` / `Good` / `Excellent`) and a severity emoji.
- **Left rail is white**, not dark. The only dark element is the vertical `Feedback` tab pinned to the far-left edge.
- Support light and dark via `prefers-color-scheme` plus a `data-theme` override, and keep it responsive down to tablet.

---

## Nav — real Glassbox order

Meshboards · Augmented Journey Map · Recorded Sessions · Interaction Maps · Mobile Analytics · Monitoring · Conversions · Product Intelligence · Alerts & Anomalies · Reports · Voice of the Silent.

Three items are live and link to the three screens: **Meshboards** (index), **Recorded Sessions** (conversation), **Conversions** (funnel). The rest render normally but are inert.

The new capability lives as a meshboard — breadcrumb `Meshboards › AI Interaction Analysis` — not as a new top-level nav item.

---

## Screen 1 — `index.html` · AI Interaction Analysis

Modelled directly on Glassbox's existing Struggle Analysis dashboard.

**Filter bar:** application chip `GlassBank-Web` · assistant chip `Servicing Assistant` · filter icon · refresh · `Past Month (UTC+03:00)`.

**Four cards across the top:**
1. Conversation Struggle Score — `0.62`, severity emoji, `Poor` chip
2. Struggle Score Over Time — inline SVG line, rising, 1.0 ceiling
3. Conversations — total `48.2K`, `Struggled 34% (16.4K)`, `Abandoned 21%`
4. Conversations Over Time — inline SVG line

**Failing intents table** (the centrepiece). Columns: Intent · Conversations affected (count *and* percent) · mini bar · Avg. Conversation Score (chip, sorted descending) · Leading cause · chevron.

Both prevalence and severity must be visible. This is Glassbox's own convention and it pre-empts the "you're just ranking by volume" objection.

**Right panel**, updating on row click: donut with percent, conversations affected, escalated-or-abandoned rate, cause breakdown bars, and a `See Also` block linking to the conversation replay and the funnel.

Keep **Unclassified** as a visible cause with real share. It signals the detection model admits uncertainty.

---

## Screen 2 — `conversation.html` · Conversation replay

The most important screen. Three columns inside a session-replay frame.

**Header:** flag, date, time, device icons, masked user ID (`**********`), `Struggles 0.71` with emoji, `↓ $38 Avoidable contact`, then Share Session / Create ▾ / **GIA Insights** / settings.

**Left — event list.** Page rows first (`GlassBank — Home`, `GlassBank — Transactions`) with mini struggle bars, then typed conversation events with timestamps:

`Assistant opened` · `User turn` (intent + confidence) · `Assistant turn` (latency + "no backend call") · **`Rephrase loop`** (amber) · **`Deflection language`** (amber) · **`Repeated intent failure`** (red) · **`Conversation abandoned`** (red) · `Page exit`.

**Centre — the transcript.** A chat widget rendered inside a browser frame. The story: customer wants to dispute a transaction from 8 March. The assistant recognises the intent correctly every time, points to a help article, then twice returns an *identical* deflection ("you'll need to contact us"), with no account lookup. Customer abandons at 01:52.

Each assistant message carries a small caption: timestamp, response latency, and `no account lookup`. Inline flag pills mark the rephrase loop, the deflection, and the abandonment.

Below it, a scrubber with translucent red struggle bands and circular markers at the flagged moments, time ticks, transport controls, `Duration: 02:04`.

**Right — GIA Conversation Insights.** Tabs `All / Technical / Behavioral`. Sections: Conversation Summary (prose), Key Takeaways (imperative bullets with underlined entity links), then a **cause verdict card**:

> ⚑ **Missing tooling** — 87% confidence
> Intent recognised at 0.91 on all turns · no backend call during the conversation · deflection phrasing matched on 2 turns · no state change on the account.
> Seen in 4,212 conversations with this signature this month.

Then an `Ask a question about this conversation` input (non-functional).

Every AI claim must show its evidence directly beneath it. That's the house rule across the whole product.

---

## Screen 3 — `funnel.html` · Conversational funnel

**Funnel steps:** Assistant opened `12.4K` → Intent: dispute_transaction `6.1K` → Assistant deflected, no backend call `4.2K` → Escalated or abandoned `3.3K`, with drop-off percentages between steps. Bars shift indigo → amber → red down the funnel.

**Failure ratio** `26.6%` · **Avg. Conversation Struggle Score** `0.71` with `Poor` chip · **Trend since prompt v4.2** showing a step change at the version marker.

**Business impact card:** conversations affected, escalated to a human, abandoned then contacted us, abandoned with no further contact, cost per handled contact, and a total avoidable contact cost of `$37,950`.

**Closing card — the backlog item this produces.** Add a dispute-initiation tool to the servicing assistant; intent recognised, no tool available, 4,212 conversations, 61% escalate or abandon, $37,950 avoidable cost, 4,212 replays attached as evidence.

That card is the point of the entire prototype. Give it visual weight.

---

## Language rules — these matter

- Say **Assistant** or **Conversation**. **Never "Bot"** — Glassbox already uses `Bot` / `Bot Reason` for automated traffic detection, and reusing it reads as not knowing the data model.
- Reuse their vocabulary: Struggle Score, Struggle Rank, Affected Sessions, Exit %, Find Sessions, See Also, Affected Page Journey, Meshboards, GIA.
- Cause names, fixed set: **Missing tooling · Context / retrieval · Prompt / policy · Assistant latency · Handoff · Unclassified**.
- Causes are **hypotheses with confidence**, never verdicts. Copy should say "consistent with", not "your system prompt is wrong".
- Every screen carries a small `Illustrative data for concept review` note.

---

## Guardrails

- No localStorage, no sessionStorage, no fetch, no API calls, no analytics.
- No CSS framework, no icon library — Unicode glyphs and inline SVG only.
- No animation beyond simple hover states. No fade-and-slide entrances.
- Charts are hand-written inline SVG. Do not add a charting library.
- Keep all mock numbers in `data.js` so they can be edited in one place.
- Visible keyboard focus; respect `prefers-reduced-motion`.

---

## Ship

```bash
git init && git add -A && git commit -m "AI Interaction Analysis prototype"
gh repo create glassbox-ai-prototype --private --source=. --push
```

Then import the repo in Vercel — framework preset **Other**, no build command, output directory `.`. Every push to `main` redeploys.

Before the interview: open the deployed URL on the actual presentation machine, click all three screens, and check it renders at 1280×720 as well as full width. Have a local copy open as a fallback in case the venue's network fails.
