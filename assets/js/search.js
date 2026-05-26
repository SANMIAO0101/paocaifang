document.addEventListener("DOMContentLoaded", async () => {
  const storyGrid = document.querySelector("#story-grid");
  const resultList = document.querySelector("#result-list");
  const count = document.querySelector("#story-count");
  if(!storyGrid && !resultList) return;

  const novels = await Site.json("data/novels.json");
  const params = new URLSearchParams(location.search);

  function normalize(text){
    return String(text || "").trim().toLowerCase();
  }

  function matchNovel(novel, keyword){
    if(!keyword) return true;
    const pool = [
      novel.title, novel.subtitle, novel.authorName, novel.category, novel.status,
      novel.intro, ...(novel.tagNames || []), ...(novel.tags || [])
    ].join(" ").toLowerCase();
    return pool.includes(keyword);
  }

  function getFilters(){
    return {
      keyword: normalize(document.querySelector("#keyword")?.value),
      category: document.querySelector("#category")?.value || "all",
      status: document.querySelector("#status")?.value || "all",
      tag: document.querySelector("#tag")?.value || "all"
    };
  }

  function filterNovels(){
    const filters = getFilters();
    return novels.filter(novel => {
      const keywordOK = matchNovel(novel, filters.keyword);
      const categoryOK = filters.category === "all" || novel.categoryKey === filters.category;
      const statusOK = filters.status === "all" || novel.status === filters.status;
      const tagOK = filters.tag === "all" || novel.tags.includes(filters.tag);
      return keywordOK && categoryOK && statusOK && tagOK;
    });
  }

  function renderStories(){
    const data = filterNovels();
    if(count) count.textContent = `共找到 ${data.length} 本小说`;
    if(storyGrid) storyGrid.innerHTML = data.length ? data.map(Site.card).join("") : `<div class="empty">没有找到符合条件的小说。</div>`;
  }

  function renderSearch(){
    const keyword = normalize(document.querySelector("#search-input")?.value);
    const tag = document.querySelector("#search-tag")?.value || "all";
    const author = normalize(document.querySelector("#search-author")?.value);
    const data = novels.filter(novel => {
      const keywordOK = matchNovel(novel, keyword);
      const tagOK = tag === "all" || novel.tags.includes(tag);
      const authorOK = !author || normalize(novel.authorName).includes(author);
      return keywordOK && tagOK && authorOK;
    });
    if(resultList){
      resultList.innerHTML = data.length ? data.map(novel => `
        <article class="result-card">
          <img src="${Site.path(novel.cover)}" alt="${escapeHTML(novel.title)}封面">
          <div>
            <h3><a href="${Site.path(`novels/${novel.id}.html`)}">${escapeHTML(novel.title)}</a></h3>
            <p>作者：${escapeHTML(novel.authorName)} · ${escapeHTML(novel.category)} · ${escapeHTML(novel.status)}</p>
            <div class="tag-row">${novel.tags.map(t => `<a class="tag" href="${Site.path(`tags/${t}.html`)}">#${escapeHTML(Site.tagName(t))}</a>`).join("")}</div>
            <p>${escapeHTML(novel.intro)}</p>
            <a class="outline-btn" href="${Site.path(`novels/${novel.id}.html`)}">查看详情</a>
          </div>
        </article>
      `).join("") : `<div class="empty">没有搜索结果，可以试试“悬疑”“现代”“泡菜罐子”。</div>`;
    }
  }

  if(storyGrid){
    ["#keyword","#category","#status","#tag"].forEach(selector => {
      const el = document.querySelector(selector);
      if(el) el.addEventListener("input", renderStories);
    });
    renderStories();
  }

  if(resultList){
    const searchInput = document.querySelector("#search-input");
    if(searchInput && params.get("q")) searchInput.value = params.get("q");
    ["#search-input","#search-tag","#search-author"].forEach(selector => {
      const el = document.querySelector(selector);
      if(el) el.addEventListener("input", renderSearch);
    });
    const form = document.querySelector("#search-form");
    if(form){
      form.addEventListener("submit", event => {
        event.preventDefault();
        const q = document.querySelector("#search-input").value.trim();
        history.replaceState(null, "", q ? `?q=${encodeURIComponent(q)}` : location.pathname);
        renderSearch();
      });
    }
    renderSearch();
  }
});
