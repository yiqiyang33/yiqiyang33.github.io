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

## 常用改动入口

- 改主页文案：编辑 `_pages/about.md`
- 改侧边栏头像/简介/联系方式：编辑 `_config.yml -> author`
- 改欢迎短句：编辑 `_config.yml -> welcome_intro.subtitle`
- 调欢迎动画时长：编辑 `_config.yml -> welcome_intro.duration_ms`
- 关闭欢迎动画：编辑 `_config.yml -> welcome_intro.enabled: false`

## 部署说明

这个仓库用于 GitHub Pages。推送到 `main` 后会自动部署到 `https://yiqiyang33.github.io/`。

## Credits

- Base template: [RayeRen/acad-homepage.github.io](https://github.com/RayeRen/acad-homepage.github.io)
- Related upstream inspirations:
  - [mmistakes/minimal-mistakes](https://github.com/mmistakes/minimal-mistakes)
  - [academicpages/academicpages.github.io](https://github.com/academicpages/academicpages.github.io)
