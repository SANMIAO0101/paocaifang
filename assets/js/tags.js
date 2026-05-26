document.addEventListener("DOMContentLoaded", async () => {
  const title = document.querySelector("#tag-title");
  const desc = document.querySelector("#tag-description");
  const grid = document.querySelector("#tag-grid");
  const aside = document.querySelector("#tag-aside");
  if(!title || !grid) return;

  const tagKey = document.body.dataset.tag;
  const [tags, novels] = await Promise.all([Site.json("data/tags.json"), Site.json("data/novels.json")]);
  const tag = tags.find(item => item.key === tagKey);
  document.title = `${tag ? tag.name : "标签"}｜泡菜小说坊`;
  title.textContent = tag ? tag.name : tagKey;
  if(desc) desc.textContent = tag ? tag.description : "对应标签下的小说列表。";

  if(aside){
    aside.innerHTML = tags.map(item => `
      <a class="${item.key === tagKey ? "active" : ""}" href="${Site.path(`tags/${item.key}.html`)}">${escapeHTML(item.name)}</a>
    `).join("");
  }

  const data = novels.filter(novel => novel.tags.includes(tagKey));
  grid.innerHTML = data.length ? data.map(Site.card).join("") : `<div class="empty">这个标签下暂时没有小说。</div>`;
});
