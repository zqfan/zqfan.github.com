---
layout: post
title: "Linux Partition Label"
description: ""
category: linux
tags: [linux, partition, blkid, e2label, tune2fs]
---
{% include JB/setup %}

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

# Reference
1. [Linux Partition HOWTO](http://www.tldp.org/HOWTO/html_single/Partition/)
2. [How to Label hard drive partition under Linux ](http://linuxconfig.org/how-to-label-hard-drive-partition-under-linux)
3. [finding partition from LABEL](http://www.unix.com/unix-advanced-expert-users/56804-finding-partition-label.html)

# Label A Partition
list partition

    df -a

show partition info

    blkid /dev/sda1

## e2label
label a partition

    e2label /dev/sda1 "mylabel"

## tune2fs
label a partition

    tune2fs -L "mylabel" /dev/sda1

## findfs
find the partition named the specific label

    findfs LABEL=mylabel

## use label in /etc/fstab

    LABEL=mylabel /mount/point ext3 defaults 0 2
