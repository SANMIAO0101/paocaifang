(function(){
  const $ = (selector, scope=document) => scope.querySelector(selector);
  const $$ = (selector, scope=document) => Array.from(scope.querySelectorAll(selector));
  const escapeHTML = (value="") => String(value)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");

  const Site = {
    base(){
      return window.SITE_BASE || "";
    },
    path(path){
      return this.base() + path;
    },
    async json(path){
      const response = await fetch(this.path(path));
      if(!response.ok) throw new Error("无法读取 " + path);
      return response.json();
    },
    date(dateText){
      const date = new Date(dateText + "T00:00:00");
      if(Number.isNaN(date.getTime())) return dateText;
      return date.toLocaleDateString("zh-CN", {year:"numeric", month:"2-digit", day:"2-digit"});
    },
    tagName(tag){
      const dict = {bg:"女频", bl:"耽美", modern:"现代", ancient:"古代", western:"西幻", suspense:"悬疑"};
      return dict[tag] || tag;
    },
    card(novel){
      const tags = (novel.tags || []).map(tag => 
        `<a class="tag" href="${Site.path(`tags/${tag}.html`)}">#${escapeHTML(Site.tagName(tag))}</a>`
      ).join("");
      return `
        <article class="card">
          <a href="${Site.path(`novels/${novel.id}.html`)}">
            <img class="card-cover" src="${Site.path(novel.cover)}" alt="${escapeHTML(novel.title)}封面">
          </a>
          <div class="card-body">
            <h3 class="card-title"><a href="${Site.path(`novels/${novel.id}.html`)}">${escapeHTML(novel.title)}</a></h3>
            <p class="card-meta">
              <a href="${Site.path(`authors/${novel.authorId}.html`)}">${escapeHTML(novel.authorName)}</a>
              · <span class="status">${escapeHTML(novel.status)}</span>
            </p>
            <div class="tag-row">${tags}</div>
            <p class="card-intro">${escapeHTML(novel.intro)}</p>
            <a class="outline-btn" href="${Site.path(`novels/${novel.id}.html`)}">查看详情</a>
          </div>
        </article>
      `;
    },
    updateRow(novel){
      const last = novel.chapters[novel.chapters.length - 1];
      return `
        <a class="update-item" href="${Site.path(last.file)}">
          <strong>${escapeHTML(novel.title)}</strong>
          <span>${escapeHTML(last.title)}</span>
          <span class="muted">${Site.date(last.date)}</span>
        </a>
      `;
    },
    social(){
      return `
        <div class="social-box">
          <a class="social-link" href="https://weibo.com" target="_blank" rel="noopener">
            <strong>微博</strong><span>发布更新、番外和站点公告</span>
          </a>
          <a class="social-link" href="#" target="_blank" rel="noopener">
            <strong>QQ群</strong><span>读者讨论、追更提醒和投喂反馈</span>
          </a>
          <a class="social-link" href="https://www.xiaohongshu.com" target="_blank" rel="noopener">
            <strong>小红书</strong><span>封面灵感、角色设定和碎碎念</span>
          </a>
        </div>
      `;
    }
  };
  window.Site = Site;
  window.escapeHTML = escapeHTML;

  function initTheme(){
    const saved = localStorage.getItem("pcxf-theme");
    if(saved) document.documentElement.dataset.theme = saved;
    $$(".theme-toggle").forEach(button => {
      button.addEventListener("click", () => {
        const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
        document.documentElement.dataset.theme = next;
        localStorage.setItem("pcxf-theme", next);
      });
    });
  }

  async function renderNovelPage(){
    const el = $(".novel-render");
    if(!el) return;
    const novelId = document.body.dataset.novelId;
    const novels = await Site.json("data/novels.json");
    const novel = novels.find(item => item.id === novelId);
    if(!novel){
      el.innerHTML = `<div class="empty">没有找到这本小说。</div>`;
      return;
    }
    document.title = `${novel.title}｜泡菜小说坊`;
    const chapters = novel.chapters.map((chapter, index) => `
      <a class="chapter-row" href="${Site.path(chapter.file)}">
        <strong>${escapeHTML(chapter.title)}</strong>
        <span class="muted">${Site.date(chapter.date)}</span>
        <span>阅读 →</span>
      </a>
    `).join("");

    const recommends = novels
      .filter(item => item.id !== novel.id && item.tags.some(tag => novel.tags.includes(tag)))
      .slice(0, 2)
      .map(Site.card)
      .join("") || `<div class="empty">暂时没有同类推荐。</div>`;

    el.innerHTML = `
      <section class="page-hero">
        <div class="breadcrumb"><a href="${Site.path("index.html")}">首页</a> / <a href="${Site.path("stories.html")}">Stories</a> / ${escapeHTML(novel.title)}</div>
        <div class="novel-box">
          <img class="novel-cover" src="${Site.path(novel.cover)}" alt="${escapeHTML(novel.title)}封面">
          <div>
            <p class="kicker">${escapeHTML(novel.category)} · ${escapeHTML(novel.status)}</p>
            <h1 class="novel-title">${escapeHTML(novel.title)}</h1>
            <p class="hero-subtitle">${escapeHTML(novel.subtitle)}</p>
            <p class="muted">作者：<a href="${Site.path(`authors/${novel.authorId}.html`)}"><strong>${escapeHTML(novel.authorName)}</strong></a> · 最近更新：${Site.date(novel.updatedAt)}</p>
            <div class="tag-row">${novel.tags.map(tag => `<a class="tag" href="${Site.path(`tags/${tag}.html`)}">#${escapeHTML(Site.tagName(tag))}</a>`).join("")}</div>
            <p>${escapeHTML(novel.intro)}</p>
            <div class="novel-actions">
              <a class="primary-btn" href="${Site.path(novel.chapters[0].file)}">立即阅读</a>
              <button class="outline-btn" type="button" onclick="alert('收藏功能后期可接入登录/数据库，这里先保留按钮位置。')">♡ 收藏</button>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="section-head">
          <div>
            <h2 class="section-title">主角介绍</h2>
            <p class="section-desc">用于放人设、关系张力和读者入坑点。</p>
          </div>
        </div>
        <div class="character-grid">
          <div class="character-card"><h3>女主 / 主角A</h3><p>${escapeHTML(novel.heroine)}</p></div>
          <div class="character-card"><h3>男主 / 主角B</h3><p>${escapeHTML(novel.hero)}</p></div>
        </div>
      </section>

      <section class="section">
        <div class="section-head">
          <div>
            <h2 class="section-title">章节列表</h2>
            <p class="section-desc">当前示例放了 2 章，后续继续新增 chapter-3.html 即可。</p>
          </div>
        </div>
        <div class="chapter-list">${chapters}</div>
      </section>

      <section class="section">
        <div class="section-head">
          <div>
            <h2 class="section-title">推荐小说</h2>
            <p class="section-desc">根据相同标签自动推荐。</p>
          </div>
        </div>
        <div class="recommend-grid">${recommends}</div>
      </section>

      <section class="section">
        <div class="section-head"><h2 class="section-title">社交讨论入口</h2></div>
        ${Site.social()}
      </section>
    `;
  }

  async function renderAuthorPage(){
    const el = $(".author-render");
    if(!el) return;
    const authorId = document.body.dataset.authorId;
    const [authors, novels] = await Promise.all([Site.json("data/authors.json"), Site.json("data/novels.json")]);
    const author = authors.find(item => item.id === authorId);
    if(!author){
      el.innerHTML = `<div class="empty">没有找到这位作者。</div>`;
      return;
    }
    document.title = `${author.name}｜泡菜小说坊`;
    const works = novels.filter(novel => author.novels.includes(novel.id)).map(Site.card).join("");
    el.innerHTML = `
      <section class="page-hero">
        <div class="breadcrumb"><a href="${Site.path("index.html")}">首页</a> / 作者 / ${escapeHTML(author.name)}</div>
        <div class="novel-box">
          <img class="novel-cover" src="${Site.path(author.avatar)}" alt="${escapeHTML(author.name)}头像">
          <div>
            <p class="kicker">Author</p>
            <h1 class="novel-title">${escapeHTML(author.name)}</h1>
            <p class="page-lead">${escapeHTML(author.bio)}</p>
            <div class="novel-actions">
              <a class="primary-btn" href="${escapeHTML(author.social)}" target="_blank" rel="noopener">社交链接</a>
              <a class="outline-btn" href="${Site.path("stories.html")}">返回小说列表</a>
            </div>
          </div>
        </div>
      </section>
      <section class="section">
        <div class="section-head">
          <div>
            <h2 class="section-title">全部小说</h2>
            <p class="section-desc">此作者目前收录的作品。</p>
          </div>
        </div>
        <div class="grid">${works}</div>
      </section>
    `;
  }

  document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    renderNovelPage().catch(error => console.error(error));
    renderAuthorPage().catch(error => console.error(error));
  });
})();
