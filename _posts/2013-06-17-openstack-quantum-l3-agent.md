---
layout: post
title: "Openstack Quantum L3 Agent"
description: ""
category: openstack
tags: [openstack, quantum, l3, python]
---
{% include JB/setup %}

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

# quantum.agent.l3_agent
## L3PluginApi(proxy.RpcProxy)
a wrapper of prc call, only support get_routers(...) and get_external_network_id(...)

## RouterInfo(object)
* store infomation of whole l3, not for router only
* it seems just hold a single router, the router's value is stored in self.router
* _snat_action, according to current router info
* iptables_manager

## L3NATAgent(manager.Manager)
* cfg: external_network_bridge, interface_driver, metadata_port, send_arp_for_ha, use_namespaces, router_id, handle_internal_only_routers, gateway_external_network_id, enable_metadata_proxy
* l3 will destroy all namespaces when init, unless router_id is set
* the destroy work is done by self.driver.unplug(device.name)
* _router_added(id, router) will cache it, and _create_router_namespace(ri) if needed, then ri.ip_tables_managedr.apply(), metadata_proxy will be spawned if needed
* **process_router(ri)** first scan all internal_ports of ri, append new ports, remove unactive ports, and do internal_network_{added,remove} respectively. if ex_gw_port is added, then invoke external_gateway_added(...) or if is removed, invoke external_gateway_removed(...). finally, update snat rules via ri.perform_snat_action(), update dnat via process_router_floating_ips() and update routes via routes.updated()
* it seems ex_gw_port can have many fixed_ips and _handle_router_snat_rules(...) will just use the first one
* **process_router_floating_ips(ri, ex_gw_port)** will scan all floating ips, if floating ip is new then floating_ip_added(...), if floating ip does not exist, floating_ip_removed(...), if floating ip -> fixed_ip has been changed, remapping it, floating_ip_removed() old and floating_ip_added new. ri cache is updated also.
* **external_gateway_added(...)** firstly ensure device exists via self.driver.plug(...), then self.driver.init_l3(...), then _send_gratuitous_arp_packet(...), then if ex_gw_port subnet's gateway_ip exists, set default route gw
* external_gateway_removed(...) directly unplug the device
* external_gateway_nat_rules(...) generate rules, including internal_network_nat_rules(ex_gw_ip, internal_cidr), and `POSTROUTING ! -i $if ! -o $if -m conntrack ! --ctstate DNAT -j ACCEPT`
* **internal_network_added(...)** ensure device exist, then driver.init_l3(...) and _send_gratuitous_arp_packet(...)
* internal_network_removed(...) will directly unplug device from driver
* internal_network_nat_rules(ex_gw_ip, internal_cidr) just generate rule `snat -s internal_cidr -j SNAT --to-source ex_gw_ip`
* floating_ip_added(...) get interface_name via get_external_device_name(ex_gw_port.id), create IPDevice, add floating ip to device.addr and _send_gratuitous_arp_packet, then for floating_forward_rules(floating_ip, fixed_ip) iptables_manager.apply() them
* floating_ip_removed(...) will delete floating ip from device.addr and remove floating_forward_rules(...)
* floating_forward_rules(...) is `PREROUTING -d $float -j DNAT --to $fix`, `OUTPUT -d $float -j DNAT --to $fix`, `float-snat -s $fix -j SNAT --to $float`
* router_deleted -> _router_removed(id) with sync_sem and exception
* routers_updated -> wrapper with sync_sem and exception
* _process_routers(routers) remove routers not meet conditions and process others via process_router(ri)
* routes_update(ri) will replace changed route and delete removed route

### why external network cannot use as internal network?
internal_network_added() will get interface name from get_internal_device_name(port_id), however, external network has different device prefix, so it will plug a new device to driver, which can be wrong or fail? and the following driver.init_l3 and gratuitous arp packet may fail too

## L3NATAgentWithStateReport(L3NATAgent)
a looping report wrapper of l3NatAgent
