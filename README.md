# 泡菜小说坊 Novel Site

这是一个可以直接上传到 GitHub Pages 的静态小说网站模板。

## 目录说明

- `index.html`：首页
- `stories.html`：小说总列表
- `search.html`：搜索结果页
- `novels/`：小说详情页
- `chapters/`：章节阅读页
- `tags/`：标签分类页
- `authors/`：作者页
- `assets/css/`：样式文件
- `assets/js/`：功能脚本
- `assets/images/`：Logo、封面、Banner、头像
- `data/`：小说、章节、作者、标签数据

## 上传到 GitHub 的方法

1. 新建 GitHub 仓库，例如 `novel-site`
2. 把本文件夹里的所有文件上传到仓库根目录
3. 进入仓库 `Settings` → `Pages`
4. Source 选择 `Deploy from a branch`
5. Branch 选择 `main` / `/root`
6. 保存后等待 1-3 分钟，GitHub 会生成网站链接

## 后续怎么新增小说

1. 在 `data/novels.json` 中新增一条小说数据
2. 在 `novels/` 里复制一个详情页，例如 `novel-1.html` 改名为 `novel-5.html`
3. 在 `chapters/novel-5/` 里新增章节页
4. 在 `data/chapters.json` 中添加章节正文

## 配色

主色来自你的要求：

- `#D6B99B`
- `#938D58`
- `#CF9264`
- `#A14B24`

## 注意

这个版本不需要 Node.js、Vite 或数据库，直接上传即可运行。
