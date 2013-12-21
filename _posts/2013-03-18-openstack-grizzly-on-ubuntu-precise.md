---
layout: post
title: "Openstack Grizzly on Ubuntu Precise"
description: ""
category: openstack
tags: [openstack, grizzly, ubuntu, precise]
---
{% include JB/setup %}
#
License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

## reference
* [longgeek](http://longgeek.com/2013/03/11/openstack-grizzly-g3-for-ubuntu-12-04-all-in-one-installation/)
* [mseknibilel](https://github.com/mseknibilel/OpenStack-Grizzly-Install-Guide)

## Architecture
Keystone+Glance+Nova+Horizon

## probelm shoot
### problem: glance image-list return error:
Unable to communicate with identity service: {"error": {"message": "The request you have made requires authentication.", "code": 401, "title": "Not Authorized"}}. (HTTP 401)

**solution**: you can try

    glance --os-tenant-name service --os-username glance --os-password your-password image-list

this is because you set environment variable to --os-tenant-name admin --os-username admin --os-password admin-password, while keystone create user glance to glance:service, so you must override those variable to generate valid request header.

You can use alias in your shell env, edit your ~/.bashrc file and add the following line:

    alias glance='glance --os-tenant-name service --os-username glance --os-password your-password'

and export it to take effect: `source ~/.bashrc`

But if this is not help, something deep you should dig. Good luck.

### horizon Volumes Internal Server Error
i set up cinder, and all cinder service is start/running, cinder-volumes vg is created. however, when i click the Volumes, it return internal server error.
?**solution**: i check /var/log/cinder/cinder-api.log, it says auth error. so i add user and service of cinder by keystone.

### glance image-create Errno 111 Connection refused
**solution**: After you restart `glance-*`, please wait for seconds to run glance image-create commoand, or sometimes (in my case, it will case) it will cause the connection refused error. I think this is because the service is not completely finish, so your request will be refused.

### pkg_resources.DistributionNotFound: python-keystoneclient==0.2.3.1.g3a3e254
**solution**: this is because the python_keystoneclient-0.2.3.2.g3ce7017.egg-info is installed but the keystone still require the old one. This will happen when you try to setup the new version and overwrite the old one.

### linux-kernel-header-virtual
**solution**: apt-get install linux-headers-3.2.0-31-virtual, or you can use uname to get the version of linux, then install specific header virtual
