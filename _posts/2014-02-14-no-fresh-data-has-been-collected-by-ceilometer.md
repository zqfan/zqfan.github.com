---
layout: post
title: "No Fresh Data Has Been Collected By Ceilometer"
description: ""
category: "openstack"
tags: [ceilometer]
---
If you're using SLES 11 SP3 to install Ceilometer Havana with mongodb as storage backend, there may be a problem that ceilometer-collector cannot store received data. It is because ceilometer-collector couldn't connect to mongodb, restart the collector service will temporarily solve the problem, but ensure mongodb is available before ceilometer-collector start is very important at the system boot time.

ceilometer装起来后，进行了若干openstack资源操作，但是ceilometer没有相应数据，各配置项与关键进程都正常。

* 环境：sles 11 sp3
* ceilometer版本：2013.2.2

解决办法：

* 治标：重启collector服务：`service openstack-ceilometer-collector restart`
* 治本：确保mongodb服务可用后，再启动ceilometer各项服务。因为ceilometer的服务必须等mongdb可用后才可以启动，目前我还不知道怎么支持像sql或者amqp那种重连机制

注意：尽管/etc/init.d/openstack-ceilometer-collector中指明了依赖，但是不知道为什么仍然出现这种问题，莫非mongodb虽然启动但在可用前collector就进行了连接尝试结果跪了？

~~~
# Should-Start:      mysql postgresql mongodb openstack-nova-compute rabbitmq-server
# Should-Stop:       mysql postgresql mongodb openstack-nova-compute rabbitmq-server
~~~

细节：

根据经验判定可能是数据没有入库，检查collector日志发现：

~~~
ERROR ceilometer.openstack.common.rpc.amqp [req-010feed1-88b1-414a-8521-dce397bcfb6e None None] Exception during message handling
TRACE ceilometer.openstack.common.rpc.amqp Traceback (most recent call last):
TRACE ceilometer.openstack.common.rpc.amqp   File "/usr/lib64/python2.6/site-packages/ceilometer/openstack/common/rpc/amqp.py", line 461, in _process_data
TRACE ceilometer.openstack.common.rpc.amqp     **args)
TRACE ceilometer.openstack.common.rpc.amqp   File "/usr/lib64/python2.6/site-packages/ceilometer/openstack/common/rpc/dispatcher.py", line 172, in dispatch
TRACE ceilometer.openstack.common.rpc.amqp     result = getattr(proxyobj, method)(ctxt, **kwargs)
TRACE ceilometer.openstack.common.rpc.amqp   File "/usr/lib64/python2.6/site-packages/ceilometer/collector/service.py", line 210, in record_metering_data
TRACE ceilometer.openstack.common.rpc.amqp     data=data)
TRACE ceilometer.openstack.common.rpc.amqp   File "/usr/lib64/python2.6/site-packages/stevedore/extension.py", line 137, in map
TRACE ceilometer.openstack.common.rpc.amqp     raise RuntimeError('No %s extensions found' % self.namespace)
TRACE ceilometer.openstack.common.rpc.amqp RuntimeError: No ceilometer.dispatcher extensions found
~~~

而该项配置是有默认值database的，判定是数据库连接不正常导致的，由于日志已缺失（纳尼？），只好复现bug：

~~~
service mongodb stop
service openstack-ceilometer-collector restart
~~~

进程启动后并没有退出，但是出现了异常：

~~~
ERROR stevedore.extension [-] could not connect to controller:27017: [Errno 111] ECONNREFUSED
TRACE stevedore.extension Traceback (most recent call last):
TRACE stevedore.extension   File "/usr/lib64/python2.6/site-packages/stevedore/extension.py", line 89, in _load_plugins
TRACE stevedore.extension     invoke_kwds,
TRACE stevedore.extension   File "/usr/lib64/python2.6/site-packages/stevedore/named.py", line 57, in _load_one_plugin
TRACE stevedore.extension     ep, invoke_on_load, invoke_args, invoke_kwds,
TRACE stevedore.extension   File "/usr/lib64/python2.6/site-packages/stevedore/extension.py", line 103, in _load_one_plugin
TRACE stevedore.extension     obj = plugin(*invoke_args, **invoke_kwds)
TRACE stevedore.extension   File "/usr/lib64/python2.6/site-packages/ceilometer/collector/dispatcher/database.py", line 42, in __init__
TRACE stevedore.extension     self.storage_conn = storage.get_connection(conf)
TRACE stevedore.extension   File "/usr/lib64/python2.6/site-packages/ceilometer/storage/__init__.py", line 81, in get_connection
TRACE stevedore.extension     return get_engine(conf).get_connection(conf)
TRACE stevedore.extension   File "/usr/lib64/python2.6/site-packages/ceilometer/storage/impl_mongodb.py", line 77, in get_connection
TRACE stevedore.extension     return Connection(conf)
TRACE stevedore.extension   File "/usr/lib64/python2.6/site-packages/ceilometer/storage/impl_mongodb.py", line 346, in __init__
TRACE stevedore.extension     self.conn = self.CONNECTION_POOL.connect(url)
TRACE stevedore.extension   File "/usr/lib64/python2.6/site-packages/ceilometer/storage/impl_mongodb.py", line 163, in connect
TRACE stevedore.extension     safe=True)
TRACE stevedore.extension   File "/usr/lib64/python2.6/site-packages/pymongo/mongo_client.py", line 352, in __init__
TRACE stevedore.extension     raise ConnectionFailure(str(e))
TRACE stevedore.extension ConnectionFailure: could not connect to controller:27017: [Errno 111] ECONNREFUSED
TRACE stevedore.extension
WARNING ceilometer.collector.service [-] Failed to load any dispatchers for ceilometer.dispatcher
~~~

预想中的异常并没有被捕获，主动触发一个消息，`nova delete vm`删除了一个虚拟机，结果collector.log立刻捕获了预期异常，使用ceilometer命令，发现虚拟机的统计信息没有正确反映最新的变化，从而复现了问题。

根据调用栈查看代码，确认问题，经验证，问题解决。

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
