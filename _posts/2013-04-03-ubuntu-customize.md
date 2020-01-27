---
layout: post
title: "Ubuntu Customize"
description: ""
category: linux
tags: [ubuntu, desktop, interface]
---
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

or you can remove the liboverlay-scrollbar package. Log out to take effect.

## desktop crash

Sometimes ubuntu desktop will crash, the windows frames just disappear and only mouse can move, and the only thing I can do the cold restart. This usally happens when I'm using web browser heavily. For now, I don't find a solution. `unity --reset` doesn't work and it even has been removed from my computer later. Search in `/var/log/syslog` for CRITICAL keyword I found that `[drm:i915_hangcheck_hung] *ERROR* Hangcheck timer elapsed... GPU hung`, after google, This link [Bug: Updated xserver-xorg-video-intel to crash xorg][1] shows that it could caused by xserver-xorg-video-intel but I've not install it at all. And there is a [thread in kernel for this bug][2].

## fonts

fonts can be insttalled via Ubuntu Software Center, sometimes it will be weired, I came across with a Microsoft Core Fonts problem, which can be solvd by:

    sudo apt-get install --reinstall -y ttf-mscorefonts-installer


[0]: http://ubuntuforums.org/showthread.php?t=1968630
[1]: http://ubuntuforums.org/showthread.php?t=2128691
[2]: https://bugzilla.kernel.org/show_bug.cgi?id=49571

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
