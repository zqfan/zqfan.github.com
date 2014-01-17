---
layout: post
title: "OpenStack Quantum Bugs"
description: ""
category: openstack
tags: [quantum, openstack-bug]
---
{% include JB/setup %}

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

# Bugs
## l3_agent
### seting the network namespace failed: Invalid argument
Once you've unsuccessfully tried to delete a namespace with ip netns delete,
it clears read permission from corresponding entry of /var/run/netns/ causing "seting the network namespace failed: Invalid argument" when namespace is used in further operations. [https://bugs.launchpad.net/neutron/+bug/1052535 #10](https://bugs.launchpad.net/neutron/+bug/1052535)

## DHCP
### quantum-ns-metadata-proxy

    Stderr: 'sudo: no tty present and no askpass program specified\nSorry, try again.\nsudo: no tty present and no askpass program specified\nSorry, try again.\nsudo: no tty present and no askpass program specified\nSorry, try again.\nsudo: 3 incorrect password attempts\n'

**solution**:

Adding the root_helper line to dhcp_agent.ini, identical to the one I
already have in quantum.conf, resolved the problem for me as well.

A notable difference seems to be that in quantum.conf it resides under
the AGENT section by default; in dhcp_agent.ini it resides under the
DEFAULT section.

And you'd better use absolute path of quantum-rootwrap which means /usr/bin/quantum-rootwrap. After modify the config files, you'd better restart all dhcp and dnsmasq process or reboot your machine.
