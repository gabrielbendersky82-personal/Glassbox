/* All mock figures for the AI Interaction Analysis prototype live here.
   One dataset per date range — the picker swaps the active dataset and
   every number on screen re-renders from it. Edit a number once and every
   screen that shows it updates. No date maths anywhere: labels are strings.
   Illustrative data for concept review — not real GlassBank figures.

   Invariants that keep the story straight across ranges:
   - Dispute a transaction stays the top failing intent, Missing tooling
     stays its leading cause, in every range.
   - Cost is observed only, and escalations only: avoidableCost = escalated ×
     $6.50 (a configured per-tenant input). 48-hour returns are displayed but
     never priced — a customer who escalated and returned would be counted
     twice. Phone contact is never counted, so the real figure is higher.
   - Struggle scores worsen in shorter ranges: the regression that began on
     4 March is recent, so narrowing the window sharpens it (0.74 → 0.62).
   - The 4 March marker only appears on trend charts whose window contains
     that date (twoWeeks / month / custom). Glassbox detects the step change
     from conversations; the prompt version is named from the customer's
     release calendar, never observed. */

var GLASSBOX_DATA = {

  ranges: {

    /* ------------------------------------------------ Past Day */
    day: {
      label: "Past Day (UTC+03:00)",
      prevPeriod: "Feb 24 – Feb 25",
      report: {
        changed: [
          { label: "Conversation Struggle Score", value: "0.74", prior: "0.66", delta: "+0.08", dir: "up" },
          { label: "Failing-intent rate", value: "29.8%", prior: "25.4%", delta: "+4.4pp", dir: "up" },
          { label: "Abandonment after answer", value: "25%", prior: "21%", delta: "+4pp", dir: "up" },
          { label: "Avoidable contact cost", value: "$1,131", prior: "$897", delta: "+$234", dir: "up" }
        ],
        periodLabel: "Day to 9 March 2026", priorScore: "0.66",
        bottomLine:
          "Assistant struggle rose from 0.66 to 0.74 over the last day. Most of the increase " +
          "comes from one cause: the assistant recognises transactional intents it has no tool " +
          "to act on, and deflects. Four intents account for 68% of failing conversations and an " +
          "estimated $1,131 in observed avoidable contact. Two are fixable with tooling; one is a " +
          "regression that began on 4 March and can be reverted this week."
      },
      dashboard: { score: "0.74", rank: "Poor", total: "1.6 K",
        struggledPct: "39%", struggledCount: "(630)", abandonedPct: "25%",
        repeatContact48h: "15%", unclassifiedShare: "9%" },
      charts: {
        struggle: { axis: "1.0", points: [0.70, 0.71, 0.73, 0.72, 0.74, 0.75, 0.74, 0.76] },
        volume:   { axis: "90",  points: [48, 71, 64, 83, 77, 68, 59, 52] },
        trend:    { mark: null,  points: [30.6, 30.9, 31.2, 30.8, 31.4, 31.0, 31.3, 31.5] }
      },
      intents: [
        { name: "Dispute a transaction", count: "176", pct: 11, barPx: 60,
          score: "0.79", scoreChip: "hi", hot: true, lead: "Missing tooling", esc: "66%",
          causes: [["Missing tooling", 78, "#E04141"], ["Context / retrieval", 11, "#F0A93B"],
                   ["Prompt / policy", 4, "#4F46E5"], ["Unclassified", 7, "#9A9AB0"]] },
        { name: "Refund status", count: "121", pct: 8, barPx: 41,
          score: "0.71", scoreChip: "hi", hot: true, lead: "Missing tooling", esc: "60%",
          causes: [["Missing tooling", 71, "#E04141"], ["Assistant latency", 14, "#F0A93B"],
                   ["Context / retrieval", 8, "#4F46E5"], ["Unclassified", 7, "#9A9AB0"]] },
        { name: "Card declined — why?", count: "96", pct: 6, barPx: 33,
          score: "0.62", scoreChip: "hi", hot: true, lead: "Context / retrieval", esc: "52%",
          causes: [["Context / retrieval", 73, "#F0A93B"], ["Prompt / policy", 11, "#4F46E5"],
                   ["Missing tooling", 7, "#E04141"], ["Unclassified", 9, "#9A9AB0"]] },
        { name: "Change address", count: "34", pct: 2, barPx: 12,
          score: "0.45", scoreChip: "lo", hot: false, lead: "Prompt / policy", esc: "35%",
          causes: [["Prompt / policy", 66, "#4F46E5"], ["Context / retrieval", 17, "#F0A93B"],
                   ["Missing tooling", 5, "#E04141"], ["Unclassified", 12, "#9A9AB0"]] },
        { name: "Payment failed", count: "31", pct: 2, barPx: 11,
          score: "0.42", scoreChip: "lo", hot: false, lead: "Assistant latency", esc: "33%",
          causes: [["Assistant latency", 72, "#F0A93B"], ["Context / retrieval", 12, "#4F46E5"],
                   ["Missing tooling", 5, "#E04141"], ["Unclassified", 11, "#9A9AB0"]] },
        { name: "Statement request", count: "18", pct: 1, barPx: 6,
          score: "0.29", scoreChip: "lo", hot: false, lead: "Unclassified", esc: "20%",
          causes: [["Unclassified", 61, "#9A9AB0"], ["Assistant latency", 19, "#F0A93B"],
                   ["Context / retrieval", 11, "#4F46E5"], ["Prompt / policy", 9, "#E04141"]] }
      ],
      funnel: {
        steps: [
          { n: "447", name: "Assistant opened", width: 100, colour: "" },
          { n: "231", name: "Intent: dispute_transaction", width: 52, colour: "" },
          { n: "168", name: "Assistant deflected — no backend call", width: 38, colour: "var(--amber)",
            note: "Intent recognised, no matching tool call observed in the session record." },
          { n: "139", name: "Escalated or abandoned", width: 31, colour: "var(--red)" }
        ],
        drops: ["↓ 48.3% raised a different intent", "↓ 27.3% received a usable answer", "↓ 17.3% resolved another way"],
        failureRatio: "31.1%", struggleScore: "0.79", struggleRank: "Poor",
        impact: [["Conversations affected", "176"], ["Escalated to a human", "82"],
                 ["Returned within 48 hours", "43", { note: "not in total" }],
                 ["Cost per handled contact (configured)", "$6.50",
                  { tip: "Set per tenant during onboarding. Default $6.50 — midpoint of the ContactBabel financial-services range ($5–$12 per contact)." }]],
        avoidableCost: "$533"
      }
    },

    /* ------------------------------------------------ Past Week */
    week: {
      label: "Past Week (UTC+03:00)",
      prevPeriod: "Feb 12 – Feb 19",
      report: {
        changed: [
          { label: "Conversation Struggle Score", value: "0.71", prior: "0.63", delta: "+0.08", dir: "up" },
          { label: "Failing-intent rate", value: "27.6%", prior: "23.6%", delta: "+4.0pp", dir: "up" },
          { label: "Abandonment after answer", value: "23%", prior: "19%", delta: "+4pp", dir: "up" },
          { label: "Avoidable contact cost", value: "$6,695", prior: "$5,343", delta: "+$1,352", dir: "up" }
        ],
        periodLabel: "Week of 9 March 2026", priorScore: "0.63",
        bottomLine:
          "Assistant struggle rose from 0.63 to 0.71 this week. Most of the increase comes from " +
          "one cause: the assistant recognises transactional intents it has no tool to act on, " +
          "and deflects. Four intents account for 66% of failing conversations and an estimated " +
          "$6,695 in observed avoidable contact. Two are fixable with tooling; one is a regression " +
          "that began on 4 March and can be reverted this week."
      },
      dashboard: { score: "0.71", rank: "Poor", total: "11.9 K",
        struggledPct: "37%", struggledCount: "(4.4K)", abandonedPct: "23%",
        repeatContact48h: "14%", unclassifiedShare: "9%" },
      charts: {
        struggle: { axis: "1.0",  points: [0.66, 0.68, 0.67, 0.70, 0.71, 0.72, 0.74] },
        volume:   { axis: "2.0K", points: [1.5, 1.8, 1.6, 1.9, 1.7, 1.8, 1.6] },
        trend:    { mark: null,   points: [28.2, 28.6, 28.4, 28.9, 29.1, 28.8, 29.2] }
      },
      intents: [
        { name: "Dispute a transaction", count: "1,094", pct: 9, barPx: 60,
          score: "0.76", scoreChip: "hi", hot: true, lead: "Missing tooling", esc: "63%",
          causes: [["Missing tooling", 76, "#E04141"], ["Context / retrieval", 12, "#F0A93B"],
                   ["Prompt / policy", 5, "#4F46E5"], ["Unclassified", 7, "#9A9AB0"]] },
        { name: "Refund status", count: "807", pct: 7, barPx: 44,
          score: "0.68", scoreChip: "hi", hot: true, lead: "Missing tooling", esc: "57%",
          causes: [["Missing tooling", 70, "#E04141"], ["Assistant latency", 15, "#F0A93B"],
                   ["Context / retrieval", 8, "#4F46E5"], ["Unclassified", 7, "#9A9AB0"]] },
        { name: "Card declined — why?", count: "731", pct: 6, barPx: 40,
          score: "0.60", scoreChip: "hi", hot: true, lead: "Context / retrieval", esc: "51%",
          causes: [["Context / retrieval", 72, "#F0A93B"], ["Prompt / policy", 12, "#4F46E5"],
                   ["Missing tooling", 7, "#E04141"], ["Unclassified", 9, "#9A9AB0"]] },
        { name: "Change address", count: "262", pct: 2, barPx: 14,
          score: "0.44", scoreChip: "lo", hot: false, lead: "Prompt / policy", esc: "34%",
          causes: [["Prompt / policy", 65, "#4F46E5"], ["Context / retrieval", 18, "#F0A93B"],
                   ["Missing tooling", 5, "#E04141"], ["Unclassified", 12, "#9A9AB0"]] },
        { name: "Payment failed", count: "241", pct: 2, barPx: 13,
          score: "0.42", scoreChip: "lo", hot: false, lead: "Assistant latency", esc: "32%",
          causes: [["Assistant latency", 71, "#F0A93B"], ["Context / retrieval", 12, "#4F46E5"],
                   ["Missing tooling", 6, "#E04141"], ["Unclassified", 11, "#9A9AB0"]] },
        { name: "Statement request", count: "149", pct: 1, barPx: 8,
          score: "0.28", scoreChip: "lo", hot: false, lead: "Unclassified", esc: "19%",
          causes: [["Unclassified", 59, "#9A9AB0"], ["Assistant latency", 20, "#F0A93B"],
                   ["Context / retrieval", 12, "#4F46E5"], ["Prompt / policy", 9, "#E04141"]] }
      ],
      funnel: {
        steps: [
          { n: "3.1K", name: "Assistant opened", width: 100, colour: "" },
          { n: "1.6K", name: "Intent: dispute_transaction", width: 51, colour: "" },
          { n: "1.1K", name: "Assistant deflected — no backend call", width: 36, colour: "var(--amber)",
            note: "Intent recognised, no matching tool call observed in the session record." },
          { n: "894", name: "Escalated or abandoned", width: 29, colour: "var(--red)" }
        ],
        drops: ["↓ 48.4% raised a different intent", "↓ 29.6% received a usable answer", "↓ 20.6% resolved another way"],
        failureRatio: "28.8%", struggleScore: "0.76", struggleRank: "Poor",
        impact: [["Conversations affected", "1,094"], ["Escalated to a human", "490"],
                 ["Returned within 48 hours", "261", { note: "not in total" }],
                 ["Cost per handled contact (configured)", "$6.50",
                  { tip: "Set per tenant during onboarding. Default $6.50 — midpoint of the ContactBabel financial-services range ($5–$12 per contact)." }]],
        avoidableCost: "$3,185"
      }
    },

    /* ------------------------------------------------ Past Two Weeks */
    twoWeeks: {
      label: "Past Two Weeks (UTC+03:00)",
      prevPeriod: "Jan 29 – Feb 12",
      report: {
        changed: [
          { label: "Conversation Struggle Score", value: "0.67", prior: "0.58", delta: "+0.09", dir: "up" },
          { label: "Failing-intent rate", value: "28.2%", prior: "24.1%", delta: "+4.1pp", dir: "up" },
          { label: "Abandonment after answer", value: "22%", prior: "18%", delta: "+4pp", dir: "up" },
          { label: "Avoidable contact cost", value: "$13,195", prior: "$10,530", delta: "+$2,665", dir: "up" }
        ],
        periodLabel: "Two weeks to 9 March 2026", priorScore: "0.58",
        bottomLine:
          "Assistant struggle rose from 0.58 to 0.67 over the past fortnight. Most of the " +
          "increase comes from one cause: the assistant recognises transactional intents it has " +
          "no tool to act on, and deflects. Four intents account for 69% of failing " +
          "conversations and an estimated $13,195 in observed avoidable contact. Two are fixable with " +
          "tooling; one is a regression that began on 4 March and can be reverted this week."
      },
      dashboard: { score: "0.67", rank: "Poor", total: "23.6 K",
        struggledPct: "36%", struggledCount: "(8.5K)", abandonedPct: "22%",
        repeatContact48h: "13%", unclassifiedShare: "8%" },
      charts: {
        struggle: { axis: "1.0",  points: [0.48, 0.50, 0.52, 0.58, 0.64, 0.66, 0.68, 0.69, 0.70, 0.71, 0.70, 0.72, 0.71, 0.73] },
        volume:   { axis: "2.0K", points: [1.5, 1.7, 1.6, 1.9, 1.6, 1.8, 1.7, 2.0, 1.8, 1.7, 1.9, 1.6, 1.8, 1.7] },
        trend:    { mark: { f: 0.14, label: "4 March" },
                    points: [18.1, 17.9, 27.0, 27.4, 27.2, 27.8, 28.1, 27.9, 28.3, 28.0, 28.4, 28.2, 28.6, 28.4] }
      },
      intents: [
        { name: "Dispute a transaction", count: "2,167", pct: 9, barPx: 60,
          score: "0.74", scoreChip: "hi", hot: true, lead: "Missing tooling", esc: "62%",
          causes: [["Missing tooling", 75, "#E04141"], ["Context / retrieval", 13, "#F0A93B"],
                   ["Prompt / policy", 5, "#4F46E5"], ["Unclassified", 7, "#9A9AB0"]] },
        { name: "Refund status", count: "1,633", pct: 7, barPx: 45,
          score: "0.66", scoreChip: "hi", hot: true, lead: "Missing tooling", esc: "56%",
          causes: [["Missing tooling", 69, "#E04141"], ["Assistant latency", 15, "#F0A93B"],
                   ["Context / retrieval", 9, "#4F46E5"], ["Unclassified", 7, "#9A9AB0"]] },
        { name: "Card declined — why?", count: "1,489", pct: 6, barPx: 41,
          score: "0.59", scoreChip: "hi", hot: true, lead: "Context / retrieval", esc: "50%",
          causes: [["Context / retrieval", 72, "#F0A93B"], ["Prompt / policy", 12, "#4F46E5"],
                   ["Missing tooling", 8, "#E04141"], ["Unclassified", 8, "#9A9AB0"]] },
        { name: "Change address", count: "571", pct: 2, barPx: 16,
          score: "0.44", scoreChip: "lo", hot: false, lead: "Prompt / policy", esc: "34%",
          causes: [["Prompt / policy", 64, "#4F46E5"], ["Context / retrieval", 18, "#F0A93B"],
                   ["Missing tooling", 6, "#E04141"], ["Unclassified", 12, "#9A9AB0"]] },
        { name: "Payment failed", count: "498", pct: 2, barPx: 14,
          score: "0.41", scoreChip: "lo", hot: false, lead: "Assistant latency", esc: "31%",
          causes: [["Assistant latency", 70, "#F0A93B"], ["Context / retrieval", 13, "#4F46E5"],
                   ["Missing tooling", 6, "#E04141"], ["Unclassified", 11, "#9A9AB0"]] },
        { name: "Statement request", count: "306", pct: 1, barPx: 8,
          score: "0.28", scoreChip: "lo", hot: false, lead: "Unclassified", esc: "18%",
          causes: [["Unclassified", 58, "#9A9AB0"], ["Assistant latency", 21, "#F0A93B"],
                   ["Context / retrieval", 12, "#4F46E5"], ["Prompt / policy", 9, "#E04141"]] }
      ],
      funnel: {
        steps: [
          { n: "6.2K", name: "Assistant opened", width: 100, colour: "" },
          { n: "3.1K", name: "Intent: dispute_transaction", width: 50, colour: "" },
          { n: "2.1K", name: "Assistant deflected — no backend call", width: 35, colour: "var(--amber)",
            note: "Intent recognised, no matching tool call observed in the session record." },
          { n: "1.7K", name: "Escalated or abandoned", width: 28, colour: "var(--red)" }
        ],
        drops: ["↓ 49.8% raised a different intent", "↓ 30.6% received a usable answer", "↓ 20.9% resolved another way"],
        failureRatio: "27.4%", struggleScore: "0.74", struggleRank: "Poor",
        impact: [["Conversations affected", "2,167"], ["Escalated to a human", "966"],
                 ["Returned within 48 hours", "514", { note: "not in total" }],
                 ["Cost per handled contact (configured)", "$6.50",
                  { tip: "Set per tenant during onboarding. Default $6.50 — midpoint of the ContactBabel financial-services range ($5–$12 per contact)." }]],
        avoidableCost: "$6,279"
      }
    },

    /* ------------------------------------------------ Past Month (default) */
    month: {
      label: "Past Month (UTC+03:00)",
      prevPeriod: "Dec 28 – Jan 27",
      report: {
        changed: [
          { label: "Conversation Struggle Score", value: "0.62", prior: "0.52", delta: "+0.10", dir: "up" },
          { label: "Failing-intent rate", value: "27.1%", prior: "22.4%", delta: "+4.7pp", dir: "up" },
          { label: "Abandonment after answer", value: "21%", prior: "17%", delta: "+4pp", dir: "up" },
          { label: "Avoidable contact cost", value: "$25,675", prior: "$20,514", delta: "+$5,161", dir: "up" }
        ],
        periodLabel: "Month to 9 March 2026", priorScore: "0.52",
        bottomLine:
          "Assistant struggle rose from 0.52 to 0.62 this month. Most of the increase comes from " +
          "one cause: the assistant recognises transactional intents it has no tool to act on, " +
          "and deflects. Four intents account for 70% of failing conversations and an estimated " +
          "$25,675 in observed avoidable contact. Two are fixable with tooling; one is a regression " +
          "that began on 4 March and can be reverted this week."
      },
      dashboard: { score: "0.62", rank: "Poor", total: "48.2 K",
        struggledPct: "34%", struggledCount: "(16.4K)", abandonedPct: "21%",
        repeatContact48h: "12%", unclassifiedShare: "8%" },
      charts: {
        struggle: { axis: "1.0",  points: [0.41, 0.42, 0.44, 0.47, 0.52, 0.56, 0.61, 0.64, 0.66] },
        volume:   { axis: "2.4K", points: [1.7, 1.9, 1.5, 2.1, 1.8, 2.3, 1.9, 2.4, 2.0, 2.4, 2.2] },
        trend:    { mark: { f: 0.48, label: "4 March" },
                    points: [18.0, 17.6, 18.2, 17.8, 18.0, 18.0, 26.5, 26.8, 27.2, 27.6, 28.0] }
      },
      intents: [
        { name: "Dispute a transaction", count: "4,212", pct: 9, barPx: 60,
          score: "0.71", scoreChip: "hi", hot: true, lead: "Missing tooling", esc: "61%",
          causes: [["Missing tooling", 74, "#E04141"], ["Context / retrieval", 14, "#F0A93B"],
                   ["Prompt / policy", 5, "#4F46E5"], ["Unclassified", 7, "#9A9AB0"]] },
        { name: "Refund status", count: "3,180", pct: 7, barPx: 46,
          score: "0.64", scoreChip: "hi", hot: true, lead: "Missing tooling", esc: "54%",
          causes: [["Missing tooling", 68, "#E04141"], ["Assistant latency", 16, "#F0A93B"],
                   ["Context / retrieval", 9, "#4F46E5"], ["Unclassified", 7, "#9A9AB0"]] },
        { name: "Card declined — why?", count: "2,940", pct: 6, barPx: 42,
          score: "0.58", scoreChip: "hi", hot: true, lead: "Context / retrieval", esc: "49%",
          causes: [["Context / retrieval", 71, "#F0A93B"], ["Prompt / policy", 12, "#4F46E5"],
                   ["Missing tooling", 8, "#E04141"], ["Unclassified", 9, "#9A9AB0"]] },
        { name: "Change address", count: "1,120", pct: 2, barPx: 18,
          score: "0.44", scoreChip: "lo", hot: false, lead: "Prompt / policy", esc: "33%",
          causes: [["Prompt / policy", 64, "#4F46E5"], ["Context / retrieval", 18, "#F0A93B"],
                   ["Missing tooling", 6, "#E04141"], ["Unclassified", 12, "#9A9AB0"]] },
        { name: "Payment failed", count: "980", pct: 2, barPx: 15,
          score: "0.41", scoreChip: "lo", hot: false, lead: "Assistant latency", esc: "31%",
          causes: [["Assistant latency", 70, "#F0A93B"], ["Context / retrieval", 13, "#4F46E5"],
                   ["Missing tooling", 6, "#E04141"], ["Unclassified", 11, "#9A9AB0"]] },
        { name: "Statement request", count: "610", pct: 1, barPx: 9,
          score: "0.28", scoreChip: "lo", hot: false, lead: "Unclassified", esc: "18%",
          causes: [["Unclassified", 58, "#9A9AB0"], ["Assistant latency", 21, "#F0A93B"],
                   ["Context / retrieval", 12, "#4F46E5"], ["Prompt / policy", 9, "#E04141"]] }
      ],
      funnel: {
        steps: [
          { n: "12.4K", name: "Assistant opened", width: 100, colour: "" },
          { n: "6.1K", name: "Intent: dispute_transaction", width: 49, colour: "" },
          { n: "4.2K", name: "Assistant deflected — no backend call", width: 34, colour: "var(--amber)",
            note: "Intent recognised, no matching tool call observed in the session record." },
          { n: "3.3K", name: "Escalated or abandoned", width: 27, colour: "var(--red)" }
        ],
        drops: ["↓ 50.8% raised a different intent", "↓ 31.1% received a usable answer", "↓ 21.4% resolved another way"],
        failureRatio: "26.6%", struggleScore: "0.71", struggleRank: "Poor",
        impact: [["Conversations affected", "4,212"], ["Escalated to a human", "1,880"],
                 ["Returned within 48 hours", "1,001", { note: "not in total" }],
                 ["Cost per handled contact (configured)", "$6.50",
                  { tip: "Set per tenant during onboarding. Default $6.50 — midpoint of the ContactBabel financial-services range ($5–$12 per contact)." }]],
        avoidableCost: "$12,220"
      }
    },

    /* ------------------------------------------------ Custom range (fixed dataset) */
    custom: {
      label: "Feb 1, 7:39 PM - Feb 26 2026, 7:39 PM (UTC+03:00)",
      prevPeriod: "Jan 6 – Jan 31",
      report: {
        changed: [
          { label: "Conversation Struggle Score", value: "0.63", prior: "0.53", delta: "+0.10", dir: "up" },
          { label: "Failing-intent rate", value: "27.1%", prior: "23.0%", delta: "+4.1pp", dir: "up" },
          { label: "Abandonment after answer", value: "21%", prior: "17%", delta: "+4pp", dir: "up" },
          { label: "Avoidable contact cost", value: "$22,269", prior: "$17,784", delta: "+$4,485", dir: "up" }
        ],
        periodLabel: "Feb 1 – Feb 26 2026", priorScore: "0.53",
        bottomLine:
          "Assistant struggle rose from 0.53 to 0.63 across the selected range. Most of the " +
          "increase comes from one cause: the assistant recognises transactional intents it has " +
          "no tool to act on, and deflects. Four intents account for 70% of failing " +
          "conversations and an estimated $22,269 in observed avoidable contact. Two are fixable with " +
          "tooling; one is a regression that began on 4 March and can be reverted this week."
      },
      dashboard: { score: "0.63", rank: "Poor", total: "41.8 K",
        struggledPct: "34%", struggledCount: "(14.2K)", abandonedPct: "21%",
        repeatContact48h: "12%", unclassifiedShare: "8%" },
      charts: {
        struggle: { axis: "1.0",  points: [0.44, 0.46, 0.49, 0.55, 0.62, 0.65, 0.68, 0.70, 0.71] },
        volume:   { axis: "2.0K", points: [1.4, 1.7, 1.5, 1.9, 1.6, 1.8, 1.7, 1.9, 1.6] },
        trend:    { mark: { f: 0.22, label: "4 March" },
                    points: [17.9, 18.2, 27.1, 27.5, 27.3, 27.9, 28.2, 28.0, 28.4] }
      },
      intents: [
        { name: "Dispute a transaction", count: "3,655", pct: 9, barPx: 60,
          score: "0.70", scoreChip: "hi", hot: true, lead: "Missing tooling", esc: "60%",
          causes: [["Missing tooling", 74, "#E04141"], ["Context / retrieval", 14, "#F0A93B"],
                   ["Prompt / policy", 5, "#4F46E5"], ["Unclassified", 7, "#9A9AB0"]] },
        { name: "Refund status", count: "2,762", pct: 7, barPx: 45,
          score: "0.63", scoreChip: "hi", hot: true, lead: "Missing tooling", esc: "53%",
          causes: [["Missing tooling", 68, "#E04141"], ["Assistant latency", 16, "#F0A93B"],
                   ["Context / retrieval", 9, "#4F46E5"], ["Unclassified", 7, "#9A9AB0"]] },
        { name: "Card declined — why?", count: "2,551", pct: 6, barPx: 42,
          score: "0.58", scoreChip: "hi", hot: true, lead: "Context / retrieval", esc: "48%",
          causes: [["Context / retrieval", 71, "#F0A93B"], ["Prompt / policy", 12, "#4F46E5"],
                   ["Missing tooling", 8, "#E04141"], ["Unclassified", 9, "#9A9AB0"]] },
        { name: "Change address", count: "973", pct: 2, barPx: 16,
          score: "0.44", scoreChip: "lo", hot: false, lead: "Prompt / policy", esc: "33%",
          causes: [["Prompt / policy", 64, "#4F46E5"], ["Context / retrieval", 18, "#F0A93B"],
                   ["Missing tooling", 6, "#E04141"], ["Unclassified", 12, "#9A9AB0"]] },
        { name: "Payment failed", count: "851", pct: 2, barPx: 14,
          score: "0.41", scoreChip: "lo", hot: false, lead: "Assistant latency", esc: "31%",
          causes: [["Assistant latency", 70, "#F0A93B"], ["Context / retrieval", 13, "#4F46E5"],
                   ["Missing tooling", 6, "#E04141"], ["Unclassified", 11, "#9A9AB0"]] },
        { name: "Statement request", count: "528", pct: 1, barPx: 9,
          score: "0.28", scoreChip: "lo", hot: false, lead: "Unclassified", esc: "18%",
          causes: [["Unclassified", 58, "#9A9AB0"], ["Assistant latency", 21, "#F0A93B"],
                   ["Context / retrieval", 12, "#4F46E5"], ["Prompt / policy", 9, "#E04141"]] }
      ],
      funnel: {
        steps: [
          { n: "10.7K", name: "Assistant opened", width: 100, colour: "" },
          { n: "5.3K", name: "Intent: dispute_transaction", width: 50, colour: "" },
          { n: "3.6K", name: "Assistant deflected — no backend call", width: 34, colour: "var(--amber)",
            note: "Intent recognised, no matching tool call observed in the session record." },
          { n: "2.9K", name: "Escalated or abandoned", width: 27, colour: "var(--red)" }
        ],
        drops: ["↓ 50.5% raised a different intent", "↓ 31.4% received a usable answer", "↓ 20.2% resolved another way"],
        failureRatio: "27.1%", struggleScore: "0.70", struggleRank: "Poor",
        impact: [["Conversations affected", "3,655"], ["Escalated to a human", "1,630"],
                 ["Returned within 48 hours", "868", { note: "not in total" }],
                 ["Cost per handled contact (configured)", "$6.50",
                  { tip: "Set per tenant during onboarding. Default $6.50 — midpoint of the ContactBabel financial-services range ($5–$12 per contact)." }]],
        avoidableCost: "$10,595"
      }
    }
  },


  /* ---- Assistant Portfolio meshboard (portfolio.html) ----
     Illustrative scenario: a portfolio of assistants across vendors and
     channels, scored on one scale. Rows sorted by struggle score. Only the
     Servicing Assistant drills into the AI Interaction Analysis meshboard.

     Scope: digital assistants only — web and mobile, where Glassbox captures
     the session. Voice/IVR is deliberately out of scope for this concept.
     Summary figures are volume-weighted across the rows below:
     score (48.2×0.62 + 21.4×0.44 + 30.8×0.38) / 100.4 = 0.51,
     escalated or abandoned (48.2×29% + 21.4×17% + 30.8×14%) / 100.4 = 22%. */
  /* ---- Assistant Portfolio meshboard (portfolio.html) ----
     Rows carry numbers rather than formatted strings, because the three
     summary cards are computed from whichever rows are visible. That way the
     assistant filter cannot disagree with the table underneath it, and the
     portfolio score stays the volume-weighted mean its tooltip promises.

     The Servicing Assistant's conversation count and struggle score are
     overridden at render time from the dashboard for the same range, so the
     two meshboards cannot drift apart no matter which range is selected. */
  portfolio: {
    assistants: [
      { key: "servicing", name: "Servicing Assistant", meta: "Chat · Vendor A",
        channels: ["Web"], href: "index.html" },
      { key: "sales", name: "Sales Assistant", meta: "Chat · Vendor B",
        channels: ["Web"] },
      { key: "inapp", name: "In-app Assistant", meta: "Mobile · in-house",
        channels: ["Mobile"] }
    ],

    /* k = conversations in thousands · score = struggle · task = completion ·
       esc = escalated or abandoned. Only the Servicing Assistant carries the
       regression, which is the point of the screen: the other two hold steady
       while the portfolio average is dragged down by one vendor's assistant. */
    ranges: {
      day: {
        servicing: { k: 1.6,  score: 0.74, task: "49%", esc: "34%", hot: true },
        sales:     { k: 0.7,  score: 0.46, task: "70%", esc: "18%", hot: false },
        inapp:     { k: 1.0,  score: 0.39, task: "75%", esc: "15%", hot: false }
      },
      week: {
        servicing: { k: 11.9, score: 0.71, task: "51%", esc: "32%", hot: true },
        sales:     { k: 5.3,  score: 0.45, task: "70%", esc: "18%", hot: false },
        inapp:     { k: 7.6,  score: 0.39, task: "75%", esc: "15%", hot: false }
      },
      twoWeeks: {
        servicing: { k: 23.6, score: 0.67, task: "52%", esc: "31%", hot: true },
        sales:     { k: 10.5, score: 0.45, task: "71%", esc: "17%", hot: false },
        inapp:     { k: 15.1, score: 0.38, task: "76%", esc: "14%", hot: false }
      },
      month: {
        servicing: { k: 48.2, score: 0.62, task: "54%", esc: "29%", hot: true },
        sales:     { k: 21.4, score: 0.44, task: "71%", esc: "17%", hot: false },
        inapp:     { k: 30.8, score: 0.38, task: "76%", esc: "14%", hot: false }
      },
      custom: {
        servicing: { k: 41.8, score: 0.63, task: "53%", esc: "30%", hot: true },
        sales:     { k: 18.6, score: 0.44, task: "71%", esc: "17%", hot: false },
        inapp:     { k: 26.7, score: 0.38, task: "76%", esc: "14%", hot: false }
      }
    }
  },

  /* ---- Weekly AI Interaction Report (report.html) ----
     Narrative that does not vary by range. The numbers in each finding are
     read at render time from the active range's `intents` row and funnel, so
     the report reconciles with the other screens by construction rather than
     by copying figures. Recommendations are proposals ("would address"),
     never instructions, and each one follows from its own cause. */
  reportMeta: {
    generated: "Generated Monday 9 March 2026",
    findings: [
      {
        intent: "Dispute a transaction",
        cause: "Missing tooling",
        confidence: "87% confidence",
        happening: "Customers ask to dispute a card transaction. The assistant recognises the " +
          "intent every time, points to a Help Centre article, then returns an identical " +
          "deflection with no account lookup. Most conversations end escalated or abandoned.",
        evidence: [
          { t: "Intent recognised at 0.91 on all turns", tier: 1 },
          { t: "No backend call during the conversation", tier: 1 },
          { t: "Deflection phrasing matched on 2 turns", tier: 1 },
          { t: "No state change on the account after the conversation", tier: 1 }
        ],
        recommendation: "Adding a dispute-initiation tool to the servicing assistant would " +
          "address this cluster directly. Where the tool cannot ship this quarter, handing off " +
          "to an agent at the point of recognition — rather than deflecting to the Help " +
          "Centre — would remove most of the repeat contact this cause generates.",
        effort: "Medium",
        costFrom: "funnel",
        links: [
          { label: "View 4,212 conversations", href: "conversation.html" },
          { label: "Open funnel", href: "funnel.html" }
        ]
      },
      {
        intent: "Refund status",
        cause: "Missing tooling",
        confidence: "82% confidence",
        happening: "Customers ask where their refund has got to. The assistant identifies the " +
          "intent and explains the refund policy correctly, but cannot look up the status of a " +
          "specific refund, so it directs the customer to call instead.",
        evidence: [
          { t: "Answer directs to phone on 71% of affected turns", tier: 1 },
          { t: "No order or payment record referenced in the reply", tier: 1 },
          { t: "No state change on the account after the conversation", tier: 1 },
          { t: "Intent recognised at 0.88 average across the cluster", tier: 1 },
          { t: "No backend call on the affected turns", tier: 1 }
        ],
        recommendation: "A read-only refund-status lookup would resolve most of this cluster. " +
          "The assistant needs to retrieve status rather than act on it, which is a materially " +
          "smaller change than the dispute tool. Surfacing expected refund dates in the " +
          "confirmation email would also reduce the volume reaching the assistant at all.",
        effort: "Low",
        cost: { day: "$351", week: "$2,093", twoWeeks: "$4,134", month: "$8,060", custom: "$6,994" },
        links: [
          { label: "View 3,180 conversations", href: "conversation.html" },
          { label: "Open funnel", href: "funnel.html" }
        ]
      },
      {
        intent: "Card declined — why?",
        cause: "Context / retrieval",
        confidence: "78% confidence",
        happening: "Customers ask why a card payment was declined. The assistant does call the " +
          "backend, but the content it retrieves covers general card FAQs rather than decline " +
          "reason codes, so the answer stays generic and customers re-ask with more detail.",
        evidence: [
          { t: "Generic answer repeated after the customer rephrased", tier: 1 },
          { t: "Customer re-asked with added detail the answer never used", tier: 1 },
          { t: "Backend call made on the affected turns", tier: 1 },
          { t: "Retrieved passages scored low relevance to the query", tier: 2 }
        ],
        recommendation: "The gap is decline reason codes: they exist in the payments record but " +
          "are not in the assistant's retrieval index. Indexing them, and grounding the answer in " +
          "the specific declined transaction, would address this cluster without new tooling.",
        effort: "Medium",
        cost: { day: "$182", week: "$1,053", twoWeeks: "$2,080", month: "$4,030", custom: "$3,497" },
        links: [
          { label: "View 2,940 conversations", href: "conversation.html" },
          { label: "Open funnel", href: "funnel.html" }
        ]
      },
      {
        intent: "Change address",
        cause: "Prompt / policy",
        confidence: "72% confidence",
        happening: "Customers ask to change their address. The assistant has the tooling, but its " +
          "policy wording asks for a verification step this channel cannot complete, so it " +
          "declines — and repeats the same policy text when pushed. The same behaviour appears " +
          "across unrelated intents, starting abruptly on 4 March.",
        evidence: [
          { t: "The same behaviour appears across unrelated intents", tier: 1 },
          { t: "Step change in failure rate beginning 4 March", tier: 1 },
          { t: "Prompt version v4.2 shipped that date — names what changed", tier: 2 }
        ],
        recommendation: "This is the one finding that can be reverted rather than built. The " +
          "behaviour starts abruptly on one date and spans unrelated intents, which points at the " +
          "policy wording rather than at any single journey; GlassBank's release calendar names " +
          "prompt v4.2 that day. Reverting or amending the verification clause would restore the " +
          "earlier completion rate. Worth A/B testing the amended wording before a full rollout.",
        effort: "Low",
        cost: { day: "$65", week: "$364", twoWeeks: "$702", month: "$1,365", custom: "$1,183" },
        links: [
          { label: "View 1,120 conversations", href: "conversation.html" },
          { label: "Open funnel", href: "funnel.html" }
        ]
      }
    ],

    /* Clusters the model declines to classify. Volumes reconcile with the
       dashboard's unclassified share (e.g. month 1,312 = 8% of 16.4K struggled).
       This section is deliberately visible — published, not hidden. */
    unclassified: [
      { intent: "Statement request",
        vol: { day: "18", week: "149", twoWeeks: "306", month: "610", custom: "528" },
        why: "No consistent signature across the cohort — struggle signals appear on different " +
          "turns with no repeated pattern. Needs labelled samples before a cause can be proposed." },
      { intent: "Card replacement",
        vol: { day: "22", week: "148", twoWeeks: "232", month: "425", custom: "368" },
        why: "Retrieval and latency signals appear in similar proportion. Separating them needs " +
          "Tier 2 retrieval context, which is not enabled on this assistant." },
      { intent: "Standing order amendment",
        vol: { day: "17", week: "99", twoWeeks: "142", month: "277", custom: "240" },
        why: "Volume sits below the threshold for a confident cluster judgement this period. " +
          "Re-check once the cohort is larger rather than acting on a weak signature." }
    ]
  },

  /* ---- Regression alerts emitted into Pulse ----
     Glassbox already runs anomaly detection (Anodot) and surfaces it through
     Pulse. This capability does not add an alerting engine — it contributes a
     new metric family for the existing one to watch. An alert is a detection
     event, so its figures describe the regression it found, not the window the
     analyst happens to be viewing; only `ranges` is range-sensitive.

     That list is the argument for alerting at all: a six-day step change is
     obvious against a one-day or one-week baseline and disappears into a
     30-day one. Custom (Feb 1 – Feb 26) ends before the regression starts, so
     it has nothing to show either. */
  alerts: [
    { title: "Regression detected",
      intent: "Dispute a transaction",
      metric: "conversation struggle up <b>0.19</b> since 4 March, against a 30-day baseline",
      affected: "412 conversations affected",
      detected: "Detected 7 March",
      source: "Detected by Pulse anomaly detection on a metric this capability emits. " +
        "Near-real-time detection of a statistical step change — not live intervention.",
      ranges: ["day", "week", "twoWeeks"] }
  ],

  /* ---- Struggle signal taxonomy (deck: nine signals, grouped by evidence
     source rather than signal type). Event labels and the replay legend must
     use exactly these names. */
  signalFamilies: [
    { name: "From the transcript",
      signals: ["Rephrase loops", "Circular conversations", "Explicit frustration", "Escalation requests"] },
    { name: "From the assistant's turns and timing",
      signals: ["Repeated intent failure", "Intent misunderstanding", "Deflection", "Response latency"] },
    { name: "From the session after the chat closes",
      signals: ["Abandonment after an answer", "Failed task completion", "Repeat contact within 48 hours"] }
  ],

  /* ---- Capture tiers (deck slide 5) ----
     Tier 1 is available day one from the session record, with no assistant
     integration. Tier 2 needs the optional assistant event schema. Every
     evidence clause below is tagged so the claim is auditable on screen. */
  tierKey: {
    1: "Tier 1 — from the session record, day one, no assistant integration",
    2: "Tier 2 — needs the optional assistant event schema"
  },

  /* GIA Cause Insights — one analysis per leading cause. Keyed by the
     `lead` field of the selected intent row. Copy stays hypothesis-level
     ("consistent with"), with the evidence directly beneath each claim.
     Classification is per cluster, never per conversation: `cluster` states
     the population the judgement is drawn from. */
  giaByCause: {
    "Missing tooling": {
      summary: "Customers raising <b>Dispute a transaction</b> and similar intents are " +
        "<b>recognised correctly</b> but the assistant has <b>no tool to act</b>. It points to a " +
        "help article, then falls back to deflection language with <b>no backend call</b> and " +
        "<b>no state change</b> on the account, and most conversations end escalated or abandoned.",
      takeaways: [
        "Give the assistant a dispute-initiation tool on <u>dispute_transaction</u>, or hand off directly instead of deflecting.",
        "Suppress identical consecutive responses — repeats immediately precede abandonment in this cohort.",
        "Attach the affected replays to the backlog item so the fix carries its own evidence."
      ],
      verdict: {
        confidence: "87% confidence",
        lead: "Consistent with a missing capability:",
        evidence: [
          { t: "Intent recognised at 0.91 on all turns", tier: 1 },
          { t: "No backend call during the conversation", tier: 1 },
          { t: "Deflection phrasing matched on 2 turns", tier: 1 },
          { t: "No state change on the account after the conversation", tier: 1 }
        ],
        cluster: "4,212 conversations share this signature this month."
      }
    },
    "Context / retrieval": {
      summary: "On <b>Card declined — why?</b> the assistant <b>does call the backend</b> but the " +
        "retrieved context <b>misses the decline reason</b>, so answers stay generic. Customers " +
        "rephrase, receive near-identical generic responses, and roughly half escalate or abandon.",
      takeaways: [
        "Index decline-reason codes so retrieval on <u>card_declined</u> returns the specific reason, not the generic card FAQ.",
        "Ground answers in the retrieved transaction record and cite it in the response.",
        "Flag answers produced from low-relevance retrievals for review before they ship."
      ],
      verdict: {
        confidence: "78% confidence",
        lead: "Consistent with a retrieval gap:",
        evidence: [
          { t: "Generic answer repeated after the customer rephrased", tier: 1 },
          { t: "Customer re-asked with added detail the answer never used", tier: 1 },
          { t: "Backend call made on the affected turns", tier: 1 },
          { t: "Retrieved passages scored low relevance to the query", tier: 2 }
        ],
        cluster: "2,940 conversations share this signature this month."
      }
    },
    "Prompt / policy": {
      summary: "On <b>Change address</b> the assistant has the tooling but its <b>policy wording " +
        "over-restricts</b>: it asks for verification steps the flow does not support, then " +
        "declines to proceed. Customers who push back receive the same policy text again. The " +
        "<b>same behaviour appears across unrelated intents, starting abruptly on one date</b> — " +
        "a pattern more consistent with a prompt or policy change than with a per-intent gap.",
      takeaways: [
        "Review the policy block governing <u>change_address</u> — it demands a verification path the channel cannot complete.",
        "Offer the in-app settings route as the next step instead of a bare refusal.",
        "A/B the softened wording against the current prompt before rolling out."
      ],
      verdict: {
        confidence: "72% confidence",
        lead: "Consistent with prompt or policy over-restriction:",
        evidence: [
          { t: "The same behaviour appears across unrelated intents", tier: 1 },
          { t: "Step change in failure rate beginning 4 March", tier: 1 },
          { t: "Prompt version v4.2 shipped that date — names what changed", tier: 2 }
        ],
        cluster: "1,120 conversations share this signature this month."
      }
    },
    "Assistant latency": {
      summary: "On <b>Payment failed</b> the assistant answers correctly but <b>slowly</b> — p95 " +
        "response latency runs well above the experience threshold, and a visible share of " +
        "customers <b>leave mid-wait</b> before the answer renders.",
      takeaways: [
        "Profile the retry-status lookup behind <u>payment_failed</u> — it dominates response time in this cohort.",
        "Stream a typing or progress state so the wait reads as work, not silence.",
        "Set a latency budget per turn and alert when p95 breaches it."
      ],
      verdict: {
        confidence: "81% confidence",
        lead: "Consistent with a latency problem:",
        evidence: [
          { t: "Response latency p95 of 9.4s on the affected turns", tier: 1 },
          { t: "Abandonment concentrated mid-wait, before the reply rendered", tier: 1 },
          { t: "Answer content rated usable once delivered", tier: 1 },
          { t: "Server-side processing time confirms the wait is upstream", tier: 2 }
        ],
        cluster: "980 conversations share this signature this month."
      }
    },
    "Unclassified": {
      summary: "For <b>Statement request</b> the detection model sees struggle signals but " +
        "<b>no single cause pattern clears the confidence bar</b>. The failure signatures here are " +
        "mixed, and the honest read is that this cohort needs labelling, not a verdict.",
      takeaways: [
        "Sample and label replays from <u>statement_request</u> to establish a dominant pattern.",
        "Do not act on a low-confidence hypothesis — collect before you fix.",
        "Re-check this cohort after the next detection-model update."
      ],
      verdict: {
        confidence: "Below threshold",
        lead: "No cause hypothesis reached the 60% confidence bar:",
        evidence: [
          { t: "Mixed signals across turns, no repeated signature", tier: 1 },
          { t: "Struggle score elevated but the pattern is inconclusive", tier: 1 },
          { t: "Assistant events would narrow this, if the schema were enabled", tier: 2 }
        ],
        cluster: "610 conversations sit in this cohort this month, published rather than hidden."
      }
    }
  },

  /* ---- What happened next: the same masked user across 48 hours ----
     The point of this strip is the boundary, not just the story: every step
     states whether it is in the session record or not. The phone call after
     the branch-locator visit is inferred and never observed, which is why the
     funnel prices contact as "observed only". */
  userTimeline: {
    title: "What happened next — 48 hours",
    sub: "Same masked user ********** · three sessions, one unresolved intent",
    steps: [
      { when: "Mar 12 · 10:24",
        what: "Transactions → Assistant → abandoned",
        detail: "No task completed. The dispute was never raised.",
        cap: "observed" },
      { when: "Mar 12 · +40 min",
        what: "Branch locator page",
        detail: "Searched for a branch, then left the site.",
        cap: "observed",
        gap: "Phone contact not captured — outside the session record" },
      { when: "Mar 14 · 09:12",
        what: "Returned, same intent",
        detail: "Raised dispute_transaction again. Escalated to a human.",
        cap: "observed" }
    ],
    foot: "All three sessions are in the record. The call the customer may have made between " +
      "them is not — which is why the funnel prices contact as observed only, and why the real " +
      "figure is higher than the one on screen."
  },

  /* ---- Screen 2 · conversation.html ----
     A replay is a single session, so these do not change with the range. */
  replay: {
    struggleScore: "0.71",
    /* No money in this header. The session abandoned without escalating, so
       under the escalations-only rule it contributes $0 to avoidable contact —
       the escalation happened two days later, in the Mar 14 session, and is
       priced there. The header states a Tier 1 observation instead, and it is
       the same signal the 48-hour strip at the foot of the screen expands on. */
    repeatContact: "48h",
    duration: "02:04"
  }
};

/* Compatibility aliases for screens not yet range-driven: funnel.html reads
   these until it is wired to the picker. Default range is Past Month. */
GLASSBOX_DATA.funnel = GLASSBOX_DATA.ranges.month.funnel;
GLASSBOX_DATA.dashboard = GLASSBOX_DATA.ranges.month.dashboard;
GLASSBOX_DATA.intents = GLASSBOX_DATA.ranges.month.intents;
