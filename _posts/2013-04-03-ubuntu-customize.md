---
layout: post
title: "Ubuntu Customize"
description: ""
category: Linux
tags: [ubuntu, desktop, interface]
---
{% include JB/setup %}
## License
this file is published under [(CC) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

## scrollbar
it is uncomfortable for me to use the thinner scrollbar, it often jump to the top of window, so i decide to disable it.

    gsettings set org.gnome.desktop.interface ubuntu-overlay-scrollbars false

or you can remove the liboverlay-scrollbar package.
