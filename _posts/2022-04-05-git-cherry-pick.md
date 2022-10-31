---
layout: post
title: 使用 git cherry-pick 从开源仓库同步特定代码
categories: git
description: sync code from open source upstream to your private branch by using git cherry-pick
keywords: git, cherry-pick, sync code, sync commit, 同步代码, 同步社区
---

在内部仓库分支上，如何从开源社区仓库同步特定代码？

大多数情况下，使用合并（`git merge`）操作即可将目标代码合入分支。但有时候我们可能并不需要所有的代码，而只需要特定的代码。一个典型的场景，OpenStack 项目中稳定分支（stable branch）不再接受新特性，但是需要移植（backport）主干（master）的重大缺陷补丁（critical bug fix）或者安全补丁（security fix）。OpenStack 社区推荐的做法就是使用 `git cherry-pick`，该命令允许指定一个（或多个，或一系列）提交（commit）追加到当前分支（更准确地说是当前工作头部（HEAD）），可以解决 `git merge` 无法满足的场景。cherry 本意是樱桃，车厘子。剑桥词典对 cherry-pick 的解释："to choose only the best or most suitable from a group of people or things"，即取其精华的意思。

工作中一种不罕见的场景：1）我们从某知名开源仓库拉取主干最新代码（甚至都不是某个稳定版本）到本地；2）我们进行大量自主研发（甚至直接在主干而不是在内部分支上）；3）公司不允许内部研发的代码贡献到开源社区；4）社区也不愿接受这些代码，我们不得不继续在本地仓库中维护。

好了，现在社区有了重大更新，客户点名需要这个功能，而我们本地已经很久没有同步社区最新代码了。我们如何从社区同步目标功能代码，又尽量保证现有的代码正常工作呢？zqfan 见到过如下几种方式：

1. 不管三七二十一，拉取社区最新代码，用本地代码覆盖它，然后看看有哪些改动是我们认识的，酌情修改；
1. 使用 Beyond Compare 等工具，两边对比，酌情采纳，最后在本地形成一次很大的提交；
1. 使用 `git rebase` 将所有本地提交变基到社区主干（谢天谢地我们不是直接 `git init` 干掉了社区原有的提交记录）；
1. 尝试使用 `git merge` 合并社区主干到本地，并努力解决所有冲突；
1. 找到目标功能相关的代码，将其改动手动编辑到本地文件；
1. 使用 `git cherry-pick` 解决问题。

虽然考虑到现实中可怕的不规范的代码管理，以及社区代码的依赖链条和相关代码可能非常多，粗暴的做法有时候可能反而是良方，所谓以毒攻毒以暴制暴耳。但是一般而言，`git cherry-pick` 是较好的选择，解决方式的排序也暗示了这点。zqfan 认为原因如下：

1. 能保留原有的提交信息，详尽的记录有助于事后追溯、回滚和其他操作；
1. 仅需指定较少的提交，减少冲突的可能。
1. 能保持本地已有提交的哈希值（SHA）不会改变，这有利于团队协作开发。

假设仓库现状如下

```
a - b - c - d - e - f - g    upstream
          \
            h - i - j        local
```

假设我们需要把社区主干的提交 f（哈希值 63ffba7）合入到本地，可以执行如下的操作，先将社区的提交获取到本地，再 cherry-pick 指定的提交：

```
$ git remote add upstream https://github.com/openstack/nova
$ git fetch upstream master
# git log upstream/master --graph --format="%C(auto) %h %s" # 观察提交哈希值
$ git checkout local
$ git cherry-pick -x -s 63ffba7
```

本地的状态将变为：

```
a - b - c - d - e - f - g     upstream
          \
            h - i - j - f'    local
```

为什么是 f'（哈希值844e381）呢？因为尽管内容一样，但这是一个新的提交，这是和 `git merge` 显著的差异。追加 `-x` 参数是为了记录 f 的哈希值以便事后追溯，这会在 `git commit message` 底部记录一行文本：`(cherry picked from commit 63ffba7)`。追加 `-s` 参数是为了记录操作者签名信息，这会在 `git commit message` 底部记录一行文本：`Signed-off-by: zhiqiangfan <zhiqiangfan@tencent.com>`。如果希望对原始的 git commit message 进行修改，可以追加 `-e` 选项。

运气好的话，此时就可以收工了。

当然，事情可能不会一帆风顺。`git cherry-pick` 可能会遇到冲突，此时会直接报错，例如：

```
~/github/openstack/nova$ git cherry-pick -x -s 63ffba7496182f6f6f49a380f3c639fc3ded9772
error: could not apply 63ffba7... Fix pre_live_migration rollback
hint: after resolving the conflicts, mark the corrected paths
hint: with 'git add <paths>' or 'git rm <paths>'
hint: and commit the result with 'git commit'
```

此时需要使用 `git status` 命令观察输出：

```
~/github/openstack/nova$ git status
# On branch local
# You are currently cherry-picking.
#   (fix conflicts and run "git commit")
#
# Changes to be committed:
#
#       modified:   nova/tests/functional/regressions/test_bug_1944619.py
#       modified:   nova/tests/unit/compute/test_compute_mgr.py
#       new file:   releasenotes/notes/bug-1944619-fix-live-migration-rollback.yaml
#
# Unmerged paths:
#   (use "git add <file>..." to mark resolution)
#
#       both modified:      nova/compute/manager.py
```

"Unmerged paths" 下列出的是需要我们解决冲突的文件，除了例子中的 "both modified" 外，可能还有 "both deleted" 和 "both added"。编辑文件，搜索 "====" 通常就能定位到冲突的位置，例如：

```
<<<<<<< HEAD
    source_bdms=source_bdmsxxx)
=======
    source_bdms=source_bdms,
    pre_live_migration=True)
>>>>>>> 63ffba7... Fix pre_live_migration rollback
```

这里 `HEAD` 指的就是当前的本地分支，`63ffba7` 是我们要选择合并的代码，清理掉不需要的代码以及 `git merge conflict` 提示文本后，保存退出。使用 `git add .` 命令将本地目录下的改动都加入暂存区，使用 `git commit` 提交此次变更。最终得到的一个新提交可能如下：

```
commit 844e381a18601d0595fffe71915af9ceb73973a2
Author: awesome contributor <his/her email address>
Date:   Tue Dec 7 17:39:58 2021 -0300

    Fix pre_live_migration rollback

    Excellent message that describes useful information....
    
    (cherry picked from commit 63ffba7496182f6f6f49a380f3c639fc3ded9772)
    Signed-off-by: zhiqiangfan <zhiqiangfan@tencent.com>
    
    Conflicts:
        nova/compute/manager.py
```

可以注意到提交信息里还记录了此次冲突的文件（Conflicts）。

除了挑选合入单个提交，我们还可以指定多个提交，例如 `git cherry-pick <SHA-1> <SHA-2>`，但 zqfan 更推荐逐个挑选合入。此外还可以指定一系列提交，例如 `git cherry-pick <SHA-1>..<SHA-2>`。甚至指定整个分支，例如 `git cherry-pick ..upstream` （注意，如果仅指定分支名，没有 `..`，此时 cherry-pick 选择的是该分支名下最新的那次提交），但当你想这么做的时候，其实就该考虑 `git merge` 了，因为随之而来的空提交（需要指定 `--allow-empty` 解决）、Merge 节点（需要参数 `-m [1|2...]` 指定父分支）以及 Merge Conflict 等问题带来的痛苦将指数上升直到被迫放弃。如果你确实想亲身体验下，那么熟练掌握以下命令将可能有所帮助：

- `git cherry-pick --continue` 继续执行
- `git cherry-pick --abort` 放弃执行回滚到初始状态
- `git cherry-pick --quit` 中止执行但保留已做完的变更

祝你好运。

[原文](https://zqfan.github.io/2022/04/05/git-cherry-pick/) 由 [zqfan (zhiqiangfan@tencent.com)](https://github.com/zqfan) 发表。License: [(CC 4.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/4.0/)
