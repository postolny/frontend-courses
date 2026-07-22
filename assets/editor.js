const editor = CodeMirror.fromTextArea(document.getElementById("code"), {
  mode: "htmlmixed",
  lineNumbers: false,
  autoCloseTags: true,
  autoCloseBrackets: true,
  styleActiveLine: false,
  lineWrapping: true,
  theme: "eclipse"
});
async function loadLesson() {
  const lesson = location.hash.slice(1);
  const response = await fetch(`data/code/${lesson}.txt`);
  const code = await response.text();
  editor.setValue(code);
  updatePreview();
}
const lightTheme = "eclipse";
const darkTheme = "ayu-dark";

function toggleTheme() {
  const isDark = document.body.classList.contains("theme-dark");
  const newIsDark = !isDark;
  document.body.classList.toggle("theme-dark", newIsDark);
  const theme = newIsDark ? darkTheme : lightTheme;
  editor.setOption("theme", theme);
  localStorage.setItem("theme", theme);
}
const savedTheme = localStorage.getItem("theme") || lightTheme;
editor.setOption("theme", savedTheme);
document.body.classList.toggle("theme-dark", savedTheme === darkTheme);

function updatePreview() {
  document.getElementById("output").srcdoc = editor.getValue();
}
document.getElementById("reloadBtn").addEventListener("click", updatePreview);
document.getElementById("formatBtn").addEventListener("click", async () => {
  const code = editor.getValue();
  const formatted = await prettier.format(code, {
    parser: "html",
    plugins: prettierPlugins
  });
  editor.setValue(formatted);
  updatePreview();
});
loadLesson();
const btn = document.getElementById("copyBtn");
const iconCopy = document.getElementById("iconCopy");
const iconCheck = document.getElementById("iconCheck");
btn.addEventListener("click", () => {
  const code = editor.getValue();
  navigator.clipboard.writeText(code);
  iconCopy.style.display = "none";
  iconCheck.style.display = "block";
  setTimeout(() => {
    iconCopy.style.display = "block";
    iconCheck.style.display = "none";
  }, 1500);
});
document.querySelector(".exit").addEventListener("click", (e) => {
  e.preventDefault();
  history.back();
});