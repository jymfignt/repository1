#include <iostream>
#include <conio.h>
#include <windows.h>
#include <time.h>
#include <stack>
#include <utility>

// 迷宫参数定义
#define HEIGHT 25
#define WIDTH 25
#define WALL 1
#define ROAD 0
#define START 2
#define END 3

// 移动方向
#define UP 1
#define DOWN 2
#define LEFT 3
#define RIGHT 4
#define AUTO 6
#define ESC 27

// 迷宫地图及相关数据结构
int maze[HEIGHT + 2][WIDTH + 2]; // 迷宫地图
bool visited[HEIGHT + 2][WIDTH + 2]; // 标记已访问的位置
std::stack<std::pair<int, int>> path; // 记录路径

// 四个方向的移动坐标: 右、下、左、上
const int dx[4] = {0, 1, 0, -1};
const int dy[4] = {1, 0, -1, 0};

// 函数声明
void initializeConsole();
void gotoxy(int x, int y);
void hideCursor();
void generateMaze(int x, int y);
void displayMaze();
void paintCell(int x, int y);
int getKey();
void playGame();
void autoSolve(int startX, int startY); // 修复函数声明，确保只有一个声明

// 控制台初始化
void initializeConsole() {
    SetConsoleOutputCP(65001); // 设置UTF-8编码，防止乱码
    system("title 迷宫游戏");
    hideCursor();
}
// 移动光标到指定位置
 void gotoxy(int x, int y) {
    COORD coord;
    coord.X = x;
    coord.Y = y;
    SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), coord);
}

//隐藏控制台光标
void hideCursor() {
    HANDLE hOut = GetStdHandle(STD_OUTPUT_HANDLE);
    CONSOLE_CURSOR_INFO cci;
    GetConsoleCursorInfo(hOut, &cci);
    cci.bVisible = 0; // 0表示隐藏，1表示显示
    SetConsoleCursorInfo(hOut, &cci);
}
//随机生成迷宫 - 使用深度优先搜索算法
void generateMaze(int x, int y) {
    // 定义四个方向并随机打乱
    int directions[4][2] = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}}; // 右、下、左、上

    // 随机打乱方向顺序
    for (int i = 0; i < 4; i++) {
        int j = rand() % 4;
        std::swap(directions[i][0], directions[j][0]);
        std::swap(directions[i][1], directions[j][1]);
    }

    maze[x][y] = ROAD; // 当前位置设为通路

    // 向四个方向尝试开拓
    for (int i = 0; i < 4; i++) {
        int nx = x + 2 * directions[i][0];
        int ny = y + 2 * directions[i][1];

        // 检查是否在边界内且为墙
        if (nx > 0 && nx < HEIGHT + 1 && ny > 0 && ny < WIDTH + 1 && maze[nx][ny] == WALL) {
            // 打通中间的墙
            maze[x + directions[i][0]][y + directions[i][1]] = ROAD;
            // 递归生成
            generateMaze(nx, ny);
        }
    }
}
//显示整个迷宫
void displayMaze() {
    system("cls"); // 清屏
    for (int i = 1; i <= HEIGHT; i++) {
        for (int j = 1; j <= WIDTH; j++) {
            paintCell(i, j);
        }
    }
}
//绘制迷宫中的单个格子
void paintCell(int x, int y) {
    gotoxy(2 * y - 2, x - 1);
    switch (maze[x][y]) {
        case START:
            std::cout << "入"; break;
        case END:
            std::cout << "出"; break;
        case WALL:
            std::cout << "▇"; break;
        case ROAD:
            std::cout << "  "; break;
    }
}
//获取用户按键输入
int getKey() {
    char c;
    while ((c = _getch())) {
        if (c == ' ') return AUTO; // 空格
        if (c == 27) return ESC;   // ESC
        if (c != -32) continue;    // 不是方向键前缀

        c = _getch(); // 读取方向键的第二个字节
        switch (c) {
            case 72: return UP;    // 上
            case 80: return DOWN;  // 下
            case 75: return LEFT;  // 左
            case 77: return RIGHT; // 右
        }
    }
    return 0;
}

//自动寻路算法 - 深度优先搜索
bool dfs(int x, int y, int ex, int ey) {
    // 如果到达终点
    if (x == ex && y == ey) {
        return true;
    }

    // 标记当前位置为已访问
    visited[x][y] = true;

    // 尝试四个方向
    for (int i = 0; i < 4; i++) {
        int nx = x + dx[i];
        int ny = y + dy[i];

        // 检查是否可行
        if (maze[nx][ny] != WALL && !visited[nx][ny]) {
            // 记录路径
            path.push(std::make_pair(nx, ny));

            // 递归搜索
            if (dfs(nx, ny, ex, ey)) {
                return true;
            }

            // 回溯
            path.pop();
        }
    }

    return false;
}
//自动寻路主函数
void autoSolve(int startX, int startY) {
    // 初始化访问标记
    for (int i = 0; i <= HEIGHT + 1; i++) {
        for (int j = 0; j <= WIDTH + 1; j++) {
            visited[i][j] = false;
        }
    }

    // 清空路径栈
    while (!path.empty()) {
        path.pop();
    }

    // 起点入栈
    path.push(std::make_pair(startX, startY));

    // 深度优先搜索寻路
    if (dfs(startX, startY, HEIGHT - 1, WIDTH)) {
        // 显示路径
        std::stack<std::pair<int, int>> tempPath = path;

        while (!tempPath.empty()) {
            // 不使用C++17的结构化绑定，改用传统方式
            std::pair<int, int> pos = tempPath.top();
            int x = pos.first;
            int y = pos.second;
            tempPath.pop();

            gotoxy(2 * y - 2, x - 1);
            if (maze[x][y] != START && maze[x][y] != END) {
                std::cout << "* ";
            }
            Sleep(50); // 延迟，让路径动画更明显
        }

        gotoxy(30, HEIGHT);
        std::cout << "已找到路径，按任意键继续...";
    } else {
        gotoxy(30, HEIGHT);
        std::cout << "无法到达终点，按任意键继续...";
    }
    _getch();
}

//游戏主循环
void playGame() {
    int x = 2, y = 1;  // 玩家起始位置（入口）
    int key = 0;       // 用户按键
    bool reachEnd = false;

    // 游戏主循环
    while (!reachEnd && key != ESC) {
        // 显示玩家位置
        gotoxy(2 * y - 2, x - 1);
        std::cout << "●";

        // 检查是否到达终点
        if (maze[x][y] == END) {
            gotoxy(30, HEIGHT);
            std::cout << "恭喜到达终点！按任意键继续...";
            _getch();
            break;
        }

        // 获取用户输入
        if (key != AUTO) {
            key = getKey();
        } else {
            Sleep(100); // 自动模式下减缓速度
        }

        // 处理用户输入
        if (key == ESC) {
            break;
        } else if (key == AUTO) {
            // 自动寻路，确保使用正确的函数签名
            autoSolve(x, y);
            key = 0; // 自动寻路完成后恢复手动控制
            displayMaze(); // 重新显示迷宫
            continue;
        }

        // 移动玩家
        int nx = x, ny = y;
        switch (key) {
            case UP:    nx--; break;
            case DOWN:  nx++; break;
            case LEFT:  ny--; break;
            case RIGHT: ny++; break;
        }

        // 检查移动是否有效
        if (maze[nx][ny] != WALL) {
            paintCell(x, y); // 恢复原位置的显示
            x = nx;
            y = ny;     // 更新玩家位置
        }
    }
}

int main() {
    initializeConsole();

    // 初始化随机数生成器
    srand((unsigned)time(NULL));

    // 初始化迷宫为全墙
    for (int i = 0; i <= HEIGHT + 1; i++) {
        for (int j = 0; j <= WIDTH + 1; j++) {
            if (i == 0 || i == HEIGHT + 1 || j == 0 || j == WIDTH + 1) {
                maze[i][j] = WALL; // 边界处理
            } else {
                maze[i][j] = WALL; // 内部初始化为墙
            }
        }
    }

    // 从随机点开始生成迷宫
    int startX = 2 * (rand() % (HEIGHT / 2) + 1);
    int startY = 2 * (rand() % (WIDTH / 2) + 1);
    generateMaze(startX, startY);

    // 设置入口和出口
    maze[2][1] = START;
    maze[HEIGHT - 1][WIDTH] = END;

    // 显示迷宫
    displayMaze();

    // 显示游戏说明
    gotoxy(2 * WIDTH + 5, 2);
    std::cout << "迷宫游戏";
    gotoxy(2 * WIDTH + 5, 4);
    std::cout << "控制：";
    gotoxy(2 * WIDTH + 5, 5);
    std::cout << "↑↓←→: 移动";
    gotoxy(2 * WIDTH + 5, 6);
    std::cout << "空格: 自动寻路";
    gotoxy(2 * WIDTH + 5, 7);
    std::cout << "ESC: 退出";

    // 开始游戏
    playGame();

    // 游戏结束
    gotoxy(0, HEIGHT + 2);
    std::cout << "游戏结束，感谢游玩！";
    _getch();

    return 0;
}
