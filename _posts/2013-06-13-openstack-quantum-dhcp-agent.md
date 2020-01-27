---
layout: post
title: "Openstack Quantum DHCP Agent"
description: ""
category: openstack
tags: [openstack, quantum, dhcp]
---

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

# quantum.agent.dhcp_agent

## DhcpAgent(manager.Manager)

* dhcp_driver = quantum.agent.linux.dhcp.Dnsmasq
* sync_state() get_active_networks() from self.plugin_rpc, disable_dhcp_helper() for deleted networks, and refresh_dhcp_helper() for active networks
* enable_dhcp_helper(network_id) get_network_info() from self.plugin_rpc, if network.admin_state_up, then it call_driver('enable', network) and put network to self.cache if there is at least one subnet enable_dhcp
* disable_dhcp_helper(network_id) will get network from self.cache, remove it from cache if call_driver('disable', network) success
* refresh_dhcp_helper(network_id) return enable_dhcp_helper(id) if network is new one, or it will get_network_info(id) from self.plugin_rpc, and compare old_cidrs with new_cidrs, if they are same, it call_driver('reload_allocations', network), else if new_cidrs, 'restart' it and update cache, or it will disable_dhcp_helper(id)

there are some hanlder of network.action.end notification event, all are decorated with lockutils.synchronized('agent', 'dhcp-')

* network_create_end -> enable_dhcp_helper(id)
* network_update_end -> enable_dhcp_helper(id) or disable it according to admin_state_up
* network_delete_end -> disable_dhcp_helper(id)
* subnet_update_end -> refresh_dhcp_helper(id)
* subnet_create_end -> subnet_update_end
* subnet_delete_end -> if network, refresh_dhcp_helper
* port_update_end -> if network, put port to cache and call_driver('reload_allocations', network)
* port_create_end -> port_update_end
* port_delete_end -> if port, remove it from cache and call_driver('reload_allocations', network)

* TODO: enable_isolated_metadata_proxy(network), currently i cannot figure out what purpose of it. if you enable_metadata_network and network.subnets has subnet in meta_cidr, it will create external_process running quantum-ns-metadata-proxy command, and generate log file named with the network.id
* disable_isolated_metadata_proxy(network) will disable it

## DhcpPluginApi(proxy.RpcProxy)

it stores topic and context, also get host from cfg, all it does is make_msg and invoke self.call or self.cast

## NetworkCache(object)

it holds tree cache: cache, subnet_lookup and port_lookup. cache actually is network_lookup. if we put a port to this cache, it will append it to `cache[network_id]`, and update `port_lookup[port.id] = network.id`. the same process with put subnet.

## DeviceManager(object)

* plugin = plugin, driver = interface_driver
* get_interface_name(network, port) -> self.driver.get_device_name(port)
* get_device_id(network) return 'dhcp%(host_uuid)s-%(network.id)s'
* **setup(network)** create and initialize a device for network's dhcp. it invokes get_device_id(network), self.plugin.get_dhcp_port(network.id, device_id) and get_interface_name(network, port), then self.driver.plug(network...). it use port.fixed_ips and metadata_default_ip to call self.driver.init_l3(interface_name, ip_cidrs, namespace), if namespace is None, device.route.pullup_route(interface_name) to ensure dhcp interface is first in list(?). if enable_metadata_network, it add a gateway so that packets can be routed back to VMs, only 1 subnet on metadata access network, device.route.add_gateway(gateway_ip)
* destroy(network, device_name) calls self.driver.unplug(device_name...), then self.plugin.relase_dhcp_port(network.id...)

## DictModel(object)

Convert dict into an object that provides attribute access to values.

## DhcpLeaseRelay(object)

UNIX domain socket server for processing lease updates.

Network namespace isolation prevents the DHCP process from notifying Quantum directly.  This class works around the limitation by using the domain socket to pass the information.  This class handles message.receiving and then calls the callback method.

* cfg.stropt dhcp_lease_relay_socket
* _handler(client_sock, client_addr) Handle incoming lease relay stream connection, This method will only read the first 1024 bytes and then close the connection.  The limit exists to limit the impact of misbehaving clients. it reads 1024 bytes from client_sock, parse it to get network_id, ip_address, lease_remaining then call self.callback(...)
* start() will spawn a grenn thread, eventlet.spawn(eventlet.serve, listener, self._handler), listener is socket.AF_UNIX type

## DhcpAgentWithStateReport(DhcpAgent)

* __init__(...) start hearbeat with callback _report_state
* _report_state() report agent_state via agent_rpc.PluginReportStateAPI(topics.PLUGIN).report_state(...)
* agent_update() handle the agent_update notification event
