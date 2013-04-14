---
layout: post
title: "Linux Chinese"
description: ""
category: linux
tags: [linux]
---
{% include JB/setup %}
## License
this file is published under [(CC) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

## ime
### rime
https://code.google.com/p/rimeime/wiki/RimeWithIBus

## Character Encoding
* iconv
* convmv: conv file name instead of content.

## Rhythmbox Chinise Tag
reference:[http://astroman.lamost.org/dbs/archives/10536](http://astroman.lamost.org/dbs/archives/10536)

    echo "export GST_ID3_TAG_ENCODING=GBK:UTF-8:GB18030" >> ~/.bashrc
    echo "export GST_ID3V2_TAG_ENCODING=GBK:UTF-8:GB18030" >> ~/.bashrc
    source ~/.bashrc

Restart Rhythmbox and reload all files, note that just simply restart Rhythmbox will not work, you must remove fils from list(not remove from disk -_-!) and import those files.
