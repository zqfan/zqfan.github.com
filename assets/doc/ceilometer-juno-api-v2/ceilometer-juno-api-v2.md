% OpenStack Ceilometer Juno API V2
%
%

```
Copyright (c) 2014, Huawei Technologies Co., Ltd
All rights reserved.

Author: ZhiQiang Fan <aji.zqfan@gmail.com>
```

# 前言（Preface）

本文档描述OpenStack Ceilometer项目Juno版本ReST API V2，主要依据

* http://api.openstack.org/api-ref-telemetry.html
* http://docs.openstack.org/developer/ceilometer/
* https://github.com/openstack/ceilometer

在Ubuntu 14.04 64上对Ceilometer 2014.2进行验证，使用的数据库为MySQL。

# 概述

## 词汇表

| 名称 | 含义 |
|:----|:----|
| meter | 指标
| sample | 采样，数据点
| statistic | 统计
| alarm | 告警
| resource | 资源
| event | 事件
| trait | 特征

# 对象模型（Object Model）

注意：对象模型只是系统中对某种资源的建模，并不代表API输入输出时的字段信息。

Ceilometer Juno API V2管理如下对象

## 告警（Alarm）

在Juno版本中，通过配置，告警对象是可以单独存储在某个数据库中的。不论是分库还是不分库，告警都存储在alarm表中，告警历史信息存储在alarm_history表中。

* Alarm属性表

| 属性 | 类型 | CRUD | 默认值 | 约束 | 备注 |
|:-----|:-----|:-----|:-------|:-----|:-----|
| alarm_id | string | r | N/A | N/A | uuid
| name | string | crw | N/A | N/A | 名称，项目内唯一
| description | string | crw | 有 | N/A | 描述，默认值根据类型而不同
| enabled | bool | crw | N/A | N/A | 是否可用
| user_id | string | crw | N/A | N/A | 用户id，只有admin用户可以指定user_id为非自身
| project_id | string | crw | N/A | N/A | 项目id，只有admin用户可以指定project_id为非自身
| state | string | crw | N/A | 见state取值表 | 状态，取值为ok/alarm/insufficient data
| state_timestamp | datetime | r | N/A | datetime | 最后一次状态更新的时间戳
| timestamp | datetime | r | N/A | datetime | 最后一次更新的时间戳
| type | string | crw | N/A | N/A | 类型，取值为threshold或combination
| threshold_rule | AlarmThresholdRule | crw | N/A | json dict | 阈值条件，满足条件则改变状态变为alarm，仅在type=threshold时能且必须被设置
| combination_rule | AlarmCombinationRule | crw | N/A | json dict | 组合条件，满足条件则状态变为alarm，仅在type=combination时能且必须被设置
| ok_actions | list | crw | N/A | N/A | alarm状态跃迁为ok时执行的动作
| alarm_actions | list | crw | N/A | N/A | alarm状态跃迁为alarm时执行的动作
| insufficient_data_actions | list | crw | N/A | N/A | alarm状态跃迁为insufficient data时执行的动作
| repeat_actions | bool | crw | N/A | N/A | 是否重复执行动作

注意，当enable=false时，告警不会在alarm-evaluator周期到来时被纳入评估

user_id和project_id默认是谁创建告警就设置为谁的user_id和project_id，只有admin用户可以指定为任意值。注意，OpenStack跨项目时不对uuid的正确性进行校验。

告警状态为ok，表示告警规则中指定的条件尚未满足；状态为alarm，表示告警规则中指定的条件已经满足；状态为insufficient data，表示无法从系统中获取足够数据断告警的状态。

state_timestamp和timestamp为UTC时间，格式"YYYY-mm-ddTHH:MM:SS.f"，例如2015-01-04T14:36:00.443839。

注意，threshold_rule和combination_rule二者只能为其中一个，且必须设置和type对应的那个。

ok_actions，alarm_actions，insufficient_data_actions是状态变迁时所触发的动作。每个action可以指定多个值。

## 能力（Capabilities）

* Capabilities属性表

| 属性 | 类型 | CRUD | 默认值 | 约束 | 备注 |
|:-----|:-----|:-----|:-------|:-----|:-----|
| api | str | r | | |
| storage | str | r | |
| alarm_storage | str | r | |

## 事件（Event）

* Event属性表

| 属性 | 类型 | CRUD | 默认值 | 约束 | 备注 |
|:-----|:-----|:-----|:-------|:-----|:-----|
| message_id | str | r | | | 消息ID
| event_type | str | r | | | 事件类型
| traits | list | r | | | Trait列表
| generated | str | r | | | 生成事件

* TraitDescription属性表

| 属性 | 类型 | CRUD | 默认值 | 约束 | 备注 |
|:-----|:-----|:-----|:-------|:-----|:-----|
| type | str | r | | | 特征类型，默认是string
| name | str | r | | | 特征名称

* Trait属性表

| 属性 | 类型 | CRUD | 默认值 | 约束 | 备注 |
|:-----|:-----|:-----|:-------|:-----|:-----|
| type | str | r | | | 特征类型
| name | str | r | | | 特征名称
| value | str | r | | | 特征的值

# API通用信息

## 获取token

Ceilometer API v2使用Keystone Identity Service作为默认的鉴权服务，用户向Ceilometer API发送请求，请求的HTTP Head中必须包括一个X-Auth-Token参数，X-Auth-Token的值必须是一个经过Keystone授权分配的token，通过Keystone分配token的方法，请查阅Keystone的接口文档。

HTTP 消息样例：

| Element | Content |
|:--------|:--------|
| HTTP HEAD | X-Auth-Token：9c81513600564b31b32d5918963778b3 Content-type：application/json
| HTTP BODY | {...}

## 多租户支持（Multiple Tenant Support）

Ceilometer中大部分对象都具有租户属性，如果是资源相关的对象，租户属性从资源中取得，如果是Alarm对象，租户属性在创建、修改Alarm时由http头部信息中的X-Project-Id获得，或者在消息体中指定。

# API操作

## 告警（Alarm）

### 创建告警（Create Alarm）

| REST VERB | URI | DESCRIPTION |
|:----------|:----|:------------|
| POST | /v2/alarms | 创建告警

* request filter参数

无

* request body参数

body是json字典的字符串，注意，目前Ceilometer不支持同时创建多个告警。

| 参数名（Field） | 参数类型（Type） | 约束（Limit） | 必选（Required） | 备注（Notes） |
|:----------------|:-----------------|:--------------|:-----------------|:--------------|
| name | string | project内唯一 | YES | 告警名称
| description | string | N/A | NO | 告警描述
| project_id | string | 仅admin可指定非自身项目 | NO | 告警所属项目
| user_id | string | 仅admin可指定非自身用户 | NO | 告警所属用户
| state | string | 见state可选值表 | NO | 告警状态，默认是insufficient data
| enabled | bool | 见enabled约束表 | NO | 告警是否激活
| type | string | 只能为threshold、combination二者之一 | YES | 告警类型
| threshold_rule | dict | 当且仅当type=threshold时设置，详见threshold_rule参数列表 | YES | 告警规则
| combination_rule | dict | 当且仅当type=combination时设置，详见combination_rule参数列表 | YES | 告警规则
| alarm_action | list | 参见action约束 | NO | state=alarm时的动作
| ok_action | list | 参见action约束 | NO | state=ok时的动作
| insufficient_data_action | list | 参见action约束 | NO | state=insufficient data时的动作
| repeat_actions | bool | N/A | NO | 是否重复执行动作，为真则每个评估周期不论状态是否变化均执行，否则仅当状态发生变化时执行
| time_constraints | list | 参见time_constraints参数列表 | NO | 告警生效的时间段

state可选值表

| 可选值 | 备注 |
|:-------|:-----|
| ok | 正常状态
| alarm | 告警状态
| insufficient data | 数据不充足

enabled约束表

| 可选值 | 备注 |
|:-------|:-----|
| t, true, on, y, yes, 1 | 大小写不敏感，取值为True
| 其他 | 取值为False

threshold_rule参数列表

threshold_rule会被用于评估阈值告警（threshold alarm）时从Statistics接口获取数据（详见查询统计（Get Statistics）章节），判断状态。

| 参数名（Field） | 参数类型（Type） | 约束（Limit） | 必选（Required） | 备注（Notes） |
|:----------------|:-----------------|:--------------|:-----------------|:--------------|
| meter_name | string | N/A | YES | 指标名称
| threshold | float | N/A | YES | 告警阈值
| query | list | N/A | NO | 过滤条件
| period | int | >=1 | NO | 时间窗口长度，单位秒，默认60秒
| evaluation_periods | int | >=1 | 时间窗口数量，默认1
| comparison_operator | string | 只能为['lt', 'le', 'eq', 'ne', 'ge', 'gt']其中之一 | 比较操作符，默认为eq
| statistic | string | 只能为['max', 'min', 'avg', 'sum', 'count']其中之一 | 统计维度，默认为avg
| exclude_outliers | bool | N/A | 是否排除在标准差范围外的数据，默认False，不排除

注意：period的值应该要保证比指标采集周期要大，否则很容易出现insufficient data状态。原因是告警评估周期到来时，每个告警是从当前时间倒推(evaluation_periods+1)*period秒数，从中取出监控数据，如果period值比监控周期小，此时很可能取不到数据。

提示：你可以在query字段添加过滤条件，限定取监控数据的范围，例如指定只监控resource id为a375caf9a73d4a49bb40321639003909的数据，CLI中可以通过指定--query "resource_id=a375caf9a73d4a49bb40321639003909"来过滤

combination_rule参数列表

combination_rule会被用于评估组合告警（combination alarm）

| 参数名（Field） | 参数类型（Type） | 约束（Limit） | 必选（Required） | 备注（Notes） |
|:----------------|:-----------------|:--------------|:-----------------|:--------------|
| alarm_ids | list | 至少2个不同的告警，且告警必须存在 | YES | 告警id列表，元素是告警id
| operator | string | 只能是and或者or | NO | 告警逻辑操作符，and是alarm_ids中所有告警都为alarm才设置本告警为alarm，or则是只要有一个是alarm则本告警为alarm

action约束

action多数情况下是一个字符串的URL，例如www.domainname.com/xyz，目前Ceilometer支持的action有如下几种：

* log：指定方式为log://，会在Ceilometer的日志文件中打印告警
* http: 指定方式为http://www.domainname.com/xyz，会POST请求到该URL
* https: 指定方式为https://www.domainname.com/xyz，会POST请求到该URL
* test: 指定方式为test://，不要使用这种方式，仅作测试用途，对告警不会有任何效果
* trust+http：指定方式为trust+http://，你需要进行额外设置才可以使用
* trust+https：指定方式为trust+https://，你需要进行额外设置才可以使用

你可以同时指定多个action，每个action种类可以不同。

time_constraints参数列表：

| 参数名（Field） | 参数类型（Type） | 约束（Limit） | 必选（Required） | 备注（Notes） |
|:----------------|:-----------------|:--------------|:-----------------|:--------------|
| name | string | N/A | YES | 告警约束名称
| description | string | N/A | NO | 告警约束描述
| start | string | cron job类型的字符串 | YES | 告警约束的开始点
| duration | integer | >=0 | YES | 告警约束的持续时间，单位秒
| timezone | string | N/A | NO | 告警约束的时区信息，默认为''

示例，注意，此处为了方便举例把json string格式化了。

~~~json
[
    {
        "description": "Time constraint at 0 23 * * * lasting for 10800 seconds",
        "duration": 10800,
        "name": "alarm-constraint-01",
        "start": "0 23 * * *",
        "timezone": "Europe/Ljubljana"
    }
]
~~~

* response body参数

参见[查询告警详情（Get Alarm）](#get-alarm)章节

示例，一个完整的创建告警的请求如下，里面包含了定义threshold_rule参数，定义query，定义time_constraints，但是并没有覆盖所有字段：

curl -i -X POST -H 'X-Auth-Token: 897de9edb774462ba5c3b875553f8087' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'User-Agent: python-ceilometerclient' -d '{"threshold_rule": {"meter_name": "cpu_util", "evaluation_periods": 3, "period": 1800, "statistic": "min", "threshold": 80.0, "query": [{"field": "resource_id", "type": "", "value": "10e8216e-4b36-4f93-942f-19b9f09e84e5", "op": "eq"}], "comparison_operator": "ge"}, "time_constraints": [{"duration": "10800", "start": "0 23 * * *", "name": "alarm-constraint-01"}], "type": "threshold", "name": "cpu-alarm", "repeat_actions": false}' http://172.128.231.201:8777/v2/alarms

-d参数json格式化后为：

~~~json
{
    "name": "cpu-alarm",
    "repeat_actions": false,
    "threshold_rule": {
        "comparison_operator": "ge",
        "evaluation_periods": 3,
        "meter_name": "cpu_util",
        "period": 1800,
        "query": [
            {
                "field": "resource_id",
                "op": "eq",
                "type": "",
                "value": "10e8216e-4b36-4f93-942f-19b9f09e84e5"
            }
        ],
        "statistic": "min",
        "threshold": 80.0
    },
    "time_constraints": [
        {
            "duration": "10800",
            "name": "alarm-constraint-01",
            "start": "0 23 * * *"
        }
    ],
    "type": "threshold"
}
~~~

得到的响应是：

{"alarm_actions": [], "ok_actions": [], "name": "cpu-alarm", "timestamp": "2015-01-04T02:25:44.216495", "enabled": true, "state": "insufficient data", "state_timestamp": "2015-01-04T02:25:44.216495", "threshold_rule": {"meter_name": "cpu_util", "evaluation_periods": 3, "period": 1800, "statistic": "min", "threshold": 80.0, "query": [{"field": "resource_id", "type": "", "value": "10e8216e-4b36-4f93-942f-19b9f09e84e5", "op": "eq"}], "comparison_operator": "ge", "exclude_outliers": false}, "alarm_id": "623df1be-ca06-431e-87ae-ab46750e2c03", "time_constraints": [{"duration": 10800, "start": "0 23 * * *", "timezone": "", "name": "alarm-constraint-01", "description": "Time constraint at 0 23 * * * lasting for 10800 seconds"}], "insufficient_data_actions": [], "repeat_actions": false, "user_id": "2630d3c577df426bab9a4d9bfa986297", "project_id": "d1578b5392f744b68dd8ad23412a8cd4", "type": "threshold", "description": "Alarm when cpu_util is ge a min of 80.0 over 1800 seconds"}

json格式化后为：

~~~json
{
    "alarm_actions": [],
    "alarm_id": "623df1be-ca06-431e-87ae-ab46750e2c03",
    "description": "Alarm when cpu_util is ge a min of 80.0 over 1800 seconds",
    "enabled": true,
    "insufficient_data_actions": [],
    "name": "cpu-alarm",
    "ok_actions": [],
    "project_id": "d1578b5392f744b68dd8ad23412a8cd4",
    "repeat_actions": false,
    "state": "insufficient data",
    "state_timestamp": "2015-01-04T02:25:44.216495",
    "threshold_rule": {
        "comparison_operator": "ge",
        "evaluation_periods": 3,
        "exclude_outliers": false,
        "meter_name": "cpu_util",
        "period": 1800,
        "query": [
            {
                "field": "resource_id",
                "op": "eq",
                "type": "",
                "value": "10e8216e-4b36-4f93-942f-19b9f09e84e5"
            }
        ],
        "statistic": "min",
        "threshold": 80.0
    },
    "time_constraints": [
        {
            "description": "Time constraint at 0 23 * * * lasting for 10800 seconds",
            "duration": 10800,
            "name": "alarm-constraint-01",
            "start": "0 23 * * *",
            "timezone": ""
        }
    ],
    "timestamp": "2015-01-04T02:25:44.216495",
    "type": "threshold",
    "user_id": "2630d3c577df426bab9a4d9bfa986297"
}
~~~

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

## 能力（Capabilities）

### 查询能力详情（Get Capabilities）

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

## 事件（Event）

### 查询事件（List Events）

| REST VERB | URI | DESCRIPTION |
|:----------|:----|:------------|
| GET | /v2/events?q.field={field}&q.op={operator}&q.type={type}&q.value={value} | 查询事件列表

添加过滤条件，格式为q.field={field}&q.op={operator}&q.type={type}&q.value={value}

field原则上没有任何限制，可以随便填。
如果它的值是['event_type', 'message_id', 'start_time', 'end_time']其中之一，则会把这个过滤条件施加到Event表上，此时operator，type将不会起作用。
如果不在这4个值里，则会把过滤条件施加到Trait表上。当field施加在Trait表上时，operator会起作用，默认值是eq, 只能为['lt', 'le', 'eq', 'ne', 'ge', 'gt']其中之一，类型（type）只能是['integer', 'float', 'string', 'datetime']其中之一；如果field不是一个已知的Trait，则返回结果将是空，而不是报错，这是预期的行为。

例如/v2/events?q.field=event_type&q.op=eq&q.type=string&q.value=compute.instance.update 这个过滤条件的意思是获取类型为compute.instance.update的事件。

例如/v2/events?q.field=state&q.op=eq&q.type=string&q.value=deleted这个过滤条件的意思是获取特征（trait）中状态（state）为已删除（deleted）的事件。

注意，由于bug: [https://bugs.launchpad.net/ceilometer/+bug/1407374](https://bugs.launchpad.net/ceilometer/+bug/1407374)导致了当type没有指定时会报500错误，你必须显示指定type才可以规避这个bug，这个bug存在于2014.2以及2014.2.1中。例如/v2/events?q.field=state&q.op=eq&q.type=&q.value=deleted这样写就会触发bug。

你可以同时指定多个过滤条件，也可以一个也不指定，为了API能够快速响应，同时也为了减小系统压力，请尽量使用过滤条件进行精确查询。注意，不建议使用message_id过滤，当你想只获取某个Event时，建议使用专门的Get Event接口，message_id是唯一的，使用专门的接口显得你很专业，也可以避免不必要的服务器负担。

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

### 查询事件详情（Get Event）

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

### 查询事件类型（List Event Types）

| REST VERB | URI | DESCRIPTION |
|:----------|:----|:------------|
| GET | /v2/event_types | 查询记录的事件类型列表

注意：Ceilometer支持的所有事件类型和此处的类型列表不是一个概念，这里显示的是系统上到现在为止记录的所有事件中，有哪些事件类型，其结果是支持的事件类型的子集。

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

### 查询特征描述（List Traits Description）

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

### 查询特征（List Traits）

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


