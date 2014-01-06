---
layout: post
title: "Ubuntu Customize"
description: ""
category: linux
tags: [ubuntu, desktop, interface]
---
{% include JB/setup %}
There always will be some problem when I use Ubuntu, so I record them here and hope it can help someone else.

## gnome
To use gnome instead of unity, run `sudo apt-get install gnome-panel`, then log out and select gnome theme in the log in option, done!

## alt-tab fails on gnome
This is not happen in all of my computers, it can be solved by
* sudo apt-get install compizconfig-settings-manager
* Applications -> System Tools -> Preferences -> CompizConfig Settings Manager
* Window Management -> Application Switcher, check it

Read this thread in ubuntuforums.org for more detail: [ALT-TAB not working in gnome classic?][0]

## scrollbar
It is uncomfortable for me to use the thinner scrollbar, it often jump to the top of window, so i decide to disable it.

    gsettings set org.gnome.desktop.interface ubuntu-overlay-scrollbars false

or you can remove the liboverlay-scrollbar package.

**UPDATE**: It seems not work for me now :(

[0]: http://ubuntuforums.org/showthread.php?t=1968630

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
