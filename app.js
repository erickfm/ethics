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

  // -- Interactive Harm Scale --

  function renderInteractiveScale(overallAverage, catMin, catMax, quantifiedHarm) {
    const sorted = [...HARM_BENCHMARKS].sort((a, b) => a.score - b.score);
    const trackHeight = sorted.length * 65; // ~65px per item

    let html = `<div class="scale-container" id="scale-container">`;
    html += `<div class="scale-header">`;
    html += `<p class="scale-title">The Harm Spectrum</p>`;
    html += `<p class="scale-subtitle">Click any benchmark to explore. Scroll to see the full scale. Placements reflect editorial judgment, arguable by design.</p>`;
    html += `</div>`;

    html += `<div class="scale-viewport">`;
    html += `<div class="scale-track" style="height: ${trackHeight}px">`;

    // Zone background bands
    for (const pos of SCALE_POSITIONS) {
      const topPct = ((pos.range[0] - 1) / 4) * 100;
      const heightPct = ((pos.range[1] - pos.range[0]) / 4) * 100;
      html += `<div class="scale-zone" style="top: ${topPct}%; height: ${heightPct}%" data-zone="${pos.label}">`;
      html += `<span class="scale-zone-label">${pos.label}</span>`;
      html += `</div>`;
    }

    // Axis line
    html += `<div class="scale-axis"></div>`;

    // User range band
    const userTopPct = ((catMin - 1) / 4) * 100;
    const userHeightPct = ((catMax - catMin) / 4) * 100;
    html += `<div class="scale-user-band" id="scale-user-band" style="top: ${userTopPct}%; height: ${Math.max(userHeightPct, 2)}%"></div>`;

    // User marker (animated)
    const userPct = ((overallAverage - 1) / 4) * 100;
    html += `<div class="scale-user-marker" id="scale-user-marker" style="top: ${userPct}%">`;
    html += `<div class="scale-user-content">`;
    html += `<span class="scale-user-label">You</span>`;
    html += `<span class="scale-user-detail">${quantifiedHarm.lifeYears.toFixed(2)} life-years of harm</span>`;
    html += `</div>`;
    html += `</div>`;

    // Benchmark items
    sorted.forEach((item, idx) => {
      const topPct = ((item.score - 1) / 4) * 100;
      const catName = CATEGORIES[item.category] ? CATEGORIES[item.category].name : "";
      const sourceHtml = item.source ? `<span class="scale-source">[${item.source}]</span>` : "";

      // Compute this benchmark's life-years if it has harm data
      let harmText = "";
      if (item.harm) {
        const m = HARM_METHODOLOGY.pipelines;
        const ly = (item.harm.co2_kg / 1000) * m.carbon.factor +
          (item.harm.exploited_labor_hrs || 0) * m.labor.factor +
          (item.harm.military_dollars || 0) * m.military.factor +
          (item.harm.carceral_dollars || 0) * m.carceral.factor +
          (item.harm.surveillance_units || 0) * m.surveillance.factor;
        if (ly > 0.001) {
          harmText = `<span class="scale-harm">${ly.toFixed(3)} life-years</span>`;
        }
      }

      html += `<div class="scale-item" style="top: ${topPct}%" data-idx="${idx}">`;
      html += `<span class="scale-score">${item.score.toFixed(1)}</span>`;
      html += `<div class="scale-item-summary">`;
      html += `<span class="scale-act">${item.act}</span>`;
      html += `<span class="scale-cat">${catName}</span>`;
      html += `</div>`;
      html += `<div class="scale-item-detail hidden">`;
      html += `<p>${item.detail} ${sourceHtml}</p>`;
      html += harmText;
      html += `</div>`;
      html += `</div>`;
    });

    html += `</div>`; // scale-track
    html += `</div>`; // scale-viewport
    html += `</div>`; // scale-container

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

    // 4. Interactive harm scale
    $("#harm-scale-container").innerHTML = renderInteractiveScale(overallAverage, catMin, catMax, quantifiedHarm);

    // Scale interaction: click to expand and auto-scroll to user
    const scaleContainer = document.getElementById("scale-container");
    if (scaleContainer) {
      // Click to expand/collapse items
      scaleContainer.addEventListener("click", (e) => {
        const item = e.target.closest(".scale-item");
        if (!item) return;
        const detail = item.querySelector(".scale-item-detail");
        const wasHidden = detail.classList.contains("hidden");
        // Collapse all others
        scaleContainer.querySelectorAll(".scale-item-detail").forEach(d => d.classList.add("hidden"));
        scaleContainer.querySelectorAll(".scale-item").forEach(i => i.classList.remove("expanded"));
        if (wasHidden) {
          detail.classList.remove("hidden");
          item.classList.add("expanded");
        }
      });

      // Auto-scroll to user marker after short delay
      setTimeout(() => {
        const marker = document.getElementById("scale-user-marker");
        const viewport = scaleContainer.querySelector(".scale-viewport");
        if (marker && viewport) {
          const markerTop = marker.offsetTop;
          viewport.scrollTo({ top: markerTop - viewport.clientHeight / 2, behavior: "smooth" });
        }
      }, 600);
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
