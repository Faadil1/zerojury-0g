const form = document.querySelector("#jury-form");
const questionInput = document.querySelector("#question");
const result = document.querySelector("#result");
const button = form.querySelector("button");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const question = questionInput.value.trim();
  const startedAt = Date.now();

  button.disabled = true;
  button.textContent = "Jury in session…";

  result.innerHTML = `
    <section class="loading-card">
      <div class="loading-orb"></div>
      <div>
        <p class="result-label">0G COMPUTE IN PROGRESS</p>
        <h2>Consulting three independent AI jurors…</h2>
        <p>Optimist · Skeptic · Operator · Final synthesis</p>
        <p id="elapsed">Elapsed: 0s</p>
      </div>
    </section>
  `;

  const timer = setInterval(() => {
    const elapsed = Math.floor((Date.now() - startedAt) / 1000);
    const element = document.querySelector("#elapsed");
    if (element) element.textContent = `Elapsed: ${elapsed}s`;
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

    result.innerHTML = `
      <section class="result-header">
        <div>
          <p class="result-label">ZEROJURY VERDICT</p>
          <h2>${formatText(data.synthesis.consensus)}</h2>
        </div>
        <div class="confidence">
          <strong>${data.synthesis.confidence ?? "—"}</strong>
          <span>confidence</span>
        </div>
      </section>

      ${
        data.synthesis.nextStep
          ? `
            <section class="next-step">
              <p class="result-label">RECOMMENDED NEXT STEP</p>
              <p>${formatText(data.synthesis.nextStep)}</p>
            </section>
          `
          : ""
      }

      <section class="summary-grid">
        <article class="summary-card">
          <p class="result-label">DISAGREEMENTS</p>
          ${renderList(data.synthesis.disagreements)}
        </article>

        <article class="summary-card">
          <p class="result-label">KEY RISKS</p>
          ${renderList(data.synthesis.risks)}
        </article>
      </section>

      <section class="jurors-section">
        <div class="section-heading">
          <p class="result-label">INDEPENDENT PERSPECTIVES</p>
          <p>${data.jurors.length} jurors · ${elapsed}s total</p>
        </div>

        <div class="juror-grid">
          ${data.jurors
            .map(
              (juror) => `
                <article class="juror-card juror-${juror.id}">
                  <div class="juror-title">
                    <span>${juror.title.charAt(0)}</span>
                    <h3>${escapeHtml(juror.title)}</h3>
                  </div>
                  <div class="juror-analysis">
                    ${formatText(juror.analysis)}
                  </div>
                </article>
              `
            )
            .join("")}
        </div>
      </section>

      <details class="proof">
        <summary>
          <span>Verified execution on 0G Compute</span>
          <span>${data.sponsorProof.totalInferenceCalls} real calls</span>
        </summary>

        <div class="proof-content">
          <p><strong>Network:</strong> ${escapeHtml(data.sponsorProof.network)}</p>
          <p><strong>Model:</strong> ${escapeHtml(data.sponsorProof.model)}</p>
          <p><strong>Providers observed:</strong> ${data.sponsorProof.providers.length}</p>
          <p><strong>Request IDs:</strong></p>
          <ul>
            ${data.sponsorProof.requestIds
              .map((id) => `<li><code>${escapeHtml(id)}</code></li>`)
              .join("")}
          </ul>
        </div>
      </details>
    `;
  } catch (error) {
    result.innerHTML = `
      <section class="error-card">
        <p class="result-label">ANALYSIS INCOMPLETE</p>
        <h2>ZeroJury could not finish this session.</h2>
        <p>${escapeHtml(error.message)}</p>
      </section>
    `;
  } finally {
    clearInterval(timer);
    button.disabled = false;
    button.textContent = "Analyze with ZeroJury";
  }
});

function renderList(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return "<p>No material items identified.</p>";
  }

  return `
    <ul>
      ${items.map((item) => `<li>${formatText(item)}</li>`).join("")}
    </ul>
  `;
}

function formatText(value = "") {
  return escapeHtml(String(value))
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
