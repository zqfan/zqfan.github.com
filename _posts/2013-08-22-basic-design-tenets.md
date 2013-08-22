---
layout: post
title: "Basic Design Tenets"
description: ""
category: openstack
tags: [openstack]
---
{% include JB/setup %}
# License
this file is published under [(CC) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)

Basic Design Tenets
1. Scalability and elasticity are our main goals
2. Any feature that limits our main goals must be optional
3. Everything should be asynchronous
    a) If you can't do something asynchronously, see No.2
4. All required components must be horizontally scalable
5. Always use shared nothing architecture (SN) or sharding
    a) If you can't Share nothing/shard, see No.2
6. Distribute everything
    a) Especially logic. Move logic to where state naturally exists.
7. Accept eventual consistency and use it where it is appropriate.
8. Test everything.
    a) We require tests with submitted code. (We will help you if you need it)
