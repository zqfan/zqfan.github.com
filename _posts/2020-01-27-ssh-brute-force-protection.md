---
layout: post
title: SSH Brute Force Protection
categories: Linux
description:
keywords: [SSH, fail2ban]
---

最近有朋友反馈 SSH 登录服务器后经常看到一些登录失败的提示，例如：

```
Last failed login: Fri Dec 15 10:41:37 CST 2017 from 51.15.220.221 on ssh:notty
There were 1049 failed login attempts since the last successful login.
```

像这种失败多次的，一般就是被人尝试暴力破解了。现在网上针对 SSH 服务的暴力破解工具很多，有些还开源了。服务器一旦在公网上开启服务，各种扫描端口和尝试暴力破解的脚本就会来光顾。指望别人好心或者眼瞎不来祸害自己是不现实的，一些简单的设置即可提高别人作恶的成本甚至杜绝被攻破的可能性。

## 禁止密码登录，采用密钥登录

**注意，在进行以下操作前，请确保自己能物理接触到服务器，如果是云服务器能使用 noVNC 等方式直接登录，以防设置错误后失去对服务器的控制权！**

编辑 SSH 服务配置文件`/etc/ssh/sshd_config`，允许密钥登录：

```
PubkeyAuthentication yes
```

配置变更后，执行命令`service ssh restart`重启 SSH 服务。

使用命令`ssh-keygen`，一路回车（也可输入密码），在本地生成公私钥：

```
# ssh-keygen 
Generating public/private rsa key pair.
Enter file in which to save the key (/root/.ssh/id_rsa): 
Created directory '/root/.ssh'.
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /root/.ssh/id_rsa.
Your public key has been saved in /root/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:7eq6ueXEGDZRm4nH1zTDHRzEqsmC3JBkHEi6PToP6FA root@sss
The key's randomart image is:
+---[RSA 2048]----+
|   ..o...  .+=+o |
|   .. ++ + o.o+  |
|  .  oo.* . ..   |
|   o  oo o  .    |
|  E o.++S..o     |
| o . oo=o.+      |
|o +   . +..      |
|o  +   = .       |
| .  . ==+        |
+----[SHA256]-----+
```

使用`ssh-copy-id`命令将公钥传输到目标服务器，例如`ssh-copy-id -i ~/.ssh/id_rsa.pub -p 22 root@207.148.94.110`。如果是其他方式，例如手动复制，你需要在目标服务器账号下建立`.ssh/authorized_keys`文件，权限为600，将公钥内容追加到`.ssh/authorized_keys`最后。

尝试使用密钥方式看能否登录目标服务器。如果可以，则在目标服务器上编辑配置文件`/etc/ssh/sshd_config`，取消`root`登录，禁止密码登录：

```
PasswordAuthentication no
PermitRootLogin without-password
PubkeyAuthentication yes
```

对 Debain 和 Ubuntu，还可以关闭如下两个选项

```
UsePam no
ChallengeResponseAuthentication no
```

配置变更后，执行命令`service ssh restart`重启 SSH 服务。

## 设置 iptables

如果是云服务器，直接使用安全组配置即可。如果你是从固定 IP 网段或者固定 IP 进行访问，则限制源 IP 为你的网段或者 IP 即可。

如果是物理服务器，也可以自己指定 iptables。缺点是操作晦涩难懂，不适合普通用户，建议使用其他工具例如`fail2ban`等处理。如果你有折腾精神，可以参考这篇博客[1][1]，如下所示：

```
# cleanup
iptables -F
iptables -X SSH_CHECK

ip6tables -F
ip6tables -X SSH_CHECK

# set rules
iptables -N SSH_CHECK
iptables -A SSH_CHECK -m recent --set --name SSH
iptables -A SSH_CHECK -m recent --update --seconds 60 --hitcount 2 --name SSH -j DROP
iptables -A SSH_CHECK -m recent --update --seconds 3600 --hitcount 10 --name SSH -j DROP
iptables -A SSH_CHECK -p tcp --dport 22 -j ACCEPT # accept packet if not previously dropped

ip6tables -N SSH_CHECK
ip6tables -A SSH_CHECK -m recent --set --name SSH
ip6tables -A SSH_CHECK -m recent --update --seconds 60 --hitcount 2 --name SSH -j DROP
ip6tables -A SSH_CHECK -m recent --update --seconds 3600 --hitcount 10 --name SSH -j DROP
ip6tables -A SSH_CHECK -p tcp --dport 22 -j ACCEPT # accept packet if not previously dropped

iptables -A INPUT -p tcp -s 127.0.0.1 -j ACCEPT # whitelist your IP (replace 127.0.0.1)
iptables -A INPUT -p tcp --dport 22 -m state --state NEW -j SSH_CHECK # jump from INPUT to SSH_CHECK

ip6tables -A INPUT -p tcp -s ::1/128 -j ACCEPT # whitelist your IP (replace ::1/128)
ip6tables -A INPUT -p tcp --dport 22 -m state --state NEW -j SSH_CHECK # jump from INPUT to SSH_CHECK
```

这个 iptables 规则如下：

1. 支持 IPv4 和 IPv6
1. 对于入站流量，如果源 IP 为本地回环地址，则直接接受
1. 非本地地址执行 SSH\_CHECK 规则检查，如果一分钟内两次或者一小时内10次进行 SSH 连接，则拒绝

## 使用 fail2ban 或者 DenyHosts 等工具

参考维基的介绍：

DenyHosts is a log-based intrusion-prevention security tool for SSH servers written in Python. It is intended to prevent brute-force attacks on SSH servers by monitoring invalid login attempts in the authentication log and blocking the originating IP addresses. [2][2]

Fail2Ban is an intrusion prevention software framework that protects computer servers from brute-force attacks. Written in the Python programming language, it is able to run on POSIX systems that have an interface to a packet-control system or firewall installed locally, for example, iptables or TCP Wrapper. [3][3]

个人感觉`fail2ban`更简单，且能覆盖除`ssh`以外的服务，安装后默认配置即可使用：`sudo apt-get install fail2ban`。打开配置文件`/etc/fail2ban/jail.conf`观察默认配置：

```
[DEFAULT]
# "bantime" is the number of seconds that a host is banned.
bantime  = 10m
# A host is banned if it has generated "maxretry" during the last "findtime"
# seconds.
findtime  = 10m
# "maxretry" is the number of failures before a host get banned.
maxretry = 5
```

默认的配置下如果十分钟内错误五次则封禁十分钟。

如果你的`ssh`端口不是默认的22端口，你需要编辑`[sshd]`部分的配置，修改`port`配置项，并重启`fail2ban`服务（例如`/etc/init.d/fail2ban restart`）。

使用`fail2ban-client status`查看当前的状态：

```
# fail2ban-client status
Status
|- Number of jail:	1
`- Jail list:	sshd
```

**注意：这些工具都是基于失败到一定频率后封禁，对于密码很弱的服务器，也许暴力破解时，密码字典一下就命中了，从而没有防护效果。**

## 资料

这里有一篇介绍防范 SSH 暴力破解十分全面的博客：[https://rimuhosting.com/knowledgebase/linux/misc/preventing-brute-force-ssh-attacks](https://rimuhosting.com/knowledgebase/linux/misc/preventing-brute-force-ssh-attacks)

这里有一篇介绍`ssh-keygen`十分详细的博客：[https://www.cnblogs.com/shoufeng/p/11022258.html](https://www.cnblogs.com/shoufeng/p/11022258.html)

[1]: https://dev.to/flowcontrol/block-ssh-brute-force-attacks-1n1o
[2]: https://zh.wikipedia.org/wiki/DenyHosts
[3]: https://en.wikipedia.org/wiki/Fail2ban
[4]: https://cloud.tencent.com/developer/article/1578810

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
