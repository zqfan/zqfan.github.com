---
layout: post
title: "Distributed KV Database"
description: ""
category: prehistoric
tags: [kv database, sql]
---
{% include JB/setup %}
## License
this file is published under [CC BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

## cassandra

## Redis
**i think this is not a distributed system**

  Redis is an open source, in-memeory, key-value data store.(1)

  Redis's value supports string, hash, list, set, sorted set.(2) It holds the whole dataset in RAM, and it's persistence is reached in two different ways: snapshotting, is a semi-persistent durability mode where the dataset is asynchronously transferred from memory to disk from time to time; journal, is an append-only fil ethat is written as operations modifying the dataset in memory are processed.(1)

  Redis supports master-slave replication. Data from any Redis server can replicate to any number of slaves. A slave may be a master to another slave. This allows Redis to implement a single-rooted replication tree. Redis slaves are writable, permitting intentional and unintentional inconsistency between instances. The Publish/Subscribe feature is fully implemented, so a client of a slave may SUBSCRIBE to a channel and receive a full feed of messages PUBLISHed to the master, anywhere up the replication tree. Replication is useful for read (but not write) scalability or data redundancy.(3)

  When the durability of data is not needed, the in-memory nature of Redis allows it to perform extremely well compared to database systems that write every change to disk before considering a transaction committed. There is no notable speed difference between write and read operations.(1)

  Redis behaves like a cache.(2)

1. [http://en.wikipedia.org/wiki/Redis](http://en.wikipedia.org/wiki/Redis)
1. [http://redis.io/topics/introduction](http://redis.io/topics/introduction)
1. [http://code.google.com/p/redis/wiki/ReplicationHowto](http://code.google.com/p/redis/wiki/ReplicationHowto)

more material

1. [http://www.hoterran.info/redis_kv_design](http://www.hoterran.info/redis_kv_design)

## CouchDB - cluster of unreliable commodity hardware data base
  It is a NoSQL database that uses JSON to store data, JavaScript as its query language using MapReduce and HTTP for an API.(1)

  Each database is a collection of independent documents. Each document maintains its own data and self-contained schema. Document metadata contains revision information, making it possible to merge any differences that may have occurred while the databases were disconnected.(2)

  CouchDB implements a form of Multi-Version Concurrency Control (MVCC) in order to avoid the need to lock the database file during writes. Conflicts are left to the application to resolve. Resolving a conflict generally involves first merging data into one of the documents, then deleting the stale one.(3)

  main features: Document Storage, ACID Semantics, Map/Reduce Views and Indexes, Distributed Architecture with Replication, REST API, Eventual Consistency, Built for Offline.

  CouchDB was designed with bi-direction replication (or synchronization) and off-line operation in mind. That means multiple replicas can have their own copies of the same data, modify it, and then sync those changes at a later time.(3)

  All items have a unique URI that gets exposed via HTTP. REST uses the HTTP methods POST, GET, PUT and DELETE for the four basic CRUD (Create, Read, Update, Delete) operations on all resources.(3)

  Replication and synchronization capabilities of CouchDB make it ideal for using it in mobile devices, where network connection is not guaranteed but the application must keep on working offline.(3)

  CouchDB is well suited for applications with accumulating, occasionally changing data, on which pre-defined queries are to be run and where versioning is important (CRM, CMS systems, by example). Master-master replication is an especially interesting feature, allowing easy multi-site deployments.(4)

1. [http://couchdb.apache.org/](http://couchdb.apache.org/)
1. [http://en.wikipedia.org/wiki/CouchDB](http://en.wikipedia.org/wiki/CouchDB)
1. [http://stackoverflow.com/a/4766398/395287](http://stackoverflow.com/a/4766398/395287)
1. [http://kkovacs.eu/cassandra-vs-mongodb-vs-couchdb-vs-redis](http://kkovacs.eu/cassandra-vs-mongodb-vs-couchdb-vs-redis)

## More to read
1. [http://blog.nahurst.com/visual-guide-to-nosql-systems](http://blog.nahurst.com/visual-guide-to-nosql-systems) see also e:/document/visual guide to nosql systems.png
2. [http://kkovacs.eu/cassandra-vs-mongodb-vs-couchdb-vs-redis](http://kkovacs.eu/cassandra-vs-mongodb-vs-couchdb-vs-redis)
