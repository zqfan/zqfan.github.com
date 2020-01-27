---
layout: post
title: "Enable Swift Meter On SUSE"
description: ""
category: "openstack"
tags: [openstack, swift, ceilometer, suse]
---
The official guide which named openstack-manuals has poor content for ceilometer installation, see [http://docs.openstack.org/havana/install-guide/install/zypper/content/ceilometer-install-swift.html](http://docs.openstack.org/havana/install-guide/install/zypper/content/ceilometer-install-swift.html), here I record my experience of enabling monitor swift meter on sles 11 sp3 for openstack havana.

All commands and operations are done by root.

## official guide

### enable ceilometer access swift service

~~~ bash
# roleid=$(keystone role-create --name=ResellerAdmin | awk '/ id / {print $4}')
# keystone user-role-add --tenant service --user ceilometer --role $roleid
~~~

### monitor incoing and outgoing traffic

Add these lines to the /etc/swift/proxy-server.conf file:

~~~
[filter:ceilometer]
use = egg:ceilometer#swift
~~~

### add ceilometer pipeline

Add ceilometer to the pipeline parameter of the /etc/swift/proxy-server.conf file:

~~~
[pipeline:main]
pipeline = healthcheck cache authtoken keystoneauth ceilometer proxy-server
~~~

note that the real pipeline may be different with this, you can keep that, and just add ceilometer filter right before proxy-server.

then you should restart swift-proxy service by run `service openstack-swift-proxy restart`, but there are some problems to be fixed before things can work

## trouble-shoot

### correct the system user name

~~~
# service openstack-swift-proxy restart
Shutting down swift-proxy-server
Starting swift-proxy-serverTraceback (most recent call last):
  File "/usr/bin/swift-proxy-server", line 22, in <module>
    run_wsgi(conf_file, 'proxy-server', default_port=8080, **options)
  File "/usr/lib64/python2.6/site-packages/swift/common/wsgi.py", line 253, in run_wsgi
    drop_privileges(conf.get('user', 'swift'))
  File "/usr/lib64/python2.6/site-packages/swift/common/utils.py", line 1021, in drop_privileges
    os.setgid(user[3])
OSError: [Errno 1] Operation not permitted
startproc:  exit status of parent of /usr/bin/swift-proxy-server: 1
~~~

The user which is running the service is hardcode as 'openstack-swift' in /etc/init.d/openstack-swift-proxy, but there may be no such user exists, only get user swift. this is caused by wrong configuration when install openstack environment. run

~~~bash
sed -i 's/CHUSER="-u openstack-swift"/CHUSER="-u swift"' /etc/init.d/openstack-swift-proxy
~~~

can solve this problem

### swift try to load ceilometer config file

~~~bash
# service openstack-swift-proxy restart
Shutting down swift-proxy-server
Starting swift-proxy-serverTraceback (most recent call last):
  File "/usr/bin/swift-proxy-server", line 22, in <module>
    run_wsgi(conf_file, 'proxy-server', default_port=8080, **options)
  File "/usr/lib64/python2.6/site-packages/swift/common/wsgi.py", line 256, in run_wsgi
    loadapp(conf_path, global_conf={'log_name': log_name})
  File "/usr/lib64/python2.6/site-packages/swift/common/wsgi.py", line 107, in wrapper
    return f(conf_uri, *args, **kwargs)
  File "/usr/lib64/python2.6/site-packages/paste/deploy/loadwsgi.py", line 247, in loadapp
    return loadobj(APP, uri, name=name, **kw)
  File "/usr/lib64/python2.6/site-packages/paste/deploy/loadwsgi.py", line 272, in loadobj
    return context.create()
  File "/usr/lib64/python2.6/site-packages/paste/deploy/loadwsgi.py", line 710, in create
    return self.object_type.invoke(self)
  File "/usr/lib64/python2.6/site-packages/paste/deploy/loadwsgi.py", line 207, in invoke
    app = filter(app)
  File "/usr/lib64/python2.6/site-packages/ceilometer/objectstore/swift_middleware.py", line 185, in ceilometer_filter
    return CeilometerMiddleware(app, conf)
  File "/usr/lib64/python2.6/site-packages/ceilometer/objectstore/swift_middleware.py", line 78, in __init__
    service.prepare_service([])
  File "/usr/lib64/python2.6/site-packages/ceilometer/service.py", line 94, in prepare_service
    cfg.CONF(argv[1:], project='ceilometer')
  File "/usr/lib64/python2.6/site-packages/oslo/config/cfg.py", line 1634, in __call__
    raise ConfigFilesNotFoundError(self._namespace.files_not_found)
oslo.config.cfg.ConfigFilesNotFoundError: Failed to read some config files: /etc/ceilometer/ceilometer.conf
startproc:  exit status of parent of /usr/bin/swift-proxy-server: 1
~~~

the pipleline has defined the ceilometer filter, and it will read the ceilometer configuration file, however, the swift-proxy service is run by user swift now, and the privilege of /etc/ceilometer/ceilometer.conf is:

~~~bash
# ls -l /etc | grep ceilometer
drwxr-xr-x  2 root  root                  4096 Mar 11 01:00 ceilometer
# ls -l /etc/ceilometer/ceilometer.conf
-rw-r----- 1 root openstack-ceilometer 700 Mar 11 01:00 /etc/ceilometer/ceilometer.conf
~~~

so we need to add user swift to openstack-ceilometer group:

~~~bash
# usermod -A openstack-ceilometer swift
~~~

### swift try to write log file to ceilometer directory

~~~bash
# service openstack-swift-proxy restart
Shutting down swift-proxy-server
Starting swift-proxy-serverTraceback (most recent call last):
  File "/usr/bin/swift-proxy-server", line 22, in <module>
    run_wsgi(conf_file, 'proxy-server', default_port=8080, **options)
  File "/usr/lib64/python2.6/site-packages/swift/common/wsgi.py", line 256, in run_wsgi
    loadapp(conf_path, global_conf={'log_name': log_name})
  File "/usr/lib64/python2.6/site-packages/swift/common/wsgi.py", line 107, in wrapper
    return f(conf_uri, *args, **kwargs)
  File "/usr/lib64/python2.6/site-packages/paste/deploy/loadwsgi.py", line 247, in loadapp
    return loadobj(APP, uri, name=name, **kw)
  File "/usr/lib64/python2.6/site-packages/paste/deploy/loadwsgi.py", line 272, in loadobj
    return context.create()
  File "/usr/lib64/python2.6/site-packages/paste/deploy/loadwsgi.py", line 710, in create
    return self.object_type.invoke(self)
  File "/usr/lib64/python2.6/site-packages/paste/deploy/loadwsgi.py", line 207, in invoke
    app = filter(app)
  File "/usr/lib64/python2.6/site-packages/ceilometer/objectstore/swift_middleware.py", line 185, in ceilometer_filter
    return CeilometerMiddleware(app, conf)
  File "/usr/lib64/python2.6/site-packages/ceilometer/objectstore/swift_middleware.py", line 78, in __init__
    service.prepare_service([])
  File "/usr/lib64/python2.6/site-packages/ceilometer/service.py", line 95, in prepare_service
    log.setup('ceilometer')
  File "/usr/lib64/python2.6/site-packages/ceilometer/openstack/common/log.py", line 359, in setup
    _setup_logging_from_conf()
  File "/usr/lib64/python2.6/site-packages/ceilometer/openstack/common/log.py", line 406, in _setup_logging_from_conf
    filelog = logging.handlers.WatchedFileHandler(logpath)
  File "/usr/lib64/python2.6/logging/handlers.py", line 377, in __init__
    logging.FileHandler.__init__(self, filename, mode, encoding, delay)
  File "/usr/lib64/python2.6/logging/__init__.py", line 827, in __init__
    StreamHandler.__init__(self, self._open())
  File "/usr/lib64/python2.6/logging/__init__.py", line 846, in _open
    stream = open(self.baseFilename, self.mode)
IOError: [Errno 13] Permission denied: '/var/log/ceilometer/swift-proxy-server.log'
startproc:  exit status of parent of /usr/bin/swift-proxy-server: 1
~~~

I think maybe it can be solved by setting corresponding configuration option in /etc/swift/proxy-server.conf, but here i just enable the write operation, this should be fixed as long as i figure out the particular option, may be logdir?

~~~bash
# touch /var/log/ceilometer/swift-proxy-server.log
# chown openstack-ceilometer:openstack-ceilometer /var/log/ceilometer/swift-proxy-server.log
# chmod g+w /var/log/ceilometer/swift-proxy-server.log
~~~

### swift expects memcached listening on real ip

open the /var/log/ceilometer/swift-proxy-server.log, I can only find lots of the following error:

~~~
ERROR root [-] Error connecting to memcached: 172.30.250.118:11211
TRACE root Traceback (most recent call last):
TRACE root   File "/usr/lib64/python2.6/site-packages/swift/common/memcached.py", line 242, in _get_conns
TRACE root     fp, sock = self._client_cache[server].get()
TRACE root   File "/usr/lib64/python2.6/site-packages/swift/common/memcached.py", line 132, in get
TRACE root     fp, sock = self._parent_class_getter() 
TRACE root   File "/usr/lib64/python2.6/site-packages/eventlet/pools.py", line 119, in get
TRACE root     created = self.create()
TRACE root   File "/usr/lib64/python2.6/site-packages/swift/common/memcached.py", line 128, in create
TRACE root     sock.connect((host, int(port)))
TRACE root   File "/usr/lib64/python2.6/site-packages/eventlet/greenio.py", line 192, in connect
TRACE root     socket_checkerr(fd)
TRACE root   File "/usr/lib64/python2.6/site-packages/eventlet/greenio.py", line 46, in socket_checkerr
TRACE root     raise socket.error(err, errno.errorcode[err])
TRACE root error: [Errno 111] ECONNREFUSED
~~~

This is caused by memcache is listening on 127.0.0.1 instead of real ip address:

~~~
# ps aux | grep memcache
114  7488  0.0  0.0  126652  888  ?  Ssl  23:46  0:00 /usr/sbin/memcached -d -l 127.0.0.1
~~~

you need to modify the /etc/sysconfig/memcached to set memcached listen port by set MEMCACHED_PARAMS="-l 172.30.250.118" in /etc/sysconfig/memcached, or you can modify /etc/swift/proxy-server.conf to set the memcached_servers option to: memcache_servers = 127.0.0.1:11211, then restart the relative service

### swift requires service tenant for ceilometer request

open the /var/log/ceilometer/agent-central.log, it complains:

~~~
INFO ceilometer.central.manager [-] Polling pollster storage.objects.size
WARNING ceilometer.central.manager [-] Continue after error from storage.objects.size: Account HEAD failed: http://172.30.250.118:8080/v1/AUTH_57c96cf14e704845978e505d60166fb7 403 Forbidden
ERROR ceilometer.central.manager [-] Account HEAD failed: http://172.30.250.118:8080/v1/AUTH_57c96cf14e704845978e505d60166fb7 403 Forbidden
TRACE ceilometer.central.manager Traceback (most recent call last):
TRACE ceilometer.central.manager   File "/usr/lib64/python2.6/site-packages/ceilometer/central/manager.py", line 46, in poll_and_publish
TRACE ceilometer.central.manager     cache,
TRACE ceilometer.central.manager   File "/usr/lib64/python2.6/site-packages/ceilometer/objectstore/swift.py", line 105, in get_samples
TRACE ceilometer.central.manager     for tenant, account in self._iter_accounts(manager.keystone, cache):
TRACE ceilometer.central.manager   File "/usr/lib64/python2.6/site-packages/ceilometer/objectstore/swift.py", line 58, in _iter_accounts
TRACE ceilometer.central.manager     cache))
TRACE ceilometer.central.manager   File "/usr/lib64/python2.6/site-packages/ceilometer/objectstore/swift.py", line 72, in _get_account_info 
TRACE ceilometer.central.manager     ksclient.auth_token))
TRACE ceilometer.central.manager   File "/usr/lib64/python2.6/site-packages/swiftclient/client.py", line 426, in head_account
TRACE ceilometer.central.manager     http_response_content=body)
TRACE ceilometer.central.manager ClientException: Account HEAD failed: http://172.30.250.118:8080/v1/AUTH_57c96cf14e704845978e505d60166fb7 403 Forbidden
TRACE ceilometer.central.manager
~~~

This is because the /etc/ceilometer/ceilometer.conf:service_credentials has set {os_username: admin, os_tenant_name: admin} instead of {os_username: ceilometer, os_tenant_name: service}, correct them and restart the ceilometer-agent-central service.

### swift requires admin role for ceilometer request

open the /var/log/ceilometer/agent-central.log, it complains:

~~~
WARNING ceilometer.central.manager [-] Continue after error from storage.objects: You are not authorized to perform the requested action, admin_required. (HTTP 403)
ERROR ceilometer.central.manager [-] You are not authorized to perform the requested action, admin_required. (HTTP 403)
TRACE ceilometer.central.manager Traceback (most recent call last):
TRACE ceilometer.central.manager   File "/usr/lib64/python2.6/site-packages/ceilometer/central/manager.py", line 46, in poll_and_publish
TRACE ceilometer.central.manager     cache,
TRACE ceilometer.central.manager   File "/usr/lib64/python2.6/site-packages/ceilometer/objectstore/swift.py", line 86, in get_samples
TRACE ceilometer.central.manager     for tenant, account in self._iter_accounts(manager.keystone, cache):
TRACE ceilometer.central.manager   File "/usr/lib64/python2.6/site-packages/ceilometer/objectstore/swift.py", line 55, in _iter_accounts
TRACE ceilometer.central.manager     cache[self.CACHE_KEY_TENANT] = ksclient.tenants.list()
TRACE ceilometer.central.manager   File "/usr/lib64/python2.6/site-packages/keystoneclient/v2_0/tenants.py", line 119, in list
TRACE ceilometer.central.manager     tenant_list = self._list("/tenants%s" % query, "tenants")
TRACE ceilometer.central.manager   File "/usr/lib64/python2.6/site-packages/keystoneclient/base.py", line 110, in _list
TRACE ceilometer.central.manager     resp, body = self.client.get(url)
TRACE ceilometer.central.manager   File "/usr/lib64/python2.6/site-packages/keystoneclient/httpclient.py", line 655, in get
TRACE ceilometer.central.manager     return self._cs_request(url, 'GET', **kwargs)
TRACE ceilometer.central.manager   File "/usr/lib64/python2.6/site-packages/keystoneclient/httpclient.py", line 651, in _cs_request
TRACE ceilometer.central.manager     **kwargs)
TRACE ceilometer.central.manager   File "/usr/lib64/python2.6/site-packages/keystoneclient/httpclient.py", line 610, in request
TRACE ceilometer.central.manager     **request_kwargs)
TRACE ceilometer.central.manager   File "/usr/lib64/python2.6/site-packages/keystoneclient/httpclient.py", line 124, in request
TRACE ceilometer.central.manager     raise exceptions.from_response(resp, method, url)
TRACE ceilometer.central.manager Forbidden: You are not authorized to perform the requested action, admin_required. (HTTP 403)
TRACE ceilometer.central.manager
~~~

It seems the swift query operation needs admin role, I don't know why, but this fix can solve it:

~~~
# keystone user-role-add --user ceilometer --tenant service --role admin
# service openstack-ceilometer-agent-central restart
~~~

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
