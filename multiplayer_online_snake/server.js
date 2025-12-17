const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

const PORT = 3000;
const TICK_RATE = 100;  //时间尺度 100ms一帧
const GRID_SIZE = 20;  //空间尺度  20x20
const url = require('url');
// ===== 游戏状态(全局) =====
function createGameState() {
  return {
    players: {},
    food: {x:5,y:5 }
  };
}
const games = new Map();
games.set('public', createGameState());
respawnFood(games.get('public'));


//判断食物位置是否合适
function respawnFood(gameState) {
  let isPositionValid = false;
  let newX, newY;
  let count=0;
//直到找到食物合适位置
  while (!isPositionValid && count<100) {
    isPositionValid = true;

    newX = Math.floor(Math.random() * GRID_SIZE);
    newY = Math.floor(Math.random() * GRID_SIZE);

    // 判断这个随机坐标
      for (const id in gameState.players)  //遍历所有玩家
      {
      const player = gameState.players[id];
      for (const segment of player.body) //遍历玩家的身体
      {
        if (segment.x === newX && segment.y === newY) {
          isPositionValid = false; 
          break;
        }
      }
      if (!isPositionValid) break;
    }
    count++;
    if (!isPositionValid) {
      console.log("地图太挤了，找不到放食物的地方！");
   }
  }

  gameState.food.x = newX;
  gameState.food.y = newY;
}
// ===== HTTP Server（分发文件--判断请求路径、找文件、发文件）静态资源服务 =====
const server = http.createServer((req, res) => {
  let filePath = "./public" + (req.url === "/" ? "/index.html" : req.url);
  const ext = path.extname(filePath);

  const contentTypeMap = {
    ".html": "text/html",
    ".js": "application/javascript"
  };

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
    } else {
      res.writeHead(200, {
        "Content-Type": contentTypeMap[ext] || "text/plain"
      });
      res.end(content);
    }
  });
});

// ===== WebSocket 实时输入通道=====
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws, req) => {
  const { query } = url.parse(req.url, true);
  const gameId = query.gameId || 'public';
  const mode = query.mode || 'multi'; // single 或 multi
  
  let room;
  
  // 如果是多人模式，需要房间
  if (mode === 'multi') {
    if (!gameId || gameId === 'public') {
      // 创建新房间
      const newRoomId = 'room_' + Date.now().toString();
      room = createGameState();
      games.set(newRoomId, room);
      respawnFood(room);
      ws.roomId = newRoomId;
      ws.send(JSON.stringify({ type: 'roomCreated', roomId: newRoomId }));
    } else {
      // 加入已有房间
      room = games.get(gameId);
      if (!room) {
        ws.send(JSON.stringify({ type: 'error', message: 'Room not found' }));
        ws.close();
        return;
      }
      ws.roomId = gameId;
    }
  } else {
    // 单人模式，每个玩家一个独立房间
    const singleRoomId = 'single_' + Date.now().toString();
    room = createGameState();
    games.set(singleRoomId, room);
    respawnFood(room);
    ws.roomId = singleRoomId;
  }
  
  const id = Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9);
  ws.id = id;
  ws.send(JSON.stringify({ type: 'init', id: id })); 
  
  const startBody = findSafeSpawnLocation(room);

  room.players[id] = {
    id,
    direction: "RIGHT",
    body: startBody, // 这里直接赋值
    alive: true,
    score: 0,
    deadSince: null
  };
  
//客户端只发 input，不发 position
  ws.on("message", (msg) => {
    const data = JSON.parse(msg);
    const roomState = games.get(ws.roomId); 
    if (!roomState) return; //以此防止报错
    
    const player = roomState.players[ws.id];
    if (!player) return;
    
    if (data.type === "input"&&player.alive) {
      const newDir = data.direction;
      
      // 简单的防反向判断
      if (player.direction == "UP" && newDir == "DOWN") return;
      if (player.direction == "DOWN" && newDir == "UP") return;
      if (player.direction == "LEFT" && newDir == "RIGHT") return;
      if (player.direction == "RIGHT" && newDir == "LEFT") return;

      // 如果通过了上面的检查，才允许转向
      player.direction = newDir;
    }
    if (data.type === "restart") {
      const now = Date.now();
      // 检查：必须是死人，且距离死亡时间已经过了 5秒 (5000毫秒)
      if (!player.alive && player.deadSince && (now - player.deadSince >= 5000)) {
          
          // 复活逻辑：重置状态
          player.alive = true;
          player.direction = "RIGHT";
          player.deadSince = null; // 清空死亡时间
          
          player.body = findSafeSpawnLocation(roomState); 
      }
  }
  });

  ws.on("close", () => {
    const roomState = games.get(ws.roomId);
    if (roomState && roomState.players[ws.id]) {
      delete roomState.players[ws.id];
      // 如果房间为空且是单人房间，清理房间
      if (Object.keys(roomState.players).length === 0 && ws.roomId.startsWith('single_')) {
        games.delete(ws.roomId);
      }
    }
  });
  let isDead = false; // 本地标记，用来防止重复触发倒计时逻辑

// WebSocket 收到消息的回调
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    if (data.type === 'state') {
        const myPlayer = data.state.players[myId]; // 假设你存了自己的 myId
        
        // 渲染画面 (略...)
        drawGame(data.state);

        // === 死亡 UI 逻辑 ===
        if (myPlayer && !myPlayer.alive) {
            // 如果刚发现自己死了（状态从活变死）
            if (!isDead) {
                isDead = true;
                showDeathModal(); // 显示弹窗
            }
        } else {
            // 如果我是活的，确保弹窗是隐藏的
            if (isDead) {
                isDead = false;
                hideDeathModal();
            }
        }
    }
};

// === 显示弹窗与倒计时逻辑 ===
function showDeathModal() {
    const modal = document.getElementById('deathModal');
    const timerSpan = document.getElementById('respawnTimer');
    const btn = document.getElementById('respawnBtn');
    
    modal.style.display = 'block';
    btn.disabled = true; // 按钮变灰
    btn.innerText = "等待复活...";

    let timeLeft = 5; // 等待重生时间
    timerSpan.innerText = timeLeft;

    // 开启倒计时定时器
    const timer = setInterval(() => {
        timeLeft--;
        timerSpan.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer); // 停掉定时器
            // 倒计时结束，启用按钮
            btn.disabled = false;
            btn.innerText = "点击重生";
        }
    }, 1000); // 每秒执行一次
}

function hideDeathModal() {
    document.getElementById('deathModal').style.display = 'none';
}
// 在 server.js 中添加这个辅助函数

function findSafeSpawnLocation(room) {
  // 初始蛇的形态（假设向右看，头在右，身在左）
  // 头需在 x >= 2 的位置，不然尾巴 (x-1, x-2) 会生成在墙外
  const SAFE_PADDING = 2; 
  
  // 尝试 50 次，找不到就随便放（防止死循环）
  for (let attempt = 0; attempt < 50; attempt++) {
    
    // 1. 随机生成一个头的位置
    // X 范围：2 到 19 (GRID_SIZE-1)
    // Y 范围：0 到 19
    const headX = Math.floor(Math.random() * (GRID_SIZE - SAFE_PADDING)) + SAFE_PADDING;
    const headY = Math.floor(Math.random() * GRID_SIZE);

    // 2. 预测重生后的身体坐标 (头, 身, 尾)
    const newBody = [
      { x: headX, y: headY },
      { x: headX - 1, y: headY },
      { x: headX - 2, y: headY }
    ];

    let isCollision = false;

    // 3. 检查这 3 个点是否撞到了别人
    for (const id in room.players) {
      const p = room.players[id];
      if (!p.alive) continue; // 忽略死人的尸体（可选，如果你希望死人也占位，就去掉这行）

      for (const segment of p.body) {
        //拿新蛇的每一节 去对比 场上蛇的每一节
        for (const newPart of newBody) {
          if (newPart.x === segment.x && newPart.y === segment.y) {
            isCollision = true;
            break;
          }
        }
        if (isCollision) break;
      }
      if (isCollision) break;
    }
    
    // 3.5 顺便检查一下是不是撞到食物了（可选，避免刚出生就吃到）
    if (!isCollision) {
         for (const newPart of newBody) {
             if (newPart.x === room.food.x && newPart.y === room.food.y) {
                 isCollision = true; // 哪怕只重叠了一节，也算冲突，换个地方
                 break;
             }
         }
    }

    // 4. 如果没有碰撞，这个位置就是安全的！
    if (!isCollision) {
      return newBody; 
    }
  }

  // 5. 如果地图实在太挤了（试了50次都不行），只能随便给一个默认值
  // 这种情况下玩家可能会死，但没办法
  return [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
}
// === 发送复活请求 ===
function requestRespawn() {
    ws.send(JSON.stringify({
        type: "restart"
    }));
    // 此时不要直接关闭弹窗，等服务器把你变活了，
    // ws.onmessage 里会检测到 alive=true，自动调用 hideDeathModal()
}
});

// ===== Game Loop =====
function gameLoop() {
  // 遍历所有房间
  games.forEach((room, roomId) => {
    // 遍历房间内所有玩家
    for (const id in room.players) {
    const player = room.players[id];
    if (!player || !player.alive) continue;

    const head = { ...player.body[0] };
    let nextHead = { ...head };
    if (player.direction === "UP") nextHead.y--;
    if (player.direction === "DOWN") nextHead.y++;
    if (player.direction === "LEFT") nextHead.x--;
    if (player.direction === "RIGHT") nextHead.x++;
   
      //1.碰撞检测 - 边界
      if (nextHead.x < 0 || nextHead.x >= GRID_SIZE || nextHead.y < 0 || nextHead.y >= GRID_SIZE) {
        player.alive = false;
        player.deadSince = Date.now();
        continue;
      }
      //2.碰撞检测 - 撞自己
      if (player.alive) {
        for (const segment of player.body) {
          if (segment.x === nextHead.x && segment.y === nextHead.y) {
            player.alive = false;
            player.deadSince = Date.now();
            break;
          }
        }
      }
      
      //3.碰撞检测 - 撞其他玩家（多人模式）
      if (player.alive) {
        for (const otherId in room.players) {
          if (otherId === id) continue;
          const otherPlayer = room.players[otherId];
          for (const segment of otherPlayer.body) {
            if (segment.x === nextHead.x && segment.y === nextHead.y) {
              player.alive = false;
              player.deadSince = Date.now(); // 记录当前时间戳
              break;
            }
          }
          if (!player.alive) break;
        }
      }
      
      if (!player.alive) {
        continue;     // 直接结束这一轮循环，不执行下面的移动代码
      }
     
      player.body.unshift(nextHead); // 2. 把新头加到数组第一个位置
      // 3. 检查食物
      if (head.x === room.food.x && head.y === room.food.y) {
        // 尾巴不pop，蛇身长度 +1
        //再次生成食物，注意不要生成到蛇身上
        respawnFood(room);
        player.score++;
      } else {
        // 维持长度，切掉尾巴
        player.body.pop();
      }
    // console.log(
    //   player.body.length,
    //   JSON.stringify(player.body)
    // );
  }
  
  

    // 向该房间的所有客户端发送状态
    const payload = JSON.stringify({
      type: "state",
      state: room
    });

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN && client.roomId === roomId) {
        client.send(payload);
      }
    });
  });
}
//世界只在服务器的节奏里推进
setInterval(gameLoop, TICK_RATE);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
