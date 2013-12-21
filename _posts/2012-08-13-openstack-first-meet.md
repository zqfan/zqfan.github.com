---
layout: post
title: "OpenStack First Meet"
description: ""
category: openstack
tags: [openstack]
---
{% include JB/setup %}
#
License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

## OpenStack encompass three components
* Nova - compute -- a cloud computing fabric controller
* Swift - object storage -- a massively scalable redundant storage system
* Glance - image service -- provides discovery, registration, and delivery services for virtual disk images (1)

## OpenStack toplogy (2)

    host-switch1_________________
                 |        |     |
            controller  node1 node2...n nova-volume-node
                 |        vm    vm        |
    host-switch2_|________|_____|_________|

OpenStack components relation

    ___UI for__________Dashboard--horizion________UI for___
    |                                                     |
    Compute-Service--nova --storage-&-image-retrieval-- Image-Service--glance
    |                                                     |     |
    |                                                     |     |--image's disk files storage
    |__auth____Identity-Service--keystone___________auth__|     |
                        |_________________________________auth__Object-Store--swift

## OpenStack's mission
  to produce the ubiquitous Open Source Cloud Computing platform that will meet the needs of public and private clouds regardless of size, by being simple to implement and massively scalable. (3)

## OpenStack object storage Swift VS. Apache Hadoop HDFS
by Chuck Thier, Openstack Swift developer, 2011-02-10
* HDFS using a central system to maintain file metadata has a single point of failure, and is difficult to scale to very large sizes;
* Swift is designed with multi-tenancy in mind, while HDFS has no notation;
* HDFS is optimized for larger files, while Swift is designed to store any sized files;
* files in HDFS are write once, and can only have one writer at a time, in Swift files can be written many times, and under concurrency, the last writter wins;
* HDFS is written in Java, while Swift in Python.

by Joshua McKenty, As Chief Architect of NASA Nebula, 2011-02-12

  HDFS is built to allow MapReduce processing using Hadoop across the object within the storage invironment; Supporting processing within swift is a roadmap item for many of the OpenStack companies, although not everyone thinks that MR is the answer. (4)

Users
* NASA
* Rackspace Cloud
* HP Public Cloud
* eBay

references
1. http://en.wikipedia.org/wiki/OpenStack
2. http://os.51cto.com/art/201111/303120.htm
3. http://wiki.openstack.org/
4. http://www.quora.com/What-features-differentiate-HDFS-and-OpenStack-Object-Storage

useful links:

1. http://devstack.org/

relational architecture

1. Eucalyptus - Elastic Utility Computing Architecture for Linking Your Programs To Useful Systems

NASA given up this architecture for scalability and open-source reason. but now, Eucalyptus has been opened and move to Github.
