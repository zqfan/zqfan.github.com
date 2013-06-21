---
layout: post
title: "Openstack Quantum Server"
description: ""
category: openstack
tags: [openstack, quantum, quantum-server, python]
---
{% include JB/setup %}
# License
this file is published under [(CC) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

# quantum.service
* serve_wsgi(cls) -> cls.create().start()
* _run_wsgi(app_name) create wsgi.Server named Quantum and start it then dump all option valud

## WsgiService(object)
* start()
* wait()

## QuantumApiService(WsgiService)
* create(cls)

## Service(service.Service)
Service object for binaries running on hosts.

A service takes a manager and enables rpc by listening to queues based on topic. It also periodically runs tasks on the manager.
* start() manager.init_host() then start() itself, if any interval task is needed, start it via loopingcall.FixedIntervalLoopingCall() then append it to timers
* create(...) instantiates class and passes back application object.
* kill() -> stop()
* stop(): stop parent and stop all timers
* wait(): wait parent and wait all timers
* periodic_tasks(): manager.periodic_tasks(...)
