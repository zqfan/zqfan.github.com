---
layout: post
title: "Quantum Task Flow"
description: ""
category: openstack
tags: [quantum, nova]
---
{% include JB/setup %}
## License
this file is published under [CC BY-NC-SA]
(http://creativecommons.org/licenses/by-nc-sa/3.0/)

1. tenant creates a network
1. tenant associates a subnet with a network
1. tenant boots a instance and specifies a nic connects to a network
1. nova contact quantum and create a port on that network
1. quantum assigns an ip address to that port
1. tenant deletes the instance
1. nova contact quantum and delete the port

# quantum net-create
## quantumclient
1. shell.QuantumShell().run(argv)
1. quantum.v2_0.network.CreateNetwork
1. CreateNetwork.run(args), get_data() need client_manager.quantum # cliff
1. common.clientmanager.ClientManager.quantum it a callable point to make_client
1. quantum.client.make_client(ClinetManager()) generate quantum_client
1. v2_0.client.Client.create_network(body) -> post(networks_path, body)

## quantum.api
1. serve_wsgi(QuantumApiService)
1. QuantumApiService.create().start()
1. app = load_paste_app('quantum')
1. wsgi.Server("Quantum").start(app, port, host) use eventlet.GreenPool to spawn thread
1. since network is standard api, the post(networks_path, body) will be processed by quantum.api.v2.router:APIRouter.factory, the controller is api.v2.base.Controller
1. openstack.common.notifier.api.notify(...'network','network.net.create.start',...body)
1. plugin.create_network(ctxt,body...)
1. plugin is specified in quantum.conf option core_plugin = quantum.plugins.openvswitch.ovs_quantum_plugin.OVSQuantumPluginV2
1. openstack.common.notifier.api.notify(...'network','network.net.create.end',...ret)

## OVSQuantumPluginV2
1. _ensure_default_security_group(...)
1. super().create_network(context, network)
1. db.db_base_plugin_v2.QuantumDbPluginV2.create_network() init network info in context # TODO: context seems to be database session
1. ovs_db_v2.add_network_binding(...)
1. _process_l3_create(context, network, net)
1. _extend_network_dict_provider(...), _extend_network_dict_l3(...)

# quantum subnet-create
subnet is a standard resource, so the task flow is same. But OVSQuantumPluginV2 has no such method create_subnet(...), so the parent db.db_base_plugin_v2.QuantumDbPluginV2.create_subnet(...) does the job.

# quantum router-create
The router is an extension, so extensions.l3 will handle the request, in fact, it plugin is just the core_plugin. QuantumDbPluginV2 -> db.l3_gwmode_db.L3_NAT_db_mixin -> db.l3_db.L3_NAT_db_mixin does the job and just update db

# quantum router-interface-add
## quantumclient
also the L3_NAT_db_mixin does the job, since port_id is not specified, it will check subnet duplicate and create_port(...), then it will sync router data and l3_rpc_agent_api.L3AgentNotify.routers_updated(...'add_router_interface'...) and notifier `router.interface.create` to all `network` consumers

## quantum.api
it will send a `routers_updated` notification with method `add_router_interface` to all agents manager this router, but the rpc.cast will drop the parameter `data` and `operation` which is add_router_interface, so this rpc.cast will lose port info

## quantum.agent.l3_agent
1. routers_updated(...) will update specific routers with sync_sem
1. _process_routers(routers) does the real job, for each router in routers, if router satisfy some conditions, it will be processed by process_router(ri), other routers will be removed
1. process_router(ri) will remove old unused ports, for new ports, it will _set_subnet_info(p) and internal_network_added(...). if external gateway port is added to router, external_gateway_added(...) , perform_snat_action(...) and process_router_floating_ips(...), else if ex_gw_port is removed, external_gateway_removed(...). finally it update router's route table via routes_updated(ri)

# quantum router-gateway-set
## quantumclient
1. put /routers/id

## quantum.api
1. db.l3_db.L3_NAT_db_mixin.update_router(id, router)
1. _update_router_gw_info(id, gw_info)
1. _create_router_gw_port(router, net_id)
1. send l3 agent notify router_updateded(...)

## quantum.agent.l3_agent
1. routers_updated(...), same as router-interface-add
