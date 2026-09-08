/* Shared behaviour for the AI Interaction Analysis prototype.
   No storage, no fetch, no analytics, no date maths — static demo only.
   All figures come from the active range dataset in data.js. */

(function () {
  "use strict";
  var D = window.GLASSBOX_DATA || {};
  var $ = function (id) { return document.getElementById(id); };

  var RANGE_ORDER = ["day", "week", "twoWeeks", "month", "custom"];
  var RANGE_NAMES = {
    day: "Past Day", week: "Past Week", twoWeeks: "Past Two Weeks",
    month: "Past Month", custom: "Custom range"
  };
  var activeKey = "month";
  var selectedIntent = null;

  function activeRange() { return D.ranges ? D.ranges[activeKey] : null; }

  /* ---- data-bind hydration (screens not yet range-driven) ---- */
  document.querySelectorAll("[data-bind]").forEach(function (el) {
    var v = el.dataset.bind.split(".").reduce(function (o, k) {
      return o == null ? o : o[k];
    }, D);
    if (v != null) el.textContent = v;
  });

  /* ---- conversation counts ----
     One parser and one formatter, so a count written on one screen and read on
     another is the same number. parseCount reads the display strings this file
     produces ("48.2 K", "4,212"); fmtCount writes them. */
  function parseCount(v) {
    var n = parseFloat(String(v).replace(/,/g, ""));
    return /k/i.test(String(v)) ? Math.round(n * 1000) : n;
  }
  function fmtCount(n) {
    return n >= 10000 ? (n / 1000).toFixed(1) + "K"
                      : Math.round(n).toLocaleString("en-US");
  }
  function pct(part, whole) { return (part / whole * 100).toFixed(1) + "%"; }

  /* The four funnel counts for a range. Only the middle two are stored; the
     population and the affected cluster are the dashboard's own figures, so
     the two screens cannot disagree about the same cohort. */
  /* Escalated or abandoned, as a share of the conversations the cluster
     affected — the same ratio the funnel's final drop describes. */
  function funnelEsc(r) {
    var c = funnelCounts(r);
    return Math.round(c.failed / c.deflected * 100) + "%";
  }

  function funnelCounts(r) {
    return {
      opened:    parseCount(r.dashboard.total),
      intent:    r.funnel.intentN,
      deflected: parseCount(r.intents[0].count),
      failed:    r.funnel.failedN
    };
  }

  /* ---- inline SVG line charts ----
     Series values map onto the 300-wide viewBox: x spaced 8..292, y scaled
     to the series' own min/max so each range's shape reads clearly. */
  function chartPaths(points, yTop, yBottom) {
    var min = Math.min.apply(null, points), max = Math.max.apply(null, points);
    var pad = (max - min) * 0.2 || 1;
    var lo = min - pad, hi = max + pad;
    var n = points.length;
    var coords = points.map(function (v, i) {
      var x = n === 1 ? 150 : 8 + i * (284 / (n - 1));
      var y = yBottom - (v - lo) / (hi - lo) * (yBottom - yTop);
      return Math.round(x * 10) / 10 + "," + Math.round(y * 10) / 10;
    });
    var line = "M" + coords.join(" L");
    return { line: line, fill: line + " L292,92 L8,92 Z" };
  }

  function renderChart(prefix, series) {
    var lineEl = $(prefix + "Line");
    if (!lineEl) return;
    var p = chartPaths(series.points, 14, 84);
    lineEl.setAttribute("d", p.line);
    var fillEl = $(prefix + "Fill");
    if (fillEl) fillEl.setAttribute("d", p.fill);
    var axisEl = $(prefix + "Axis");
    if (axisEl) axisEl.textContent = series.axis;
  }

  /* ---- dropdown picker (one implementation, shared by every filter) ----
     The range picker and the portfolio's assistant filter are the same
     control, so they share the .rp-menu / .rp-opt styling and this code. */
  function initPicker(btn, opts, getActive, onPick) {
    if (!btn) return;
    var wrap = btn.closest(".range-picker, .picker");
    var menu = document.createElement("div");
    menu.className = "rp-menu";
    menu.setAttribute("role", "listbox");
    menu.hidden = true;
    menu.innerHTML = opts.map(function (o) {
      return '<button class="rp-opt" role="option" data-val="' + o.value + '">' + o.label + "</button>";
    }).join("");
    wrap.appendChild(menu);

    function sync() {
      menu.querySelectorAll(".rp-opt").forEach(function (o) {
        var on = o.dataset.val === getActive();
        o.classList.toggle("on", on);
        o.setAttribute("aria-selected", String(on));
      });
    }

    function setOpen(open) {
      menu.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
    }

    btn.addEventListener("click", function () { setOpen(menu.hidden); });
    menu.addEventListener("click", function (e) {
      var opt = e.target.closest(".rp-opt");
      if (!opt) return;
      setOpen(false);
      btn.focus();
      onPick(opt.dataset.val);
      sync();
    });
    menu.addEventListener("keydown", function (e) {
      var list = Array.prototype.slice.call(menu.querySelectorAll(".rp-opt"));
      var i = list.indexOf(document.activeElement);
      if (e.key === "ArrowDown") { e.preventDefault(); (list[i + 1] || list[0]).focus(); }
      if (e.key === "ArrowUp") { e.preventDefault(); (list[i - 1] || list[list.length - 1]).focus(); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) { setOpen(false); btn.focus(); }
    });
    document.addEventListener("click", function (e) {
      if (!menu.hidden && !wrap.contains(e.target)) setOpen(false);
    });

    sync();
  }

  function initRangePicker(onChange) {
    var btn = $("rangeBtn");
    if (!btn) return;
    function label() { $("rangeLabel").textContent = activeRange().label; }
    initPicker(btn,
      RANGE_ORDER.map(function (k) { return { value: k, label: RANGE_NAMES[k] }; }),
      function () { return activeKey; },
      function (v) { activeKey = v; label(); onChange(activeRange()); });
    label();
  }

  /* ---- GIA Insights panel toggle (dashboard + replay) ---- */
  var giaBtn = $("giaBtn");
  var giaPanel = $("giaPanel");
  if (giaBtn && giaPanel) {
    var rbody = document.querySelector(".rbody");
    var setGia = function (open) {
      giaPanel.hidden = !open;
      giaBtn.setAttribute("aria-expanded", String(open));
      if (rbody) rbody.classList.toggle("gia-hidden", !open);
    };
    giaBtn.addEventListener("click", function () { setGia(giaPanel.hidden); });
    var giaClose = $("giaClose");
    if (giaClose) giaClose.addEventListener("click", function () { setGia(false); giaBtn.focus(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !giaPanel.hidden) { setGia(false); giaBtn.focus(); }
    });
  }

  /* Render evidence clauses with their capture-tier chip. Tier 1 is available
     from the session record on day one; Tier 2 needs the assistant event
     schema — the split is stated on screen because the deck is probed on it. */
  function evidenceList(evidence) {
    return '<ul class="evlist">' + evidence.map(function (e) {
      return "<li><em>" + e.t + "</em>" +
        '<span class="tier t' + e.tier + '" title="' + D.tierKey[e.tier] +
        '">T' + e.tier + "</span></li>";
    }).join("") + "</ul>";
  }

  function tierKeyHtml() {
    if (!D.tierKey) return "";
    return '<div class="tierkey">' + D.tierKey[1] + "<br>" + D.tierKey[2] + "</div>";
  }

  /* Fill the dashboard GIA panel with the analysis for one cause. */
  function renderGiaCause(intentName, causeName) {
    var g = D.giaByCause && D.giaByCause[causeName];
    var el = $("giaIntent");
    if (!g || !el) return;
    el.textContent = intentName;
    $("giaSummary").innerHTML = g.summary;
    $("giaTakeaways").innerHTML = g.takeaways.map(function (t) {
      return "<li>" + t + "</li>";
    }).join("");
    $("giaCause").textContent = causeName;
    $("giaConf").textContent = g.verdict.confidence;
    $("giaEvidence").innerHTML = g.verdict.lead + evidenceList(g.verdict.evidence) + tierKeyHtml();
    $("giaSeen").innerHTML = "<b>Cluster classification</b> — " + g.verdict.cluster;
  }

  /* ---- Screen 1 · dashboard ---- */
  var tbody = $("intents");

  function selectIntentRow(row, intents) {
    tbody.querySelectorAll("tr").forEach(function (x) { x.classList.remove("sel"); });
    row.classList.add("sel");
    var d = intents[+row.dataset.i];
    selectedIntent = d.name;
    $("panelTitle").textContent = d.name;
    $("panelN").textContent = d.count;
    /* The Dispute cluster's escalation share is the funnel's own arithmetic
       rather than a second figure that can disagree with it. */
    $("panelEsc").textContent = d.escFrom === "funnel" ? funnelEsc(activeRange()) : d.esc;
    $("ringPc").textContent = d.pct + "%";
    $("ring").setAttribute("stroke-dasharray", d.pct + " " + (100 - d.pct));
    $("causelist").innerHTML = d.causes.map(function (c) {
      return '<div class="causerow"><span style="width:112px">' + c[0] + "</span>" +
        '<span class="bar"><i style="width:' + c[1] + "%;background:" + c[2] + '"></i></span>' +
        '<span class="pc">' + c[1] + "%</span></div>";
    }).join("");
    renderGiaCause(d.name, d.lead);
  }

  /* ---- Regression alerts (dashboard) ----
     Glassbox already owns the alerting engine; this only emits into it. The
     banner appears only in the ranges an alert names, which is why the month
     view shows nothing: a 30-day baseline absorbs a six-day step change.
     A dismissal lasts only as long as the range it was made in: changing range
     is a new query, so the banner re-evaluates and comes back. No storage, per
     the guardrails. */
  var dismissed = {};
  var dismissedFor = null;

  function renderAlerts() {
    var bar = $("alertBar");
    if (!bar) return;
    if (dismissedFor !== activeKey) { dismissed = {}; dismissedFor = activeKey; }
    var live = (D.alerts || []).filter(function (a) {
      return a.ranges.indexOf(activeKey) !== -1 && !dismissed[a.intent];
    });
    bar.innerHTML = live.map(function (a) {
      return '<div class="alertbar" role="status" data-intent="' + a.intent + '">' +
        '<span class="ab-ico" aria-hidden="true">◬</span>' +
        '<div class="ab-body">' +
          '<div class="ab-line"><b>' + a.title + "</b> — <i>" + a.intent + "</i>: " +
            a.metric + ". " + a.affected + '. <b class="ab-when">' + a.detected + "</b></div>" +
          '<div class="src">' + a.source + "</div>" +
          '<div class="ab-acts">' +
            '<button type="button" class="ab-view">View cluster</button>' +
            '<button type="button" class="ab-pulse" title="Opens the alert in Pulse, where Glassbox anomaly detection already lives.">Open in Pulse</button>' +
          "</div>" +
        "</div>" +
        '<button type="button" class="ab-x" aria-label="Dismiss alert">✕</button>' +
      "</div>";
    }).join("");

    bar.querySelectorAll(".alertbar").forEach(function (el) {
      var intent = el.dataset.intent;
      el.querySelector(".ab-x").addEventListener("click", function () {
        dismissed[intent] = true;
        renderAlerts();
      });
      el.querySelector(".ab-view").addEventListener("click", function () {
        var r = activeRange(), rows = tbody.querySelectorAll("tr"), hit = -1;
        r.intents.forEach(function (d, i) { if (d.name === intent) hit = i; });
        if (hit < 0) return;
        selectIntentRow(rows[hit], r.intents);
        rows[hit].scrollIntoView({ block: "nearest" });
      });
    });
  }

  function renderDashboard(r) {
    $("dashScore").textContent = r.dashboard.score;
    var rank = $("dashRank");
    rank.textContent = r.dashboard.rank;
    rank.className = "rank " + r.dashboard.rank.toLowerCase();
    $("dashTotal").textContent = r.dashboard.total;
    $("dashStruggledPct").textContent = r.dashboard.struggledPct;
    $("dashStruggledCount").textContent = r.dashboard.struggledCount;
    $("dashAbandoned").textContent = r.dashboard.abandonedPct;
    $("dashRepeat").textContent = r.dashboard.repeatContact48h;
    $("dashUnclassified").textContent = r.dashboard.unclassifiedShare;
    renderChart("chartStruggle", r.charts.struggle);
    renderChart("chartVolume", r.charts.volume);
    renderAlerts();

    tbody.innerHTML = r.intents.map(function (d, i) {
      return '<tr data-i="' + i + '" tabindex="0">' +
        '<td><div class="intent"><span class="tick' + (d.hot ? "" : " grey") + '">⚑</span>' + d.name + "</div></td>" +
        '<td class="affected">' + d.count + " <span>(" + d.pct + "%)</span></td>" +
        '<td style="width:70px"><div class="minibar" style="width:' + d.barPx + 'px"></div></td>' +
        '<td class="r"><span class="chip ' + d.scoreChip + '">' + d.score + "</span></td>" +
        '<td class="cause">' + (d.lead === "Unclassified" ? d.lead : "<b>" + d.lead + "</b>") + "</td>" +
        '<td class="arrow">›</td></tr>';
    }).join("");

    var rows = tbody.querySelectorAll("tr");
    rows.forEach(function (row) {
      row.addEventListener("click", function () { selectIntentRow(row, r.intents); });
      row.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectIntentRow(row, r.intents); }
      });
    });

    /* keep the previously selected intent selected if it still exists */
    var keep = 0;
    r.intents.forEach(function (d, i) { if (d.name === selectedIntent) keep = i; });
    selectIntentRow(rows[keep], r.intents);
  }

  if (tbody && D.ranges) {
    initRangePicker(renderDashboard);
    renderDashboard(activeRange());
  }

  /* ---- Assistant Portfolio meshboard ----
     Both filters are live. The three summary cards are computed from the rows
     currently visible, so filtering to one assistant cannot leave a headline
     describing a portfolio that is no longer on screen. */
  var asst = $("assistants");
  if (asst && D.portfolio) {
    var assistantKey = "all";

    function fmtK(k) { return k.toFixed(1) + " K"; }

    function rankFor(score) {
      return score >= 0.5 ? "Poor" : score >= 0.3 ? "Good" : "Excellent";
    }

    function visibleAssistants() {
      var per = D.portfolio.ranges[activeKey];
      return D.portfolio.assistants
        .filter(function (a) { return assistantKey === "all" || a.key === assistantKey; })
        .map(function (a) {
          var m = per[a.key];
          /* The Servicing Assistant is the dashboard's subject, so its headline
             figures come from the dashboard for this same range rather than
             being written twice. */
          var isServicing = a.key === "servicing";
          var d = activeRange().dashboard;
          return {
            key: a.key, name: a.name, meta: a.meta, channels: a.channels, href: a.href,
            k: m.k, hot: m.hot, task: m.task, esc: m.esc,
            count: isServicing ? d.total : fmtK(m.k),
            score: isServicing ? d.score : m.score.toFixed(2),
            scoreN: isServicing ? parseFloat(d.score) : m.score
          };
        });
    }

    function renderPortfolio() {
      var rows = visibleAssistants();
      var one = assistantKey === "all" ? null : rows[0];
      var total = rows.reduce(function (t, r) { return t + r.k; }, 0);
      var score = rows.reduce(function (t, r) { return t + r.k * r.scoreN; }, 0) / total;
      var esc = rows.reduce(function (t, r) { return t + r.k * parseFloat(r.esc); }, 0) / total;
      var channels = [];
      rows.forEach(function (r) {
        r.channels.forEach(function (c) { if (channels.indexOf(c) === -1) channels.push(c); });
      });

      $("pfScore").textContent = score.toFixed(2);
      var rank = rankFor(score);
      var pfRank = $("pfRank");
      pfRank.textContent = rank;
      pfRank.className = "rank " + rank.toLowerCase();
      $("pfTotal").textContent = fmtK(total);
      $("pfAssistants").textContent = String(rows.length);
      $("pfChannels").textContent = channels.join(" · ");
      $("pfEsc").textContent = Math.round(esc) + "%";

      var who = one ? one.name : "all assistants";
      $("pfTotalLabel").textContent = "Total Conversations · " + who;
      $("pfEscLabel").textContent = "of conversations · " + who;

      /* The footnote only makes sense while the Servicing row is on screen. */
      var hint = $("pfHint");
      hint.hidden = !rows.some(function (r) { return r.href; });

      var maxK = Math.max.apply(null, rows.map(function (r) { return r.k; }));
      asst.innerHTML = rows.map(function (a) {
        return "<tr" + (a.href ? ' data-href="' + a.href + '" tabindex="0"' : ' class="norow"') + ">" +
          '<td><div class="intent"><span class="tick' + (a.hot ? "" : " grey") + '">▣</span>' +
            "<span>" + a.name + '<div class="asst-meta">' + a.meta + "</div></span></div></td>" +
          '<td class="affected">' + a.count + "</td>" +
          '<td style="width:70px"><div class="minibar" style="width:' +
            Math.round(a.k / maxK * 60) + 'px"></div></td>' +
          '<td class="r"><span class="chip ' + (a.scoreN >= 0.5 ? "hi" : "lo") + '">' + a.score + "</span></td>" +
          '<td class="cause"><b>' + a.task + "</b></td>" +
          '<td class="cause">' + a.esc + "</td>" +
          '<td class="arrow">' + (a.href ? "›" : "") + "</td></tr>";
      }).join("");

      asst.querySelectorAll("tr[data-href]").forEach(function (row) {
        var go = function () { window.location.href = row.dataset.href; };
        row.addEventListener("click", go);
        row.addEventListener("keydown", function (e) {
          if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
        });
      });
    }

    initRangePicker(renderPortfolio);
    initPicker($("asstBtn"),
      [{ value: "all", label: "All Assistants" }].concat(
        D.portfolio.assistants.map(function (a) { return { value: a.key, label: a.name }; })),
      function () { return assistantKey; },
      function (v) {
        assistantKey = v;
        $("asstLabel").textContent =
          v === "all" ? "All Assistants"
            : D.portfolio.assistants.filter(function (a) { return a.key === v; })[0].name;
        renderPortfolio();
      });

    renderPortfolio();
  }

  /* ---- Replay cause verdict (replay screen) ----
     The verdict card's evidence is rendered from the same giaByCause entry the
     dashboard panel reads, through the same evidenceList(). One chip component,
     one source of truth — the replay and the dashboard cannot drift apart. */
  var replayEv = $("replayEvidence");
  if (replayEv && D.giaByCause && D.giaByCause["Missing tooling"]) {
    var rv = D.giaByCause["Missing tooling"].verdict;
    replayEv.innerHTML = rv.lead + evidenceList(rv.evidence) + tierKeyHtml();
  }


  /* ---- What happened next: user timeline strip (replay screen) ----
     Every step states its capture status. The uncaptured phone call is shown
     as an explicit gap, not omitted — the boundary is the point. */
  var utl = $("userTimeline");
  if (utl && D.userTimeline) {
    var t = D.userTimeline;
    utl.innerHTML = "<h3>" + t.title + "</h3>" +
      '<div class="utl-sub">' + t.sub + "</div>" +
      '<div class="utl-row">' + t.steps.map(function (s, i) {
        return (i ? '<span class="utl-arrow">›</span>' : "") +
          '<div class="utl-step"><div class="utl-when">' + s.when + "</div>" +
          '<div class="utl-what">' + s.what + "</div>" +
          '<div class="utl-detail">' + s.detail + "</div>" +
          '<span class="utl-cap ' + s.cap + '">' +
            (s.cap === "observed" ? "Observed in the session record" : "Not captured") + "</span>" +
          (s.gap ? '<div class="utl-gap"><b>Not captured</b>' + s.gap + "</div>" : "") +
          "</div>";
      }).join("") + "</div>" +
      '<div class="utl-foot">' + t.foot + "</div>";
  }

  /* ---- Weekly AI Interaction Report ----
     Finding numbers are read from the active range so the report reconciles
     with the dashboard and funnel by construction. */
  var repFindings = $("repFindings");

  function findingCost(r, meta) {
    if (meta.costFrom === "funnel") return r.funnel.avoidableCost;
    return meta.cost && meta.cost[activeKey];
  }

  function renderReport(r) {
    if (!repFindings || !D.reportMeta) return;
    $("repGenerated").textContent = D.reportMeta.generated;
    $("repPeriod").textContent = r.report.periodLabel;
    $("repPeriodCrumb").textContent = r.report.periodLabel;
    $("repBottomLine").textContent = r.report.bottomLine;

    $("repChanged").innerHTML = r.report.changed.map(function (c) {
      return '<div class="chg"><div class="lbl">' + c.label + "</div>" +
        '<div class="val">' + c.value +
        '<span class="delta ' + c.dir + '" style="font-family:Inter">' + c.delta + "</span></div>" +
        '<div class="cmp">from ' + c.prior + " last period</div></div>";
    }).join("");

    $("repUnclassified").innerHTML = D.reportMeta.unclassified.map(function (u) {
      return '<div class="uncl"><div class="un-i">' + u.intent + "</div>" +
        '<div class="un-v">' + u.vol[activeKey] + "</div>" +
        '<div class="un-w">' + u.why + "</div></div>";
    }).join("");

    repFindings.innerHTML = D.reportMeta.findings.map(function (m, i) {
      var row = null;
      r.intents.forEach(function (x) { if (x.name === m.intent) row = x; });
      if (!row) return "";
      return '<div class="finding">' +
        '<div class="fhead"><span class="rank-n">' + (i + 1) + "</span>" +
          '<span class="ftitle">' + m.intent + "</span>" +
          '<span class="fstats"><span><b>' + row.count + "</b> conversations (" + row.pct + "%)</span>" +
          '<span class="chip ' + row.scoreChip + '">' + row.score + "</span></span></div>" +

        '<div class="fblock"><div class="lbl">What&rsquo;s happening</div><p>' + m.happening + "</p></div>" +

        '<div class="fblock"><div class="lbl">Why</div>' +
          '<div class="fcause"><span style="color:var(--red)">⚑</span>' + m.cause +
          '<span class="conf">' + m.confidence + "</span></div>" +
          evidenceList(m.evidence) + tierKeyHtml() + "</div>" +

        '<div class="fblock"><div class="lbl">What to do</div><p>' + m.recommendation + "</p></div>" +

        '<div class="fblock"><div class="lbl">What it&rsquo;s worth</div>' +
          '<div class="worth"><span class="amt">' + findingCost(r, m) + "</span>" +
          '<span style="font-size:12.5px;color:var(--dim)">estimated avoidable contact</span>' +
          '<span class="effort ' + m.effort.toLowerCase() + '">' + m.effort + " effort</span></div></div>" +

        '<div class="flinks">' + m.links.map(function (l) {
          return '<a href="' + l.href + '">' + l.label + "</a>";
        }).join("") + "</div></div>";
    }).join("");
  }

  if (repFindings && D.ranges) {
    initRangePicker(renderReport);
    renderReport(activeRange());
  }

  /* ---- Screen 3 · funnel (month dataset until wired to the picker) ----
     Every number below is computed from the four counts, and two of those are
     the dashboard's own. Nothing on this screen restates a figure that lives
     somewhere else, which is what stops the two screens contradicting each
     other about the same cohort. */
  var FUNNEL_STEPS = [
    { name: "Intent: dispute_transaction" },
    { name: "Assistant deflected — no backend call", colour: "var(--amber)",
      note: "Intent recognised, no matching tool call observed in the session record." },
    { name: "Escalated or abandoned", colour: "var(--red)" }
  ];
  var FUNNEL_DROPS = ["received a usable answer", "resolved another way"];

  var funsteps = $("funsteps");
  if (funsteps && D.ranges) {
    var fr = D.ranges.month;
    var fc = funnelCounts(fr);
    var order = [fc.intent, fc.deflected, fc.failed];

    /* The population sits above the funnel as context rather than as its first
       bar. At true scale a 48.2K first step renders the other three as stubs of
       near-identical length, which hides the drop-offs the funnel exists to
       show; scaling them to a 48.2K bar instead would need a broken axis. So
       the funnel measures the intent journey and states the population in
       words — no scale break, nothing for a reader to misjudge by length. */
    $("funPopulation").innerHTML =
      "<b>Assistant opened</b> — " + fmtCount(fc.opened) +
      " conversations in this range. " + pct(fc.opened - fc.intent, fc.opened) +
      " raised a different intent; this funnel follows the " + fmtCount(fc.intent) +
      " that raised <b>dispute_transaction</b>.";

    funsteps.innerHTML = FUNNEL_STEPS.map(function (st, i) {
      var bar = '<div class="bar" style="width:' +
        (order[i] / order[0] * 100).toFixed(1) + "%" +
        (st.colour ? ";background:" + st.colour : "") + '"></div>';
      var drop = i < FUNNEL_DROPS.length
        ? '<div class="drop">↓ ' + pct(order[i] - order[i + 1], order[i]) + " " +
          FUNNEL_DROPS[i] + "</div>"
        : "";
      var note = st.note ? '<div class="step-note">' + st.note + "</div>" : "";
      return '<div class="step"><div class="lab"><span class="n">' + fmtCount(order[i]) +
        '</span><span class="nm">' + st.name + "</span></div>" + bar + note + "</div>" + drop;
    }).join("");

    /* Failure ratio is scoped to the people who raised this intent, so it is
       also exactly the width of the last bar. */
    $("funFailure").textContent = pct(fc.failed, fc.intent);
    $("funEsc").textContent = funnelEsc(fr);
    $("funAffected").textContent = fmtCount(fc.deflected);
  }

  var impact = $("impactlines");
  if (impact && D.funnel) {
    impact.innerHTML = D.funnel.impact.map(function (l) {
      var extra = "";
      if (l[2] && l[2].tip) {
        extra = ' <span class="info tip-left" tabindex="0" data-tip="' + l[2].tip + '">\u24d8</span>';
      } else if (l[2] && l[2].note) {
        extra = ' <span class="line-note">' + l[2].note + "</span>";
      }
      return '<div class="line"><span>' + l[0] + extra + "</span><b>" + l[1] + "</b></div>";
    }).join("");
  }
})();
