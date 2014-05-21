---
layout: post
title: "Goagent For Github"
description: ""
category: linux
tags: [goagent, github]
---
{% include JB/setup %}

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

    # sudo mkdir /usr/share/ca-certificates/github.com/
    # cd !!:1
    # sudo cp /path/to//goagent/local/certs/github.com.crt ./
    # sudo dpkg-reconfigure ca-certificates

choose prompt for new cert

    # sudo update-ca-certificates
    # git config --global http.proxy 127.0.0.1:8087

NOTE: you should check your firewall for port 8087

enjoy!

reference:

1. http://mdjhny.github.com/git-proxy-using-goagent.html
1. http://enyo.iteye.com/blog/1336975
