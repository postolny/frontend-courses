import {loadLessons} from "./lessons.js";
const allLessons = await loadLessons();
const counters = {};
allLessons.forEach((item) => {
  if (!counters[item.course]) {
    counters[item.course] = 1;
  }
  item.number = counters[item.course]++;
});
const lessonCounts = allLessons.reduce((acc, lesson) => {
  acc[lesson.course] = (acc[lesson.course] || 0) + 1;
  return acc;
}, {});
document.querySelectorAll(".tab").forEach((tab) => {
  const id = tab.dataset.course;
  tab.querySelector(".count").textContent = `(${lessonCounts[id] || 0})`;
});
const pageSize = 8;
const shown = {};
// создание карточки
function createLessonCard(item) {
  return `
  <a class="lesson" href="${item.url}">
    <div class="lesson-top">
      <h3 class="lesson-title">
        ${item.title}
      </h3>
      <span class="lesson-number">${item.number}</span>
    </div>
    <p class="lesson-desc">
      ${item.description}
    </p>
    <div class="lesson-bottom">
      <span>
        ${item.level}
      </span>
      <span class="lesson-open">Открыть
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path d="M0 0h24v24H0z" fill="none" />
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 12l-6-6m6 6l-6 6m6-6H5" />
        < /svg>
      </span>
    </div>
  </a>
  `;
}
//вывод курса
function renderCourse(courseId) {
  if (!shown[courseId]) {
    shown[courseId] = pageSize;
  }
  const grid = document.querySelector(`#${courseId} .lesson-grid`);
  const lessons = allLessons.filter((item) => item.course === courseId);
  grid.innerHTML = lessons.slice(0, shown[courseId]).map(createLessonCard).join("");
  const button = document.querySelector(`.load-more[data-course="${courseId}"]`);
  if (shown[courseId] >= lessons.length) {
    button.hidden = true;
  } else {
    button.hidden = false;
  }
}
renderCourse("js");
// табы
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const id = tab.dataset.course;
    document.querySelectorAll(".tab").forEach((t) => {
      t.classList.remove("active");
    });
    tab.classList.add("active");
    document.querySelectorAll(".course").forEach((section) => {
      section.hidden = true;
    });
    document.getElementById(id).hidden = false;
    search.value = "";
    search.dispatchEvent(new Event("input"));
  });
});
// кнопка Загрузить ещё
document.addEventListener("click", (e) => {
  const button = e.target.closest(".load-more");
  if (!button) return;
  const id = button.dataset.course;
  shown[id] += pageSize;
  renderCourse(id);
});
// поиск
const search = document.querySelector("#search");
const clearSearch = document.querySelector("#clearSearch");
search.addEventListener("input", (e) => {
  const text = e.target.value.toLowerCase().trim();
  clearSearch.style.display = text ? "block" : "none";
  document.querySelectorAll(".course").forEach((section) => {
    const id = section.id;
    if (!text) {
      // shown[id] = pageSize;
      renderCourse(id);
      return;
    }
    const grid = section.querySelector(".lesson-grid");
    const result = allLessons.filter((item) => {
      if (item.course !== id) return false;
      return (
        item.title.toLowerCase().includes(text) || item.description.toLowerCase().includes(text)
      );
    });
    grid.innerHTML = result.map(createLessonCard).join("");
    const button = document.querySelector(`.load-more[data-course="${id}"]`);
    button.hidden = true;
  });
});
clearSearch.addEventListener("click", () => {
  search.value = "";
  search.dispatchEvent(new Event("input"));
  search.focus();
});
document.getElementById("year").textContent = new Date().getFullYear();