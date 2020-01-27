---
layout: post
title: "APT-GET"
description: ""
category: Linux
tags: [apt-get, linux]
---
#
License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

    E: Encountered a section with no Package: header
    E: Problem with MergeList /var/lib/apt/lists/mirror.bjtu.edu.cn_ubuntu_dists_precise_universe_i18n_Translation-en
    E: The package lists or status file could not be parsed or opened."

this is because ubuntu auto update manager boken when network shutdown unexpectly. fix:

    @:sudo rm /var/lib/apt/lists/* -vf
    @:sudo apt-get update
