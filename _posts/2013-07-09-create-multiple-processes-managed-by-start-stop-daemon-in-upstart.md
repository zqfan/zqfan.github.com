---
layout: post
title: "Create Multiple Processes Managed by Start stop daemon in UpStart"
description: ""
category: linux
tags: [upstart, start-stop-daemon]
---
{% include JB/setup %}
# License
this file is published under [(CC) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

# Reference
* [http://upstart.ubuntu.com/cookbook](http://upstart.ubuntu.com/cookbook)
* [start-stop-daemon to create multiple instances of executable through upstart](http://datum-bits.blogspot.com/2011/09/start-stop-daemon-to-create-multiple.html)

# How to
In reference [start-stop-daemon to create multiple instances of executable through upstart](http://datum-bits.blogspot.com/2011/09/start-stop-daemon-to-create-multiple.html), the author Atul Dambalkar mentioned a way to start multiple instances via start-stop-daemon, which is by specify the `--name` option.

    start-stop-daemon --start --quiet --chuid myuser --name myapp1 \
                      --exec /usr/bin/myapp -- --config /etc/myapp-configfile1

    start-stop-daemon --start --quiet --chuid myuser --name myapp2 \
                      --exec /usr/bin/myapp -- --config /etc/someapp-configfile2

However, it cannot execute correctly in upstart, because start-stop-daemon will block at the first command and the second one will not be executed. Specify the --background(-b) option will not correct this because it will fork the instance and you can no longer use `stop` command to manage the forked instance since its pid is changed.

The fix is simple, just let the start-stop-daemon run in background by append the `&`, and be careful, the last command of start-stop-daemon should not end with `&`, if every command is run in background, the `stop` command will fail and you can only terminate the instances via `kill` command.
