# Dark Mode Switch - Firefox 扩展插件

一个将网页转换为暗色模式的 Firefox 扩展插件，提供更符合人体工程学的视觉体验。

## 功能特性

- **一键切换**: 单击即可开启/关闭暗色模式
- **颜色深度调节**: 支持调节暗色程度（轻度/中度/深度）
- **系统主题同步**: 自动检测系统主题并同步切换
- **自定义颜色**: 个性化背景颜色和文字颜色
- **媒体保护**: 图片、视频和 Canvas 元素保持原色
- **性能优化**: 使用 CSS 滤镜实现即时转换
- **设置持久化**: 自动保存用户偏好设置

## 安装方法

### 方法一：临时加载（推荐用于测试）
这是最简单的测试方式，无需修改浏览器设置。重启 Firefox 后插件会自动消失。

1. 打开 Firefox
2. 访问 `about:debugging#/runtime/this-firefox`
3. 找到 **"临时扩展"** 部分
4. 点击 **"加载临时扩展..."**
5. 选择项目目录中的 `manifest.json` 文件
6. 插件图标会立即出现在工具栏中

### 方法二：从 XPI 文件安装（需要开发者版）
要永久安装，需要使用特殊版本的 Firefox 并禁用签名验证。

1. **安装 Firefox 开发者版**
   - 下载地址: https://www.mozilla.org/zh-CN/firefox/developer/
   
2. **禁用签名验证**
   - 打开 `about:config`
   - 点击 "接受风险并继续"
   - 搜索 `xpinstall.signatures.required`
   - 将值设置为 `false`
   
3. **安装插件**
   - 访问 `about:addons`
   - 点击齿轮图标 → "从文件安装附加组件..."
   - 选择 `DarkModeSwitch.xpi` 文件

### 方法三：从 Firefox 附加组件商店安装（即将推出）
插件经过 Mozilla 签名后，可以直接从 Firefox 附加组件商店安装。

### 关于 Firefox 附加组件签名
Firefox 要求大多数附加组件在安装前必须经过 Mozilla 的数字签名验证。这有助于保护用户免受恶意附加组件的侵害，这些恶意组件可能会劫持浏览器、窃取信息或植入垃圾广告。

**为什么需要签名：**
- 防止未经授权修改浏览器设置
- 阻止广告软件、跟踪器和工具栏的安装
- 保护浏览数据和登录凭证

**如何使用未签名插件：**
1. **临时加载**: 使用 `about:debugging`（上述方法一）
2. **Firefox 开发者版**: 在 `about:config` 中禁用签名验证
3. **Firefox ESR**: 也支持禁用签名验证
4. **提交到 AMO**: 如需永久分发，提交到 https://addons.mozilla.org/ 进行审核和签名

## 使用说明

### 基本操作
- 点击工具栏中的插件图标打开弹窗
- 点击 "Enable Dark Mode" 按钮切换暗色模式
- 使用滑块调节颜色深度（10%-100%）
- 点击预设按钮快速设置（Mild/Medium/Deep）
- 启用 "Follow System Theme" 跟随系统主题

### 自定义颜色
1. 在弹窗中点击 "Custom Colors Settings"
2. 选择您偏好的背景颜色和文字颜色
3. 启用 "Enable Custom Colors" 应用设置
4. 点击 "Save Changes" 保存

## 技术细节

### 架构
- **Manifest V3**: 使用最新的 Firefox 扩展标准
- **Content Scripts**: 注入 CSS 并处理页面级逻辑
- **Background Script**: 管理设置和系统主题检测
- **Popup UI**: 提供用户控制界面
- **Options Page**: 高级自定义选项

### CSS 实现
扩展使用 CSS `filter: invert()` 结合 `hue-rotate()` 实现高效的颜色反转：
- `color-scheme: dark` 确保表单元素正确渲染
- 图片、视频和 Canvas 元素使用 `filter: invert(100%) hue-rotate(180deg)` 抵消父元素的反转效果
- 自定义颜色使用 CSS 变量实现动态应用

### 浏览器兼容性
- **Firefox**: 版本 109 或更高
- **Manifest 版本**: V3

## 所需权限

- `storage`: 保存用户偏好设置
- `activeTab`: 访问当前标签页
- `theme`: 检测系统主题变化
- `<all_urls>`: 对所有网站应用暗色模式

## 项目结构

```
TurnOffLight/
├── manifest.json          # 扩展配置文件
├── DarkModeSwitch.xpi     # 打包后的扩展文件
├── background/
│   └── background.js      # 后台脚本
├── content_scripts/
│   ├── dark-mode.css      # 暗色模式样式
│   └── dark-mode.js       # 内容脚本逻辑
├── popup/
│   ├── popup.html         # 弹窗界面
│   ├── popup.css          # 弹窗样式
│   └── popup.js           # 弹窗逻辑
├── options/
│   ├── options.html       # 选项页面
│   ├── options.css        # 选项页面样式
│   └── options.js         # 选项页面逻辑
├── icons/                 # 扩展图标
└── README.md              # 说明文档
```

## 开发

### 前置条件
- Firefox 109 或更高版本
- 基本了解 WebExtensions API

### 构建
运行 `python build_xpi.py` 创建 XPI 包。

### 测试
1. 在 Firefox 中临时加载扩展
2. 在各类网站（Google、Wikipedia、GitHub 等）上测试
3. 验证所有功能正常工作

## 许可证

本项目是开源的，可用于个人和商业用途。

## 支持

如果您遇到任何问题或有建议，请通过 GitHub issues 页面报告。
