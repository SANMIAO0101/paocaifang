# novel-site

个人小说网站静态模板，参考 Cherry Mist Cafe 的小说站信息架构，并按以下模块组织：

- `index.html`: 首页、Banner、推荐小说、最新小说、最新章节、社交入口
- `stories.html`: 小说总列表、分类筛选、标签筛选、搜索
- `search.html`: 搜索结果页
- `novels/`: 小说详情页
- `chapters/`: 章节阅读页
- `tags/`: 标签分类页
- `authors/`: 作者页
- `assets/`: CSS、JS、图片资源目录
- `data/`: 小说、章节、作者、标签 JSON 数据

部署到 GitHub Pages 时，将整个目录上传到仓库根目录，在 `Settings -> Pages` 中选择 `main` 分支和 `/root`。
