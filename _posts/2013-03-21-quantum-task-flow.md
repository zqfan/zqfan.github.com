---
layout: post
title: "Quantum Task Flow"
description: ""
category: OpenStack
tags: [quantum, nova]
---
{% include JB/setup %}
## License
this file is published under [(CC) BY-NC-SA]
(http://creativecommons.org/licenses/by-nc-sa/3.0/)

## tenant creates a network

## tenant associates a subnet with a network

## tenant boots a instance and specifies a nic connects to a network

## nova contact quantum and create a port on that network

## quantum assigns an ip address to that port

## tenant deletes the instance

## nova contact quantum and delete the port
