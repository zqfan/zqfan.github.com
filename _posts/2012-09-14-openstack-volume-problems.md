---
layout: post
title: "Openstack Volume Problems"
description: ""
category: openstack
tags: [nova-volumes, openstack]
---
{% include JB/setup %}
#
License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

## problem
when you just have one disk, you will choose to create a image file to act as a disk, like this:

    @:dd if=/dev/zero of=/opt/nova-volumes.img bs=1M seek=100000 count=0

and then load it:

    @:losetup -f /opt/nova-volumes.img

and then create a logic volume group:

    @:vgcreate nova-volumes /dev/loop0

then nova-volume service will use this logic volume group to create volumes, all seem fine

BUT

if you have no more than 'seek' free disk space, which means 100G here,
when you create volumes, and more than the free disk space but less than the free space on logic volume group, it will success!

and when you try to delete it, it cannot be removed, and mark status 'ERROR_DELETING', you will see 'no free disk space' error in /var/log/nova/nova-volume.log, and you will find you / directory is 100% usage!

### CONCLUSION:
DO NOT allocate image file larger than your free disk space

### FIX:
if you just got 100% usage in / directory and some volumes stop at 'ERROR_DELETING', just reboot your host

if you are running a product, not developing, hehe
