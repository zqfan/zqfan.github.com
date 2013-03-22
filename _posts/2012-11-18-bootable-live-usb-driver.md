---
layout: post
title: "Bootable Live USB Driver"
description: ""
category: 
tags: []
---
{% include JB/setup %}
## License
this file is published under [(CC) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

## win32 image writer
[download](https://launchpad.net/win32-image-writer/+download)

There is just one thing you need to notice:

when you change the *.iso to *.raw, imagewriter will not find it from gtk file selector. You just need copy the filename *.raw to the location. Then, just continue next.

But there is a critical problem:

It will finished unordinary, which will cause usb unmountable, when i restart computer and install os with this usb device. I can never use the usb device any more and when i try to format it, it only has 700MB space left instead of 2GB, i don't know why. Even though, i format it on windows 7, after this, it can be automatically mounted by linux, and i right click the device icon, select 'format', click 'Disk utils' and create new partition and format it.

It back! the 2GB space!

## Startup Disk Creator
Simple tool just write iso file to a usb driver, easy and useful. Available on linux distribution.
