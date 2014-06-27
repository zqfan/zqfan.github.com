---
layout: post
title: "OpenStack Ceilometer Juno Development"
description: ""
category: "openstack"
tags: [ceilometer]
---
{% include JB/setup %}
本文简略介绍Ceilometer项目Juno版本开发进度

Ceilometer元老（也是之前的项目负责人）Julien Danjou（昵称jd）在亚特兰大峯会后撰写了一篇博文[OpenStack Design Summit Juno, from a Ceilometer point of view](http://techs.enovance.com/6994/openstack-design-summit-juno-from-a-ceilometer-point-of-view)，从他亲身参与的会议中描述了接下来的开发计划，包括：

* Scaling the central agent：目前central agent负责一些非虚拟机相关的指标采样工作，一般单进程单节点部署，不利于性能和水平扩展性。理想情况下，这些工作应当具备分布于多个节点协同工作的能力。jd声称用于该目的的Tooz组件已经开发完毕并具备基础能力，同事Cyril Roelandt已经通过Taskflow和Tooz组件替换了报警任务划分的代码开始了类似尝试。
* Test strategy：支持Tempest原本是Havana版本的计划但是流产了，Juno版本将其列为重点之一。
* Complex queries and per-user/project data collection：Ildikó Váncsa提出增加细粒度流水线配置，以支持基于用户和基于项目的数据检索。虽然细节还没有确定但是受到认可。同时强化复杂查询接口也是任务之一
* Rethinking Ceilometer as a Time-Series-as-a-Service：之前的API和数据库设计使得数据存储的可扩展性出现严重问题。jd为此开发了一个新项目[Gnocchi](https://wiki.openstack.org/Gnocchi)，直接上原文：“Gnocchi is split in two parts: a time series API and its driver, and a resource indexing API with its own driver. Having two distinct driver sets allows it to use different technologies to store each data type in the best storage engine possible. The canonical driver for time series handling is based on Pandas and Swift. The canonical resource indexer driver is based on SQLAlchemy.” 在该项目基础上将设计V3接口，并会在Juno最终发布时提供某种V3预览版。
* Revisiting the Ceilometer data model：Alexei Kornienko提出数据模型重构，意图从底层数据库的角度提升性能。在V3还未成为默认版本前这项工作也很紧迫，Mehdi Abaakouk已实现若干建议
* Ceilometer devops session：长期但是非重点的对devops的支持
* SNMP inspectors：Lianhao Lu讨论了关于支持SNMP的许多细节
* Alarm and logs improvements：会议讨论了优化alarm evaluator和日志两个系统
* Epilogue：Ceilometer新的项目负责人Eoghan Glynn指出QA将是当前版本的主要关注点

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
