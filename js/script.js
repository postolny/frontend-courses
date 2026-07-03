const tabs = document.querySelectorAll('.tab');
const contentContainer = document.querySelector('.content');
const cache = new Map();
async function loadCourse(id) {
  if (cache.has(id)) {
    contentContainer.innerHTML = cache.get(id);
    return;
  }
  const res = await fetch("./courses/" + id + ".html");
  const html = await res.text();
  cache.set(id, html);
  contentContainer.innerHTML = html;
}
tabs.forEach(function(tab) {
  tab.addEventListener('click', function() {
    const id = tab.dataset.course;
    tabs.forEach(function(t) {
      t.classList.remove('active');
    });
    tab.classList.add('active');
    loadCourse(id);
  });
});
if (tabs.length > 0) {
  tabs[0].click();
}
document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".load-more");
  if (!btn) return;
  const course = btn.closest(".course");
  const grid = course.querySelector(".lesson-grid");
  const name = btn.dataset.course;
  let page = Number(btn.dataset.page);
  const max = Number(btn.dataset.max);
  if (page > max) {
    btn.remove();
    return;
  }
  const url = "./courses/" + name + "-part" + page + ".html";
  const res = await fetch(url);
  if (!res.ok) {
    btn.remove();
    return;
  }
  const html = await res.text();
  const temp = document.createElement("div");
  temp.innerHTML = html;
  grid.append(...temp.querySelectorAll(".lesson"));
  page++;
  btn.dataset.page = page;
  if (page > max) {
    btn.remove();
  }
});
document.getElementById("year").textContent = new Date().getFullYear();