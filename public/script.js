const form = document.getElementById("rap-form");
const btn = document.getElementById("generate-btn");
const btnText = btn.querySelector(".btn-text");
const btnLoading = btn.querySelector(".btn-loading");
const output = document.getElementById("output");
const rapText = document.getElementById("rap-text");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const context = document.getElementById("context").value.trim();
  const style = document.getElementById("style").value;

  if (!name) return;

  // Loading state
  btn.disabled = true;
  btnText.hidden = true;
  btnLoading.hidden = false;
  output.hidden = true;

  // Remove any previous error
  const prevError = document.querySelector(".error");
  if (prevError) prevError.remove();

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, context, style }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    rapText.textContent = data.rap;
    output.hidden = false;
  } catch (err) {
    const errorEl = document.createElement("p");
    errorEl.className = "error";
    errorEl.textContent = err.message;
    form.after(errorEl);
  } finally {
    btn.disabled = false;
    btnText.hidden = false;
    btnLoading.hidden = true;
  }
});
