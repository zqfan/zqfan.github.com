---
layout: post
title: "How To Use IRC"
description: ""
category: "other"
tags: [open-source, irc]
---

# IRC不靠谱攻略

由于要混openstack社区，IRC（Internet Relay Chat）作为淡逼的重要渠道一直没怎么上心，虽然可以使用webchat.freenode.net，但是这货一开代理就挂，而且过段时间就默默掉线是要闹哪样，重复几次后不能忍，google “webchat freenode tool”关键字后得到以下收获：

[https://fedoraproject.org/wiki/How_to_use_IRC](https://fedoraproject.org/wiki/How_to_use_IRC)告诉我有三种渠道，这里选择本地客户端xchat，其余请自行查看。

~~~
sudo aptitude install --yes xchat
~~~

连上freenode后注册一记，步骤见[http://www.wikihow.com/Register-a-User-Name-on-Freenode](http://www.wikihow.com/Register-a-User-Name-on-Freenode)，里面有其他好东西，推荐自己看完

~~~
/nick AccountName
/msg nickserv register YourPassword YourEmailAddress
/msg NickServ VERIFY REGISTER AccountName raamhryophwu
/msg nickserv identify AccountName YourPassword
~~~

xchat可以进行若干设置已自动登录，具体看第一个链接。

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
