---
layout: post
title: "Why I Design This Way   OpenStack Install"
description: ""
category: openstack
tags: [openstack, fixed_range_v4]
---
{% include JB/setup %}
## License
this file is published under [(CC) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

## fixed ip in host's network when single nic used
if you only have one nic, and you want multi mode, then you have two choice:

1) set fixed range to a subnet of host's network
2) set fixed range to a private network but every node should add a route to each compute node. this is necessary for instances' communication
