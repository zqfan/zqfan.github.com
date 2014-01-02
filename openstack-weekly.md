---
layout: page
title: "OpenStack Weekly"
description: ""
category: "openstack"
tags: []
---
{% include JB/setup %}
This post is a draft of OpenStack newsletter and process log of my contribution to OpenStack in 2014.

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

# Week 1
Launchpad:

* Neutron openvswitch agent efficiency problem, ovs-vsctl takes too much time in a small cluster, [bug link][1.1]

[1.1]: https://bugs.launchpad.net/neutron/+bug/1264608

## Week 0
Stackalytics:

Zhiqiang Fan
* Total commits: 6
* Total LOC: 313
* Review stat (-2, -1, +1, +2, A): 0, 5, 35, 0, 0
* Draft Blueprints: 0
* Completed Blueprints: 0
* Emails: 0

Gerrit:

* [openstack hacking][0.1]: Empty files shouldn't contain copyright nor license
* we should use kwargs explanation instead of detail when raise webob.exc.WSGIHTTPException, or http response will generate message with default explanation

Maillist:

There is a discussion about "Complex query BP implementation" using POST to do rich query. Jay Pipes disagrees with this way because it breaks the verb's original meaning, and suggests to use `POST /reports` and `GET /posts/{id}` to do rich query. But Ceilometer PTL [Julien Danjou has confirmed][0.2] that POST for rich query is ok, and currently Ceilometer will not store user's query since it amis to IaaS.

Blogs:

UnitedStack: [OpenStack Ceilometer 简介][0.3] by Suo, Guangyu

[0.1]: http://docs.openstack.org/developer/hacking/#openstack-licensing "openstack hacking"
[0.2]: http://www.mail-archive.com/openstack-dev@lists.openstack.org/msg12514.html
[0.3]: http://www.ustack.com/blog/ceilometer/
