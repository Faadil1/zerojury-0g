const form = document.querySelector("#jury-form");
const questionInput = document.querySelector("#question");
const result = document.querySelector("#result");
const button = form.querySelector("button");
const seats = Array.from(document.querySelectorAll(".seat"));

// Truthful phase copy. These describe the request lifecycle, not individual
// juror completion — the API resolves all three jurors plus synthesis in a
// single response, so no phase claims a specific juror is "done" early.
const PHASES = [
  "Convening the panel",
  "Running 3 independent jurors on 0G Compute",
  "Comparing perspectives",
  "Synthesizing the verdict"
];

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const question = questionInput.value.trim();
  const startedAt = Date.now();

  button.disabled = true;
  button.textContent = "Jury in session…";

  setSeatsState("active", "Running on 0G Compute…");
  renderLoading(0);

  let phaseIndex = 0;
  const phaseTimer = setInterval(() => {
    phaseIndex = Math.min(phaseIndex + 1, PHASES.length - 1);
    const phaseEl = document.querySelector("#loading-phase");
    if (phaseEl) phaseEl.textContent = PHASES[phaseIndex];
  }, 5000);

  const elapsedTimer = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startedAt) / 1000);
    const elapsedEl = document.querySelector("#loading-elapsed");
    if (elapsedEl) elapsedEl.textContent = `Elapsed: ${elapsed}s`;
  }, 1000);

  try {
    const response = await fetch("/api/jury", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ question })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || data.error || "Analysis failed.");
    }

    const elapsed = Math.round((Date.now() - startedAt) / 1000);

    setSeatsState("resolved", "Resolved");
    renderResult(data, elapsed);

    requestAnimationFrame(() => {
      result.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  } catch (error) {
    setSeatsState("idle", "Waiting");
    result.innerHTML = `
      <section class="error-card">
        <p class="result-label">Analysis incomplete</p>
        <h2>ZeroJury could not finish this session.</h2>
        <p>${escapeHtml(error.message)}</p>
      </section>
    `;
  } finally {
    clearInterval(phaseTimer);
    clearInterval(elapsedTimer);
    button.disabled = false;
    button.textContent = "Analyze with ZeroJury";
  }
});

function setSeatsState(state, label) {
  seats.forEach((seat) => {
    seat.classList.remove("active", "resolved");
    if (state !== "idle") seat.classList.add(state);
    const stateEl = seat.querySelector(".seat-state");
    if (stateEl) stateEl.textContent = label;
  });
}

function renderLoading(elapsedSeconds) {
  result.innerHTML = `
    <section class="loading-card" aria-live="polite">
      <p class="result-label">0G Compute in progress</p>
      <p class="loading-phase" id="loading-phase">${PHASES[0]}</p>
      <p class="loading-elapsed" id="loading-elapsed">Elapsed: ${elapsedSeconds}s</p>
      <div class="loading-track"><div class="loading-track-fill"></div></div>
    </section>
  `;
}

function renderResult(data, elapsed) {
  const proof = data.sponsorProof || {};
  const providerCount = Array.isArray(proof.providers) ? proof.providers.length : 0;
  const requestIds = Array.isArray(proof.requestIds) ? proof.requestIds : [];

  result.innerHTML = `
    <section class="result-header">
      <div>
        <p class="result-label">ZeroJury verdict</p>
        <h2>${formatText(data.synthesis.consensus)}</h2>
      </div>
      <div class="confidence">
        <strong>${data.synthesis.confidence ?? "—"}<small>/100</small></strong>
        <span>confidence</span>
      </div>
    </section>

    <section class="proof-strip">
      <span><strong>${escapeHtml(proof.network || "0G Compute mainnet")}</strong></span>
      <span class="proof-sep">·</span>
      <span>${escapeHtml(proof.model || "")}</span>
      <span class="proof-sep">·</span>
      <span>${proof.totalInferenceCalls ?? 4} real calls</span>
      <span class="proof-sep">·</span>
      <span>${providerCount} provider${providerCount === 1 ? "" : "s"}</span>
    </section>

    ${
      requestIds.length
        ? `
          <details class="proof-details">
            <summary>View request IDs</summary>
            <ul>
              ${requestIds.map((id) => `<li><code>${escapeHtml(id)}</code></li>`).join("")}
            </ul>
          </details>
        `
        : ""
    }

    ${
      data.synthesis.nextStep
        ? `
          <section class="next-step">
            <p class="result-label">Recommended next step</p>
            <p>${formatText(data.synthesis.nextStep)}</p>
          </section>
        `
        : ""
    }

    <section class="summary-grid">
      <article class="summary-card">
        <p class="result-label">Disagreements</p>
        ${renderList(data.synthesis.disagreements)}
      </article>

      <article class="summary-card">
        <p class="result-label">Key risks</p>
        ${renderList(data.synthesis.risks)}
      </article>
    </section>

    <section class="jurors-section">
      <div class="section-heading">
        <p class="result-label">Independent perspectives</p>
        <p>${data.jurors.length} jurors · ${elapsed}s total</p>
      </div>

      <div class="juror-grid">
        ${data.jurors.map(renderJurorCard).join("")}
      </div>
    </section>
  `;
}

function renderJurorCard(juror) {
  const fullText = formatText(juror.analysis);
  const preview = createPreview(juror.analysis);

  return `
    <article class="juror-card juror-${juror.id}">
      <div class="juror-title">
        <span></span>
        <h3>${escapeHtml(juror.title)}</h3>
      </div>
      <div class="juror-analysis juror-preview">
        ${escapeHtml(preview)}
      </div>
      <details>
        <summary>Read full analysis</summary>
        <div class="juror-analysis">${fullText}</div>
      </details>
    </article>
  `;
}

function createPreview(value, limit = 220) {
  const plain = String(value)
    .replace(/\*\*/g, "")
    .replace(/(^|\n)\s*[-*]\s+/g, "$1")
    .replace(/\s+/g, " ")
    .trim();

  if (plain.length <= limit) return plain;

  const slice = plain.slice(0, limit);
  const sentenceBoundary = Math.max(
    slice.lastIndexOf(". "),
    slice.lastIndexOf("; "),
    slice.lastIndexOf(", ")
  );

  const preview =
    sentenceBoundary >= 120
      ? slice.slice(0, sentenceBoundary + 1)
      : slice;

  return `${preview.trim()}…`;
}

function renderList(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return "<p>No material items identified.</p>";
  }

  return `
    <ul>
      ${items.map((item) => `<li>${attributeDot(item)}${formatText(item)}</li>`).join("")}
    </ul>
  `;
}

function attributeDot(text) {
  const lowered = String(text).toLowerCase();
  if (lowered.includes("optimist")) return '<span class="attribution-dot optimist"></span>';
  if (lowered.includes("skeptic")) return '<span class="attribution-dot skeptic"></span>';
  if (lowered.includes("operator")) return '<span class="attribution-dot operator"></span>';
  return "";
}

function formatText(value = "") {
  const normalized = String(value)
    .replace(/\r\n?/g, "\n")
    .replace(/([:.])\s*\*\s+(?=[A-Z])/g, "$1\n• ")
    .replace(/(^|\n)\s*[-*]\s+/g, "$1• ")
    .trim();

  return escapeHtml(normalized)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}
