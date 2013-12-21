---
layout: post
title: "Quantum Router Gateway"
description: ""
category: openstack
tags: [openstack, quantum, router, external network, gateway]
---
{% include JB/setup %}

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

# Details
* rest api doesn't have router-gateway-{set,clear}
* python-quantumclient.quantum.v2_0.router.SetGatewayRouter does the cli api
* quantum_client.add_gateway_router does the actual job
* quantum_client is app.client_manager.quantum
* client_manager is quantumclient.common.clientmanager.ClientManager, it stores token, tenant_id and etc
* quantum is an instance of ClientCache
* quantum is quantumclient.v2_0.client.Client
* add_gateway_router calls self.put(url,body), url holds router id while body holds external_gateway_info including network_id
* put calls self.retry_request('PUT', action, body)
* retry_request calls self.do_request('PUT', action, body)
* do_request will put the action with body to call self.httpclient.do_request
* action = '/v2.0' + '/routers/%(router_id)s' + '.json'
* so the quantum has a rest api /v2.0/routers/%(router_id)s.json and accept body={"router":{"external_gateway_info":{"network_id": ext_net_id, "enable_snat": false}}}

## external_gateway_added vs. internal_network_added
* in agent.l3_agent
* external_gateway_added(self, ri, ex_gw_port, interface_name, internal_cidrs)
* internal_network_added(self, ri, network_id, port_id, internal_cidr, mac_address)

external_gateway_added
1. force device exists, self.driver.plug
1. self.driver.init_l3
1. _send_gratutious_arp_packets
1. **ip netns qrouter-xxx route add default gw gw_ip**

internal_network_added
1. force device exists, self.driver.plug
1. self.driver.init_l3
1. _send_gratutious_arp_packets

* internal_network_nat_rules: `snat -s $internal_cidr -j SNAT --to-source $ex_gw_ip`
* external_gateway_nat_rules: `POSTROUTING ! -i $interface_name ! -o $interface_name -m conntrack ! --ctstate DNAT -j ACCEPT`, include internal_network_nat_rules

routers_updated mainly invoke \_process_routers which just remove routers no longer exist

## `__router_added(router_id, router)`
* add router info to cache: self.router\_info
* create namespace if needed
* handle metadata filter and nat rules
* ri.iptables_manager.apply()
* handle metadata proxy if needed
