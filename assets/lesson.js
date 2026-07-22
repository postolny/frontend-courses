async function loadLesson() {
  const file = location.hash.slice(1);
  const lessonsResponse = await fetch("data/lessons.json");
  const lessons = await lessonsResponse.json();
  const lesson = lessons.find((item) => item.file === file);
  if (lesson) {
    document.title = lesson.title;
  }
  const codeResponse = await fetch(`data/code/${file}.txt`);
  const code = await codeResponse.text();
  editor.setValue(code);
  updatePreview();
}
loadLesson();