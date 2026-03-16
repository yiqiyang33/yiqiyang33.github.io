# Yiqi Yang Personal Website

个人学术主页源码仓库（基于 Jekyll）。

- Online: https://yiqiyang33.github.io/
- Branch: `main`
- Tech stack: Jekyll + SCSS + Vanilla JS

## 项目结构

- `_pages/about.md`: 主页正文内容（教育经历、News、论文等）
- `_config.yml`: 站点全局配置（作者信息、SEO、欢迎动画参数）
- `_data/navigation.yml`: 顶部导航锚点
- `assets/css/main.scss`: 自定义样式（含深色模式和欢迎动画样式）
- `assets/js/theme-toggle.js`: 深色模式切换逻辑
- `assets/js/welcome-intro.js`: 进入页面欢迎动画逻辑

## 本地运行

### 1. 安装依赖

```bash
bundle install
```

### 2. 启动开发服务器

```bash
bash run_server.sh
```

或：

```bash
bundle exec jekyll serve --livereload
```

### 3. 访问页面

打开 `http://127.0.0.1:4000`。

## 现在已有的自定义功能

- 深色模式：
  - 默认跟随系统主题
  - 用户切换后记住偏好（`localStorage.site_theme`）
- Welcome 动画（全屏揭幕）：
  - 每次打开页面播放
  - 支持 `Skip` / `Esc` 退出
  - `prefers-reduced-motion` 下自动跳过
  - 配置入口：`_config.yml -> welcome_intro`
- 访客统计（GA4）：
  - 默认前台不展示任何访问统计数字
  - 仅在你自己的 GA4 / Looker Studio 后台查看

## 访问统计与私有后台（GA4 + Looker Studio）

### 1. 接入 GA4 采集

1. 在 Google Analytics 创建 GA4 Property（时区建议 `Asia/Shanghai`）。
1. 复制 Measurement ID（格式 `G-XXXXXXXXXX`）。
1. 在 `_config.yml` 填写：
   - `google_analytics_id: "G-XXXXXXXXXX"`
1. push 后等待 GitHub Pages 发布。

说明：模板已做保护，只有 `google_analytics_id` 非空时才会加载 gtag，避免空 ID 请求。

### 2. 建私有报表（只有你能看）

1. 打开 Looker Studio，新增报表并连接你的 GA4 数据源。
1. 建议添加以下组件：
   - 每日 `Users` + `Pageviews` 折线图
   - 自然周/自然月汇总卡片
   - 总访问（All time）卡片
   - 国家分布（`Country` + `Users` / `Pageviews`）
1. 在 Looker Studio 分享设置里：
   - 仅添加你自己的 Google 账号
   - 关闭“知道链接的任何人可查看”

### 3. 指标口径建议

- 人数看 `Users`，流量看 `Pageviews`
- 周/月建议优先看自然周、自然月
- 国家分布优先按 `Users` 排序，附带 `Pageviews` 作为补充

## 常用改动入口

- 改主页文案：编辑 `_pages/about.md`
- 改侧边栏头像/简介/联系方式：编辑 `_config.yml -> author`
- 改欢迎短句：编辑 `_config.yml -> welcome_intro.subtitle`
- 调欢迎动画时长：编辑 `_config.yml -> welcome_intro.duration_ms`
- 关闭欢迎动画：编辑 `_config.yml -> welcome_intro.enabled: false`
- 开关 GA4 统计：编辑 `_config.yml -> google_analytics_id`

## 部署说明

这个仓库用于 GitHub Pages。推送到 `main` 后会自动部署到 `https://yiqiyang33.github.io/`。

## Credits

- Base template: [RayeRen/acad-homepage.github.io](https://github.com/RayeRen/acad-homepage.github.io)
- Related upstream inspirations:
  - [mmistakes/minimal-mistakes](https://github.com/mmistakes/minimal-mistakes)
  - [academicpages/academicpages.github.io](https://github.com/academicpages/academicpages.github.io)
