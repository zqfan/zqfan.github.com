---
layout: page
title: "OpenStack Weekly"
description: ""
category: "openstack"
tags: [news]
---
{% include JB/setup %}
This page is a draft of OpenStack newsletter and process log of my contribution to OpenStack in 2014.

Information is coming from:

* OpenStack Developer Mailing List
* https://launchpad.net/openstack
* http://stackalytics.com/
* Ceilometer PTL's blog: http://julien.danjou.info/blog/
* UnitedStack blog: http://www.ustack.com/blog/
* enovance blog: http://techs.enovance.com/
* [ceilometer irc meeting record](http://eavesdrop.openstack.org/meetings/ceilometer/2014/)
* [openstack irc log](http://eavesdrop.openstack.org/irclogs/)
* [Mark McLoughlin's blog](http://blogs.gnome.org/markmc/)

# week 25 (20140614-20140620)

Merged:

* 2014.06.19 (fix) (ceilometer) [Fix hacking rule 302 and enable it](https://review.openstack.org/101123)
* 2014.06.18 (fix) (ceilometer) [Remove unused logging in tests](https://review.openstack.org/99245)
* 2014.06.18 (fix) (ceilometer) [Clean up oslo.middleware.{audit,notifier}](https://review.openstack.org/99246)
* 2014.06.17 (fix) (marconi) [remove default=None for config options](https://review.openstack.org/99545)
* 2014.06.14 (fix) (ceilometer) [Fix incorrect trait initialization](https://review.openstack.org/97588) high
* 2014.06.14 (fix) (ceilometerclient) [Fix hacking rules: H302,H305,H307,H402](https://review.openstack.org/99293)

Gerrit:

* Ceilometer CI高失败率问题已逐渐解决
* 为实现alarm与meter分库存储，Ceilometer的数据库重构已经由Mehdi Abaakouk初步完成


# week 24 (20140609-20140615)

Merged:

* [https://review.openstack.org/#/c/95640/](https://review.openstack.org/#/c/95640/), bug [https://bugs.launchpad.net/python-ceilometerclient/+bug/1323480](https://bugs.launchpad.net/python-ceilometerclient/+bug/1323480)
* [https://review.openstack.org/#/c/96699/](https://review.openstack.org/#/c/96699/)
* [https://review.openstack.org/#/c/94324/](https://review.openstack.org/#/c/94324/), bug [https://bugs.launchpad.net/ceilometer/+bug/1320761](https://bugs.launchpad.net/ceilometer/+bug/1320761)
* [https://review.openstack.org/#/c/95229/](https://review.openstack.org/#/c/95229/), bug [https://bugs.launchpad.net/ceilometer/+bug/1322111](https://bugs.launchpad.net/ceilometer/+bug/1322111)
* [https://review.openstack.org/#/c/99546/](https://review.openstack.org/#/c/99546/), bug [https://launchpad.net/bugs/1323975](https://launchpad.net/bugs/1323975)

Gerrit:

* Ceilometer已在HBase中实现event相关接口，[https://review.openstack.org/91408](https://review.openstack.org/91408), MongoDB的接口正在开发中
* Ceilometer已批准增加升级测试，以验证版本升级能正常工作，[https://review.openstack.org/98168](https://review.openstack.org/98168)
* Ceilometer已批准在CeilometerClient中增加Keystone V3支持，[https://review.openstack.org/95270](https://review.openstack.org/95270)
* Ceilometer目前遭遇严重的CI问题，[https://bugs.launchpad.net/ceilometer/+bug/1327344](https://bugs.launchpad.net/ceilometer/+bug/1327344), [https://bugs.launchpad.net/ceilometer/+bug/1323524](https://bugs.launchpad.net/ceilometer/+bug/1323524), 并在邮件列表里被点名，[http://lists.openstack.org/pipermail/openstack-dev/2014-June/037079.html](http://lists.openstack.org/pipermail/openstack-dev/2014-June/037079.html), 经过两次修正仍未解决问题，项目核心成员经过讨论没有分析出根因但提出了一些可能的解决办法，预计还会在未来一段时间造成影响

Mailing List:

* Horizon计划支持Ceilometer Alarm资源，[http://lists.openstack.org/pipermail/openstack-dev/2014-June/036627.html](http://lists.openstack.org/pipermail/openstack-dev/2014-June/036627.html)


# 2014/06/02-2014/06/08

Gerrit:

* Ceilometer目前bp的提交方式采用在github.com/openstack/ceilometer-specs中讨论，在launchapd上跟踪进展的方式，与oslo，nova，neutron保持一致，详见https://wiki.openstack.org/wiki/Blueprints#Ceilometer
* Ceilometer Juno版本主要任务是解决性能问题，新对象模型以及新接口将被开发，项目名称gnocchi，详见https://github.com/openstack/ceilometer-specs/blob/master/specs/juno/gnocchi.rst，https://github.com/stackforge/gnocchi
* Ceilometer计划增加对Neutron资源LBAAS的支持，详见https://github.com/openstack/ceilometer-specs/blob/master/specs/juno/lbaas_metering.rst
* Ceilometer计划将alarm数据和metric数据分开存储以缓解性能问题，详见https://github.com/openstack/ceilometer-specs/blob/master/specs/juno/dedicated-alarm-database.rst
* Ceilometer计划在hbase中实现event相关的存储接口，详见https://github.com/openstack/ceilometer-specs/blob/master/specs/juno/hbase-events-feature.rst

Mailing List：

* Ceilometer P层监控的特性正在被讨论，详见：https://blueprints.launchpad.net/ceilometer/+spec/monitoring-as-a-service

Working Log：

* 主要在review代码以及更新patch，尚未有patch被合入
* 解决报警依赖问题的特性已提交，等待审核

# week 15 (20140407-20140413)

Gerrit:

* [reconnect to mongodb on connection failure](https://review.openstack.org/#/c/86609/) 但是只针对了启动连接的时候，运行时连接失败尚未处理。

# week 13 (20140324-20140330)

Mailing List:

* nova uses gerrit for blueprint review process in juno, [原文](http://lists.openstack.org/pipermail/openstack-dev/2014-March/030576.html)

# week 10

Stackalytics:

* Total commits: 67
* Total LOC: 1763
* Review stat (-2, -1, +1, +2, A): 0, 28, 138, 0, 0
* Draft Blueprints: 2
* Completed Blueprints: 0
* Emails: 16

Gerrit:

* Ceilometer项目正在试图将oslo.rpc替换为oslo.messaging，[Replace oslo.rpc by oslo.messaging](https://review.openstack.org/#/c/57457/38)

Mailing List:

* Sean Dague提出在Gerrit上审核Nova Blueprint，获得一致认可并已在商讨细节问题。[原文](http://lists.openstack.org/pipermail/openstack-dev/2014-March/029232.html)
* OpenStack Launchpad Answers现已正式迁移到Ask.openstack.org，Stefano Maffulli正联系各项目PTL关闭Launchapd上的Answer功能。[原文](http://lists.openstack.org/pipermail/openstack-dev/2014-March/028787.html)
* nova api v2 v.s. v3讨论：[Russell Bryant: Concrete Proposal for Keeping V2 API](http://lists.openstack.org/pipermail/openstack-dev/2014-March/028724.html)
* Miguel Angel Ajo提到rootwrap的效率很低，导致主机启动时耗费了大量时间（2.5倍于sudo）。一些想法如C重写rootwrap，开启管道通信等被提出但仍在讨论中。[原文](http://lists.openstack.org/pipermail/openstack-dev/2014-March/029017.html)
* Yuzhou提议一个类似于网吧系统或者沙盘系统的非持久化存储，当虚拟机一停机，所有新增数据就被删除。Joe Gordon提出这个想法可以通过快照-删vm-从快照创vm的流程解决。尽管Qin Zhao等人向他灌输业务流程里使用者也许压根没有权限创建虚拟机，Joe却无法理解为何会出现这种场景。我觉得这个讨论值得玩味，管中窥豹，东西方环境差异导致的思维差异，可见一斑。[原文](http://lists.openstack.org/pipermail/openstack-dev/2014-March/028799.html)

# week 09

* cinder ptl John Griffith提到后端vendor一次黑箱操作意图控制cinder代码的行为，呼吁社区合作应当公开透明。[原文](http://lists.openstack.org/pipermail/openstack-dev/2014-March/028624.html)
* Morgan Fainberg提出为支持多后台身份服务，将user id的长度从64字节增加到255字节，引起激烈讨论，反对者Jay Pipes认为user id有多长是keystone内部的事，外部调用时所使用的应该越短越好，最好只是16字节的uuid，另外大家都担心的对现有数据库迁移。[原文](http://lists.openstack.org/pipermail/openstack-dev/2014-February/028125.html)

# week 08

Mailing List:

* Joe Gordon建议成立oslo-sync团队，打算以nova项目做试点并在征集志愿者，目的是解决现在oslo-sync乱象问题。[原文](http://lists.openstack.org/pipermail/openstack-dev/2014-February/027631.html)
* Russell Bryant提议延迟Nova API V3稳定版在Icehouse的发布，而作为实验性接口与V2并存，Seab Dague同意不必急于求成，但提到最终要达到一套接口的目标，而不是维护两套接口疲于奔命。[原文](http://lists.openstack.org/pipermail/openstack-dev/2014-February/027588.html)
* Vishvananda Ishaya提出OpenStack对象都是租户级别的，缺乏层次化多租户资源控制，打算成立一个团队解决这个问题。[原文](http://lists.openstack.org/pipermail/openstack-dev/2014-January/025706.html)
* David Kranz提出配置文件中参数默认值的问题，最好是对于不同场景有推荐的配置。[原文](https://www.mail-archive.com/openstack-dev@lists.openstack.org/msg16469.html)

# Week 05

Launchpad:

* Julien Danjou: [Support for OpenStack Climate][5.1]

Gerrit:

* Yuuichi Fujioka: [Implements monitoring-network][5.2]
* Yuuichi Fujioka: [Implements monitoring-network-from-opendaylight][5.3]

[5.1]: https://blueprints.launchpad.net/ceilometer/+spec/climate-support
[5.2]: https://review.openstack.org/#/c/60473/
[5.3]: https://review.openstack.org/#/c/63890/

# Week 04

zqfan@Stackalytics:

* Total commits: 37
* Total LOC: 1221
* Review stat (-2, -1, +1, +2, A): 0, 23, 101, 0, 0
* Draft Blueprints: 1
* Completed Blueprints: 0
* Emails: 7

Blogs:

* Mirantis: [Understanding OpenStack Authentication: Keystone PKI][4.6]，介绍了OpenStack Keystone的token机制，包括UUID和PKI（从Grizzly开始）两种形式。
* Julien Danjou [Inside Synaps, a CloudWatch-like implementation for OpenStack][4.1]，介绍了Synaps这个AWS CloudWatch的开源实现并分析了其与Heat和Ceilometer的异同。Synaps使用了Cassandra并与之直接相连。取消了数据库引擎中间件；它允许直接写新数据但是缺乏从OpenStack其他组件拉取数据的能力；Synaps做了数据集中以加快读取速度，但是缺乏历史数据支持导致不适合作为计费的底层系统（？）。

Mails:

* horizon: [web accessibility issues][4.5]（个人觉得不止是可用性问题，Havana版本的horizon中文简体翻译就是个渣，但是仍然要感谢翻译团队所做的工作）
* Doug Hellmann@dreamhost: [writing comments as complete sentences][4.8]，强调注释文档不仅仅是写给自己看的，甚至不是写给英语母语的人看到的，因此如果要写，就认真点。（看看大师的风范）

Launchpad:

* Matthieu Huin@enovance: [per domain/project/user quotas on alarms][4.2]，对告警数量进行配额限制（亚马逊对单个账户的告警数量限制为5000，[官网链接][4.4]），但是Julien Danjou认为基础功能即可不必太过复杂，且反对由各项目独自负责quota的实现，[邮件详情][4.3]
* VijayKumar Kodam: [Dynamically enable or disable meters][4.7]，之前在邮件列表里已经讨论过的，在不重启ceilometer进程的情况下动态启用和禁止某些指标的监控。实现方式是使用pyinotify监控配置文件的变化，然后向所有关联进程发送消息通知其重新加载配置文件。由于存在异议，这个特性目前仍处于等待审核的状态。
* Toni Zehnder: [Monitoring Physical Devices][4.10]，硬件设备监控，包括服务器和交换机。[代码审核][4.11]进行中。

Gerrit:

* Gordon Chung@ibm: [meter table contains redundant/duplicate data][4.9]，ceilometer性能问题由来已久，早在Havana发布前，Jay Pipes就提到Meter表作为最基础的表之一，体积庞大，但是列本身内容太多，可以精简一下；Gordon Chung提交了一个改进，将meter_name，meter_type，meter_unit移除，新建MeterDef模型对应meter_def表。（从抽象角度，个人认为meter_type，meter_unit可以再独立出去，因为他们数量极少且相对稳定，但是太琐碎了，没必要）

[4.1]: http://julien.danjou.info/blog/2012/openstack-synaps-exploration
[4.2]: https://blueprints.launchpad.net/ceilometer/+spec/quotas-on-alarms
[4.3]: http://osdir.com/ml/openstack-dev/2014-01/msg00924.html
[4.4]: http://docs.aws.amazon.com/AmazonCloudWatch/latest/DeveloperGuide/cloudwatch_limits.html
[4.5]: http://www.mail-archive.com/openstack-dev@lists.openstack.org/msg14612.html
[4.6]: http://www.mirantis.com/blog/understanding-openstack-authentication-keystone-pki/
[4.7]: https://blueprints.launchpad.net/ceilometer/+spec/dynamic-meters
[4.8]: http://www.mail-archive.com/openstack-dev@lists.openstack.org/msg13692.html
[4.9]: https://review.openstack.org/#/c/65786/
[4.10]: https://blueprints.launchpad.net/ceilometer/+spec/monitoring-physical-devices
[4.11]: https://review.openstack.org/#q,topic:bp/monitoring-physical-devices,n,z

# Week 03

Stackalytics:

* Total commits: 25
* Total LOC: 680
* Review stat (-2, -1, +1, +2, A): 0, 16, 72, 0, 0
* Draft Blueprints: 1
* Completed Blueprints: 0
* Emails: 2

Blogs:

* [Setting up gating in the OpenStack intrastructure][03.1]
* [Ceilometer Quickstart ][03.2]

Mailing List:

* Mirantis的Nadya Privalova抱怨Ceilometer在海量数据下的低响应，提出要在DB中另起一表，暂存某种特殊查询的数据，或者周期任务的数据。Jay Pipes反驳说Ceilometer的重点是收集数据，预处理以及持久化。加速工作可以交由下游组件完成，如Pentaho。
* Julien Danjou注册了[基于通知的告警][03.3]特性，未实现，当包含某些属性的特定类型的通知到达时，发出告警。

[03.1]: http://jaegerandi.blogspot.com/2014/01/setting-up-gating-in-openstack.html
[03.2]: http://openstack.redhat.com/CeilometerQuickStart
[03.3]: https://blueprints.launchpad.net/ceilometer/+spec/alarm-on-notification


# Week 02

Launchpad:

* \[oslo\][common-ssh-client][2.0], High-level ssh client library, based on paramiko. It seemes there are some choices for ssh library, from low to high, [paramiko][2.3], [spur][2.2], [Fabric][2.4]. Advanced reading: [spur.py: A simplified interface for SSH and subprocess in Python][2.1]

Mailing List:

* samsung贡献者Deok-June Yi提出ceilometer告警延迟具有不可预知性，而Synaps的告警延迟稳定在2秒钟以内。原因在于ceilometer有大量数据库IO操作，而Synaps却是从内存以及流中读取数据。Deok-June Yi提议重新开始曾被搁置的Synaps并入ceilometer的特性，实现实时告警的需求。

Blog:

* Julien Danjou [Databases integration testing strategies with Python][2.5]，介绍了通过运行独立数据库进程的方式实现真实数据库测试的方法

[2.0]: https://blueprints.launchpad.net/oslo/+spec/common-ssh-client
[2.1]: http://mike.zwobble.org/2013/02/spur-py-a-simplified-interface-for-ssh-and-subprocess-in-python/
[2.2]: https://github.com/mwilliamson/spur.py
[2.3]: https://github.com/paramiko/paramiko
[2.4]: https://github.com/fabric/fabric
[2.5]: http://julien.danjou.info/blog/2014/db-integration-testing-strategies-python

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

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
