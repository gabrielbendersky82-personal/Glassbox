/* All mock figures for the AI Interaction Analysis prototype live here.
   One dataset per date range — the picker swaps the active dataset and
   every number on screen re-renders from it. Edit a number once and every
   screen that shows it updates. No date maths anywhere: labels are strings.
   Illustrative data for concept review — not real GlassBank figures.

   Invariants that keep the story straight across ranges:
   - Dispute a transaction stays the top failing intent, Missing tooling
     stays its leading cause, in every range.
   - impact: affected = escalated + abandonedContacted + abandonedNoContact,
     avoidableCost = (escalated + abandonedContacted) × $11.50 exactly.
   - Struggle scores worsen in shorter ranges: the prompt v4.2 regression
     is recent, so narrowing the window sharpens it (0.74 day → 0.62 month).
   - The v4.2 marker only appears on trend charts whose window contains
     the release (twoWeeks / month / custom). */

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
          { label: "Avoidable contact cost", value: "$2,392", prior: "$1,932", delta: "+$460", dir: "up" }
        ],
        periodLabel: "Day to 9 March 2026", priorScore: "0.66",
        bottomLine:
          "Assistant struggle rose from 0.66 to 0.74 over the last day. Most of the increase " +
          "comes from one cause: the assistant recognises transactional intents it has no tool " +
          "to act on, and deflects. Four intents account for 68% of failing conversations and an " +
          "estimated $2,392 in avoidable contact. Two are fixable with tooling; one is a " +
          "regression from prompt v4.2 and can be reverted this week."
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
          { n: "168", name: "Assistant deflected — no backend call", width: 38, colour: "var(--amber)" },
          { n: "139", name: "Escalated or abandoned", width: 31, colour: "var(--red)" }
        ],
        drops: ["↓ 48.3% did not raise this intent", "↓ 27.3% received a usable answer", "↓ 17.3% resolved another way"],
        failureRatio: "31.1%", struggleScore: "0.79", struggleRank: "Poor",
        impact: [["Conversations affected", "176"], ["Escalated to a human", "81"],
                 ["Abandoned, then contacted us within 48h","59", "crmRecontact"], ["Abandoned, no further contact", "36", "crmAbsence"],
                 ["Cost per handled contact", "$11.50"]],
        avoidableCost: "$1,610"
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
          { label: "Avoidable contact cost", value: "$15,111", prior: "$12,190", delta: "+$2,921", dir: "up" }
        ],
        periodLabel: "Week of 9 March 2026", priorScore: "0.63",
        bottomLine:
          "Assistant struggle rose from 0.63 to 0.71 this week. Most of the increase comes from " +
          "one cause: the assistant recognises transactional intents it has no tool to act on, " +
          "and deflects. Four intents account for 66% of failing conversations and an estimated " +
          "$15,111 in avoidable contact. Two are fixable with tooling; one is a regression from " +
          "prompt v4.2 and can be reverted this week."
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
          { n: "1.1K", name: "Assistant deflected — no backend call", width: 36, colour: "var(--amber)" },
          { n: "894", name: "Escalated or abandoned", width: 29, colour: "var(--red)" }
        ],
        drops: ["↓ 48.4% did not raise this intent", "↓ 29.6% received a usable answer", "↓ 20.6% resolved another way"],
        failureRatio: "28.8%", struggleScore: "0.76", struggleRank: "Poor",
        impact: [["Conversations affected", "1,094"], ["Escalated to a human", "489"],
                 ["Abandoned, then contacted us within 48h","371", "crmRecontact"], ["Abandoned, no further contact", "234", "crmAbsence"],
                 ["Cost per handled contact", "$11.50"]],
        avoidableCost: "$9,890"
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
          { label: "Avoidable contact cost", value: "$29,923", prior: "$24,610", delta: "+$5,313", dir: "up" }
        ],
        periodLabel: "Two weeks to 9 March 2026", priorScore: "0.58",
        bottomLine:
          "Assistant struggle rose from 0.58 to 0.67 over the past fortnight. Most of the " +
          "increase comes from one cause: the assistant recognises transactional intents it has " +
          "no tool to act on, and deflects. Four intents account for 69% of failing " +
          "conversations and an estimated $29,923 in avoidable contact. Two are fixable with " +
          "tooling; one is a regression from prompt v4.2 and can be reverted this week."
      },
      dashboard: { score: "0.67", rank: "Poor", total: "23.6 K",
        struggledPct: "36%", struggledCount: "(8.5K)", abandonedPct: "22%",
        repeatContact48h: "13%", unclassifiedShare: "8%" },
      charts: {
        struggle: { axis: "1.0",  points: [0.48, 0.50, 0.52, 0.58, 0.64, 0.66, 0.68, 0.69, 0.70, 0.71, 0.70, 0.72, 0.71, 0.73] },
        volume:   { axis: "2.0K", points: [1.5, 1.7, 1.6, 1.9, 1.6, 1.8, 1.7, 2.0, 1.8, 1.7, 1.9, 1.6, 1.8, 1.7] },
        trend:    { mark: { f: 0.14, label: "v4.2 released" },
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
          { n: "2.1K", name: "Assistant deflected — no backend call", width: 35, colour: "var(--amber)" },
          { n: "1.7K", name: "Escalated or abandoned", width: 28, colour: "var(--red)" }
        ],
        drops: ["↓ 49.8% did not raise this intent", "↓ 30.6% received a usable answer", "↓ 20.9% resolved another way"],
        failureRatio: "27.4%", struggleScore: "0.74", struggleRank: "Poor",
        impact: [["Conversations affected", "2,167"], ["Escalated to a human", "966"],
                 ["Abandoned, then contacted us within 48h","730", "crmRecontact"], ["Abandoned, no further contact", "471", "crmAbsence"],
                 ["Cost per handled contact", "$11.50"]],
        avoidableCost: "$19,504"
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
          { label: "Avoidable contact cost", value: "$58,420", prior: "$47,150", delta: "+$11,270", dir: "up" }
        ],
        periodLabel: "Month to 9 March 2026", priorScore: "0.52",
        bottomLine:
          "Assistant struggle rose from 0.52 to 0.62 this month. Most of the increase comes from " +
          "one cause: the assistant recognises transactional intents it has no tool to act on, " +
          "and deflects. Four intents account for 70% of failing conversations and an estimated " +
          "$58,420 in avoidable contact. Two are fixable with tooling; one is a regression from " +
          "prompt v4.2 and can be reverted this week."
      },
      dashboard: { score: "0.62", rank: "Poor", total: "48.2 K",
        struggledPct: "34%", struggledCount: "(16.4K)", abandonedPct: "21%",
        repeatContact48h: "12%", unclassifiedShare: "8%" },
      charts: {
        struggle: { axis: "1.0",  points: [0.41, 0.42, 0.44, 0.47, 0.52, 0.56, 0.61, 0.64, 0.66] },
        volume:   { axis: "2.4K", points: [1.7, 1.9, 1.5, 2.1, 1.8, 2.3, 1.9, 2.4, 2.0, 2.4, 2.2] },
        trend:    { mark: { f: 0.48, label: "v4.2 released" },
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
          { n: "4.2K", name: "Assistant deflected — no backend call", width: 34, colour: "var(--amber)" },
          { n: "3.3K", name: "Escalated or abandoned", width: 27, colour: "var(--red)" }
        ],
        drops: ["↓ 50.8% did not raise this intent", "↓ 31.1% received a usable answer", "↓ 21.4% resolved another way"],
        failureRatio: "26.6%", struggleScore: "0.71", struggleRank: "Poor",
        impact: [["Conversations affected", "4,212"], ["Escalated to a human", "1,880"],
                 ["Abandoned, then contacted us within 48h","1,420", "crmRecontact"], ["Abandoned, no further contact", "912", "crmAbsence"],
                 ["Cost per handled contact", "$11.50"]],
        avoidableCost: "$37,950"
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
          { label: "Avoidable contact cost", value: "$50,669", prior: "$41,285", delta: "+$9,384", dir: "up" }
        ],
        periodLabel: "Feb 1 – Feb 26 2026", priorScore: "0.53",
        bottomLine:
          "Assistant struggle rose from 0.53 to 0.63 across the selected range. Most of the " +
          "increase comes from one cause: the assistant recognises transactional intents it has " +
          "no tool to act on, and deflects. Four intents account for 70% of failing " +
          "conversations and an estimated $50,669 in avoidable contact. Two are fixable with " +
          "tooling; one is a regression from prompt v4.2 and can be reverted this week."
      },
      dashboard: { score: "0.63", rank: "Poor", total: "41.8 K",
        struggledPct: "34%", struggledCount: "(14.2K)", abandonedPct: "21%",
        repeatContact48h: "12%", unclassifiedShare: "8%" },
      charts: {
        struggle: { axis: "1.0",  points: [0.44, 0.46, 0.49, 0.55, 0.62, 0.65, 0.68, 0.70, 0.71] },
        volume:   { axis: "2.0K", points: [1.4, 1.7, 1.5, 1.9, 1.6, 1.8, 1.7, 1.9, 1.6] },
        trend:    { mark: { f: 0.22, label: "v4.2 released" },
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
          { n: "3.6K", name: "Assistant deflected — no backend call", width: 34, colour: "var(--amber)" },
          { n: "2.9K", name: "Escalated or abandoned", width: 27, colour: "var(--red)" }
        ],
        drops: ["↓ 50.5% did not raise this intent", "↓ 31.4% received a usable answer", "↓ 20.2% resolved another way"],
        failureRatio: "27.1%", struggleScore: "0.70", struggleRank: "Poor",
        impact: [["Conversations affected", "3,655"], ["Escalated to a human", "1,630"],
                 ["Abandoned, then contacted us within 48h","1,232", "crmRecontact"], ["Abandoned, no further contact", "793", "crmAbsence"],
                 ["Cost per handled contact", "$11.50"]],
        avoidableCost: "$32,913"
      }
    }
  },

  /* Source notes for integration-dependent metrics. Lines flagged in the
     business-impact data carry a small "⇄ CRM" badge with this copy —
     honest about where Glassbox's native visibility ends. */
  sourceNotes: {
    crmRecontact: "Phone re-contact is joined from GlassBank's contact-centre / CRM records at customer level. " +
      "Digital re-contact (click-to-call, secure messaging) is measured natively by Glassbox.",
    crmAbsence: "An absence claim: asserting no further contact requires visibility of every channel, " +
      "so this line is computed only when contact-centre records are ingested. Without that feed it " +
      "narrows to no further digital contact observed."
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
  portfolio: {
    score: "0.51", rank: "Poor",
    total: "100.4 K", assistants: "3", channels: "Web · Mobile",
    escAbandoned: "22%",
    rows: [
      { name: "Servicing Assistant", meta: "Chat · Vendor A", count: "48.2 K", barPx: 60,
        score: "0.62", chip: "hi", hot: true, task: "54%", esc: "29%", href: "index.html" },
      { name: "Sales Assistant", meta: "Chat · Vendor B", count: "21.4 K", barPx: 27,
        score: "0.44", chip: "lo", hot: false, task: "71%", esc: "17%" },
      { name: "In-app Assistant", meta: "Mobile · in-house", count: "30.8 K", barPx: 38,
        score: "0.38", chip: "lo", hot: false, task: "76%", esc: "14%" }
    ]
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
          { t: "Deflection phrasing matched on 2 turns", tier: 1 },
          { t: "No state change on the account after the conversation", tier: 1 },
          { t: "Identical consecutive response repeated before abandonment", tier: 1 },
          { t: "Intent recognised at 0.91 on all turns", tier: 2 },
          { t: "No backend call during the conversation", tier: 2 }
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
          { t: "Intent recognised at 0.88 average across the cluster", tier: 2 },
          { t: "No backend call on the affected turns", tier: 2 }
        ],
        recommendation: "A read-only refund-status lookup would resolve most of this cluster. " +
          "The assistant needs to retrieve status rather than act on it, which is a materially " +
          "smaller change than the dispute tool. Surfacing expected refund dates in the " +
          "confirmation email would also reduce the volume reaching the assistant at all.",
        effort: "Low",
        cost: { day: "$506", week: "$3,450", twoWeeks: "$6,900", month: "$13,570", custom: "$11,776" },
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
          { t: "Backend call made on the affected turns", tier: 2 },
          { t: "Retrieved passages scored low relevance to the query", tier: 2 }
        ],
        recommendation: "The gap is decline reason codes: they exist in the payments record but " +
          "are not in the assistant's retrieval index. Indexing them, and grounding the answer in " +
          "the specific declined transaction, would address this cluster without new tooling.",
        effort: "Medium",
        cost: { day: "$207", week: "$1,403", twoWeeks: "$2,806", month: "$5,520", custom: "$4,784" },
        links: [
          { label: "View 2,940 conversations", href: "conversation.html" },
          { label: "Open funnel", href: "funnel.html" }
        ]
      },
      {
        intent: "Change address",
        cause: "Prompt / policy",
        confidence: "72% confidence",
        happening: "Customers ask to change their address. The assistant has the tooling, but the " +
          "policy wording introduced in prompt v4.2 asks for a verification step this channel " +
          "cannot complete, so it declines — and repeats the same policy text when pushed.",
        evidence: [
          { t: "Policy phrasing matched on the refusal turns", tier: 1 },
          { t: "Identical policy text repeated after the customer pushed back", tier: 1 },
          { t: "Failure rate steps up at the prompt v4.2 release date", tier: 1 },
          { t: "Tool available but never invoked", tier: 2 }
        ],
        recommendation: "This is the one finding that can be reverted rather than built. The " +
          "verification clause added in prompt v4.2 does not appear to be required by policy on " +
          "this journey — reverting or amending that clause would restore the pre-v4.2 completion " +
          "rate. Worth A/B testing the amended wording before a full rollout.",
        effort: "Low",
        cost: { day: "$69", week: "$368", twoWeeks: "$713", month: "$1,380", custom: "$1,196" },
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

  /* ---- Struggle signal taxonomy (deck slide: nine signals, three families) ----
     Event labels in the replay and the legend must use exactly these names. */
  signalFamilies: [
    { name: "Repetition and repair",
      signals: ["Rephrase loop", "Circular conversation", "Repeated intent failure"] },
    { name: "Sentiment and explicit signals",
      signals: ["Sentiment decline", "Explicit frustration", "Escalation requested"] },
    { name: "Outcome signals",
      signals: ["Abandonment after answer", "Failed task completion", "Intent misunderstanding"] }
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
          { t: "Deflection phrasing matched on 2 turns", tier: 1 },
          { t: "No state change on the account after the conversation", tier: 1 },
          { t: "Identical consecutive response repeated before abandonment", tier: 1 },
          { t: "Intent recognised at 0.91 on all turns", tier: 2 },
          { t: "No backend call during the conversation", tier: 2 }
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
          { t: "Backend call made on the affected turns", tier: 2 },
          { t: "Retrieved passages scored low relevance to the query", tier: 2 }
        ],
        cluster: "2,940 conversations share this signature this month."
      }
    },
    "Prompt / policy": {
      summary: "On <b>Change address</b> the assistant has the tooling but its <b>policy wording " +
        "over-restricts</b>: it asks for verification steps the flow does not support, then " +
        "declines to proceed. Customers who push back receive the same policy text again.",
      takeaways: [
        "Review the policy block governing <u>change_address</u> — it demands a verification path the channel cannot complete.",
        "Offer the in-app settings route as the next step instead of a bare refusal.",
        "A/B the softened wording against the current prompt before rolling out."
      ],
      verdict: {
        confidence: "72% confidence",
        lead: "Consistent with prompt or policy over-restriction:",
        evidence: [
          { t: "Policy phrasing matched on the refusal turns", tier: 1 },
          { t: "Identical policy text repeated after the customer pushed back", tier: 1 },
          { t: "No compliance constraint requires refusal on this journey", tier: 1 },
          { t: "Tool available but never invoked", tier: 2 }
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

  /* ---- Screen 2 · conversation.html ----
     A replay is a single session, so these do not change with the range. */
  replay: {
    struggleScore: "0.71",
    avoidableContact: "$38",
    duration: "02:04"
  }
};

/* Compatibility aliases for screens not yet range-driven: funnel.html reads
   these until it is wired to the picker. Default range is Past Month. */
GLASSBOX_DATA.funnel = GLASSBOX_DATA.ranges.month.funnel;
GLASSBOX_DATA.dashboard = GLASSBOX_DATA.ranges.month.dashboard;
GLASSBOX_DATA.intents = GLASSBOX_DATA.ranges.month.intents;
