#include<stdio.h>
#include<conio.h>
#include<windows.h>
#include<time.h>
#include <stdlib.h>

#define HO 37
#define LC 79
#define CELL_WIDTH 2 // 每个迷宫格子的屏幕宽度
#define MAX_TRAIL 50  // 最大轨迹点数
#define AUTO_SPEED 50
#define MANUAL_SPEED 30
#define PLAYER_COLOR 9
#define TRAIL_COLOR 8
#define WALL_COLOR 7

#define MAZE_COL(x) ((x)/CELL_WIDTH)
#define MAZE_ROW(y) ((y))

struct sign
{
	int x;
	int y;
}s[702];    //迷宫生成路径和轨迹
struct people
{
	int x;
	int y;
	int direction;   //1=左 2=上 3=右 4=下
	int mode; //0=手动 1=自动
	int steps;
}man={4,2,3,0,0};   //玩家初始
int h,l;   //迷宫生成时的当前坐标
int **road;   //迷宫地图
clock_t last_trail_time;   // 轨迹时间记录
int end_x = LC-4;  // 终点x坐标（屏幕坐标）
int end_y = HO-5;
void init_rand() { srand((unsigned)time(NULL)); } // 只需初始化一次
int random_range(int min, int max) { return rand()%(max-min+1)+min; }
void autoshow();   //迷宫生成与显示
void gotoxy(int x,int y);//移动光标
void ycgb(int k);//隐藏光标
void game();
int can_move(int dir);
void set_color(int k);

int main()
{
	SetConsoleOutputCP(65001);   //防止乱码
	ycgb(0);   //隐藏光标
	init_rand();

    road = (int **)malloc(HO * sizeof(int *));
    for (int i = 0; i < HO; i++)
        road[i] = (int *)malloc(LC * sizeof(int));

	autoshow();
	game();

	for (int i = 0; i < HO; i++)
        free(road[i]);
    free(road);

	return 0;
}
void gotoxy(int x,int y) //移动光标
{
    COORD coord = {x,y};
    SetConsoleCursorPosition( GetStdHandle( STD_OUTPUT_HANDLE ), coord );
}
void ycgb(int k)//隐藏光标
{
    HANDLE hOut = GetStdHandle(STD_OUTPUT_HANDLE);
    CONSOLE_CURSOR_INFO cci;
    GetConsoleCursorInfo(hOut,&cci);
    cci.bVisible=k;//赋1为显示，赋0为隐藏
    SetConsoleCursorInfo(hOut,&cci);
}
void set_color(int k) {
    SetConsoleTextAttribute(GetStdHandle(STD_OUTPUT_HANDLE), k);
}
void autoshow()
{
    system("title 迷宫");
	system ("mode con cols=120 lines=40");

	for(int i=0;i<HO;i++)    //初始全部为墙
	{
		for(int j=0;j<LC;j++)
		{
			road[i][j]=1;
		}
	}
	int center_x = 2, center_y = 2;
    road[center_x][center_y] = 0;
    road[center_x+1][center_y] = 0;
    road[center_x][center_y+1] = 0;
	h = center_x;
	l = center_y;

    s[0].x = h;
    s[0].y = l;
    int k = 1,i=0;
	while(i<k)
    {
	    while(1) {
            int dirs[4] = {0};
            int valid_dirs = 0;
        // 检查四个方向
            if(h-2>0 && road[h-2][l]==1) dirs[valid_dirs++] = 1; // 上
            if(l-2>0 && road[h][l-2]==1) dirs[valid_dirs++] = 2; // 左
            if(l+2<LC-1 && road[h][l+2]==1) dirs[valid_dirs++] = 3; // 右
            if(h+2<HO-1 && road[h+2][l]==1) dirs[valid_dirs++] = 4; // 下

            if(valid_dirs == 0) break;

            // 随机选择可用方向
            int dir = dirs[random_range(0, valid_dirs-1)];
            switch(dir) {
                case 1: // 上
                    road[h-2][l] = road[h-1][l] = 0;
                    h-=2;
                    break;
                case 2: // 左
                    road[h][l-2] = road[h][l-1] = 0;
                    l-=2;
                    break;
                case 3: // 右
                    road[h][l+2] = road[h][l+1] = 0;
                    l+=2;
                    break;
                case 4: // 下
                    road[h+2][l] = road[h+1][l] = 0;
                    h+=2;
                    break;
            }
            s[k++] = (struct sign){h, l};
        }

        // 回溯
        if(++i < k) {
            h = s[i].x;
            l = s[i].y;
        }
    }

 set_color(WALL_COLOR);
    for (int i = 0; i < HO; i++) {
        for (int j = 0; j < LC; j++) {
            printf(road[i][j] ? "■" : "  ");
        }
        printf("\n");
    }
}

int can_move(int dir) {
    int maze_row = MAZE_ROW(man.y);
    int maze_col = MAZE_COL(man.x);

    if (maze_row < 0 || maze_row >= HO || maze_col < 0 || maze_col >= LC) return 0;
    switch (dir) {
        case 1: return (maze_col > 0 && road[maze_row][maze_col - 1] == 0);
        case 2: return (maze_row > 0 && road[maze_row - 1][maze_col] == 0);
        case 3: return (maze_col < LC - 1 && road[maze_row][maze_col + 1] == 0);
        case 4: return (maze_row < HO - 1 && road[maze_row + 1][maze_col] == 0);
    }
    return 0;

}
void game()
{
    man.x = 2*CELL_WIDTH; // 迷宫起点(2,2)对应的屏幕坐标
    man.y = 2;
    gotoxy(man.x, man.y);
    set_color(PLAYER_COLOR);
    printf("♂");
    gotoxy(end_x, end_y);
    set_color(12);  // 红色
    printf("◎");
    while(1)
        {
            gotoxy(man.x, man.y);
            printf(" "); // 清除旧位置
            if (GetAsyncKeyState(VK_SPACE) & 0x8000)
            man.mode = !man.mode;

            if (!man.mode) {
            if (GetAsyncKeyState(VK_LEFT) & 0x8000 && can_move(1)) { man.x -= 2; man.steps++; }
            if (GetAsyncKeyState(VK_UP) & 0x8000 && can_move(2)) { man.y -= 1; man.steps++; }
            if (GetAsyncKeyState(VK_RIGHT) & 0x8000 && can_move(3)) { man.x += 2; man.steps++; }
            if (GetAsyncKeyState(VK_DOWN) & 0x8000 && can_move(4)) { man.y += 1; man.steps++; }
            }

            gotoxy(man.x, man.y);
            set_color(PLAYER_COLOR);
            printf("♂");

           if (man.x == end_x && man.y == end_y) {
                gotoxy(40, 20);
                printf("恭喜通关！步数：%d", man.steps);
                system("pause >nul");
                break;
            }

            Sleep(MANUAL_SPEED);
    }
}
