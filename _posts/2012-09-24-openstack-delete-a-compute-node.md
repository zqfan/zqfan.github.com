---
layout: post
title: "Openstack Delete Compute Node"
description: ""
category: openstack
tags: [openstack, nova-compute]
---
{% include JB/setup %}
## License
this file is published under [(CC) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

currently, i just use nova-manage to disable a service:

    root@:nova-manage service disable --host $host_name --service $service_name

but it still shows in nova-manage service list, update database nova set deleted=true will make it invisible
