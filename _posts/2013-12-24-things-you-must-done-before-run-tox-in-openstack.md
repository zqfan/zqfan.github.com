---
layout: post
title: "Things You Must Done Before Run TOX in OpenStack"
description: ""
category: "openstack"
tags: [unit test, tox]
---
{% include JB/setup %}
All OpenStack projects require unit test, almost all of them use tox to run unit test code. It is very convenient to run whole suite of unit test by one single command: `tox`, configuration and option details are already done for you. But perfect is just a day dream, you still need to do something when you just setup a fresh environment. This post aims at providing pre-condition of tox for some openstack project on Ubuntu 12.04 (precise).

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

# common
To run tox, you need to install tox first:

{% highlight bash linenos=table %}
sudo apt-get install python-pip
sudo pip install tox
{% endhighlight %}

Before run test suite, tox need to install required python package. they are defined in requirements.txt, and test-requirements.txt which only needed when run test. pip will install them automatically one by one, so their order makes sense. But pip cannot deal with dependency of non python packages, so there are potential unmet dependency.

# ceilometer
For now, Dec 24, 2013, ceilometer requires MySQL-python, xattr, lxml, and mongodb, here is a list of unmet dependency:

* MySQL-python: libmysqlclient-dev
* xattr: python-dev libffi-dev
* lxml: libxml2-dev libxslt-dev
* pymongo: mongodb

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

## solution

{% highlight bash linenos=table %}
sudo apt-get install libmysqlclient-dev python-dev libffi-dev libxml2-dev \
                     libxslt-dev mongodb
{% endhighlight %}

In my environment, mysql-server is already installed, so if you've not done this in operating system installation, you should better do

{% highlight bash linenos=table %}
sudo apt-get install mysql-server
{% endhighlight %}
