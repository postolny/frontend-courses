export async function loadLessons() {
  const response = await fetch("data/lessons.json");
  return await response.json();
}