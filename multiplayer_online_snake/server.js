const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

const PORT = 3000;
const TICK_RATE = 100;
const GRID_SIZE = 20;

// ===== 游戏状态 =====
const state = {
  players: {},
  food: {
    x: Math.floor(Math.random() * GRID_SIZE),
    y: Math.floor(Math.random() * GRID_SIZE)
  }
};

// ===== HTTP Server =====
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

// ===== WebSocket =====
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  const id = Date.now().toString();

  state.players[id] = {
    id,
    direction: "RIGHT",
    body: [{ x: 5, y: 5 }],
    alive: true
  };

  ws.on("message", (msg) => {
    const data = JSON.parse(msg);
    if (data.type === "input") {
      state.players[id].direction = data.direction;
    }
  });

  ws.on("close", () => {
    delete state.players[id];
  });
});

// ===== Game Loop =====
function gameLoop() {
  for (const id in state.players) {
    const player = state.players[id];
    if (!player.alive) continue;

    const head = { ...player.body[0] };

    if (player.direction === "UP") head.y--;
    if (player.direction === "DOWN") head.y++;
    if (player.direction === "LEFT") head.x--;
    if (player.direction === "RIGHT") head.x++;

    player.body[0] = head;
  }

  const payload = JSON.stringify({
    type: "state",
    state
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

setInterval(gameLoop, TICK_RATE);

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
