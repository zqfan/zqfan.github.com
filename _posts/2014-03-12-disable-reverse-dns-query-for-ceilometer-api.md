---
layout: post
title: "Disable Reverse DNS Query For Ceilometer API"
description: ""
category: "openstack"
tags: [openstack, ceilometer, wsgiref]
---
The ceilometer-api serves its application via wsgiref.simple_server module, which depends on BaseHTTPServer, which will do a reverse DNS query when log message. In some network environment, it will cause around 10 seconds useless latency. Patch BaseHTTPServer.BaseHTTPRequestHandler.address_string will solve this issue.

My workmate complains that it always consume 10 extra seconds to get http response when test ceilometer havana rest api, I check my test environment and find that it is affected too. But nova, neutron and other openstack service is ok. so I think it may be the wsgiref problem, since this is the significant difference for ceilometer-api.

so i write a demo wsgi app to locate the problem:

{% highlight python linenos=table %}
import wsgiref.simple_server as ss

server = ss.make_server('0.0.0.0', 60000, ss.demo_app)
server.serve_forever()
{% endhighlight %}

it works fine in public network enviroment and my notebook, but has same 10 seconds latency in the LAN environment of company, so i think it may be the dns problem. after some search on google, i find that BaseHTTPServer.BaseHTTPRequestHandler.address_string will do a reverse dns query when log message, so i hacked it with ip address, then the 10 seconds latency no longer exists.

{% highlight python linenos=table %}
import wsgiref.simple_server as ss

bhs = __import__('BaseHTTPServer')
bhs.BaseHTTPRequestHandler.address_string = lambda x: x.client_address[0]
server = ss.make_server('0.0.0.0', 60000, ss.demo_app)
server.serve_forever()
{% endhighlight %}

for ceilometer, you need to patch it before make_server as well, for i.e., insert the following lines in Line 115 of /usr/lib64/python2.6/site-packages/ceilometer/api/app.py:

{% highlight python linenos=table %}
bhs = __import__('BaseHTTPServer')
bhs.BaseHTTPRequestHandler.address_string = lambda x: x.client_address[0]
{% endhighlight %}

then restart the ceilometer-api service, done.

But the ceilometer-drive (core developers) doesn't accept monkypatch module, see [https://review.openstack.org/#/c/79876/](https://review.openstack.org/#/c/79876/), so we need to use a special param in wsgiref.simple_server.make_server, which is `handler_class`. We can create a class inherits from wsgiref.simple_server.WSGIRequestHandler, and override its log_message or client_address method, thanks for the duck type of Python. The final solution for now is:

{% highlight python linenos=table %}
class CeiloWSGIRequestHandler(simple_server.WSGIRequestHandler):
    def address_string(self):
        return self.client_address[0]

srv = simple_server.make_server(host, port, root,
                                handler_class=CeiloWSGIRequestHandler)
{% endhighlight %}

materials:

* [wsgiref should not be used in production enviroment and it doesn't support muti-thread](https://mail.python.org/pipermail/web-sig/2008-July/003518.html)
* [wsgiref.simple_server will do reserve dns query](https://mail.python.org/pipermail/web-sig/2008-July/003519.html)
* [disable reverse dns lookup](http://blog.est.im/post/34288214582)

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
