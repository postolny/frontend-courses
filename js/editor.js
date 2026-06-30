function updatePreview() {
  const code = document.getElementById("code").value;
  document.getElementById("output").srcdoc = code;
  document.getElementById("preview").textContent = code;
}
document.getElementById("code").addEventListener("input", () => {
  clearTimeout(window._t);
  window._t = setTimeout(updatePreview, 200);
});
window.addEventListener("DOMContentLoaded", updatePreview);
const btn = document.getElementById("copyBtn");
const iconCopy = document.getElementById("iconCopy");
const iconCheck = document.getElementById("iconCheck");
btn.addEventListener("click", () => {
  const code = document.getElementById("preview").innerText;
  navigator.clipboard.writeText(code);
  iconCopy.style.display = "none";
  iconCheck.style.display = "block";
  setTimeout(() => {
    iconCopy.style.display = "block";
    iconCheck.style.display = "none";
  }, 1500);
});