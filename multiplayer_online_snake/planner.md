# Phase 0：准备（10 分钟）
- [x] 新建项目目录
- [x]  初始化 Node 项目
- [x]  安装 WebSocket 库（ws）
- [x]  确认 Node 版本 ≥ 18
>目标：能 node server.js 跑起来

# Phase 1：后端世界模型（纯逻辑，不连前端）
1. 定义基础数据结构
- [x] World（宽、高）
- [x] Player（id / direction / body / alive）
- [x] GameState（players / food）
> 不写 WebSocket 都行，先把模型想清楚

2. 玩家加入 / 离开
- [ ] 新玩家生成初始蛇
- [ ] 玩家断线清理
- [ ] 不允许出生点重叠（可先忽略）

3. Tick 机制
-[ ] setInterval(gameLoop, 100)
-[ ] 所有蛇按方向前进一格
-[ ] 暂时不检测任何碰撞

>验收标准：console.log(players) 能看到蛇在“动”

# Phase 2：WebSocket 通信（还是不画画）
4. 建立 WebSocket 服务
-[ ] 客户端连接
-[ ] 分配 playerId
-[ ] 存进 players Map

5. 输入处理
-[ ] 接收 { type: "input", direction }
-[ ] 只更新方向
-[ ] 禁止 180° 掉头（可选）

6. 状态广播
-[ ] 每个 tick 广播一次 gameState
-[ ] JSON 格式
-[ ] 所有客户端都收到

# Phase 3：最小前端（能看到动）
7. Canvas 渲染
-[ ] 一个 <canvas>
-[ ] 画网格
-[ ] 画蛇头（一个方块就行）

8. 接收状态
-[ ] WebSocket 连接
-[ ] 接收 state
-[ ] 本地保存 latestState
-[ ] 每次收到就重绘

9. 键盘输入
-[ ] 监听 ↑↓←→
-[ ] 发送 input 消息

# Phase 4：规则补全
10. 食物
-[ ] 随机生成
-[ ] 吃到 → 蛇变长
-[ ] 食物重生

11. 碰撞检测
-[ ] 撞墙死亡
-[ ] 撞自己
-[ ] 撞别人

12. 玩家生命周期
-[ ] 死亡后消失
-[ ] 或 3 秒后重生（可选）

# Phase 5：工程加分（选做）
-[ ] 前端插值平滑
-[ ] 房间系统（多个房间）
-[ ] 简单 UI（人数、得分）
-[ ]  延迟容忍设计

# 安装依赖
```cmd
npm init -y
npm install ws
```