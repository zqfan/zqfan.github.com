---
layout: post
title: "openvswitch gre mode"
description: ""
category: openstack
tags: [openstack, quantum, openvswitch]
---
{% include JB/setup %}

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

# What is it?
A virtual network realized as network packets encapsulated using GRE. GRE networks are also referred to as "tunnels". **GRE tunnel packets are routed by the host's IP routing table**, so GRE networks are not associated by Quantum with specific physical networks.

--OpenStack Network (Quantum), Dec 20, 2012, p27

