---
layout: post
title: "SecureCRT"
description: ""
category: 
tags: []
---
License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

如果你是使用 SecureCRT 登录到远程机器上，你可能会遇到使用 vim 等编辑器编辑文件后，文件内容依旧保留在屏幕上没有被清除的问题。
这个问题会导致之前的命令和输出快速地被文件内容刷掉。
对于习惯了 putty 或者 xshell 的用户，可能会想要退出 vim 后，文件内容被自动清除的效果。
将如下配置添加到 ~/.vimrc 文件中，注意如果终端不是 linux 而是 xterm ，你需要做相应的变更。
查看终端类型可以用命令 `echo $TERM` 。

~~~
if &term =~ "linux"
    " SecureCRT versions prior to 6.1.x do not support 4-digit DECSET
    "     let &t_ti = "\<Esc>[?1049h"
    "     let &t_te = "\<Esc>[?1049l"
    " Use 2-digit DECSET instead
    let &t_ti = "\<Esc>[?47h"
    let &t_te = "\<Esc>[?47l"
endif
~~~

此方法来源自 [ vandyke 官方论坛](https://forums.vandyke.com/showthread.php?t=3431)
