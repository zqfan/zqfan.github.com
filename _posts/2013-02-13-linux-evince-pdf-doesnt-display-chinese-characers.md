---
layout: post
title: "Linux evince PDF Doesn't Display Chinese Characers"
description: ""
category: linux
tags: [evince, pdf]
---
{% include JB/setup %}

#
License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

open pdf file through shell: ``evince somefile.pdf``, if you find some text
cannot display for chinese character, try to run
```sudo apt-get install poppler-data```
