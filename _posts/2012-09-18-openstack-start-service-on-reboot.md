---
layout: post
title: "openstack start service on reboot"
description: ""
category: OpenStack
tags: [openstack]
---
{% include JB/setup %}
## License
this file is published under [(CC) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

when you reboot the host, nova services cannot restart properly, you will find asynchronous connection error in nova-compute.log, nova-scheduler.log, nova-cert.log, nova-volume.log and maybe in nova-network.log

it just because the network bridge is not started

when you reboot your system, type@:ifconfig, you will not find the br100, if you set when you install openstack following the guide on the Internet

the network bridge on control node will be created after nova-network start running, and then map your ip address through iptables's NAT functionality.

bridge on compute node will even late after you create a new instance on that host, it will not created even nova-network and nova-compute started. after creating, it will overwrite interface's network information by the binding information. before that, you cannot run an instance, because the expected bridge did not exist

so you must make network bridge created right after host reboot, one method post in http://blog.csdn.net/ugyn109/article/details/7610882 show his way to fix this problems:

here is my solution:
