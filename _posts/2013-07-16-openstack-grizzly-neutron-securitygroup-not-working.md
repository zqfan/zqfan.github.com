---
layout: post
title: "OpenStack Grizzly Neutron SecurityGroup Not Working"
description: ""
category: openstack
tags: [openstack, quantum, neutron, security group]
---
{% include JB/setup %}
# License
this file is published under [(CC) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

# Desc
Although security group is set, and by default it will deny any ingress traffic, but instance still can be ping or provide any other service.

# Reference
* according to [openstack official guide](http://docs.openstack.org/trunk/openstack-network/admin/content/nova_config_security_groups.html), in nova.conf, firewall_driver should be set to `nova.virt.firewall.NoopFirewallDriver` and security_group_api should be set to `quantum`, or it will cause conflict
* in the same material but [different section](http://docs.openstack.org/trunk/openstack-network/admin/content/securitygroups.html), it seems ok not to modify nova.conf
* according to [answer on launchpad](https://answers.launchpad.net/neutron/+question/226821), we should set /etc/quantum/plugins/openvswitch/ovs_quantum_plugin.ini with firewall_driver = quantum.agent.linux.iptables_firewall.OVSHybridIptablesFirewallDriver, however, this only can avoid 404 error by `quantum security-group-*`
