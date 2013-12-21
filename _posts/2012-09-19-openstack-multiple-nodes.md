---
layout: post
title: "Openstack Multiple Nodes"
description: ""
category: openstack
tags: [openstack, multi_host]
---
{% include JB/setup %}
#
License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

when you install open-stack on a server and you want to expand a compute node,
it is simple, just install nova-compute in the new machine and do some configure, then it done! following my steps:
## step 1:

    root@:apt-get install ntp bridge-utils
    root@:vim /etc/ntp.conf
    # before server ntp.ubuntu.com, insert ip with your control node ip
    server $CONTROL_NODE_IP
    root@:service ntp restart
    root@:apt-get install nova-compute

you may need psycopg2 module, if you cannot run nova-compute successfully, or just be sure:

    root@:apt-get install python-psycopg2

## step 2:

    root@:vim /etc/nova/nova.conf

everything just like the original server you have, except:

    # overwrite the following arguments with you real environment
    --vncserver_proxyclient_address=$COMPUTE_NODE_IP
    --vncserver_listen=$COMPUTE_NODE_IP
    root@:vim /etc/nova/api-paste.ini
    #overwrite the 3 lines in the bottom, put the value associated with your configure
    admin_tenant_name = some_tenant
    admin_user = some_user
    admin_password = your_password

## step 3:

    root@:service nova-compute restart
