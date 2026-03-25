(() => {
  // -- State --

  const state = {
    currentQuestion: 0,
    answers: {},        // questionIndex -> optionIndex
  };

  const $ = (sel) => document.querySelector(sel);
  const show = (el) => { el.classList.remove("hidden"); el.classList.add("active"); };
  const hide = (el) => { el.classList.remove("active"); el.classList.add("hidden"); };

  // -- Question Rendering --

  function renderQuestion() {
    const q = QUESTIONS[state.currentQuestion];
    const selected = state.answers[state.currentQuestion];

    $("#question-counter").textContent =
      `${state.currentQuestion + 1} / ${QUESTIONS.length}`;
    $("#progress-fill").style.width =
      `${((state.currentQuestion + 1) / QUESTIONS.length) * 100}%`;

    let html = `<p class="question-text">${q.text}</p>`;
    if (q.context) {
      html += `<p class="question-context">${q.context}</p>`;
    }
    html += `<ul class="options">`;
    q.options.forEach((opt, i) => {
      const isSelected = selected === i;
      html += `
        <li>
          <label class="option-label${isSelected ? " selected" : ""}" data-index="${i}">
            <input type="radio" name="q${state.currentQuestion}" value="${i}"
              ${isSelected ? "checked" : ""}>
            ${opt.text}
          </label>
        </li>`;
    });
    html += `</ul>`;

    $("#question-area").innerHTML = html;

    // Bind option clicks
    document.querySelectorAll(".option-label").forEach((label) => {
      label.addEventListener("click", () => {
        const idx = parseInt(label.dataset.index);
        state.answers[state.currentQuestion] = idx;
        renderQuestion();
      });
    });

    // Navigation
    if (state.currentQuestion === 0) {
      hide($("#prev-btn"));
    } else {
      show($("#prev-btn"));
    }
    $("#next-btn").textContent =
      state.currentQuestion === QUESTIONS.length - 1 ? "See Your Terrain" : "Next";
  }

  // -- Scoring --

  function calculateResults() {
    const categoryScores = {};
    const categoryCounts = {};
    const categoryConstrained = {};

    QUESTIONS.forEach((q, i) => {
      const answerIndex = state.answers[i];
      if (answerIndex === undefined) return;

      const opt = q.options[answerIndex];
      // Skip N/A answers in scoring
      if (opt.na) return;

      const score = opt.score;
      if (!categoryScores[q.category]) {
        categoryScores[q.category] = 0;
        categoryCounts[q.category] = 0;
        categoryConstrained[q.category] = { constrained: 0, total: 0 };
      }
      categoryScores[q.category] += score;
      categoryCounts[q.category] += 1;

      // Track constrained selections
      const cc = categoryConstrained[q.category];
      cc.total++;
      if (opt.constrained) {
        cc.constrained++;
      }
    });

    const categoryAverages = {};
    let totalScore = 0;
    let totalCategories = 0;

    for (const cat in categoryScores) {
      if (categoryCounts[cat] > 0) {
        const raw = categoryScores[cat] / categoryCounts[cat];
        categoryAverages[cat] = raw;
        totalScore += raw;
        totalCategories += 1;
      }
    }

    const overallAverage = totalCategories > 0 ? totalScore / totalCategories : 0;

    return { categoryAverages, overallAverage, categoryConstrained };
  }

  function calculateQuantifiedHarm() {
    const totals = { co2_kg: 0, exploited_labor_hrs: 0, military_dollars: 0, carceral_dollars: 0, surveillance_units: 0 };

    // Sum deltas from selected options
    QUESTIONS.forEach((q, i) => {
      const answerIndex = state.answers[i];
      if (answerIndex === undefined) return;
      const opt = q.options[answerIndex];
      if (opt.impact) {
        for (const key in totals) {
          totals[key] += opt.impact[key] || 0;
        }
      }
    });

    // Add baselines
    for (const key in IMPACT_BASELINES) {
      totals[key] += IMPACT_BASELINES[key];
    }

    // Convert to life-years using HARM_METHODOLOGY pipelines
    const m = HARM_METHODOLOGY.pipelines;
    const lifeYears =
      (totals.co2_kg / 1000) * m.carbon.factor +
      totals.exploited_labor_hrs * m.labor.factor +
      totals.military_dollars * m.military.factor +
      totals.carceral_dollars * m.carceral.factor +
      totals.surveillance_units * m.surveillance.factor;

    const deathEquivalents = lifeYears / HARM_METHODOLOGY.life_years_per_death;

    return { totals, lifeYears, deathEquivalents };
  }

  function getScalePosition(score) {
    for (const pos of SCALE_POSITIONS) {
      if (score >= pos.range[0] && score <= pos.range[1]) return pos;
    }
    return SCALE_POSITIONS[SCALE_POSITIONS.length - 1];
  }

  // -- Radar Chart (SVG) --

  function renderRadarChart(categoryAverages) {
    const cats = Object.keys(categoryAverages);
    const n = cats.length;
    if (n === 0) return "";

    const cx = 150;
    const cy = 150;
    const maxR = 110;
    const angleStep = (2 * Math.PI) / n;
    const startAngle = -Math.PI / 2; // top

    function polar(angle, r) {
      return {
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
      };
    }

    let svg = `<svg viewBox="-60 -10 420 320" class="radar-chart" xmlns="http://www.w3.org/2000/svg">`;

    // Grid rings
    for (let ring = 1; ring <= 5; ring++) {
      const r = (ring / 5) * maxR;
      let points = [];
      for (let i = 0; i < n; i++) {
        const p = polar(startAngle + i * angleStep, r);
        points.push(`${p.x},${p.y}`);
      }
      svg += `<polygon points="${points.join(" ")}" class="radar-ring"/>`;
    }

    // Axis lines
    for (let i = 0; i < n; i++) {
      const p = polar(startAngle + i * angleStep, maxR);
      svg += `<line x1="${cx}" y1="${cy}" x2="${p.x}" y2="${p.y}" class="radar-axis"/>`;
    }

    // Data polygon
    let dataPoints = [];
    for (let i = 0; i < n; i++) {
      const val = categoryAverages[cats[i]] || 0;
      const r = (val / 5) * maxR;
      const p = polar(startAngle + i * angleStep, r);
      dataPoints.push(`${p.x},${p.y}`);
    }
    svg += `<polygon points="${dataPoints.join(" ")}" class="radar-data"/>`;

    // Data dots + labels
    for (let i = 0; i < n; i++) {
      const val = categoryAverages[cats[i]] || 0;
      const r = (val / 5) * maxR;
      const p = polar(startAngle + i * angleStep, r);
      svg += `<circle cx="${p.x}" cy="${p.y}" r="3.5" class="radar-dot"/>`;

      // Label
      const lp = polar(startAngle + i * angleStep, maxR + 22);
      const catName = CATEGORIES[cats[i]].name;
      // Split long names
      const shortName = catName.length > 18 ? catName.split(" & ")[0] || catName.split(" ")[0] : catName;
      let anchor = "middle";
      if (lp.x < cx - 10) anchor = "end";
      else if (lp.x > cx + 10) anchor = "start";
      svg += `<text x="${lp.x}" y="${lp.y}" text-anchor="${anchor}" class="radar-label">${shortName}</text>`;
    }

    svg += `</svg>`;
    return svg;
  }

  // -- Harm Spectrum Graph --

  function computeBenchmarkHarm(item) {
    if (!item.harm) return 0;
    const m = HARM_METHODOLOGY.pipelines;
    return (item.harm.co2_kg / 1000) * m.carbon.factor +
      (item.harm.exploited_labor_hrs || 0) * m.labor.factor +
      (item.harm.military_dollars || 0) * m.military.factor +
      (item.harm.carceral_dollars || 0) * m.carceral.factor +
      (item.harm.surveillance_units || 0) * m.surveillance.factor;
  }

  function renderHarmGraph(overallAverage, catMin, catMax, quantifiedHarm) {
    // Compute life-years for each benchmark
    const points = HARM_BENCHMARKS.map((b) => ({
      ...b,
      lifeYears: computeBenchmarkHarm(b),
      catName: CATEGORIES[b.category] ? CATEGORIES[b.category].name : "",
    })).filter((p) => p.lifeYears > 0);

    // Graph dimensions
    const W = 700, H = 420;
    const pad = { top: 30, right: 30, bottom: 55, left: 70 };
    const gw = W - pad.left - pad.right;
    const gh = H - pad.top - pad.bottom;

    // X axis: complicity score 1-5
    const xMin = 1, xMax = 5;
    const x = (score) => pad.left + ((score - xMin) / (xMax - xMin)) * gw;

    // Y axis: life-years (log scale)
    const allLY = points.map((p) => p.lifeYears).filter((v) => v > 0);
    const lyMin = Math.max(0.0001, Math.min(...allLY) * 0.5);
    const lyMax = Math.max(...allLY) * 1.5;
    const logMin = Math.log10(lyMin);
    const logMax = Math.log10(lyMax);
    const y = (ly) => pad.top + gh - ((Math.log10(Math.max(ly, lyMin)) - logMin) / (logMax - logMin)) * gh;

    // Category colors
    const catColors = {
      labor: "#c4a35a",
      ecology: "#4a8",
      finance: "#7a9ec4",
      food: "#8b6",
      tech: "#a77dc2",
      housing: "#c47a5a",
      military_carceral: "#b44",
      solidarity: "#5ac4a3",
    };

    let svg = `<svg viewBox="0 0 ${W} ${H}" class="harm-graph" xmlns="http://www.w3.org/2000/svg">`;

    // Zone background bands (vertical strips for each complicity zone)
    for (const pos of SCALE_POSITIONS) {
      const x1 = x(pos.range[0]);
      const x2 = x(pos.range[1]);
      svg += `<rect x="${x1}" y="${pad.top}" width="${x2 - x1}" height="${gh}" fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.04)" stroke-width="0.5"/>`;
      svg += `<text x="${(x1 + x2) / 2}" y="${pad.top + 12}" text-anchor="middle" class="graph-zone-label">${pos.label}</text>`;
    }

    // Grid lines (horizontal, for Y axis log ticks)
    const yTicks = [];
    for (let exp = Math.floor(logMin); exp <= Math.ceil(logMax); exp++) {
      for (const m of [1, 2, 5]) {
        const val = m * Math.pow(10, exp);
        if (val >= lyMin && val <= lyMax) yTicks.push(val);
      }
    }
    for (const tick of yTicks) {
      const ty = y(tick);
      svg += `<line x1="${pad.left}" y1="${ty}" x2="${W - pad.right}" y2="${ty}" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>`;
      let label = tick >= 1 ? tick.toFixed(1) : tick >= 0.01 ? tick.toFixed(2) : tick.toFixed(4);
      svg += `<text x="${pad.left - 8}" y="${ty + 3}" text-anchor="end" class="graph-axis-label">${label}</text>`;
    }

    // X axis ticks
    for (let s = 1; s <= 5; s++) {
      const tx = x(s);
      svg += `<line x1="${tx}" y1="${pad.top}" x2="${tx}" y2="${H - pad.bottom}" stroke="rgba(255,255,255,0.06)" stroke-width="0.5"/>`;
      svg += `<text x="${tx}" y="${H - pad.bottom + 16}" text-anchor="middle" class="graph-axis-label">${s}</text>`;
    }

    // Axis labels
    svg += `<text x="${W / 2}" y="${H - 8}" text-anchor="middle" class="graph-axis-title">Complicity Score</text>`;
    svg += `<text x="14" y="${H / 2}" text-anchor="middle" transform="rotate(-90, 14, ${H / 2})" class="graph-axis-title">Life-Years of Harm</text>`;

    // Benchmark dots
    points.forEach((p, i) => {
      const cx = x(p.score);
      const cy = y(p.lifeYears);
      const color = catColors[p.category] || "var(--text-muted)";
      // Slight jitter to separate overlapping points
      const jx = ((i * 7) % 11 - 5) * 0.8;
      const jy = ((i * 13) % 11 - 5) * 0.8;
      svg += `<circle cx="${cx + jx}" cy="${cy + jy}" r="4.5" fill="${color}" opacity="0.7" class="graph-dot" data-idx="${i}"/>`;
    });

    // User point (larger, animated)
    const userX = x(overallAverage);
    const userY = y(quantifiedHarm.lifeYears);
    svg += `<circle cx="${userX}" cy="${userY}" r="8" fill="none" stroke="var(--accent)" stroke-width="2" class="graph-user-ring"/>`;
    svg += `<circle cx="${userX}" cy="${userY}" r="4" fill="var(--accent)" class="graph-user-dot"/>`;
    svg += `<text x="${userX + 12}" y="${userY + 4}" class="graph-user-label">You (${quantifiedHarm.lifeYears.toFixed(2)})</text>`;

    svg += `</svg>`;

    // Build the full container with tooltip area
    let html = `<div class="graph-container" id="graph-container">`;
    html += `<div class="graph-header">`;
    html += `<p class="graph-title">The Harm Spectrum</p>`;
    html += `<p class="graph-subtitle">Each dot is a consumer act. X axis: complicity score. Y axis: quantified life-years of harm (log scale). Click any dot for details.</p>`;
    html += `</div>`;
    html += svg;
    html += `<div class="graph-tooltip hidden" id="graph-tooltip"></div>`;

    // Legend
    html += `<div class="graph-legend">`;
    for (const [key, color] of Object.entries(catColors)) {
      const name = CATEGORIES[key] ? CATEGORIES[key].name : key;
      html += `<span class="graph-legend-item"><span class="graph-legend-dot" style="background:${color}"></span>${name}</span>`;
    }
    html += `</div>`;

    html += `</div>`;

    // Store points data for tooltip lookups
    window._graphPoints = points;

    return html;
  }

  // -- Composite Harm Display --

  function renderCompositeHarm(quantifiedHarm) {
    const { totals, lifeYears, deathEquivalents } = quantifiedHarm;

    let html = `<div class="composite-harm">`;

    // Big number
    html += `<div class="composite-main">`;
    html += `<span class="composite-number" id="composite-number" data-target="${lifeYears.toFixed(2)}">0.00</span>`;
    html += `<span class="composite-unit">life-years of harm per year</span>`;
    html += `</div>`;

    // Death equivalent
    html += `<p class="composite-death">Roughly equivalent to complacency in ${deathEquivalents.toFixed(4)} premature deaths annually.</p>`;

    // Breakdown grid
    html += `<div class="harm-breakdown">`;

    const items = [
      { label: "CO\u2082 emissions", value: (totals.co2_kg / 1000).toFixed(1), unit: "tonnes/yr" },
      { label: "Exploited labor", value: Math.round(totals.exploited_labor_hrs), unit: "hours/yr" },
      { label: "Military funding", value: "$" + Math.round(totals.military_dollars).toLocaleString(), unit: "/yr" },
      { label: "Carceral funding", value: "$" + Math.round(totals.carceral_dollars).toLocaleString(), unit: "/yr" },
    ];

    for (const item of items) {
      html += `<div class="breakdown-item">`;
      html += `<span class="breakdown-value">${item.value}</span>`;
      html += `<span class="breakdown-label">${item.label}</span>`;
      html += `</div>`;
    }

    html += `</div>`; // harm-breakdown

    // Caveat
    html += `<p class="composite-caveat">Calculated using conservative DALY, VSL, and Social Cost of Carbon frameworks from the WHO, EPA, and IPCC. We use $120/tonne SCC and $160K/VSLY; the Biden EPA finalized $255/tonne and HHS central VSLY is $604K, so actual harm is likely 2-4x this estimate. This represents structural complicity, not direct causation. You did not kill anyone. You participated in systems that produce these outcomes at population scale.</p>`;

    html += `</div>`; // composite-harm

    return html;
  }

  function animateCompositeNumber() {
    const el = document.getElementById("composite-number");
    if (!el) return;
    const target = parseFloat(el.dataset.target);
    const duration = 1500;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = (target * eased).toFixed(2);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // -- Results Rendering --

  function renderResults() {
    const { categoryAverages, overallAverage, categoryConstrained } = calculateResults();
    const position = getScalePosition(overallAverage);
    const quantifiedHarm = calculateQuantifiedHarm();

    // Compute range across categories
    const catValues = Object.values(categoryAverages);
    const catMin = catValues.length ? Math.min(...catValues) : 0;
    const catMax = catValues.length ? Math.max(...catValues) : 0;

    // 1. Composite harm display
    const compositeContainer = $("#composite-harm-container");
    if (compositeContainer) {
      compositeContainer.innerHTML = renderCompositeHarm(quantifiedHarm);
      animateCompositeNumber();
    }

    // 2. Radar chart
    $("#radar-container").innerHTML = renderRadarChart(categoryAverages);

    // 3. Terrain summary (label only, range shown, no numeric average)
    let overallHtml = `
      <div class="terrain-label">
        <span class="terrain-name">${position.label}</span>
        <span class="terrain-score">range: ${catMin.toFixed(1)} \u2013 ${catMax.toFixed(1)}</span>
      </div>
      <p class="terrain-description">${position.description}</p>
    `;
    $("#terrain-summary").innerHTML = overallHtml;

    // 4. Harm spectrum graph
    $("#harm-scale-container").innerHTML = renderHarmGraph(overallAverage, catMin, catMax, quantifiedHarm);

    // Graph tooltip interaction
    const graphContainer = document.getElementById("graph-container");
    if (graphContainer) {
      const tooltip = document.getElementById("graph-tooltip");
      const svg = graphContainer.querySelector("svg");

      svg.addEventListener("click", (e) => {
        const dot = e.target.closest(".graph-dot");
        if (!dot) {
          tooltip.classList.add("hidden");
          return;
        }
        const idx = parseInt(dot.dataset.idx);
        const p = window._graphPoints[idx];
        if (!p) return;

        const sourceHtml = p.source ? ` [${p.source}]` : "";
        tooltip.innerHTML = `
          <p class="tooltip-act">${p.act}</p>
          <p class="tooltip-score">Score: ${p.score.toFixed(1)} | ${p.lifeYears.toFixed(3)} life-years | ${p.catName}</p>
          <p class="tooltip-detail">${p.detail}${sourceHtml}</p>
        `;
        tooltip.classList.remove("hidden");
      });

      // Close tooltip when clicking outside
      document.addEventListener("click", (e) => {
        if (!e.target.closest(".graph-dot") && !e.target.closest(".graph-tooltip")) {
          tooltip.classList.add("hidden");
        }
      });
    }

    // 5. Category details
    const sortedCategories = Object.entries(categoryAverages)
      .sort((a, b) => a[1] - b[1]);

    let detailHtml = "";

    for (const [catKey, avg] of sortedCategories) {
      const cat = CATEGORIES[catKey];
      const catPos = getScalePosition(avg);

      // Count constrained selections for this category
      let constrainedCount = 0;
      let categoryQuestionCount = 0;
      QUESTIONS.forEach((q, i) => {
        if (q.category !== catKey) return;
        categoryQuestionCount++;
        const ai = state.answers[i];
        if (ai !== undefined && q.options[ai].constrained) constrainedCount++;
      });

      let constraintNote = "";
      if (constrainedCount > 0) {
        constraintNote = `<p class="constraint-note">You indicated that ${constrainedCount} of your ${categoryQuestionCount} responses here reflect systemic constraint rather than choice. The physical harm is the same; the complicity framing is different.</p>`;
      }

      let resourceHtml = "";
      if (cat.resources && cat.resources.length) {
        resourceHtml = `<div class="category-resources"><p class="resources-label">Where to go from here:</p><ul>`;
        for (const r of cat.resources) {
          resourceHtml += `<li><a href="${r.url}" target="_blank" rel="noopener"><strong>${r.name}</strong></a>: ${r.description}</li>`;
        }
        resourceHtml += `</ul></div>`;
      }

      detailHtml += `
        <details class="category-result">
          <summary>
            <span class="category-name">${cat.name}</span>
            <span class="category-score">${avg.toFixed(1)}</span>
            <span class="category-position">${catPos.label}</span>
          </summary>
          <div class="category-detail-inner">
            <p class="category-desc">${cat.description}</p>
            <div class="structural-context">
              <p class="structural-label">The system:</p>
              <p>${cat.structural_context}</p>
            </div>
            ${constraintNote}
            ${resourceHtml}
          </div>
        </details>
      `;
    }

    $("#category-details").innerHTML = detailHtml;
  }

  // -- Event Listeners --

  $("#start-btn").addEventListener("click", () => {
    hide($("#intro"));
    show($("#questionnaire"));
    renderQuestion();
  });

  $("#next-btn").addEventListener("click", () => {
    if (state.answers[state.currentQuestion] === undefined) {
      const area = $("#question-area");
      area.style.outline = "1px solid var(--accent-dim)";
      setTimeout(() => { area.style.outline = "none"; }, 800);
      return;
    }

    if (state.currentQuestion < QUESTIONS.length - 1) {
      state.currentQuestion++;
      renderQuestion();
      // Scroll to top of question
      $("#question-area").scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      hide($("#questionnaire"));
      show($("#results"));
      renderResults();
    }
  });

  $("#prev-btn").addEventListener("click", () => {
    if (state.currentQuestion > 0) {
      state.currentQuestion--;
      renderQuestion();
    }
  });

  $("#restart-btn").addEventListener("click", () => {
    state.currentQuestion = 0;
    state.answers = {};
    hide($("#results"));
    show($("#intro"));
  });

  // Methodology link
  const methLink = $("#methodology-link");
  if (methLink) {
    methLink.addEventListener("click", (e) => {
      e.preventDefault();
      hide($("#intro"));
      show($("#methodology"));
    });
  }

  const methBack = $("#methodology-back");
  if (methBack) {
    methBack.addEventListener("click", () => {
      hide($("#methodology"));
      show($("#intro"));
    });
  }
})();
