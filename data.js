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

  /* GIA Cause Insights — one analysis per leading cause. Keyed by the
     `lead` field of the selected intent row. Copy stays hypothesis-level
     ("consistent with"), with the evidence directly beneath each claim. */
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
        evidence: "Consistent with a missing capability: <em>intent recognised</em> at high confidence · " +
          "<em>no backend call</em> during the conversation · <em>deflection phrasing</em> matched · " +
          "<em>no state change</em> on the account.",
        seen: "Seen in <u>4,212 conversations</u> with this signature this month."
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
        evidence: "Consistent with a retrieval gap: <em>backend call made</em> on affected turns · " +
          "<em>retrieved passages</em> scored low relevance to the query · <em>generic answer</em> " +
          "repeated after rephrase · account data <em>available but unused</em>.",
        seen: "Seen in <u>2,940 conversations</u> with this signature this month."
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
        evidence: "Consistent with prompt or policy over-restriction: <em>tool available</em> but not invoked · " +
          "<em>policy phrasing</em> matched on the refusal turns · <em>identical policy text</em> repeated " +
          "after pushback · no compliance constraint requires refusal here.",
        seen: "Seen in <u>1,120 conversations</u> with this signature this month."
      }
    },
    "Assistant latency": {
      summary: "On <b>Payment failed</b> the assistant answers correctly but <b>slowly</b> — p95 " +
        "response latency runs well above the experience threshold, and a visible share of " +
        "customers <b>leave mid-wait</b> before the answer renders.",
      takeaways: [
        "Profile the retry-status lookup behind <u>payment_failed</u> — it dominates response time in this cohort.",
        "Stream a typing/progress state so the wait reads as work, not silence.",
        "Set a latency budget per turn and alert when p95 breaches it."
      ],
      verdict: {
        confidence: "81% confidence",
        evidence: "Consistent with a latency problem: <em>response latency</em> p95 of 9.4s on affected turns · " +
          "<em>abandonment concentrated mid-wait</em>, before the reply rendered · answer content itself " +
          "<em>rated usable</em> when delivered.",
        seen: "Seen in <u>980 conversations</u> with this signature this month."
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
        evidence: "No cause hypothesis reached the 60% confidence bar: <em>mixed signals</em> across turns · " +
          "<em>no repeated signature</em> within the cohort · struggle score elevated but " +
          "<em>pattern inconclusive</em>. The model reports uncertainty rather than guessing.",
        seen: "Applies to <u>610 conversations</u> in this cohort this month."
      }
    }
  },

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
