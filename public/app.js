const form = document.querySelector("#jury-form");
const questionInput = document.querySelector("#question");
const result = document.querySelector("#result");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  result.textContent = "Preparing the independent AI jury…";

  try {
    const response = await fetch("/api/jury", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        question: questionInput.value.trim()
      })
    });

    const data = await response.json();

    result.innerHTML = `
      <h2>${response.ok ? "Result" : "Current status"}</h2>
      <pre>${escapeHtml(JSON.stringify(data, null, 2))}</pre>
    `;
  } catch {
    result.textContent = "The service could not be reached.";
  }
});

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[character]);
}
