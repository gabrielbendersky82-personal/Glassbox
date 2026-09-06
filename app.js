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

  /* ---- date range picker (one implementation, initialised per screen) ---- */
  function initRangePicker(onChange) {
    var btn = $("rangeBtn");
    if (!btn) return;
    var wrap = btn.closest(".range-picker");
    var menu = document.createElement("div");
    menu.className = "rp-menu";
    menu.setAttribute("role", "listbox");
    menu.hidden = true;
    menu.innerHTML = RANGE_ORDER.map(function (k) {
      return '<button class="rp-opt" role="option" data-range="' + k + '">' + RANGE_NAMES[k] + "</button>";
    }).join("");
    wrap.appendChild(menu);

    function syncLabel() {
      $("rangeLabel").textContent = activeRange().label;
      menu.querySelectorAll(".rp-opt").forEach(function (o) {
        o.classList.toggle("on", o.dataset.range === activeKey);
        o.setAttribute("aria-selected", String(o.dataset.range === activeKey));
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
      activeKey = opt.dataset.range;
      syncLabel();
      setOpen(false);
      btn.focus();
      onChange(activeRange());
    });
    menu.addEventListener("keydown", function (e) {
      var opts = Array.prototype.slice.call(menu.querySelectorAll(".rp-opt"));
      var i = opts.indexOf(document.activeElement);
      if (e.key === "ArrowDown") { e.preventDefault(); (opts[i + 1] || opts[0]).focus(); }
      if (e.key === "ArrowUp") { e.preventDefault(); (opts[i - 1] || opts[opts.length - 1]).focus(); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) { setOpen(false); btn.focus(); }
    });
    document.addEventListener("click", function (e) {
      if (!menu.hidden && !wrap.contains(e.target)) setOpen(false);
    });

    syncLabel();
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
        '<span class="tier t' + e.tier + '">Tier ' + e.tier + "</span></li>";
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
    $("panelEsc").textContent = d.esc;
    $("ringPc").textContent = d.pct + "%";
    $("ring").setAttribute("stroke-dasharray", d.pct + " " + (100 - d.pct));
    $("causelist").innerHTML = d.causes.map(function (c) {
      return '<div class="causerow"><span style="width:112px">' + c[0] + "</span>" +
        '<span class="bar"><i style="width:' + c[1] + "%;background:" + c[2] + '"></i></span>' +
        '<span class="pc">' + c[1] + "%</span></div>";
    }).join("");
    renderGiaCause(d.name, d.lead);
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

  /* ---- Assistant Portfolio meshboard ---- */
  var asst = $("assistants");
  if (asst && D.portfolio) {
    var pf = D.portfolio;
    $("pfScore").textContent = pf.score;
    var pfRank = $("pfRank");
    pfRank.textContent = pf.rank;
    pfRank.className = "rank " + pf.rank.toLowerCase();
    $("pfTotal").textContent = pf.total;
    $("pfAssistants").textContent = pf.assistants;
    $("pfChannels").textContent = pf.channels;
    $("pfEsc").textContent = pf.escAbandoned;

    asst.innerHTML = pf.rows.map(function (a) {
      return "<tr" + (a.href ? ' data-href="' + a.href + '" tabindex="0"' : ' class="norow"') + ">" +
        '<td><div class="intent"><span class="tick' + (a.hot ? "" : " grey") + '">▣</span>' +
          "<span>" + a.name + '<div class="asst-meta">' + a.meta + "</div></span></div></td>" +
        '<td class="affected">' + a.count + "</td>" +
        '<td style="width:70px"><div class="minibar" style="width:' + a.barPx + 'px"></div></td>' +
        '<td class="r"><span class="chip ' + a.chip + '">' + a.score + "</span></td>" +
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

  /* ---- Screen 3 · funnel (month dataset until wired to the picker) ---- */
  var funsteps = $("funsteps");
  if (funsteps && D.funnel) {
    funsteps.innerHTML = D.funnel.steps.map(function (s, i) {
      var bar = '<div class="bar" style="width:' + s.width + "%" +
        (s.colour ? ";background:" + s.colour : "") + '"></div>';
      var drop = D.funnel.drops[i] ? '<div class="drop">' + D.funnel.drops[i] + "</div>" : "";
      return '<div class="step"><div class="lab"><span class="n">' + s.n +
        '</span><span class="nm">' + s.name + "</span></div>" + bar + "</div>" + drop;
    }).join("");
  }

  var impact = $("impactlines");
  if (impact && D.funnel) {
    impact.innerHTML = D.funnel.impact.map(function (l) {
      var badge = l[2] && D.sourceNotes[l[2]]
        ? ' <span class="info src tip-left" tabindex="0" data-tip="' + D.sourceNotes[l[2]] + '">⇄ CRM</span>'
        : "";
      return '<div class="line"><span>' + l[0] + badge + "</span><b>" + l[1] + "</b></div>";
    }).join("");
  }
})();
