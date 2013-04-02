---
layout: post
title: "Openstack Grizzly on Ubuntu Precise"
description: ""
category: 
tags: [openstack, grizzly, ubuntu, precise]
---
{% include JB/setup %}
## License
this file is published under [(CC) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

## Architecture
Keystone+Glance+Nova+Horizon

## probelm shoot
problem: glance image-list return error:

    Unable to communicate with identity service: {"error": {"message": "The request you have made requires authentication.", "code": 401, "title": "Not Authorized"}}. (HTTP 401)

solution: you can try

    glance --os-tenant-name service --os-username glance --os-password your-password image-list

this is because you set environment variable to --os-tenant-name admin --os-username admin --os-password admin-password, while keystone create user glance to glance:service, so you must override those variable to generate valid request header.

But if this is not help, something deep you should dig. Good luck.
