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
Stackalytics:
* Total commits: 9
* Total LOC: 400
* Review stat (-2, -1, +1, +2, A): 0, 9, 43, 0, 0
* Draft Blueprints: 0
* Completed Blueprints: 0
* Emails: 0

Launchpad:

* Neutron openvswitch agent efficiency problem, ovs-vsctl takes too much time in a small cluster, [bug link][1.1]

Mailing List:
* 来自HP的贡献者Herndon, John Luke计划为CEILOMETER支持vertica数据库，由于这是个非开源软件（但有社区版），因此CI需要走第三方软件的方式。[http://ci.openstack.org/third_party.html][1.2]
* 同样是Herndon, John Luke，提出为CEILOMETER支持批量消费通知，由于目前的消息机制是每次只消费一个，存在一定的性能问题，如果在一定的超时时间窗内缓冲若干消息，然后再一次性入库则能提高插入性能。这个方案目前问题很多，例如错误处理机制等，尚在讨论中。

Blogs:

* [OpenStack Metering Using Ceilometer][1.3], 介绍了G版CEILOMETER的情况。

[1.1]: https://bugs.launchpad.net/neutron/+bug/1264608
[1.2]: http://ci.openstack.org/third_party.html
[1.3]: http://www.mirantis.com/blog/openstack-metering-using-ceilometer/

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
