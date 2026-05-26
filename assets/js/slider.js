document.addEventListener("DOMContentLoaded", async () => {
  const hero = document.querySelector("#hero-slider");
  const featuredGrid = document.querySelector("#featured-grid");
  const latestGrid = document.querySelector("#latest-grid");
  const updatesList = document.querySelector("#updates-list");
  if(!hero && !featuredGrid && !latestGrid && !updatesList) return;

  const novels = await Site.json("data/novels.json");
  const featured = novels.filter(novel => novel.featured);
  let index = 0;

  function renderHero(){
    if(!hero || featured.length === 0) return;
    const novel = featured[index % featured.length];
    hero.innerHTML = `
      <div class="banner-slide">
        <div>
          <img class="banner-cover" src="${Site.path(novel.banner)}" alt="${escapeHTML(novel.title)}Banner">
        </div>
        <div>
          <p class="kicker">Pickled Story · ${escapeHTML(novel.category)}</p>
          <h1 class="hero-title">${escapeHTML(novel.title)}</h1>
          <p class="hero-subtitle">${escapeHTML(novel.subtitle)}</p>
          <div class="tag-row">${novel.tags.map(tag => `<a class="tag" href="${Site.path(`tags/${tag}.html`)}">#${escapeHTML(Site.tagName(tag))}</a>`).join("")}</div>
          <p>${escapeHTML(novel.intro)}</p>
          <a class="primary-btn" href="${Site.path(novel.chapters[0].file)}">立即阅读</a>
          <a class="outline-btn" href="${Site.path(`novels/${novel.id}.html`)}">查看详情</a>
        </div>
      </div>
    `;
  }

  renderHero();
  if(featured.length > 1){
    setInterval(() => {
      index += 1;
      renderHero();
    }, 5200);
  }

  if(featuredGrid){
    featuredGrid.innerHTML = featured.map(Site.card).join("");
  }

  if(latestGrid){
    const latest = [...novels].sort((a,b) => b.updatedAt.localeCompare(a.updatedAt)).slice(0, 3);
    latestGrid.innerHTML = latest.map(Site.card).join("");
  }

  if(updatesList){
    const updates = [...novels].sort((a,b) => b.updatedAt.localeCompare(a.updatedAt));
    updatesList.innerHTML = updates.map(Site.updateRow).join("");
  }
});
