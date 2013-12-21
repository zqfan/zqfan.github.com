---
layout: post
title: "OpenStack Neutron Multiple External Network"
description: ""
category: openstack
tags: [openstack, neutron, l3-agent]
---
{% include JB/setup %}

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

# Reference
1. [https://review.openstack.org/#/c/34192/](https://review.openstack.org/#/c/34192/)

# Status
In reference [1](https://review.openstack.org/#/c/34192/), Robert Kukura said:

I'm suggesting fixing l3-agent so that a single l3-agent can host multiple routers using different external networks, as long as external_network_bridge is unset (overriding the default of 'br-ex') and the external networks are proper provider networks (with the external flag set).

Given network namespace support and provider external networks, I see no fundamental reason a single l3-agent shouldn't be able to host multiple routers using different provider external networks.

Just to clarify, I believe the need to configure gateway_external_network_id came about because at the time the l3-agent was designed, provider networks were not yet available, so the external_network_bridge (of which there can only be one for a process) was introduced.

The l3-agent works fine using a single provider external network with the following in l3_agent.ini:

external_network_bridge =

to override the default of 'br-ex'.

So my suggestion is to eliminate the need to configure gateway_external_network_id when their are multiple external networks.

