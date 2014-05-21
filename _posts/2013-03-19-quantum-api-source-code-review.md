---
layout: post
title: "Quantum API Source Code review"
description: ""
category: openstack
tags: [quantum, quantum-api, openstack, code-review]
---
{% include JB/setup %}

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

## method

* first, i checkout the api reference and api source code
* then, i follow the api init work flow
* finally, i down to the underlying to find how it process the req

## api reference

it very simple and user friendly, from [openstack.org](http://docs.openstack.org/api/openstack-network/2.0/content/API_Operations.html)

**networks**

* {GET|POST} /networks
* {GET|PUT|DELETE} /networks/{network_id}

**subnets**

* {GET|POST} /subnets
* {GET|PUT|DELETE} /subnets/{subnet_id}

**ports**

* {GET|POST} /ports
* {GET|PUT|DELETE} /ports/{port_id}

**extensions**

* resource extensions, new object classes
* attribute extensions, add new attr to res
* action extensions, new operation beyond HTTP verbs

* {GET} /extensions
* {GET} /extensions/{ext_name}

Layer-3 networking extensions introduces two new resources:

* router
* floatingip

the l3 extenstion also adds the router:external attr to network resource.

**routers**

* {GET} /routers
* {GET|PUT|DELETE} /routers/{router_id}
* {PUT} /routers/{router_id}/add_router_interface
* {PUT} /routers/{router_id}/remove_router_interface

**floatingips**

* {GET|POST} /floatingips
* {GET|PUT|DELETE} /floatingips/{floatingip_id}

**quota**

* {GET} /quotas
* {GET|PUT|DELETE} /quotas/{tenant_id}

## api source code

`api_common.py` only has a class named QuantumController(object), it receive a var plugin as construct param, and has a private method _prepare_request_body(). I think this is used as a base class.

`extension.py` has a lot of methods and class. i think the most important is ExtensionManager(object):

    class ExtensionManager
        def __init__(self,path)
        def get_resources(self)
        def get_actions(self)
        def get_request_extensions(self)
        def extend_resources(self, version, attr_map)
        def _check_extension(self, extension)
        def _load_all_extensions(self)
        def add_extension(self, ext)

so from the _check_extension() i know a extension at least has functions:

    get_name()
    get_alias()
    get_description()
    get_namespace()
    get_updated()

class ExtensionDescriptor(object) is base class for extension:

    class ExtensionDescriptor
        def get_name(self)
        def get_alias(self)
        def get_description(self)
        def get_namespace(self)
        def get_updated(self)
        def get_resources(self)
        def get_actions(self)
        def get_request_extensions(self)
        def get_extended_resources(self, version)
        def get_plugin_interface(self)

Resources define new nouns, and are accessible through URLs. Actions are verbs callable from the API. Request extensions are used to handle custom request data. Extended attributes are implemented by a core plugin similarly to the attributes defined in the core, and can appear in request and response messages.

    class ExtensionMiddleware(wsgi.Middleware)
        def __init__(self, application, ext_mgr=None)
        @classmethod
        def factory(cls, global_config, **local_config)
        def _action_ext_controllers(self, application,
            ext_mgr, mapper)
        def _request_ext_controllers(self, application,
            ext_mgr, mapper)
        @webob.dec.wsgify(RequestClass=wsgi.Request)
        def __call__(self, req)
        @staticmethod
        @webob.dec.wsgify(RequestClass=wsgi.Request)
        def _dispatch(req)

/v2/attributes.py has lots of validate* and convert* functions and also many attributes.

/v2/base.py has a class Controller(object), the global create_resource() function will return a Resource() using controller object

    class Controller
        def __init__(...)
        def __getattr__(self, name)
        def index(self, request, **kwargs)
        def show(self, request, id, **kwargs)
        def create(self, request, body=None, **kwargs)
        def delete(self, request, id, **kwargs)
        def update(self, request, id, body=None, **kwargs)
        def prepare_request_body(...)

__init__() define an attribute named _plugin_handlers, which has (LIST,SHOW,CREATE,UPDATE,DELETE) action. __getattr__() only accept self._member_actions and return a inner function handler. create(), delete() and update() will invoke notifier_api.notify() and use policy

/v2/resource.py defines a function Resource(), it returns an inner function decorated by webob.dec.wsgify. the inner function named resource() gets "action" from `req.environ["wsgiorg.routing_args"]` then invokes controller.action

/v2/router.py defines RESOURCES, including networks, subnets, ports. Also defines COLLECTION_ACTIONS and MEMBER_ACTIONS

    class Index(wsgi.Application):
        def __init__(self, resources)
        @webob.dec.wsgify(RequestClass=wsgi.Request)
        def __call__(self, req)

the __call__() will return resources items

    class APIRouter(wsgi.Router):
        @classmethod
        def factory(cls, global_config, **local_config)
        def __init__(self, **local_config)

the APIRouter connect("index","/",controller=Index(RESOURCES)), and collection() each RESOURCES. controller is created by quantum.api.v2.base.create_resource().

## the api init workflow

quantum includes 4 parts:

* plugin-agent
* l3-agent
* dhcp-agent
* server

quantun-server just launches quantum.server.main(), which server_wsgi() the quantum.service.QuantumApiService. so this is the entry i'm just looking for. QuantumApiService is a wsgi service, in the start() method, it

    app = config.load_paste_app(app_name)
    server = wsgi.Server("Quantum")
    server.start(app, cfg.CONF.bind_port, cfg.CONF.bind_host)

PS: i notice that the quantum.service.py also contains a rpc service named Service.

    class Service(service.Service):
        def __init__(...)
        def start(self)
        def __getattr__(self, key)
        @classmethod
        def create(...)
        def kill(self)
        def stop(self)
        def wait(self)
        def periodic_tasks(self, raise_on_error=False)
        def report_state(self)

currently, i don't know where this class is instanced.

quantum.common.config.load_paste_app(): Builds and returns a WSGI app from a paste config file.

    app = deploy.loadapp("config:%s" % config_path, name=app_name)

from the /etc/quantum/api-paste.ini

    [app:quantumversions]
    paste.app_factory = quantum.api.versions:Versions.factory

    [app:quantumapiapp_v2_0]
    paste.app_factory = quantum.api.v2.router:APIRouter.factory

## from api to underlying

image that if we want to create a network, so a post request to /networks is received. what happen's next ?

from the APIRouter.__init__(), the post request is mapped to quantum.api.v2.base.Controller(collection="networks").create(),

    action = self._plugin_handlers[self.CREATE]
    obj_creator = getattr(self._plugin, action)
    obj = obj_creator(request.context, **kwargs)
    return notify({self._resource: self._view(obj)})

so it just invoke plugin's method, which defines in the __init__() function, particularly, it's create_network. i.e. i use openvswitch, so i dive into quantum.plugins.openvswitch.ovs_quantum_plugin.py. the class OVSQuantumPluginV2 is what i need, and it truly has a method create_networks(self, context, network). **BUT**, it's inherit from 4 class, so it's just like a monster to me.

so for other resources like subnets and ports, it all act like this way. however, resources created by extension's have no callback routines in OVSQuantumPluginV2, this is what i will dig next para.

## the extensions

if i want to create a router, i will post /routers, then what will happen?

from /etc/quantum/api-paste.ini i know that:

    [filter:extensions]
    paste.filter_factory = quantum.api.extensions:plugin_aware_extension_middleware_factory

from quantum.api.extensions.plugin_aware_extension_middleware_factory i know that:

    ext_mgr = PluginAwareExtensionManager.get_instance()
    return ExtensionMiddleware(app, ext_mgr=ext_mgr)

the PluginAwareExtensionManager is inherit from ExtensionManager, the get_instance() is a classmethod, using singleton pattern, which will invoke global method get_extension_path to get path and init his father's instance. so the extensions in cfg.CONF.api_extensions_path and quantum.extensions.__path__ will automatically loaded by ExtensionManager.

<del>but i can't find the router extension and floatingip extension,</del>
router is an alias of l3 externsion, however, quotasv2.py exists. so let post /quotas. the ext_name is generaged by mod_name, so the quotas extension is located in quotasv2.Quotasv2

    class Quotasv2(extensions.ExtensionDescriptor):
        def get_name(cls)
        def get_alias(cls)
        def get_description(cls)
        def get_namespace(cls)
        def get_updated(cls)
        def get_resources(cls)
        def get_extended_resources(self, version)

this extension will be checked by ExtensionManager._check_extension,

    def get_resources(cls):
        """ Returns Ext Resources """
        controller = resource.Resource(
            QuotaSetsController(QuantumManager.get_plugin()),
            faults=base.FAULT_MAP)
        return [extensions.ResourceExtension(
            Quotasv2.get_alias(),
            controller,
            collection_actions={'tenant': 'GET'})]

the class QuotaSetsController(wsgi.Controller) is the actual executor of req,

    class QuotaSetsController:
        def __init__(self, plugin)
        def create(self, request, body=None)
        def index(self, request)
        def tenant(self, request)
        def show(self, request, id)
        def delete(self, request, id)
        def update(self, request, id, body=None)

so we must find the mapper.resource, the ExtensionMiddleware.__init__() will get_resources() from ext_mgr, which will get_resources from each extension. the ExtensionMiddleware will invoke mapper.resource() for each resource and for each resource's collection_actions, it will invoke mapper.submapper() to connect /resource.collection/action.

as the extended attr for quota resource disable post, so the DELETE /quotas/{quota_id} will work.

the quantum.api.v2.router.APIRouter will invoke ext_mgr.extend_resources() and update quantum.api.v2.attributes.RESOURCE_ATTRIBUTE_MAP, it will get_extended_resources() from extension and update or create `attr_map[resource]`. But the APIRouter only register resource in global dict RESOURCES and SUB_RESOURCES. I think the ExtensionMiddleware act like APIRouter, because it has similar method and behavior like APIRouter's father quantum.wsgi.Router. they both:

    self._routes = routes.middleware.RoutesMiddleware(self._dispatch, mapper)
    @webob.dec.wsgify
    def __call__()
    @staticmethod
    @webob.dec.wsgify
    def _dispatch(req)

Although his father quantum.wsgi.Middleware doesn't support router feature. Here comes another question: where this app is served? The anwser is hidden in api-paste.ini

    [composite:quantum]
    use = egg:Paste#urlmap
    /: quantumversions
    /v2.0: quantumapi_v2_0

    [composite:quantumapi_v2_0]
    use = call:quantum.auth:pipeline_factory
    noauth = extensions quantumapiapp_v2_0
    keystone = authtoken keystonecontext extensions quantumapiapp_v2_0

    [filter:keystonecontext]
    paste.filter_factory = quantum.auth:QuantumKeystoneContext.factory

    [filter:authtoken]
    paste.filter_factory = keystoneclient.middleware.auth_token:filter_factory

    [filter:extensions]
    paste.filter_factory = quantum.api.extensions:plugin_aware_extension_middleware_factory

    [app:quantumversions]
    paste.app_factory = quantum.api.versions:Versions.factory

    [app:quantumapiapp_v2_0]
    paste.app_factory = quantum.api.v2.router:APIRouter.factory

Note that the `[composite:quantumapi_v2_0]` section, the extensions filter always ahead of quantumapiapp_v2_0, so every req will be handled from extensions to apirouter. The __call__ in ExtensionMiddleware:

    @webob.dec.wsgify(RequestClass=wsgi.Request)
    def __call__(self, req):
        req.environ['extended.app'] = self.application
        return self._router

and the \_dispatch:

    @staticmethod
    @webob.dec.wsgify(RequestClass=wsgi.Request)
    def _dispatch(req):
        match = req.environ['wsgiorg.routing_args'][1]
        if not match:
            return req.environ['extended.app']
        app = match['controller']
        return app

so if the req is a extension request, then extension controller is returned, else the APIRouter does. Where does the "wsgiorg.routing_args" come from? Remeber the self._router is an instance of routes.middleware.RoutesMiddleware, that is a wsgi app which will set the `req.environ["wsgiorg.routing_args"]` with the ((url), match), and match comes from mapper.routematch(environ). So if the match is not None, then it definitly is a request for the extension since we use the mapper to initialize the RoutesMiddleware.

There is still a question: the extension app will directly return response, while the APIRouter will just return a wsgi app named dispatch, which need one more step to handle.

## conclusion

* we start a wsgi app APIRouter
* APIRouter is taken over by ExtensionMiddleware
* core api is completed by plugin
