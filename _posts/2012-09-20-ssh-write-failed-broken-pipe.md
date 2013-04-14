---
layout: post
title: "SSH Write Failed: Broken Pipe"
description: ""
category: linux
tags: [ssh]
---
{% include JB/setup %}
## License
this file is published under [(CC) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

if long time with no data transfer, ssh will automatically broke

    root@:vim /etc/ssh/ssh_config

add or overwrite

    ServerAliveInterval 60

this will automatically send a KeepAlive request every ServerAliveInterval seconds
