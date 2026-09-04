/* All mock figures for the AI Interaction Analysis prototype live here.
   Edit a number once and every screen that shows it updates.
   Illustrative data for concept review — not real GlassBank figures. */

var GLASSBOX_DATA = {

  /* ---- Screen 1 · index.html ---- */
  dashboard: {
    struggleScore: "0.62",
    struggleRank: "Poor",
    totalConversations: "48.2 K",
    struggledPct: "34%",
    struggledCount: "(16.4K)",
    abandonedPct: "21%"
  },

  /* Failing intents table + right detail panel.
     causes: [name, percent, colour] — names come from the fixed set:
     Missing tooling · Context / retrieval · Prompt / policy ·
     Assistant latency · Handoff · Unclassified */
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

  /* ---- Screen 2 · conversation.html ---- */
  replay: {
    struggleScore: "0.71",
    avoidableContact: "$38",
    duration: "02:04"
  },

  /* ---- Screen 3 · funnel.html ---- */
  funnel: {
    steps: [
      { n: "12.4K", name: "Assistant opened", width: 100, colour: "" },
      { n: "6.1K", name: "Intent: dispute_transaction", width: 49, colour: "" },
      { n: "4.2K", name: "Assistant deflected — no backend call", width: 34, colour: "var(--amber)" },
      { n: "3.3K", name: "Escalated or abandoned", width: 27, colour: "var(--red)" }
    ],
    drops: [
      "↓ 50.8% did not raise this intent",
      "↓ 31.1% received a usable answer",
      "↓ 21.4% resolved another way"
    ],
    failureRatio: "26.6%",
    struggleScore: "0.71",
    struggleRank: "Poor",
    impact: [
      ["Conversations affected", "4,212"],
      ["Escalated to a human", "1,880"],
      ["Abandoned, then contacted us", "1,420"],
      ["Abandoned, no further contact", "912"],
      ["Cost per handled contact", "$11.50"]
    ],
    avoidableCost: "$37,950"
  }
};
