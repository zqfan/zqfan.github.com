---
layout: post
title: "Openstack Quantum Agent"
description: ""
category: openstack
tags: [quantum, openstack, agent, python]
---
{% include JB/setup %}
# License
this file is published under [CC BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

# quantum.agent
## rpc
* create_consumers

### PluginReportStateAPI(proxy.RpcProxy)
* report_state, rpc call for (report_state, agent_state)

### PluginApi(proxy.RpcProxy)
all methods are just directly rpc call
* get_device_details
* update_device_down
* update_device_up
* tunnel_sync

## firewall
### FirewallDriver(object)
NotImplementedError

### NoopFirewallDriver(FirewallDriver)
pass

## linux.daemon
### Pidfile(object)

### Daemon(object)
generic daemon class

## linux.dhcp
* cfg: dhcp_confs, dhcp_lease_time, dhcp_domain, dnsmasq_config_file, dnsmasq_dns_server

### DhcpBase(object)

### DhcpLocalProcess(DhcpBase)
* enable() enables DHCP for this network by spawning a local process. device_delegate.setup(network) and if active then restart, else if this network enable_dhcp then spawn process
* disable() will kill -9 cur pid and destroy network device
* the pid and interface_name are stored in conf files which file name has their type respectively

### Dnsmasq(DhcpLocalProcess)
* existing_dhcp_networks(..) get active networks from dhcp conf dir, according to the dir names, each dir name represent a network uuid
* **swpawn_process()** spawns a Dnsmasq process for the network, which run cmd dnsmasq, with a lot of parameters
* reload_allocations() rebuild the dnsmasq config and signal the dnsmasq to reload.
* lease_update() use socket to send network lease info

## linux.external_process
### ProcessManager(object)
An external process manager for Quantum spawned processes
* enable(callback) execute callback with wrapper in a new process
* disable() kill -9 self.pid

## linux.interface
* cfg: ovs_integration_bridge, ovs_use_veth, network_device_mtu, meta_flavor_driver_mappings, admin_user, admin_password, admin_tenant_name, auth_url, auth_strategy, auth_region

### LinuxInterfaceDriver(object)
* DEV_NAME_PREFIX: tap
* **init_l3(device_name, ip_cidrs...)** set the L3 settings for the interface using data from the port. get device via ip_lib.IPDevice, if ip_cidr is not in device.addr, then add it, remove all ip_cidr from device.addr if not in ip_cidrs
* plug(...) @abc.abstractedmethod
* unplug(...) @abc.abstractedmethod

### OVSInterfaceDriver(LinuxInterfaceDriver)
driver for creating an internal interface on an OVS bridge
* _ovs_add_port(...) execute ovs-vsctl add-port with a lot of parameters
* **plug(...)** check_bridge_exists(bridge) first, then if device not exist, try to create it via _ovs_add_port(...), then link it via ns_dev.link.set_address(mac_address), set mtu via ns_dev.link.set_mtu(...) and add ns_dev to namespace if needed, finally, active it by call ns_dev.link.set_up()
* unplug(...) use ovs.delete_port(tap_name) to unplug device

### BridgeInterfaceDriver(LinuxInterfaceDriver)
Driver for creating bridge interfaces.
* plug(...) create ns_veth by ip_lib.IPWrapper.add_veth() and set mac_address and mtu through ne_veth
* unplug(...) delete device link directly

### MetaInterfaceDriver(LinuxInterfaceDriver)
setup a quantum client and init flavor_driver_map via conf.meta_flavor_driver_mappings
* plug(...) get driver by network id and call driver.plug and set device plugin tag which will set device.link.alias
* unplug(...)

## linux.ip_lib
* cfg: ip_lib_force_root

### SubProcessBase(object)
* `_run(...)` call `_as_root(...)` if namespace, or it call `_execute(...)`
* `_as_root(...)` call `_execute(...)`
* `_execute(...)` run process `[ip netns exec] ip`

### IPWrapper(SubProcessBase)
* device(name) get device by name
* get_devices() get all devices' name by `ip -o link list` and get their device
* add_tuntap(name) run `ip tuntap add $name mode $mode` and return device by name
* add_veth(name1, name2) run `ip link add $name1 type veth peer name $name2` and return their device
* ensure_namespace(name) if not exist, netns.add(name) and lo.link.set_up()
* add_device_to_namespace(device)
* get_namespaces() run `ip netns list`

### IPDevice(SubProcessBase)
* name
* link = IpLinkCommand()
* addr = IpAddrCommand()
* route = IpRouteCommand()

### IpCommandBase(object)
### IpDeviceCommandBase(IpCommandBase)
### IpLinkCommand(IpDeviceCommandBase)
### IpAddrCommand(IpDeviceCommandBase)
### IpRouteCommand(IpDeviceCommandBase)
* pullup_route(interface_name) ensures that the route entry for the interface is before all others on the same subnet.

### IpNetnsCommand(IpCommandBase)
* add
* delete
* execute
* exists(name) use `ip netns list` and check the name

* device_exists(device_name) will use `ip link show | grep link/ether` to check any address exist

## TODO linux.iptables_firewall
## linux.iptables_manager
### IptablesRule(object)
### IptablesTable(object)
* rules, chains, unwrapped_chains
* add_chain(name) add name to chains
* ensure_remove_chain(name) -> remove_chain(name)
* remove_chain(name) remove chains and rules
* add_rule(chain, rule)
* remove_rule(chain, rule), the rule must be exactly identical to the one that was added
* empty_chain(chain) remove all rules from a chain.

### IptablesManager(object)
Wrapper for iptables

A number of chains are set up to begin with.

First, quantum-filter-top. It's added at the top of FORWARD and OUTPUT. Its name is not wrapped, so it's shared between the various nova workers. It's intended for rules that need to live at the top of the FORWARD and OUTPUT chains. It's in both the ipv4 and ipv6 set of tables.

For ipv4 and ipv6, the built-in INPUT, OUTPUT, and FORWARD filter chains are wrapped, meaning that the "real" INPUT chain has a rule that jumps to the wrapped INPUT chain, etc. Additionally, there's a wrapped chain named "local" which is jumped to from quantum-filter-top.

For ipv4, the built-in PREROUTING, OUTPUT, and POSTROUTING nat chains are wrapped in the same was as the built-in filter chains. Additionally, there's a snat chain that is applied after the POSTROUTING chain.

* apply() wrapper of `_apply()`
* `_apply()` apply the current in-memory set of iptables rules. This will blow away any rules left over from previous runs of the same component of Nova, and replace them with our current set of rules. This happens atomically, thanks to iptables-restore. this method is decorated by lockutils. it use iptables-save and iptables-restore to apply rules
* _modify_rules(...)

## linux.ovs_lib
* get_bridge_for_iface(iface) `ovs-vsctl iface-to-br $iface`
* get_bridges() `ovs-vsctl list-br`
### VifPort
### OVSBridge
* run_vsctl(args) run `ovs-vsctl`
* reset_bridge() `ovs-vsctl del-br`, `ovs-vsctl add-br`
* add_port(name) `ovs-vsctl add-port`
* delete_port(name)
* set_db_attribute(...)
* clear_db_attribute(...)
* run_ofctl(....) `ovs-ofctl`
* count_flows() `ovs-ofctl dump-flows`
* remove_all_flows()
* get_port_ofport(name)
* get_datapath_id()
* **add_flow(...)** `ovs-ofctl add-flow`
* **delete_flow(...)** `ovs-ofctl del-flows`
* **add_tunnel_port(...)** `ovs-vsctl add-port`
* **add_patch_port(...)** `ovs-vsctl add-port`
* db_get_map(...) `ovs-vsctl get`
* db_get_val(...)
* get_post_name_list() `ovs-vsctl list-ports`
* get_port_stats(name)
* get_xapi_iface_id(id)
* get_vif_ports() returns a VIF object for each VIF port
* get_vif_port_set()
* get_vif_port_by_id(id) `ovs-vsctl find interface external_ids:iface-id=$id`

## linux.utils
* execute(...) run cmd in subprocess
* get_interface_mac(interface)
* replace_file(file_name, data) replaces the contents of file_name with data in a safe manner. First write to a temp file and then rename. Since POSIX renames are atomic, the file is unlikely to be corrupted by competing writes.
We create the tempfile on the same device to ensure that it can be renamed.
