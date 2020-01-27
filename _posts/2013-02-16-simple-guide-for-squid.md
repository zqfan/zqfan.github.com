---
layout: post
title: "Simple Guide for Squid"
description: ""
category: linux
tags: [linux, squid]
---
## references
main link:

[baidu](http://hi.baidu.com/wayoca/item/d5075ffc4d0cd6b131c19988)

secondary links:

[sina](http://blog.sina.com.cn/s/blog_5a48dd2d01015tdj.html)

[blogbus](http://linux.blogbus.com/logs/35912092.html)

[weifadong](http://hi.baidu.com/weifadong/item/aefac13f595ac5637c034bbb)

[linuxany](http://www.linuxany.com/archives/1292.html)

[linuxany](http://www.linuxidc.com/Linux/2012-05/59506.htm)

## step 1 
    
    # apt-get install squid squid-common
## step 2

    # cat /etc/squid3/squid.conf

    #
    # INSERT YOUR OWN RULE(S) HERE TO ALLOW ACCESS FROM YOUR CLIENTS
    #
    cache_effective_user proxy
    cache_effective_group proxy
    http_port 10.106.34.12:3128
    cache_mem 1000 MB
    maximum_object_size 4096 KB
    reply_body_max_size 15 MB
    visible_hostname ubuntu-proxy
    cache_mgr aji.zqfan@gmail.com
    acl vrv-f3 src 192.168.32.0/24
    http_access allow vrv-f3

*NOTE:* this settings need to be verified
## step 3

    # squid3 -k shutdown
    # ps aux | grep squid
    # squid3 -z
    # squid3 -k parse
    # squid3 -s
    
# squid for windows
ref:

1. [大雄兔](http://hi.baidu.com/billdkj/item/eefaf03d6ae8ab617c034b2d)
2. [windows service management](http://www.metsky.com/archives/571.html)

## steps

1. download squid for windows: http://squid.acmeconsulting.it/
2. extract it to C:\
3. cp all files in C:\squid\etc and rename them by remove the trailing '.default'
4. edit squid.conf, see example in ref 1
5. cd c:\squid\sbin
6. squid -i
7. squid -z
8. net start squid

