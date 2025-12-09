# 1. 初始化仓库

### 本地已有项目第一次使用 Git
```bash
cd 项目目录
git init
git add .
git commit -m "Initial commit"
````

### 关联远程仓库（第一次上传）

```bash
git remote add origin <仓库地址>
git branch -M main
git push -u origin main
```


# 2. 日常操作流程

### 查看状态

```bash
git status
```

### 添加修改

```bash
git add <文件名>  # 添加指定文件
git add .         # 添加所有修改
```

### 提交修改

```bash
git commit -m "描述本次修改"
```

### 拉取远程更新

```bash
git pull origin main
```

### 推送本地修改

```bash
git push origin main
```

> 第一次 push 需要加 `-u` 参数：`git push -u origin main`


# 3. 分支操作


```bash
git checkout -b 新分支名 # 创建新分支
git checkout 分支名 # 切换分支
git push -u origin 分支名 # 推送分支
```

### 拉取远程分支到本地

```bash
git fetch origin
git checkout -b 本地分支名 origin/远程分支名
```


# 4. 常用小技巧

### 查看提交历史
    

```bash
git log --oneline --graph --all
```

### 撤销本地修改
    

```bash
git restore <文件名>
git restore --staged <文件名>  # 取消暂存
```

### 强制推送（慎用）
    

```bash
git push -f origin 分支名
```

### 解决冲突
    

```bash
git pull origin main
# 手动修改冲突文件
git add 冲突文件
git commit -m "resolve conflict"
git push
```
