---
layout: post
title: use git cherry-pick to sync code
categories: git
description: sync code from open source upstream to your private branch by using git cherry-pick
keywords: git, cherry-pick, sync code, sync commit, github repo
---

cherry 本意是樱桃，车厘子。剑桥词典对 cherry-pick 的解释："to choose only the best or most suitable from a group of people or things" 取其精华的意思。

git cherry-pick 允许指定一个（或多个，或一系列）提交（commit）追加到当前分支（更准确地说是当前工作头部（HEAD））。大多数情况下，使用合并（merge）操作即可将目标代码合入分支。但有时候我们可能并不需要所有的代码，而只需要特定的代码。典型的场景有：

1. OpenStack 项目中稳定分支（stable branch）不再接受新特性，但是需要移植（backport）主干（master）的重大缺陷（critical bug fix）修复或者安全补丁（security fix）；
1. 某个合并请求（Pull Request）并没有被接受，但是其中某个提交是有价值的，可以单独合入仓库；
 

[原文](https://zqfan.github.io/2022/04/05/git-cherry-pick/) 由 [zqfan (zhiqiangfan@tencent.com)](https://github.com/zqfan) 发表。License: [(CC 4.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/4.0/)
