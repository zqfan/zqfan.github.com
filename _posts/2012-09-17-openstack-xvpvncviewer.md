---
layout: post
title: "Openstack Xvpvncviewer"
description: ""
category: openstack
tags: [openstack, vnc, xvpvnc]
---
{% include JB/setup %}
#
License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

version 2012.1

there is a mistake in official manual when you follow the step: `java -jar VncViewer.jar [access_url]`

that will definitely cause a output:

    Malformed url

and have no other response at all. the correct arguments are

    java -jar VncViewer.jar url [access_url]

bug reported: https://bugs.launchpad.net/openstack-manuals/+bug/979054

here are the complete steps:
## step 1:
vim /etc/nova/nova.conf, add or overwrite the following line

    --xvpvncproxy_base_url=http://[$SERVER_IP]:6081/console

## step 2:

    @:git clone https://github.com/cloudbuilders/nova-xvpvncviewer
    @:cd nova-xvpvncviewer
    @:make

you will need java run time environment to complete the last command
## step 3:
in the nova service host, type

    @:nova get-vnc-console [instance-id] xvpvnc

it will print the access_url, then in the vnc client, type

    @:java -jar VncViewer.jar url [access_url]
