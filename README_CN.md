<div align="center">

# 🌙 暗色模式开关（Dark Mode Switch）

**一款 Firefox 扩展插件，将网页转换为暗色模式，提供更符合人体工程学的视觉体验。**

[![版本][version-badge]][version-link]
[![许可证][license-badge]][license-link]
[![Firefox][firefox-badge]][firefox-link]
[![欢迎 PR][prs-badge]][prs-link]

[version-badge]: https://img.shields.io/badge/版本-1.0.0-blue?style=flat-square
[version-link]: #
[license-badge]: https://img.shields.io/badge/许可证-MIT-green?style=flat-square
[license-link]: #许可证
[firefox-badge]: https://img.shields.io/badge/Firefox-109%2B-orange?style=flat-square&logo=firefox
[firefox-link]: #
[prs-badge]: https://img.shields.io/badge/PR-欢迎-brightgreen?style=flat-square
[prs-link]: #贡献指南

[主要功能](#主要功能) • [安装方法](#安装方法) • [使用说明](#使用说明) • [贡献指南](#贡献指南) • [许可证](#许可证)

</div>

---

## ✨ 主要功能

- **一键开关** — 从工具栏点击即可启用/禁用插件
- **自定义暗模式** — 个性化设置背景颜色和暗度级别
- **系统主题同步** — 自动跟随操作系统主题变化
- **灯箱查看器** — 内置图片灯箱，支持画廊浏览
- **媒体保护** — 图片、视频和 Canvas 元素不受反色影响
- **性能优化** — 使用 CSS 滤镜实现即时、流畅的转换
- **双语支持** — 英文和简体中文界面，自动检测系统语言
- **设置持久化** — 您的偏好设置会自动保存，重启浏览器后保留

## 🚀 安装方法

### 方法一：临时加载（推荐用于测试）

最简单的测试方式，无需修改浏览器设置。重启 Firefox 后插件会自动消失。

1. 打开 Firefox
2. 访问 `about:debugging#/runtime/this-firefox`
3. 找到 **临时扩展** 部分
4. 点击 **加载临时扩展...**
5. 选择项目目录中的 `manifest.json` 文件
6. 插件图标会立即出现在工具栏中

### 方法二：从 XPI 文件安装（需要开发者版）

如需永久安装，请使用 Firefox 开发者版并禁用签名验证。

1. **安装 Firefox 开发者版**
   - 下载地址：[mozilla.org/zh-CN/firefox/developer](https://www.mozilla.org/zh-CN/firefox/developer/)

2. **禁用签名验证**
   - 打开 `about:config`
   - 点击"接受风险并继续"
   - 搜索 `xpinstall.signatures.required`
   - 将值设置为 `false`

3. **安装插件**
   - 访问 `about:addons`
   - 点击齿轮图标 → "从文件安装附加组件..."
   - 选择 `DarkModeSwitch.xpi`

### 方法三：Firefox 附加组件商店（即将推出）

插件经过 Mozilla 签名后，可直接从 Firefox 附加组件商店安装。

## 📖 使用说明

### 快速开始

1. 点击 Firefox 工具栏中的插件图标
2. 切换 **启用插件** 来激活扩展
3. 在任何网页上，右下角会出现两个浮动按钮：
   - 🖼️ **灯箱按钮** — 点击打开图片灯箱查看器
   - ⚙️ **设置按钮** — 点击打开设置面板

### 设置面板

通过网页上的齿轮按钮访问所有自定义选项：

| 设置项 | 说明 |
|--------|------|
| **启用暗模式** | 开启/关闭暗模式效果 |
| **背景颜色** | 选择自定义背景颜色 |
| **暗度** | 调节暗度级别（0-100%） |
| **跟随系统主题** | 自动同步系统主题 |
| **启用灯箱查看器** | 开关图片灯箱功能 |
| **灯箱大小** | 调整灯箱尺寸（紧凑 / 标准 / 宽敞 / 沉浸） |

### 键盘快捷键（灯箱）

| 按键 | 功能 |
|------|------|
| `Esc` | 关闭灯箱 |
| `←` / `→` | 上一张 / 下一张图片 |
| `+` / `-` | 放大 / 缩小 |
| `空格` | 播放 / 暂停（视频） |
| `f` | 切换全屏 |
| `m` | 静音 / 取消静音 |

## 🛠️ 技术细节

### 项目结构

```
TurnOffLight/
├── manifest.json          # 扩展配置文件
├── _locales/              # 国际化文件
│   ├── en/messages.json   # 英文文案
│   └── zh_CN/messages.json # 简体中文文案
├── background/
│   └── background.js      # 后台脚本（设置管理、主题检测）
├── content_scripts/
│   ├── dark-mode.css      # 暗模式样式
│   ├── dark-mode.js       # 暗模式逻辑
│   ├── lightbox.css       # 灯箱样式
│   └── lightbox.js        # 灯箱与设置面板逻辑
├── popup/
│   ├── popup.html         # 弹窗界面
│   ├── popup.css          # 弹窗样式
│   └── popup.js           # 弹窗逻辑
├── options/
│   ├── options.html       # 选项页面
│   ├── options.css        # 选项页面样式
│   └── options.js         # 选项页面逻辑
├── icons/                 # 扩展图标
└── build_xpi.py           # XPI 构建脚本
```

### 技术栈

- **Manifest V3** — 最新的 Firefox 扩展标准
- **CSS 滤镜** — 使用 `filter: invert()` + `hue-rotate()` 实现高效颜色反转
- **WebExtensions API** — `browser.storage`、`browser.theme`、`browser.i18n`
- **原生 JavaScript** — 无框架依赖，轻量快速

### 浏览器兼容性

| 浏览器 | 最低版本 |
|--------|----------|
| Firefox | 109+ |
| Manifest | V3 |

## 🔒 所需权限

| 权限 | 用途 |
|------|------|
| `storage` | 本地保存用户偏好设置 |
| `activeTab` | 访问当前标签页以进行灯箱交互 |
| `theme` | 检测系统主题变化 |
| `<all_urls>` | 对所有网站应用暗模式 |

## 🤝 贡献指南

欢迎贡献代码！以下是参与方式：

1. **Fork 本仓库** 并创建您的分支
2. **进行修改** — 添加功能、修复 Bug、改进文档
3. **在多个网站上充分测试**
4. **提交 Pull Request** 并附上清晰的描述

### 开发环境搭建

```bash
# 克隆仓库
git clone https://github.com/NARCSSU/TurnOffLight.git
cd TurnOffLight

# 构建 XPI 包
python build_xpi.py

# 在 Firefox 中加载（临时）
# about:debugging#/runtime/this-firefox → 加载临时扩展 → 选择 manifest.json
```

### 添加新语言

1. 在 `_locales/` 下创建新目录（例如 `_locales/ja/`）
2. 复制 `_locales/en/messages.json` 作为模板
3. 翻译所有 message 值
4. 通过更改 Firefox 界面语言进行测试

## 📝 更新日志

### v1.0.0
- 初始版本发布
- 支持自定义颜色的暗模式开关
- 系统主题同步
- 图片灯箱查看器
- 双语（英文 / 中文）支持
- 插件总开关

## 📄 许可证

本项目开源，可用于个人和商业用途。

---

<div align="center">

用 ❤️ 制作，为了更好的视力健康

[**报告 Bug**][issues-link] · [**功能建议**][issues-link]

[issues-link]: https://github.com/NARCSSU/TurnOffLight/issues

</div>
