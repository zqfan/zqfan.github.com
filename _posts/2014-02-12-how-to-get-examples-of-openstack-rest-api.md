---
layout: post
title: "How to Get Examples of OpenStack ReST API"
description: ""
category: "openstack"
tags: []
---
{% include JB/setup %}
OpenStack现在的API文档写得并不尽善尽美，有时候官方的例子也许有错误或者不完善，你可以google得到你想要的答案或者到社区求助，或者如果你手头刚好有个部署好的环境，你也可以**打开cli接口的--debug选项，运行cli命令时就会把http交互过程打印出来**

以我同事遇到的问题为例，他在看Nova创建虚拟机的接口时，对于http://api.openstack.org/api-ref-compute.html#compute_servers中`POST /v2/{tenant_id}/servers`请求参数中的属性server的类型'csapi:ServerForCreate'的含义不理解，而且想知道在Horizon界面上批量创建虚拟机是如何对应到Rest接口的，所以我写了这篇水文阐述一下。

首先说一下，http://api.openstack.org/的内容由https://github.com/openstack/api-site项目进行托管，网页根据文档自动生成并托管到服务器上，随着OpenStack各项目API的变化以及一些历史遗留问题，其中会有错误，欢迎大家到https://launchpad.net/openstack-api-site提交bug并贡献补丁。

再解释下'csapi:ServerForCreate'，它其实相当于xml中的一个复杂类型，在json中相当于一个collection，一般是一个字典，用于表述这个属性。由于api-site项目无法在表格中呈现这样的复杂类型，又没有在表格后附加其他表格进行解释，就造成现在这样一个让人摸不着头脑的情况。

最后回答下疑问：既然我们已经知道Nova支持批量创建虚拟机，为什么官网API文档中的示例没有提及到这个呢？个人认为由于不是必选项，示例为了简洁起见，所以没有包含这个字段。

回到正题，如何利用已有环境得到想要的REST API示例请求响应？答案很简单，使用CLI的'--debug'选项，（所谓CLI是指OpenStack的Python绑定库，用来在shell环境下提供命令行接口，它封装了REST接口以便利使用。）但是在做这个简单动作前，我们先得会用CLI命令。

以Nova项目为例，使用`nova help`得到所有可用的命令，查看命令的简略说明，得到创建虚拟机的命令为`nova boot`，使用帮助命令`nova help boot`得到该命令的用法以及各项参数的说明，得知`--num-instances`参数可以指定创建的最大数量（是的，是最大，因为资源也许不够，最终结果可能小于指定值）。现在你知道了可以用boot命令创建多个虚拟机，打开debug选项，观察http请求与响应的输出，以下做一个简单的演示。

首先，我已知悉必选参数为'--image', '--flavor'以及虚拟机名称。所以先使用`nova image-list`得到可选的镜像列表，使用`nova flavor-list`得到可选的规格列表，然后使用boot命令创建两个虚拟机：

    nova --debug boot --image cirros0.3.1 --flavor 1 test --num-instances 2 --nic net-id=0f2ab214-103a-4111-919b-c0cdd03db629

注意`--nic`不是必选的，此处加上是因为nova做了限制，在存在多个可选网络的情况下必须指定网卡，否则会提示： 'Multiple possible networks found, use a Network ID to be more specific. (HTTP 400)'，如果你的环境上只有单一的网络，可以忽略这个。

此时会打印一大波控制台输出，根据经验或者肉眼搜索8774端口字样，找到与Nova服务交互的http请求，得到：

    curl -i http://controller:8774/v2/313a8bc21b994e60b93d6fff7c1e0c1b/servers -X POST -H "X-Auth-Project-Id: admin" -H "User-Agent: python-novaclient" -H "Content-Type: application/json" -H "Accept: application/json" -H "X-Auth-Token: 0b4ff9947e68437098db7bdaf9e88666" -d '{"server": {"name": "test", "imageRef": "d338a0f7-ef81-43bb-b098-7de14fd1449d", "flavorRef": "1", "max_count": 2, "min_count": 1, "networks": [{"uuid": "0f2ab214-103a-4111-919b-c0cdd03db629"}]}}'

可以看到请求消息体中server是一个json字典，它通过min_count和max_count控制要创建的虚拟机数量。

使用`nova list`查看虚拟机列表，显示刚刚创建两个虚拟机：

    | 5881ac54-0541-46b4-9482-97a285b6432c | test-5881ac54-0541-46b4-9482-97a285b6432c | BUILD   | spawning   | NOSTATE     | int-net=172.16.0.10            |
    | f660cb2b-5930-4181-b7c5-b0f3c79bdf63 | test-f660cb2b-5930-4181-b7c5-b0f3c79bdf63 | BUILD   | spawning   | NOSTATE     | int-net=172.16.0.9             |

注意到虚拟机的名字已经变更为指定的名字加上虚拟机uuid，以作区分。

基本上所有REST接口都可以通过这种打开debug选项的CLI接口的途径，获得http请求和响应的例子。但是有一点要注意，cli接口是封装rest接口的但是不是等于rest接口，这意味着有时候它会多加一些参数或者限制，多做一些步骤来完成调用。所以，**你不能依赖cli发出的http请求来判断哪些参数是必选的**。

最后补充下，你可以使用`keystone service-list`查看有哪些服务，使用`keystone endpoint-list`查看服务的url信息，然后对照控制台输出辨别出哪些是你要的http请求。我给出的例子中的curl命令拷贝后运行与CLI命令效果是一致的。

祝好运。

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
