---
layout: post
title: "OpenStack Quantum Bugs"
description: ""
category: openstack
tags: [quantum, openstack-bug]
---
{% include JB/setup %}
# License
this file is published under [(CC) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

# Bugs
## l3_agent
### seting the network namespace failed: Invalid argument
Once you've unsuccessfully tried to delete a namespace with ip netns delete,
it clears read permission from corresponding entry of /var/run/netns/ causing "seting the network namespace failed: Invalid argument" when namespace is used in further operations. [https://bugs.launchpad.net/neutron/+bug/1052535 #10](https://bugs.launchpad.net/neutron/+bug/1052535)

### ip link
<pre>ERROR [quantum.agent.l3_agent] Failed deleting namespace 'qrouter-ca26e546-384e-48fb-a55f-a632e632c855'
Traceback (most recent call last):
  File "/usr/lib/python2.7/dist-packages/quantum/agent/l3_agent.py", line 187, in _destroy_router_namespaces
    self._destroy_router_namespace(ns)
  File "/usr/lib/python2.7/dist-packages/quantum/agent/l3_agent.py", line 193, in _destroy_router_namespace
    for d in ns_ip.get_devices(exclude_loopback=True):
  File "/usr/lib/python2.7/dist-packages/quantum/agent/linux/ip_lib.py", line 73, in get_devices
    self.root_helper, self.namespace)
  File "/usr/lib/python2.7/dist-packages/quantum/agent/linux/ip_lib.py", line 58, in _execute
    root_helper=root_helper)
  File "/usr/lib/python2.7/dist-packages/quantum/agent/linux/utils.py", line 61, in execute
    raise RuntimeError(m)
RuntimeError:
Command: ['sudo', 'quantum-rootwrap', '/etc/quantum/rootwrap.conf', 'ip', 'netns', 'exec', 'qrouter-ca26e546-384e-48fb-a55f-a632e632c855', 'ip', '-o', 'link', 'list']
Exit code: 1
Stdout: ''
Stderr: 'seting the network namespace failed: Invalid argument\n'</pre>

<pre>ERROR [quantum.agent.l3_agent] Failed synchronizing routers
Traceback (most recent call last):
  File "/usr/lib/python2.7/dist-packages/quantum/agent/l3_agent.py", line 673, in _sync_routers_task
    self._process_routers(routers, all_routers=True)
  File "/usr/lib/python2.7/dist-packages/quantum/agent/l3_agent.py", line 653, in _process_routers
    self._router_added(r['id'], r)
  File "/usr/lib/python2.7/dist-packages/quantum/agent/l3_agent.py", line 230, in _router_added
    self._create_router_namespace(ri)
  File "/usr/lib/python2.7/dist-packages/quantum/agent/l3_agent.py", line 208, in _create_router_namespace
    ip_wrapper.netns.execute(['sysctl', '-w', 'net.ipv4.ip_forward=1'])
  File "/usr/lib/python2.7/dist-packages/quantum/agent/linux/ip_lib.py", line 414, in execute
    check_exit_code=check_exit_code)
  File "/usr/lib/python2.7/dist-packages/quantum/agent/linux/utils.py", line 61, in execute
    raise RuntimeError(m)
RuntimeError:
Command: ['sudo', 'quantum-rootwrap', '/etc/quantum/rootwrap.conf', 'ip', 'netns', 'exec', 'qrouter-ca26e546-384e-48fb-a55f-a632e632c855', 'sysctl', '-w', 'net.ipv4.ip_forward=1']
Exit code: 1
Stdout: ''
Stderr: 'seting the network namespace failed: Invalid argument\n'</pre>

<pre>ERROR [quantum.agent.l3_agent] Failed synchronizing routers
Traceback (most recent call last):
  File "/usr/lib/python2.7/dist-packages/quantum/agent/l3_agent.py", line 672, in _sync_routers_task
    self._process_routers(routers, all_routers=True)
  File "/usr/lib/python2.7/dist-packages/quantum/agent/l3_agent.py", line 655, in _process_routers
    self.process_router(ri)
  File "/usr/lib/python2.7/dist-packages/quantum/agent/l3_agent.py", line 323, in process_router
    self.external_gateway_added(ri, ex_gw_port, internal_cidrs)
  File "/usr/lib/python2.7/dist-packages/quantum/agent/l3_agent.py", line 414, in external_gateway_added
    prefix=EXTERNAL_DEV_PREFIX)
  File "/usr/lib/python2.7/dist-packages/quantum/agent/linux/interface.py", line 191, in plug
    namespace_obj.add_device_to_namespace(ns_dev)
  File "/usr/lib/python2.7/dist-packages/quantum/agent/linux/ip_lib.py", line 129, in add_device_to_namespace
    device.link.set_netns(self.namespace)
  File "/usr/lib/python2.7/dist-packages/quantum/agent/linux/ip_lib.py", line 192, in set_netns
    self._as_root('set', self.name, 'netns', namespace)
  File "/usr/lib/python2.7/dist-packages/quantum/agent/linux/ip_lib.py", line 167, in _as_root
    kwargs.get('use_root_namespace', False))
  File "/usr/lib/python2.7/dist-packages/quantum/agent/linux/ip_lib.py", line 47, in _as_root
    namespace)
  File "/usr/lib/python2.7/dist-packages/quantum/agent/linux/ip_lib.py", line 58, in _execute
    root_helper=root_helper)
  File "/usr/lib/python2.7/dist-packages/quantum/agent/linux/utils.py", line 61, in execute
    raise RuntimeError(m)
RuntimeError:
Command: ['sudo', 'quantum-rootwrap', '/etc/quantum/rootwrap.conf', 'ip', 'link', 'set', 'qg-52405136-74', 'netns', 'qrouter-c5b2ccd9-94b7-4191-8c22-3df32dc26192']
Exit code: 2
Stdout: ''
Stderr: 'RTNETLINK answers: Invalid argument\n'</pre>

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
