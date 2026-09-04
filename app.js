/* Shared behaviour for the AI Interaction Analysis prototype.
   No storage, no fetch, no analytics — static demo only. */

(function () {
  "use strict";
  var D = window.GLASSBOX_DATA || {};

  /* ---- data-bind hydration (all screens) ----
     Any element with data-bind="path.to.key" gets its text set from
     GLASSBOX_DATA. HTML keeps the same values as static fallback. */
  document.querySelectorAll("[data-bind]").forEach(function (el) {
    var v = el.dataset.bind.split(".").reduce(function (o, k) {
      return o == null ? o : o[k];
    }, D);
    if (v != null) el.textContent = v;
  });

  /* ---- GIA Insights panel toggle (dashboard + replay) ---- */
  var giaBtn = document.getElementById("giaBtn");
  var giaPanel = document.getElementById("giaPanel");
  if (giaBtn && giaPanel) {
    var rbody = document.querySelector(".rbody");
    function setGia(open) {
      giaPanel.hidden = !open;
      giaBtn.setAttribute("aria-expanded", String(open));
      if (rbody) rbody.classList.toggle("gia-hidden", !open);
    }
    giaBtn.addEventListener("click", function () { setGia(giaPanel.hidden); });
    var giaClose = document.getElementById("giaClose");
    if (giaClose) giaClose.addEventListener("click", function () { setGia(false); giaBtn.focus(); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !giaPanel.hidden) { setGia(false); giaBtn.focus(); }
    });
  }

  /* Fill the dashboard GIA panel with the analysis for one cause. */
  function renderGiaCause(intentName, causeName) {
    var g = D.giaByCause && D.giaByCause[causeName];
    var el = document.getElementById("giaIntent");
    if (!g || !el) return;
    el.textContent = intentName;
    document.getElementById("giaSummary").innerHTML = g.summary;
    document.getElementById("giaTakeaways").innerHTML = g.takeaways.map(function (t) {
      return "<li>" + t + "</li>";
    }).join("");
    document.getElementById("giaCause").textContent = causeName;
    document.getElementById("giaConf").textContent = g.verdict.confidence;
    document.getElementById("giaEvidence").innerHTML = g.verdict.evidence;
    document.getElementById("giaSeen").innerHTML = g.verdict.seen;
  }

  /* ---- Screen 1 · failing intents table + detail panel ---- */
  var tbody = document.getElementById("intents");
  if (tbody && D.intents) {
    tbody.innerHTML = D.intents.map(function (d, i) {
      return '<tr data-i="' + i + '" tabindex="0"' + (i === 0 ? ' class="sel"' : "") + ">" +
        '<td><div class="intent"><span class="tick' + (d.hot ? "" : " grey") + '">⚑</span>' + d.name + "</div></td>" +
        '<td class="affected">' + d.count + " <span>(" + d.pct + "%)</span></td>" +
        '<td style="width:70px"><div class="minibar" style="width:' + d.barPx + 'px"></div></td>' +
        '<td class="r"><span class="chip ' + d.scoreChip + '">' + d.score + "</span></td>" +
        '<td class="cause">' + (d.lead === "Unclassified" ? d.lead : "<b>" + d.lead + "</b>") + "</td>" +
        '<td class="arrow">›</td></tr>';
    }).join("");

    var rows = tbody.querySelectorAll("tr");

    function select(row) {
      rows.forEach(function (x) { x.classList.remove("sel"); });
      row.classList.add("sel");
      var d = D.intents[+row.dataset.i];
      document.getElementById("panelTitle").textContent = d.name;
      document.getElementById("panelN").textContent = d.count;
      document.getElementById("panelEsc").textContent = d.esc;
      document.getElementById("ringPc").textContent = d.pct + "%";
      document.getElementById("ring").setAttribute("stroke-dasharray", d.pct + " " + (100 - d.pct));
      document.getElementById("causelist").innerHTML = d.causes.map(function (c) {
        return '<div class="causerow"><span style="width:112px">' + c[0] + "</span>" +
          '<span class="bar"><i style="width:' + c[1] + "%;background:" + c[2] + '"></i></span>' +
          '<span class="pc">' + c[1] + "%</span></div>";
      }).join("");
      renderGiaCause(d.name, d.lead);
    }

    rows.forEach(function (r) {
      r.addEventListener("click", function () { select(r); });
      r.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(r); }
      });
    });

    select(rows[0]);
  }

  /* ---- Screen 3 · funnel steps + business impact ---- */
  var funsteps = document.getElementById("funsteps");
  if (funsteps && D.funnel) {
    funsteps.innerHTML = D.funnel.steps.map(function (s, i) {
      var bar = '<div class="bar" style="width:' + s.width + "%" +
        (s.colour ? ";background:" + s.colour : "") + '"></div>';
      var drop = D.funnel.drops[i] ? '<div class="drop">' + D.funnel.drops[i] + "</div>" : "";
      return '<div class="step"><div class="lab"><span class="n">' + s.n +
        '</span><span class="nm">' + s.name + "</span></div>" + bar + "</div>" + drop;
    }).join("");
  }

  var impact = document.getElementById("impactlines");
  if (impact && D.funnel) {
    impact.innerHTML = D.funnel.impact.map(function (l) {
      return '<div class="line"><span>' + l[0] + "</span><b>" + l[1] + "</b></div>";
    }).join("");
  }
})();
