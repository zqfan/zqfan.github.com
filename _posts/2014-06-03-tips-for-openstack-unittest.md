---
layout: post
title: "Tips For OpenStack UnitTest"
description: ""
category: "openstack"
tags: [python, openstack, unittest]
---
{% include JB/setup %}

1. no assertEquals (deprecated in py3), use assertEqual
1. assertEqual(expect, actual), order of params makes sense when fail
1. assertRaises will return an instance of exception type

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
