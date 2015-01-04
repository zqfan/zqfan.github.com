% OpenStack Ceilometer Juno API V2
%
%

```
Copyright (c) 2014, Huawei Technologies Co., Ltd
All rights reserved.

Author: ZhiQiang Fan <aji.zqfan@gmail.com>
```

# Event

## List Events

| REST VERB | URI | DESCRIPTION |
|:----------|:----|:------------|
| GET | /v2/events?q.field={field}&q.op={operator}&q.type={type}&q.value={value} | 查询事件列表

添加过滤条件，格式为q.field={field}&q.op={operator}&q.type={type}&q.value={value}

你可以同时指定多个过滤条件，也可以一个也不指定，为了API能够快速响应，同时也为了减小系统压力，请尽量使用过滤条件进行精确查询

示例：查询系统上事件类型为compute.instance.delete.start的事件，为了方便举例，此处仅截取了响应体列表的一个元素，且对该元素进行了json格式化，实际返回的是纯文本。

curl -i -X GET -H 'X-Auth-Token: 56c50f283bb84ee28d29d77f35a3714d' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'User-Agent: python-ceilometerclient' 'http://172.128.231.201:8777/v2/events?q.field=event_type&q.op=eq&q.type=&q.value=compute.instance.delete.start'

~~~json
[
    {
        "event_type": "compute.instance.delete.start",
        "generated": "2014-12-28T22:50:53.113282",
        "message_id": "a25935cb-9d74-4f2f-9c5e-5a162f022095",
        "traits": [
            {
                "name": "state",
                "type": "string",
                "value": "active"
            },
            {
                "name": "root_gb",
                "type": "integer",
                "value": "0"
            },
            {
                "name": "user_id",
                "type": "string",
                "value": "2630d3c577df426bab9a4d9bfa986297"
            },
            {
                "name": "service",
                "type": "string",
                "value": "compute"
            },
            {
                "name": "disk_gb",
                "type": "integer",
                "value": "0"
            },
            {
                "name": "instance_type",
                "type": "string",
                "value": "64m-ram"
            },
            {
                "name": "tenant_id",
                "type": "string",
                "value": "d1578b5392f744b68dd8ad23412a8cd4"
            },
            {
                "name": "ephemeral_gb",
                "type": "integer",
                "value": "0"
            },
            {
                "name": "instance_type_id",
                "type": "integer",
                "value": "6"
            },
            {
                "name": "vcpus",
                "type": "integer",
                "value": "1"
            },
            {
                "name": "memory_mb",
                "type": "integer",
                "value": "64"
            },
            {
                "name": "instance_id",
                "type": "string",
                "value": "5e7d8e95-a8a5-41ab-a1dc-c0fbbb9fa705"
            },
            {
                "name": "host",
                "type": "string",
                "value": "openstack"
            },
            {
                "name": "request_id",
                "type": "string",
                "value": "req-4b599fb8-0cc7-4980-9a61-5bd2c51d0ffb"
            },
            {
                "name": "launched_at",
                "type": "datetime",
                "value": "2014-12-28T22:36:27"
            }
        ]
    }
]
~~~

## Get Event

| REST VERB | URI | DESCRIPTION |
|:----------|:----|:------------|
| GET | /v2/events/{message_id} | 查询某事件

注意，查询单个事件并不能比查询事件列表获取更详细的信息，但是有助于提高性能，减轻系统压力。

示例：为了方便举例，对响应体进行了json格式化，实际返回的是纯文本。

curl -i -X GET -H 'X-Auth-Token: d980626ab92c4a17b1fb69f1e6eddc06' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'User-Agent: python-ceilometerclient' http://172.128.231.201:8777/v2/events/a25935cb-9d74-4f2f-9c5e-5a162f022095

~~~json
{
    "event_type": "compute.instance.delete.start",
    "generated": "2014-12-28T22:50:53.113282",
    "message_id": "a25935cb-9d74-4f2f-9c5e-5a162f022095",
    "traits": [
        {
            "name": "state",
            "type": "string",
            "value": "active"
        },
        {
            "name": "root_gb",
            "type": "integer",
            "value": "0"
        },
        {
            "name": "user_id",
            "type": "string",
            "value": "2630d3c577df426bab9a4d9bfa986297"
        },
        {
            "name": "service",
            "type": "string",
            "value": "compute"
        },
        {
            "name": "disk_gb",
            "type": "integer",
            "value": "0"
        },
        {
            "name": "instance_type",
            "type": "string",
            "value": "64m-ram"
        },
        {
            "name": "tenant_id",
            "type": "string",
            "value": "d1578b5392f744b68dd8ad23412a8cd4"
        },
        {
            "name": "ephemeral_gb",
            "type": "integer",
            "value": "0"
        },
        {
            "name": "instance_type_id",
            "type": "integer",
            "value": "6"
        },
        {
            "name": "vcpus",
            "type": "integer",
            "value": "1"
        },
        {
            "name": "memory_mb",
            "type": "integer",
            "value": "64"
        },
        {
            "name": "instance_id",
            "type": "string",
            "value": "5e7d8e95-a8a5-41ab-a1dc-c0fbbb9fa705"
        },
        {
            "name": "host",
            "type": "string",
            "value": "openstack"
        },
        {
            "name": "request_id",
            "type": "string",
            "value": "req-4b599fb8-0cc7-4980-9a61-5bd2c51d0ffb"
        },
        {
            "name": "launched_at",
            "type": "datetime",
            "value": "2014-12-28T22:36:27"
        }
    ]
}
~~~

## List Event Types

| REST VERB | URI | DESCRIPTION |
|:----------|:----|:------------|
| GET | /v2/event_types | 查询记录的事件类型列表

注意：Ceilometer支持的所有事件类型和此处的类型列表不是一个概念，这里显示的是系统上到现在为止记录的所有事件中，有哪些事件类型。

Ceilometer Juno默认有的事件类型有：

* compute.instance.*
* compute.instance.exists

通过修改/etc/ceilometer/event_definitions.yaml并重启ceilometer-agent-notification服务可以增加新的事件类型。

示例：为了方便举例，此处仅截取了响应体列表的若干个元素（删除虚拟机的动作导致的事件），且对该元素进行了json格式化，实际返回的是纯文本。

curl -i -X GET -H 'X-Auth-Token: 5f113ec0cb3249219d8e5300321c2282' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'User-Agent: python-ceilometerclient' http://172.128.231.201:8777/v2/event_types/

~~~json
[
    "compute.instance.delete.end",
    "compute.instance.delete.start",
    "compute.instance.exists",
    "compute.instance.shutdown.end",
    "compute.instance.shutdown.start",
    "compute.instance.update"
]
~~~

## List Traits Description

| REST VERB | URI | DESCRIPTION |
|:----------|:----|:------------|
| GET | /v2/events_types/{event_type}/traits | 查询某事件类型的特征描述列表

注意：如果event_type输入的是一个不存在的的类型，该接口不会报错，只会返回一个空列表。这是预期的行为。

示例：为了方便举例，对响应体进行了json格式化，实际返回的是纯文本。

curl -i -X GET -H 'X-Auth-Token: 1f9a3ec4845a49d8afa6faf48cd31300' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'User-Agent: python-ceilometerclient' http://172.128.231.201:8777/v2/event_types/compute.instance.delete.start/traits

~~~json
[
    {
        "name": "disk_gb",
        "type": "integer"
    },
    {
        "name": "ephemeral_gb",
        "type": "integer"
    },
    {
        "name": "host",
        "type": "string"
    },
    {
        "name": "instance_id",
        "type": "string"
    },
    {
        "name": "instance_type",
        "type": "string"
    },
    {
        "name": "instance_type_id",
        "type": "integer"
    },
    {
        "name": "launched_at",
        "type": "datetime"
    },
    {
        "name": "memory_mb",
        "type": "integer"
    },
    {
        "name": "request_id",
        "type": "string"
    },
    {
        "name": "root_gb",
        "type": "integer"
    },
    {
        "name": "service",
        "type": "string"
    },
    {
        "name": "state",
        "type": "string"
    },
    {
        "name": "tenant_id",
        "type": "string"
    },
    {
        "name": "user_id",
        "type": "string"
    },
    {
        "name": "vcpus",
        "type": "integer"
    }
]
~~~

## List Traits

| REST VERB | URI | DESCRIPTION |
|:----------|:----|:------------|
| GET | /v2/events_types/{event_type}/traits/{trait_name} | 查询某事件类型的某特征列表

注意：如果event_type输入的是一个不存在的的类型，该接口不会报错，只会返回一个空列表。如果trait_name输入的是不存在的特征，该接口不会报错，只会返回一个空列表。这是预期的行为。

示例：为了方便举例，对响应体进行了json格式化，实际返回的是纯文本。

curl -i -X GET -H 'X-Auth-Token: 1f9a3ec4845a49d8afa6faf48cd31300' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'User-Agent: python-ceilometerclient' http://172.128.231.201:8777/v2/event_types/compute.instance.delete.start/traits/vcpus

~~~json
[
    {
        "name": "vcpus",
        "type": "integer",
        "value": "1"
    }
]
~~~

# Capabilities

## Get Capabilities

| REST VERB | URI | DESCRIPTION |
|:----------|:----|:------------|
| GET | /v2/capabilities | 查询能力列表（查询当前版本的能力，例如分页查询是否支持等。）

curl -i -X GET -H 'User-Agent: python-ceilometerclient' -H 'Content-Type: application/json'  -H "X-Auth-Token: $(keystone token-get | awk 'NR==5{print $4}')" -k "https://metering.localdomain.com:8777/v2/capabilities"

~~~json
{
    "alarm_storage": {
        "storage:production_ready": true
    },
    "api": {
        "alarms:history:query:complex": true,
        "alarms:history:query:simple": true,
        "alarms:query:complex": true,
        "alarms:query:simple": true,
        "events:query:simple": true,
        "meters:pagination": false,
        "meters:query:complex": false,
        "meters:query:metadata": true,
        "meters:query:simple": true,
        "resources:pagination": false,
        "resources:query:complex": false,
        "resources:query:metadata": true,
        "resources:query:simple": true,
        "samples:groupby": false,
        "samples:pagination": false,
        "samples:query:complex": true,
        "samples:query:metadata": true,
        "samples:query:simple": true,
        "statistics:aggregation:selectable:avg": true,
        "statistics:aggregation:selectable:cardinality": true,
        "statistics:aggregation:selectable:count": true,
        "statistics:aggregation:selectable:max": true,
        "statistics:aggregation:selectable:min": true,
        "statistics:aggregation:selectable:stddev": true,
        "statistics:aggregation:selectable:sum": true,
        "statistics:aggregation:standard": true,
        "statistics:groupby": true,
        "statistics:pagination": false,
        "statistics:query:complex": false,
        "statistics:query:metadata": true,
        "statistics:query:simple": true
    },
    "storage": {
        "storage:production_ready": true
    }
}
~~~

# Resource

## List Resources

| REST VERB | URI | DESCRIPTION |
|:----------|:----|:------------|
| GET | /v2/resources?meter_links=1&q.op={operator}&q.value={value}&q.field={field} | List Resources

valid keys: ['end_timestamp', 'end_timestamp_op', 'metaquery', 'pagination', 'project', 'resource', 'source', 'start_timestamp', 'start_timestamp_op', 'user']

curl -i -X GET -H 'User-Agent: python-ceilometerclient' -H 'Content-Type: application/json'  -H "X-Auth-Token: $(keystone token-get | awk 'NR==5{print $4}')" -k "https://metering.localdomain.com:8777/v2/resources?meter_links=1"

~~~json
[
    {
        "first_sample_timestamp": "2014-12-04T03:10:42.402000",
        "last_sample_timestamp": "2014-12-15T00:16:40",
        "links": [
            {
                "href": "https://metering.localdomain.com:8777/v2/resources/8813ac84-d01d-4c97-ad31-4f04cf128f9b",
                "rel": "self"
            },
            {
                "href": "https://metering.localdomain.com:8777/v2/meters/vcpus?q.field=resource_id&q.value=8813ac84-d01d-4c97-ad31-4f04cf128f9b",
                "rel": "vcpus"
            },
            {
                "href": "https://metering.localdomain.com:8777/v2/meters/instance:m1.tiny?q.field=resource_id&q.value=8813ac84-d01d-4c97-ad31-4f04cf128f9b",
                "rel": "instance:m1.tiny"
            },
            {
                "href": "https://metering.localdomain.com:8777/v2/meters/instance?q.field=resource_id&q.value=8813ac84-d01d-4c97-ad31-4f04cf128f9b",
                "rel": "instance"
            },
            {
                "href": "https://metering.localdomain.com:8777/v2/meters/memory?q.field=resource_id&q.value=8813ac84-d01d-4c97-ad31-4f04cf128f9b",
                "rel": "memory"
            },
            {
                "href": "https://metering.localdomain.com:8777/v2/meters/disk.ephemeral.size?q.field=resource_id&q.value=8813ac84-d01d-4c97-ad31-4f04cf128f9b",
                "rel": "disk.ephemeral.size"
            },
            {
                "href": "https://metering.localdomain.com:8777/v2/meters/disk.root.size?q.field=resource_id&q.value=8813ac84-d01d-4c97-ad31-4f04cf128f9b",
                "rel": "disk.root.size"
            },
            {
                "href": "https://metering.localdomain.com:8777/v2/meters/disk.read.bytes?q.field=resource_id&q.value=8813ac84-d01d-4c97-ad31-4f04cf128f9b",
                "rel": "disk.read.bytes"
            },
            {
                "href": "https://metering.localdomain.com:8777/v2/meters/disk.read.requests?q.field=resource_id&q.value=8813ac84-d01d-4c97-ad31-4f04cf128f9b",
                "rel": "disk.read.requests"
            },
            {
                "href": "https://metering.localdomain.com:8777/v2/meters/disk.write.requests?q.field=resource_id&q.value=8813ac84-d01d-4c97-ad31-4f04cf128f9b",
                "rel": "disk.write.requests"
            },
            {
                "href": "https://metering.localdomain.com:8777/v2/meters/disk.write.bytes?q.field=resource_id&q.value=8813ac84-d01d-4c97-ad31-4f04cf128f9b",
                "rel": "disk.write.bytes"
            },
            {
                "href": "https://metering.localdomain.com:8777/v2/meters/cpu?q.field=resource_id&q.value=8813ac84-d01d-4c97-ad31-4f04cf128f9b",
                "rel": "cpu"
            },
            {
                "href": "https://metering.localdomain.com:8777/v2/meters/cpu_util?q.field=resource_id&q.value=8813ac84-d01d-4c97-ad31-4f04cf128f9b",
                "rel": "cpu_util"
            },
            {
                "href": "https://metering.localdomain.com:8777/v2/meters/disk.read.bytes.rate?q.field=resource_id&q.value=8813ac84-d01d-4c97-ad31-4f04cf128f9b",
                "rel": "disk.read.bytes.rate"
            },
            {
                "href": "https://metering.localdomain.com:8777/v2/meters/disk.read.requests.rate?q.field=resource_id&q.value=8813ac84-d01d-4c97-ad31-4f04cf128f9b",
                "rel": "disk.read.requests.rate"
            },
            {
                "href": "https://metering.localdomain.com:8777/v2/meters/disk.write.requests.rate?q.field=resource_id&q.value=8813ac84-d01d-4c97-ad31-4f04cf128f9b",
                "rel": "disk.write.requests.rate"
            },
            {
                "href": "https://metering.localdomain.com:8777/v2/meters/disk.write.bytes.rate?q.field=resource_id&q.value=8813ac84-d01d-4c97-ad31-4f04cf128f9b",
                "rel": "disk.write.bytes.rate"
            }
        ],
        "metadata": {
            "OS-EXT-AZ.availability_zone": "az1.dc1",
            "device": "[vda]",
            "disk_gb": "1",
            "display_name": "as-ASG-gpcheb3tt5yk-uvcdt75k7vfi-ngi72lsbd7ji",
            "ephemeral_gb": "0",
            "flavor.disk": "1",
            "flavor.ephemeral": "0",
            "flavor.id": "1",
            "flavor.links": "[\"{uhref: uhttps://compute.localdomain.com:8001/13b4b5694ebb49c9a927c0ffd3ba28cb/flavors/1, urel: ubookmark}\"]",
            "flavor.name": "m1.tiny",
            "flavor.ram": "512",
            "flavor.vcpus": "1",
            "host": "2e00e1525a23119869d5ed01605a2828479d22844052fdbb2f60925c",
            "image.id": "2ff58fab-ee6c-40ee-90b7-299452ef5b92",
            "image.links": "[\"{uhref: uhttps://compute.localdomain.com:8001/13b4b5694ebb49c9a927c0ffd3ba28cb/images/2ff58fab-ee6c-40ee-90b7-299452ef5b92, urel: ubookmark}\"]",
            "image.name": "myImage",
            "image_ref": "2ff58fab-ee6c-40ee-90b7-299452ef5b92",
            "image_ref_url": "https://compute.localdomain.com:8001/13b4b5694ebb49c9a927c0ffd3ba28cb/images/2ff58fab-ee6c-40ee-90b7-299452ef5b92",
            "instance_type": "1",
            "kernel_id": "None",
            "memory_mb": "512",
            "name": "instance-00000002",
            "ramdisk_id": "None",
            "root_gb": "1",
            "status": "active",
            "user_metadata.AutoScalingGroupName": "as-ASG-gpcheb3tt5yk",
            "user_metadata.groupname": "as-ASG-gpcheb3tt5yk",
            "vcpus": "1"
        },
        "project_id": "104beede98164e5e894eb79bf685c584",
        "resource_id": "8813ac84-d01d-4c97-ad31-4f04cf128f9b",
        "source": "openstack",
        "user_id": "db3b71f5e5f346d9b4d53a55a10a33f9"
    }
]
~~~

## Get Resource

| REST VERB | URI | DESCRIPTION |
|:----------|:----|:------------|
| GET | /v2/resources/{resource_id} | Get resource detailed information

curl -i -X GET -H 'User-Agent: python-ceilometerclient' -H 'Content-Type: application/json'  -H "X-Auth-Token: $(keystone token-get | awk 'NR==5{print $4}')" -k "https://metering.localdomain.com:8777/v2/resources/2ff58fab-ee6c-40ee-90b7-299452ef5b92"

~~~json
{
    "first_sample_timestamp": "2014-12-04T02:27:59",
    "last_sample_timestamp": "2014-12-15T00:22:08",
    "links": [
        {
            "href": "https://metering.localdomain.com:8777/v2/resources/2ff58fab-ee6c-40ee-90b7-299452ef5b92",
            "rel": "self"
        },
        {
            "href": "https://metering.localdomain.com:8777/v2/meters/image?q.field=resource_id&q.value=2ff58fab-ee6c-40ee-90b7-299452ef5b92",
            "rel": "image"
        },
        {
            "href": "https://metering.localdomain.com:8777/v2/meters/image.size?q.field=resource_id&q.value=2ff58fab-ee6c-40ee-90b7-299452ef5b92",
            "rel": "image.size"
        }
    ],
    "metadata": {
        "checksum": "d972013792949d0d3ba628fbe8685bce",
        "container_format": "bare",
        "created_at": "2014-12-04T02:27:51.843400",
        "deleted": "False",
        "deleted_at": "None",
        "disk_format": "qcow2",
        "is_public": "True",
        "min_disk": "0",
        "min_ram": "0",
        "name": "myImage",
        "protected": "False",
        "size": "13147648",
        "status": "active",
        "updated_at": "2014-12-04T02:27:53.914783"
    },
    "project_id": "104beede98164e5e894eb79bf685c584",
    "resource_id": "2ff58fab-ee6c-40ee-90b7-299452ef5b92",
    "source": "openstack",
    "user_id": null
}
~~~

# Alarm

## Alarm Model

| 属性 | 类型 | CRUD | 默认值 | 约束 | 备注 |
|:-----|:-----|:-----|:-------|:-----|:-----|
| alarm_id | string | r | N/A | N/A | uuid
| type | string | crw | N/A | N/A | 类型，取值为threshold或combination
| name | string | crw | N/A | N/A | 名称，项目内唯一
| description | string | crw | 有 | N/A | 描述，默认值根据类型而不同
| enabled | bool | crw | N/A | N/A | 是否可用
| state | string | crw | N/A | 见state取值表 | 状态，取值为ok/alarm/insufficient data
| threshold_rule | object | crw | N/A | json dict | 条件，满足条件即触发alarm
| combination_rule | object | crw | N/A | json dict | 条件，满足条件即触发alarm
| user_id | string | crw | N/A | N/A | 用户id
| project_id | string | crw | N/A | N/A | 项目id
| evaluation_periods | string | crw | N/A | N/A | 时间窗口数量
| period | int | crw | N/A | 非负数 | 时间窗口，单位秒
| timestamp | string | r | N/A | datetime | 最后一次更新的时间戳
| state_timestamp | string | r | N/A | datetime | 最后一次状态更新的时间戳
| ok_actions | list | crw | N/A | N/A | alarm状态跃迁为ok时执行的动作
| alarm_actions | list | crw | N/A | N/A | alarm状态跃迁为alarm时执行的动作
| insufficient_data_actions | list | crw | N/A | N/A | alarm状态跃迁为insufficient data时执行的动作
| repeat_actions | bool | crw | N/A | N/A | 是否重复执行动作
| time_constraints | list | | [] | |

### AlarmThresholdRule Model

| Attribute | Type | Default | Remark |
|:----------|:-----|:--------|:-------|
| meter_name | string | | required
| query | list | [] | |
| period | int | 60 | >=1
| comparison_operator | string | eq | 'lt', 'le', 'eq', 'ne', 'ge', 'gt'
| threshold | float | | required
| statistic | string | avg | 'max', 'min', 'avg', 'sum', 'count'
| evaluation_periods | int | 1 | >=1
| exclude_outliers | bool | False |

exclude_outliers为真则会排除在标准差范围外的指标

### AlarmCombinationRule Model

| Attribute | Type | Default | Remark |
|:----------|:-----|:--------|:-------|
| operator | str | and | 'or', 'and'
| alarm_ids | list | | required

### AlarmTimeConstraint

| Attribute | Type | Default | Remark |
|:----------|:-----|:--------|:-------|
| name | str | | required
| description | str | |
| start | CronType | | required
| duration | int | | >=0, required
| timezone | str | "" |

## Create Alarm

## List Alarms

| REST VERB | URI | DESCRIPTION |
|:----------|:----|:------------|
| GET | /v2/alarms?q.op=eq&q.value={value}&q.field={field} | List alarms

valid keys: ['alarm_id', 'enabled', 'meter', 'name', 'pagination', 'project', 'state', 'type', 'user']

curl -i -X GET -H 'User-Agent: python-ceilometerclient' -H 'Content-Type: application/json'  -H "X-Auth-Token: $(keystone token-get | awk 'NR==5{print $4}')" -k "https://metering.localdomain.com:8777/v2/alarms"

~~~json
~~~

## Get Alarm

| REST VERB | URI | DESCRIPTION |
|:----------|:----|:------------|
| GET | /v2/alarms/{alarm_id} | Get alarm detailed information
