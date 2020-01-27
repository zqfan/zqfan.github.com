---
layout: post
title: "Things You Must Done Before Run TOX in OpenStack"
description: ""
category: "openstack"
tags: [unit test, tox]
---
All OpenStack projects require unit test, almost all of them use tox to run unit test code. It is very convenient to run whole suite of unit test by one single command: `tox`, configuration and option details are already done for you. But perfect is just a day dream, you still need to do something when you just setup a fresh environment. This post aims at providing pre-condition of tox for some openstack project on Ubuntu 12.04 (precise).

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

# common
To run tox, you need to install tox first:

{% highlight bash linenos=table %}
sudo apt-get install python-pip
sudo pip install tox
{% endhighlight %}

Before run test suite, tox need to install required python package. they are defined in requirements.txt, and test-requirements.txt which only needed when run test. pip will install them automatically one by one, so their order makes sense. But pip cannot deal with dependency of non python packages, so there are potential unmet dependency.

NOTE: I do the following project tox one by one, so it is possible a later project's dependency is already met in previous one. It is simple just search the error message in this post, and **PLEASE COMMENT** on this post so I can update it.

# Ceilometer
For now, Dec 24, 2013, ceilometer requires MySQL-python, xattr, lxml, and mongodb, here is a list of unmet dependency:

* MySQL-python: libmysqlclient-dev
* xattr: python-dev libffi-dev
* lxml: libxml2-dev libxslt-dev
* pymongo: mongodb
* psycopg2: libpq-dev

here is possible message of stderr:

    sh: 1: mysql_config: not found
    EnvironmentError: mysql_config not found

    c/_cffi_backend.c:2:20: fatal error: Python.h: No such file or directory
    c/_cffi_backend.c:14:17: fatal error: ffi.h: No such file or directory

    ERROR: /bin/sh: 1: xslt-config: not found
    fatal error: libxml/xmlversion.h: No such file or directory

    WARNING:test command found but not installed in testenv
      cmd: /bin/bash
      env: /home/zqfan/openstack/ceilometer/.tox/py27
    Maybe forgot to specify a dependency?
    Could not find mongod command

**Solution**:

{% highlight bash linenos=table %}
sudo apt-get install libmysqlclient-dev python-dev libffi-dev libxml2-dev \
                     libxslt-dev mongodb libpq-dev
{% endhighlight %}

In my environment, mysql-server is already installed, so if you've not done this in operating system installation, you should better do

{% highlight bash linenos=table %}
sudo apt-get install mysql-server
{% endhighlight %}

### NOTE

On SLES 11, I have observed that local test always fail because "AutoReconnect: connection closed" or "AutoReconnect: [Errno 111] ECONNREFUSED". If you can get some MongoDB message, you will see:

~~~
# Fatal error in v8::Context::New()
# V8 is no longer usable
~~~

This is because SLES set virtual memory to 6475920 kbytes by default, so MongoDB thread will be killed after run too many unit test cases. You can check ulimit by run `ulimit -a`, if the virtual memory is set to a low level, run `ulimit -v unlimited`, then it will work fine.

# Glance
Dependency

* psycopg2: libpq-dev

Error message:

* Error: pg_config executable not found

Solution:
{% highlight bash linenos=table %}
sudo apt-get install libpq-dev
{% endhighlight %}

# Docs

When you want to generate document, you may run `tox -e docs --develop`, but sphinxcontrib has lots of sphinxcontrib-docbookrestapi extensions, some may requires binary packages in your operating system. Here is the list:

* libtidy

You may get the error message if you don't have all these packages:

~~~
Initializing sphinxcontrib.pecanwsme.rest
error: None
ERROR: InvocationError: '/home/sam/workspace/openstack/ceilometer/.tox/docs/bin/python setup.py build_sphinx'
____________________ summary ____________________
ERROR: docs: commands failed
~~~

**Solutions**:

* RPM based: `yum install -y libtidy-devel`
* APT based: `apt-get install libtidy-dev`

# Nova

* **No package 'libvirt' found**: `apt-get install libvirt-dev`
