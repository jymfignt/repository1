## Learn Git Branching 网站
[Learn Git Branching](https://learngitbranching.js.org/)
### Main
#### Introduction Sequence
1. Introduction to Git Commits
   - `git commit` 提交
1. Branching in Git
   - `git branch *newname*` 创建一个新分支
   - `git checkout *name*` 将我们置于此名字所在分支
   - `git checkout -b *branchname*` 新建一个分支并签出的快捷方式
1. Merging in Git
   - `git merge *name*` 把有此名字的分支合并到此时所在分支中
1. Rebase Introduction
   - `git rebase *name*` 
     - 移动此时所在分支到此名字分支中（即以此名字为基底）
     - 如果 *name* 分支是在此时分支子孙（下面），则此时分支变为 *name* 分支


#### Ramping Up
1. Detach yo' HEAD
    - HEAD 头指针，默认指向main
    - `git checkout C*n*`  改成指向 C*n*

2. Relative Refs(^)
    - `^` 上面的
    - `~*n*`上面第 n 个

3. Relative Refs #2 (~)
    - `git branch -f *name1* *name2*`将第一个节点移到第二个节点的位置

4. Reversing Changes in Git
    - `git reset *name*`向后移动到此名字所在分支，相当于“历史重演”
    - `git revert *name*`反转，“重写历史”

#### Moving Work Around
1. Cherry-pick Intro
    - `git cherry-pick *name1* *name2*…… `把分支依次接到当前分支下
2. Interactive Rebase Intro
    - `git rebase -i *name*`以此名字所在分支为底接当前所在分支（自己排序）
#### A Mixes Bag
1. Grabbing Just 1 Commit
2. Juggling Commits
    - `git commit --amend`微调
3. Juggling Commits # 2
4. Git Tags
    - `git tag *tagname* *name*`加tag
5. Git Describe
    - `git describe *name*`描述位置
     *tagname*_*numcommits*_g*hash*
#### Advanced Topics
1. Rebasing over 9000 times
2. Multiple parents
    - `~` `^`都可以加数字，一个代表加几，一个代表方向
3. Branch Spaghetti
