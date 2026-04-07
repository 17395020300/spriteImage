<p align="center">
  <a href="https://github.com/Rupiong/nanaSprite/blob/main/src/assets/logo.png">
    <img src="https://raw.githubusercontent.com/Rupiong/nanaSprite/main/src/assets/logo.png" alt="nanaSprite logo" width="200" />
  </a>
</p>

# nanaSprite

基于浏览器的 **CSS 雪碧图（Sprite）** 生成工具：上传多张图片，自动装箱排版，预览合成图，并生成可直接使用的 CSS。

**在线使用：** [https://rupiong.github.io/nanaSprite/](https://rupiong.github.io/nanaSprite/)

## 功能概览

- **多图上传**：支持拖拽或选择文件；同名文件会自动加序号避免冲突。
- **多种排版**：Binary Tree（紧凑装箱）、Diagonal / Diagonal Alt（对角阶梯）、单行横向、单列纵向；可设置帧间距（gap）。
- **实时预览**：在画布上查看合成后的雪碧图。
- **CSS 导出**：
  - `background` 简写或拆分为 `background-image` / `position` / `repeat` 等长写法。
  - 类名规则：`bg-文件名`、`sprite-序号`，或「自定义前缀 + 文件名」。
  - 单位：`px` 或 `rem`（可配置 rem 基准）。
  - 可编辑 CSS 中引用的雪碧图文件名（如 `css_sprites.png`）。
- **代码高亮与复制**：便于粘贴到项目中使用。

## 技术栈

| 类别     | 说明 |
|----------|------|
| 框架     | [Vue 3](https://vuejs.org/)（`<script setup>`） |
| 语言     | [TypeScript](https://www.typescriptlang.org/) |
| 构建     | [Vite](https://vite.dev/) |
| 状态     | [Pinia](https://pinia.vuejs.org/) |
| UI       | [Naive UI](https://www.naiveui.com/) |
| 样式     | [UnoCSS](https://unocss.dev/) |
| 其他     | Vue Router、VueUse、highlight.js、css-tree（部分工具逻辑） |

## 环境要求

- [Node.js](https://nodejs.org/) 建议 **18+**（与 Vite 8 兼容即可）

## 本地开发

```bash
npm install
npm run dev
```

默认开发服务器：<http://localhost:5173>（见 `vite.config.ts`）。

## 构建与预览

```bash
npm run build
npm run preview
```

`build` 会先执行 `vue-tsc` 做类型检查，再执行 Vite 打包。

## 目录结构（简要）

```
src/
  components/     # 上传、帧列表、布局选项、预览、CSS 输出等面板
  views/          # 页面视图（雪碧图生成主界面）
  store/          # Pinia：帧数据、装箱结果、CSS 生成
  utils/          # 装箱算法、画布合成、CSS 生成
  hooks/          # 图片元信息、复制等组合逻辑
  enums/          # 布局模式、输出样式、类名规则等枚举
```

## 许可证

本项目为私有仓库（`package.json` 中 `"private": true`），未指定开源许可证；对外分发前请自行补充许可说明。
