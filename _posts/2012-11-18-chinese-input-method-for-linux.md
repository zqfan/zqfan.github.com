---
layout: post
title: "chinese input method for linux"
description: ""
category: Linux
tags: []
---
#
License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

download the input platform

    @$:sudo apt-get install ibus ibus-clutter ibus-gtk ibus-gtk3 ibus-qt4

switch to this input platform

    @$:im-switch -s ibus

install an input method

    @$:sudo apt-get install ibus-table-wubi

setup preference

    @$:ibus-setup

enable icon on task bar

    @$:ibus-daemon -drx
