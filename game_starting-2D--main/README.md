# 理想工作模拟器（未完成）

一个基于Vue 3 + TypeScript的交互式人生选择游戏，让玩家体验不同的职业道路和人生选择。

## 游戏特色

- 🎮 **四条主线剧情**：职场路线、作家路线、创业路线、躺平路线
- 🌟 **25个故事节点**：丰富的剧情分支和多重结局（to be continued）
- 💫 **现代化UI**：简洁优雅的左右分栏设计
- 📱 **移动端友好**：完美适配手机和平板设备 （to be improved）
- 🎯 **角色系统**：主角林淼，显示能量和创造力属性（固定值）（后续自定义角色名称）
- 💾 **存档功能**：支持游戏进度保存和读取 （to be improved）
- ↩️ **撤销功能**：可以撤销上一步选择

## 技术栈

- **前端框架**：Vue 3 + Composition API
- **开发语言**：TypeScript
- **构建工具**：Vite
- **样式设计**：CSS3 + CSS Variables + Element-plus
- **响应式设计**：Mobile-first approach

## 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 游戏玩法

1. 游戏开始时，你需要选择人生道路：努力求职、追求梦想写小说、或选择躺平
2. 每个选择都会影响后续剧情发展
3. 根据你的选择，会走向不同的结局
4. 可以随时重新开始游戏，体验不同的剧情分支

## 项目结构

```
src/
├── components/
│   └── JobSimulator.vue    # 游戏主组件
├── data/
│   └── story.ts           # 剧情数据定义
├── App.vue                # 应用根组件
├── main.ts                # 应用入口
└── style.css              # 全局样式
```

## 贡献

欢迎提交Issue和Pull Request来改进游戏体验！
