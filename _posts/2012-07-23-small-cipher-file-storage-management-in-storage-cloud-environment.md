---
layout: post
title: "Small Cipher File Storage Management in Storage Cloud Environment"
description: ""
category: openstack
tags: [cipher]
---
{% include JB/setup %}
# License
this file is published under [(CC) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

# intrudoction
## current research
### small file storage management
#### small file leading problem
1. document meta-data is stored in ram, couldn't support processing of huge amount of small file
fix: document archive & doecument merge

2. low io output
fix: cache

3. low web bandwidth usage
fix: request merge & request transmit delay

## key tech for private cloud storage
### layer and struct of private cloud storage
#### target of cloud storage
1. large-scale document storage, and easy for liner expandtion
2. realtime or nearly realtime access, bash support
3. reliability, can handle single point or idc fault
4. local file system like ui
5. low cost, easy to maintain

#### four layers of cloud storage
1. storage layer
2. basic management layer
3. application interface layer. include two type: web based REST protocal implementation, include web2.0 and dos like interface; specific open platform based api
4. access layer

# small cipher file storage management in private cloud
## document-orented storage management basic principle for NoSQL feature
### CAP theory
you can only satisfy 2 of 3 requirement in distribute computing for
Consistency, Availability and tolerance of network Partition
### BASE model
  BASE model sacrifice consistency to get availability
  Basically Available, support partion failure
  Soft state, state can have asynchronization some time
  Eventually consistent, the final data should be consistent
# prototype
## dev platform
### hadoop hdfs
  it is suitable for large file, data stream, bash, not very satisfy
  small file storage
### couchdb & mogondb
  both are doc-oriented dbms, couchdb provide JSON data struct for
  REST interface to handle data process, mogondb store files as
  key-value pair.
### RESTfull
  REST (Representation State Transfer) is a group of constraint
  condition and principle, all program or design satisfy these
  condition and principle are RESTful. it use basic standard HTTP
  method.
