document.addEventListener("DOMContentLoaded", async () => {
  const head = document.querySelector("#chapter-head");
  const content = document.querySelector("#reader-content");
  const tools = document.querySelector("#reader-tools");
  const recommend = document.querySelector("#chapter-recommend");
  if(!head || !content) return;

  const novelId = document.body.dataset.novelId;
  const chapterId = document.body.dataset.chapterId;
  const [novels, chapters] = await Promise.all([Site.json("data/novels.json"), Site.json("data/chapters.json")]);
  const novel = novels.find(item => item.id === novelId);
  const chapter = chapters.find(item => item.novelId === novelId && item.chapterId === chapterId);
  if(!novel || !chapter){
    head.innerHTML = `<div class="empty">章节不存在。</div>`;
    return;
  }
  document.title = `${chapter.title}｜${novel.title}｜泡菜小说坊`;

  const currentIndex = novel.chapters.findIndex(item => item.id === chapterId);
  const prev = novel.chapters[currentIndex - 1];
  const next = novel.chapters[currentIndex + 1];

  head.innerHTML = `
    <p class="breadcrumb"><a href="${Site.path("index.html")}">首页</a> / <a href="${Site.path(`novels/${novel.id}.html`)}">${escapeHTML(novel.title)}</a></p>
    <p class="kicker">${escapeHTML(novel.title)} · ${escapeHTML(novel.authorName)}</p>
    <h1 class="chapter-title">${escapeHTML(chapter.title)}</h1>
    <p class="muted">更新日期：${Site.date(chapter.date)}</p>
    <a class="outline-btn" href="#page-bottom">返回底部 ↓</a>
  `;
  content.innerHTML = chapter.content.map(p => `<p>${escapeHTML(p)}</p>`).join("");

  if(tools){
    tools.innerHTML = `
      <button type="button" onclick="window.scrollTo({top:0,behavior:'smooth'})">返回顶部</button>
      <a href="${Site.path(`novels/${novel.id}.html`)}">目录</a>
      ${prev ? `<a href="${Site.path(prev.file)}">上一章</a>` : `<span class="muted">上一章</span>`}
      ${next ? `<a href="${Site.path(next.file)}">下一章</a>` : `<span class="muted">下一章</span>`}
    `;
  }

  if(recommend){
    const recs = novels.filter(item => item.id !== novel.id).slice(0,3).map(Site.card).join("");
    recommend.innerHTML = recs;
  }
});
