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

**注意：对象模型只是系统中对某种资源的建模，并不代表数据库中表或者字段信息。（各种类型的数据库的表和字段名称都不一样）**

Ceilometer Juno API V2管理如下对象

## 告警（Alarm）

在Juno版本中，通过配置，告警对象是可以单独存储在某个数据库中的。不论是分库还是不分库，告警都存储在alarm表中，告警历史信息存储在alarm_history表中。

* 告警（Alarm）模型

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

注意：当enable=false时，告警不会在alarm-evaluator周期到来时被纳入评估

告警状态为ok，表示告警规则中指定的条件尚未满足；状态为alarm，表示告警规则中指定的条件已经满足；状态为insufficient data，表示无法从系统中获取足够数据断告警的状态。

state_timestamp和timestamp为UTC时间，格式"YYYY-mm-ddTHH:MM:SS.f"，例如2015-01-04T14:36:00.443839。

* 告警变更（AlarmChange）模型

| 属性 | 类型 | CRUD | 默认值 | 约束 | 备注 |
|:-----|:-----|:-----|:-------|:-----|:-----|
| event_id | string | r | N/A | N/A | 告警变更唯一标识符
| alarm_id | string | r | N/A | N/A | 告警唯一标识符
| type | string | r | N/A | N/A | 变更类型，只能为creation、rule change、state transition、deletion其中之一
| detail | string | r | N/A | N/A | 变更详情，文本格式
| project_id | string | r | N/A | N/A | 告警变更前所属租户
| user_id | string | r | N/A | N/A | 告警变更前所属用户
| on_behalf_of | string | r | N/A | N/A | 告警变更后所属租户
| timestamp | string | r | N/A | datetime格式 | 告警变更发生时间

## 能力（Capabilities）

* Capabilities模型

Capabilities对象没有存储在数据库中，是写死在代码里的。

| 属性 | 类型 | CRUD | 默认值 | 约束 | 备注 |
|:-----|:-----|:-----|:-------|:-----|:-----|
| api | str | r | | |
| storage | str | r | |
| alarm_storage | str | r | |

## 事件（Event）

* Event模型

| 属性 | 类型 | CRUD | 默认值 | 约束 | 备注 |
|:-----|:-----|:-----|:-------|:-----|:-----|
| message_id | str | r | | | 消息ID
| event_type | str | r | | | 事件类型
| traits | list | r | | | Trait列表
| generated | str | r | | | 生成事件

* TraitDescription模型

| 属性 | 类型 | CRUD | 默认值 | 约束 | 备注 |
|:-----|:-----|:-----|:-------|:-----|:-----|
| type | str | r | | | 特征类型，默认是string
| name | str | r | | | 特征名称

* Trait模型

| 属性 | 类型 | CRUD | 默认值 | 约束 | 备注 |
|:-----|:-----|:-----|:-------|:-----|:-----|
| type | str | r | | | 特征类型
| name | str | r | | | 特征名称
| value | str | r | | | 特征的值

## 指标（Meter）

* Meter模型

Meter对象没有在MongoDB数据库中持久化存储，是从数据点中提取出来的。
Meter对象在MySQL数据库中对应meter表。

| 属性 | 类型 | CRUD | 默认值 | 约束 | 备注 |
|:-----|:-----|:-----|:-------|:-----|:-----|
| name | string | r | N/A | N/A | 指标名称
| type | string | r | N/A | gauge、cumulative、delta之一 | 指标类型
| unit | string | r | N/A | N/A | 指标单位
| resource_id | string | r | N/A | N/A | 资源唯一标识符（UUID）
| project_id | string | r | N/A | N/A | 资源所属租户
| user_id | string | r | N/A | N/A | 资源所属用户
| source | string | r | openstack | N/A | 资源来源
| meter_id | string | r | N/A | N/A | 指标唯一标示符

meter_id并没有在哪里被用到，实际上被作为标识使用的只是name字段。

gauge指的是跟时间无关的数值，例如cpu的核数，cpu的使用率，网卡流速等。
cumulative指的是随时间累加的数值，例如cpu使用时长，网卡总流量等，这种类型的数值在资源重启后，可能被清零重新开始计数。
delta指的是此次相对于上次的差值，这个在某些事件类型的指标中有时候会被用到，例如创建虚拟网络的事件。

source默认是openstack，你可以通过修改配置项来修改这个默认值。

* OldSample模型

OldSample对象在MySQL数据库中对应sample表。

| 属性 | 类型 | CRUD | 默认值 | 约束 | 备注 |
|:-----|:-----|:-----|:-------|:-----|:-----|
| counter_name | string | r | N/A | N/A | 数据点所对应的指标名称
| counter_type | string | r | gauge、cumulative、delta之一 | 数据点所对应的指标类型
| counter_unit | string | r | N/A | N/A | 数据点所对应的指标单位
| counter_volume | float | r | N/A | N/A | 数据点的值
| source | string | r | N/A | N/A | 数据点的来源
| resource_id | string | r | N/A | N/A | 资源唯一标示符（UUID）
| user_id | string | r | N/A | N/A | 资源所属用户
| project_id | string | r | N/A | N/A | 资源租户
| timestamp | string | r | N/A | datetime格式 | 数据点创建的时间
| recorded_at | string | r | N/A | datetime格式 | 数据点保存的时间
| resource_metadata | string | r | N/A | json dict | 资源的元数据
| message_id | string | r | N/A | N/A | 数据点唯一标识符（UUID）

* Statistics模型

Statistic是计算出来的，并未在数据库中持久化存储。

| 属性 | 类型 | CRUD | 默认值 | 约束 | 备注 |
|:-----|:-----|:-----|:-------|:-----|:-----|
| groupby | dict | r | N/A | N/A | 统计排序规则
| unit | string | r | N/A | N/A | 统计单位
| min | float | r | N/A | N/A | 统计区间中的最小值
| max | float | r | N/A | N/A | 统计区间中的最大值
| avg | float | r | N/A | N/A | 统计区间中的平均值
| sum | float | r | N/A | N/A | 统计区间中的总和
| count | int | r | N/A | N/A | 统计区间中的数据点个数
| aggregate | dict | r | N/A | N/A | ？？？
| duration | float | r | N/A | N/A | 统计区间中最早和最晚的数据点的时间差，单位秒
| duration_start | string | r | N/A | datetime | 统计区间中最早的数据的时间，或者是指定的起始时间
| duration_end | string | r | N/A | datetime | 统计区间中最晚的数据的时间，或者是指定的结束时间
| period | integer | r | N/A | >=0 | 统计区间的时间长度
| period_start | string | r | N/A | datetime | 统计区间的起始时间
| period_end | string | r | N/A | datetime | 统计区间的结束时间

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

user_id和project_id默认是谁创建告警就设置为谁的user_id和project_id，只有admin用户可以指定为任意值。
注意：如果admin用户指定了一个非本project-id的值给project_id，则创建出来的告警会自动在query字段施加一个project_id的过滤条件。这样做是防止越权，因为Ceilometer无法判定指定的用户在指定的project内是否是admin。如果不施加一个project_id的过滤条件，那么在评估告警时，调用[查询统计接口](#查询统计get-statistics)时会查到其他project数据，而此时user在project内可能只是个普通用户，从而导致数据泄露。
注意：OpenStack跨项目时不对uuid的正确性进行校验。

注意：threshold_rule和combination_rule二者只能为其中一个，且必须设置和type对应的那个。

ok_actions，alarm_actions，insufficient_data_actions是状态变迁时所触发的动作。每个action可以指定多个值。

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
| evaluation_periods | int | >=1 | NO | 时间窗口数量，默认1
| comparison_operator | string | 只能为['lt', 'le', 'eq', 'ne', 'ge', 'gt']其中之一 | NO | 比较操作符，默认为eq
| statistic | string | 只能为['max', 'min', 'avg', 'sum', 'count']其中之一 | NO | 统计维度，默认为avg
| exclude_outliers | bool | N/A | NO | 是否排除在标准差范围外的数据，默认False，不排除

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

详见响应示例。

* 相关配置

* JSON请求样例

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

* JSON响应样例

响应消息体是字符串，json格式化后为：

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

### 查询告警（List Alarms）

| REST VERB | URI | DESCRIPTION |
|:----------|:----|:------------|
| GET | /v2/alarms?q.field={field}&q.op=eq&q.type={type}&q.value={value} | List alarms

* request filter参数

| 参数名 | 参数类型 | 约束 | 必选 | 备注 |
|:-------|:---------|:-----|:-----|:-----|
| q.field | string | 见filed可选值表 | NO | 查询关键字
| q.op | string | 只能为eq | NO | 操作符
| q.type | string | 未知 | NO | 可以不填，填了也没用，类型自动识别
| q.value | string | N/A | NO | 值

op设置为非eq的值，则返回400。

field可选值表

| 可选值 | Value类型 | 约束 | 备注
|:-------|:----------|:-----|:-----|
| alarm_id | string | N/A | 告警id
| project | string | N/A | 项目id
| user | string | N/A | 用户id
| name | string | N/A | 告警名称
| enabled | string | 见enabled约束表 | 告警是否启用
| state | string | N/A | 告警状态
| meter | string | N/A | 告警关联的指标
| pagination | int | N/A | 未实现

注意：如果你想查询单个告警，请使用专门的[查询告警详情接口](#查询告警详情show-alarm)，而不是使用alarm_id进行过滤。使用专门的接口将显得您更专业，且可以改善响应性能。

注意：告警状态不会进行合法性检查，如果不是在ok、alarm和insufficient data其中之一，则返回空。使用insufficient data过滤时，你需要对url进行编码处理特殊字符' '，或者直接将空格转成%20。

enabled取值表

| 可选值 | 备注 |
|:-------|:-----|
| t, true, on, y, yes, 1 | 大小写不敏感，取值为True
| 其他 | 取值为False

* request body参数

无

* response body参数

响应体是字符串，json格式化后是一个列表，每个元素代表一个告警。详见响应样例。

* 相关配置

* JSON请求样例

curl -i -X GET -H 'X-Auth-Token: 28b85fce1dd841eebe783e72e94c0c76' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'User-Agent: python-ceilometerclient' http://172.128.231.201:8777/v2/alarms

* JSON响应样例

响应body为字符串，json格式化后为

~~~json
[
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
]
~~~

### 查询告警详情（Show Alarm）

| REST VERB | URI | DESCRIPTION |
|:----------|:----|:------------|
| GET | /v2/alarms/{alarm_id} | 查询告警详情

注意，查询告警详情和查询告警返回的列表中的元素相比，并没有更多的字段。

* request filter参数

无

* request body参数

无

* response body参数

见响应样例

* 相关配置

* JSON请求样例

curl -i -X GET -H 'X-Auth-Token: a4010a1c024f47a8917b60fb7167cdfb' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'User-Agent: python-ceilometerclient' http://172.128.231.201:8777/v2/alarms/623df1be-ca06-431e-87ae-ab46750e2c03

* JSON响应样例

响应体是字符串，json格式化后为

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

### 更新告警（Update Alarm）

| REST VERB | URI | DESCRIPTION |
|:----------|:----|:------------|
| PUT | /v2/alarms/{alarm_id} | 修改指定alarm信息

* request filter参数

无

* request body参数

见[创建告警章节](#创建告警create-alarm)。注意，即使只更新某一个字段，必填字段也都需要填，否则会报400错误。

* response body参数

见响应示例

* 相关配置

* JSON请求样例

curl -i -X PUT -H 'X-Auth-Token: 8c0bb261eb424cd7806256275ad1fb26' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'User-Agent: python-ceilometerclient' -d '{"alarm_actions": [], "ok_actions": [], "name": "cpu-alarm", "state": "insufficient data", "timestamp": "2015-01-04T02:25:44.216495", "enabled": true, "state_timestamp": "2015-01-04T02:25:44.216495", "threshold_rule": {"meter_name": "cpu_util", "evaluation_periods": 3, "period": 1800, "statistic": "min", "threshold": 70.0, "query": [{"field": "resource_id", "type": "", "value": "10e8216e-4b36-4f93-942f-19b9f09e84e5", "op": "eq"}], "comparison_operator": "ge", "exclude_outliers": false}, "alarm_id": "623df1be-ca06-431e-87ae-ab46750e2c03", "time_constraints": [{"duration": 10800, "start": "0 23 * * *", "description": "Time constraint at 0 23 * * * lasting for 10800 seconds", "name": "alarm-constraint-01", "timezone": ""}], "insufficient_data_actions": [], "repeat_actions": false, "user_id": "2630d3c577df426bab9a4d9bfa986297", "project_id": "d1578b5392f744b68dd8ad23412a8cd4", "type": "threshold", "description": "Alarm when cpu_util is ge a min of 80.0 over 1800 seconds"}' http://172.128.231.201:8777/v2/alarms/623df1be-ca06-431e-87ae-ab46750e2c03

请求体json格式化后为：

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
        "threshold": 70.0
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

* JSON响应样例

响应体为字符串，json格式化后为：

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
        "threshold": 70.0
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
    "timestamp": "2015-01-04T18:38:17.705821",
    "type": "threshold",
    "user_id": "2630d3c577df426bab9a4d9bfa986297"
}
~~~

### 删除告警（Delete Alarm）

| REST VERB | URI | DESCRIPTION |
|:----------|:----|:------------|
| DELETE | /v2/alarms/{alarm_id} | 删除指定告警

* request filter参数

无

* response body参数

无

* 相关配置

* JSON请求样例

curl -i -X DELETE -H 'X-Auth-Token: a4010a1c024f47a8917b60fb7167cdfb' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'User-Agent: python-ceilometerclient' http://172.128.231.201:8777/v2/alarms/c4278318-0572-45b6-96f8-e321cf44f817

* JSON响应样例

无消息体

### 查询告警状态（Get Alarm State）

| REST VERB | URI | DESCRIPTION |
|:----------|:----|:------------|
| GET | /v2/alarms/{alarm_id}/state | 获取指定alarm状态

* request filter参数

无

* request body参数

无

* response body参数

| 参数名 | 参数类型 | 约束 | 必选 | 备注 |
|:-------|:---------|:-----|:-----|:-----|
| N/A | string | N/A | YES | 告警状态

返回的值只会是ok、alarm、insufficient data三者之一，分别代表正常、告警、数据不足三种状态。

* 相关配置

* JSON请求样例

curl -i -X GET -H 'X-Auth-Token: a4010a1c024f47a8917b60fb7167cdfb' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'User-Agent: python-ceilometerclient' http://172.128.231.201:8777/v2/alarms/c4278318-0572-45b6-96f8-e321cf44f817/state

* JSON响应样例

~~~json
"insufficient data"
~~~

### 更新告警状态(Set Alarm State)

| REST VERB | URI | DESCRIPTION |
|:----------|:----|:------------|
| PUT | /v2/alarms/{alarm_id}/state | 更新指定alarm状态

* request filter参数

无

* request body参数

字符串，只能为ok、alarm、insufficient data三者之一，分别代表正常、告警、数据不足三种状态。大小写敏感，提交错误的状态将会返回400错误。

* response body参数

字符串，内容和request body中的内容保持一致

示例，错误的状态值将返回：

~~~json
{
    "error_message": {
        "debuginfo": null,
        "faultcode": "Client",
        "faultstring": "state invalid"
    }
}
~~~

* 相关配置

* JSON请求样例

curl -i -X PUT -H 'X-Auth-Token: cfd6f176d85043fcb1528aba734df3a4' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'User-Agent: python-ceilometerclient' -d '"ok"' http://172.128.231.201:8777/v2/alarms/623df1be-ca06-431e-87ae-ab46750e2c03/state

* JSON响应样例

~~~json
"ok"
~~~

### 查询告警历史(Show Alarm History)

| REST VERB | URI | DESCRIPTION |
|:----------|:----|:------------|
| GET | /v2/alarms/{alarm_id}/history?q.field={field}&q.op={operator}&q.type={type}&q.value={value} | 获取指定告警的历史

告警的历史记录有如下种类：creation、rule change、state transition、deletion，字段信息参见[告警模型](#告警alarm)中的告警变更模型。

* request filter参数

| 参数名 | 参数类型 | 约束 | 必选 | 备注 |
|:-------|:---------|:-----|:-----|:-----|
| q.field | string | 见filed可选值表 | NO | 查询关键字
| q.op | string | 只能为lt、le、eq、ne、ge、gt其中之一 | NO | 操作符
| q.type | string | 未知 | NO | 可以不填，填了也没用，类型自动识别
| q.value | string | N/A | NO | 值

field可选值表

| 可选值 | Value类型 | 约束 | 备注
|:-------|:----------|:-----|:-----|
| project | string | N/A | 告警所属项目
| user | string | N/A | 告警所属用户
| type | strig | N/A | 告警变更类型
| start_timestamp | string | datetime格式 | 起始时间
| start_timestamp_op | string | 只有gt、ge有效，其他值一律视为ge | 起始时间比较符，默认ge
| end_timestamp | string | datetime格式 | 结束时间
| end_timestamp_op | string | 只有lt、le有效，其他值一律视为le | 起始时间比较符，默认le

当field为project、user、type时，operator只能为eq，否则报400错误。

type原则上可以是任何字符串，但只有creation、rule change、state transition、deletion其中之一才能过滤出结果。

* request body参数

无

* response body参数

响应体是告警历史记录的列表。

* 相关配置

* JSON请求样例

curl -i -X GET -H 'X-Auth-Token: a4010a1c024f47a8917b60fb7167cdfb' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'User-Agent: python-ceilometerclient' http://172.128.231.201:8777/v2/alarms/c4278318-0572-45b6-96f8-e321cf44f817/history

* JSON响应样例

响应体是字符串，json格式化后为：

~~~json
[
    {
        "alarm_id": "623df1be-ca06-431e-87ae-ab46750e2c03",
        "detail": "{\"state\": \"ok\"}",
        "event_id": "da9ce15a-7694-433c-a101-f9c6e3b03060",
        "on_behalf_of": "d1578b5392f744b68dd8ad23412a8cd4",
        "project_id": "d1578b5392f744b68dd8ad23412a8cd4",
        "timestamp": "2015-01-04T19:12:14.743806",
        "type": "state transition",
        "user_id": "2630d3c577df426bab9a4d9bfa986297"
    },
    {
        "alarm_id": "623df1be-ca06-431e-87ae-ab46750e2c03",
        "detail": "{\"alarm_actions\": [], \"user_id\": \"2630d3c577df426bab9a4d9bfa986297\", \"name\": \"cpu-alarm\", \"state\": \"insufficient data\", \"timestamp\": \"2015-01-04T02:25:44.216495\", \"enabled\": true, \"state_timestamp\": \"2015-01-04T02:25:44.216495\", \"rule\": {\"meter_name\": \"cpu_util\", \"evaluation_periods\": 3, \"period\": 1800, \"statistic\": \"min\", \"threshold\": 80.0, \"query\": [{\"field\": \"resource_id\", \"type\": \"\", \"value\": \"10e8216e-4b36-4f93-942f-19b9f09e84e5\", \"op\": \"eq\"}], \"comparison_operator\": \"ge\", \"exclude_outliers\": false}, \"alarm_id\": \"623df1be-ca06-431e-87ae-ab46750e2c03\", \"time_constraints\": [{\"duration\": 10800, \"start\": \"0 23 * * *\", \"timezone\": \"\", \"name\": \"alarm-constraint-01\", \"description\": \"Time constraint at 0 23 * * * lasting for 10800 seconds\"}], \"insufficient_data_actions\": [], \"repeat_actions\": false, \"ok_actions\": [], \"project_id\": \"d1578b5392f744b68dd8ad23412a8cd4\", \"type\": \"threshold\", \"description\": \"Alarm when cpu_util is ge a min of 80.0 over 1800 seconds\"}",
        "event_id": "46bb9986-ea08-44b3-98d5-0558697adbc9",
        "on_behalf_of": "d1578b5392f744b68dd8ad23412a8cd4",
        "project_id": "d1578b5392f744b68dd8ad23412a8cd4",
        "timestamp": "2015-01-04T02:25:44.216495",
        "type": "creation",
        "user_id": "2630d3c577df426bab9a4d9bfa986297"
    }
]
~~~

## 能力（Capabilities）

### 查询能力详情（Get Capabilities）

| REST VERB | URI | DESCRIPTION |
|:----------|:----|:------------|
| GET | /v2/capabilities | 查询能力列表（查询当前版本的能力，例如分页查询是否支持等。）

* request filter参数

无

* request body参数

无

* response body参数

参见响应样例

* 相关配置

* JSON请求样例

curl -i -X GET -H 'User-Agent: python-ceilometerclient' -H 'Content-Type: application/json'  -H "X-Auth-Token: $(keystone token-get | awk 'NR==5{print $4}')" -k "https://metering.localdomain.com:8777/v2/capabilities"

* JSON响应样例

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

* request filter参数

添加过滤条件，格式为q.field={field}&q.op={operator}&q.type={type}&q.value={value}

field原则上没有任何限制，可以随便填。
如果它的值是['event_type', 'message_id', 'start_time', 'end_time']其中之一，则会把这个过滤条件施加到Event表上，此时operator，type将不会起作用。
如果不在这4个值里，则会把过滤条件施加到Trait表上。当field施加在Trait表上时，operator会起作用，默认值是eq, 只能为['lt', 'le', 'eq', 'ne', 'ge', 'gt']其中之一，类型（type）只能是['integer', 'float', 'string', 'datetime']其中之一；如果field不是一个已知的Trait，则返回结果将是空，而不是报错，这是预期的行为。

例如/v2/events?q.field=event_type&q.op=eq&q.type=string&q.value=compute.instance.update 这个过滤条件的意思是获取类型为compute.instance.update的事件。

例如/v2/events?q.field=state&q.op=eq&q.type=string&q.value=deleted这个过滤条件的意思是获取特征（trait）中状态（state）为已删除（deleted）的事件。

注意，由于bug: [https://bugs.launchpad.net/ceilometer/+bug/1407374](https://bugs.launchpad.net/ceilometer/+bug/1407374)导致了当type没有指定时会报500错误，你必须显示指定type才可以规避这个bug，这个bug存在于2014.2以及2014.2.1中。例如/v2/events?q.field=state&q.op=eq&q.type=&q.value=deleted这样写就会触发bug。

你可以同时指定多个过滤条件，也可以一个也不指定，为了API能够快速响应，同时也为了减小系统压力，请尽量使用过滤条件进行精确查询。注意，不建议使用message_id过滤，当你想只获取某个Event时，建议使用专门的Get Event接口，message_id是唯一的，使用专门的接口显得你很专业，也可以避免不必要的服务器负担。

* request body参数

无

* response body参数

参见响应示例

* 相关配置

* JSON请求样例

示例：查询系统上事件类型为compute.instance.delete.start的事件，为了方便举例，此处仅截取了响应体列表的一个元素，且对该元素进行了json格式化，实际返回的是纯文本。

curl -i -X GET -H 'X-Auth-Token: 56c50f283bb84ee28d29d77f35a3714d' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'User-Agent: python-ceilometerclient' 'http://172.128.231.201:8777/v2/events?q.field=event_type&q.op=eq&q.type=&q.value=compute.instance.delete.start'

* JSON响应样例

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

### 查询事件详情（Show Event）

| REST VERB | URI | DESCRIPTION |
|:----------|:----|:------------|
| GET | /v2/events/{message_id} | 查询某事件

注意，查询单个事件并不能比查询事件列表获取更详细的信息，但是有助于提高性能，减轻系统压力。

* request filter参数

无

* request body参数

无

* response body参数

见响应示例

* 相关配置

* JSON请求样例

curl -i -X GET -H 'X-Auth-Token: d980626ab92c4a17b1fb69f1e6eddc06' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'User-Agent: python-ceilometerclient' http://172.128.231.201:8777/v2/events/a25935cb-9d74-4f2f-9c5e-5a162f022095

* JSON响应样例

为了方便举例，对响应体进行了json格式化，实际返回的是纯文本。

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

* request filter参数

无

* request body参数

无

* response body参数

参见响应样例

* 相关配置

* JSON请求样例

curl -i -X GET -H 'X-Auth-Token: 5f113ec0cb3249219d8e5300321c2282' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'User-Agent: python-ceilometerclient' http://172.128.231.201:8777/v2/event_types/

* JSON响应样例

为了方便举例，此处仅截取了响应体列表的若干个元素（删除虚拟机的动作导致的事件），且对该元素进行了json格式化，实际返回的是纯文本。

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

* request filter参数

无

* request body参数

无

* response body参数

参见响应样例

* 相关配置

* JSON请求样例

curl -i -X GET -H 'X-Auth-Token: 1f9a3ec4845a49d8afa6faf48cd31300' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'User-Agent: python-ceilometerclient' http://172.128.231.201:8777/v2/event_types/compute.instance.delete.start/traits

* JSON响应样例

为了方便举例，对响应体进行了json格式化，实际返回的是纯文本。

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

* request filter参数

无

* request body参数

无

* response body参数

参见响应样例

* 相关配置

* JSON请求样例

curl -i -X GET -H 'X-Auth-Token: 1f9a3ec4845a49d8afa6faf48cd31300' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'User-Agent: python-ceilometerclient' http://172.128.231.201:8777/v2/event_types/compute.instance.delete.start/traits/vcpus

* JSON响应样例

为了方便举例，对响应体进行了json格式化，实际返回的是纯文本。

~~~json
[
    {
        "name": "vcpus",
        "type": "integer",
        "value": "1"
    }
]
~~~

## 指标（Meter）

### 查询指标（List Meter）

| REST VERB | URI | DESCRIPTION |
|:----------|:----|:------------|
| GET | /v2/meters?q.field={field}&q.op=eq&q.type={type}&q.value={value} | 查询指标

* request filter参数

| 参数名 | 参数类型 | 约束 | 必选 | 备注 |
|:-------|:---------|:-----|:-----|:-----|
| q.field | string | 见filed可选值表 | NO | 查询关键字
| q.op | string | 只能为eq | NO | 操作符
| q.type | string | 未知 | NO | 可以不填，填了也没用，类型自动识别
| q.value | string | N/A | NO | 值

op设置为非eq的值，则返回400。

field可选值表

| 可选值 | Value类型 | 约束 | 备注
|:-------|:----------|:-----|:-----|
| resource | string | N/A | 资源唯一标示符（UUID）
| project | string | N/A | 项目唯一标示符（UUID）
| user | string | N/A | 用户唯一标示符（UUID）
| source | string | N/A | 资源来源
| metadata.{key} | string | N/A | 使用metadata字段进行过滤，key可以是任意值
| pagination | int | N/A | 未实现，使用这个字段将返回501错误

注意：如果你错误的设置了一个不支持的field，例如/v2/meters?q.field=meta&q.op=eq&q.type=&q.value=1，则会返回400，同时告知你有哪些field被支持，消息体经过json格式化后，形如：

~~~json
{
    "error_message": {
        "debuginfo": null,
        "faultcode": "Client",
        "faultstring": "Unknown argument: \"meta\": unrecognized field in query: [<Query umeta eq u1 None>], valid keys: [metaquery, pagination, project, resource, source, user]"
    }
}
~~~

此时如果你使用metaquery，例如/v2/meters?q.field=metaquery&q.op=eq&q.type=&q.value=1，将会得到错误的输出：

~~~json
{
    "error_message": {
        "debuginfo": null,
        "faultcode": "Server",
        "faultstring": "unicode object has no attribute iteritems"
    }
}
~~~

其实你应该使用metadata，例如/v2/meters?q.field=metadata.flavor_id&q.op=eq&q.type=&q.value=1

* request body参数

无

* response body参数

见响应示例

* 相关配置

* JSON请求样例

ceilometer -d meter-list -q "resource=d950d166-4b1a-4d00-8572-c401ab4fb85c;user=2630d3c577df426bab9a4d9bfa986297"

curl -i -X GET -H 'X-Auth-Token: b1ae050d8789417c933f0fc62ceaf01c' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'User-Agent: python-ceilometerclient' http://172.128.231.201:8777/v2/meters?q.field=resource&q.field=user&q.op=eq&q.op=eq&q.type=&q.type=&q.value=d950d166-4b1a-4d00-8572-c401ab4fb85c&q.value=2630d3c577df426bab9a4d9bfa986297

* JSON响应样例

响应消息体是字符串，json格式化后为：

~~~json
[
    {
        "meter_id": "ZDk1MGQxNjYtNGIxYS00ZDAwLTg1NzItYzQwMWFiNGZiODVjK2ltYWdlLmRvd25sb2Fk\n",
        "name": "image.download",
        "project_id": "d1578b5392f744b68dd8ad23412a8cd4",
        "resource_id": "d950d166-4b1a-4d00-8572-c401ab4fb85c",
        "source": "openstack",
        "type": "delta",
        "unit": "B",
        "user_id": "2630d3c577df426bab9a4d9bfa986297"
    }
]
~~~

### 查询数据点（List Sample）

| REST VERB | URI | DESCRIPTION |
|:----------|:----|:------------|
| GET | /v2/meters/{meter_name}?limit={value}&q.field={field}&q.op={operator}&q.type={type}&q.value={value} | 查询数据点

* request filter参数

| 参数名 | 参数类型 | 约束 | 必选 | 备注 |
|:-------|:---------|:-----|:-----|:-----|
| limit | integer | 必须为非负数 | NO | 返回结果数
| q.field | string | 见filed可选值表 | NO | 查询关键字
| q.op | string | lt、le、eq、ne、ge、gt其中之一| NO | 操作符
| q.type | string | 未知 | NO | 可以不填，填了也没用，类型自动识别
| q.value | string | N/A | NO | 值

field可选值表

| 可选值 | 类型 | 约束 | 备注|
|:-------|:-----|:-----|:-----|
| message_id | string | N/A | 数据点唯一标识符（UUUID）
| meter | string | N/A | 数据点对应的指标名称
| resource | string | N/A | 资源唯一标识符（UUID）
| project | string | N/A | 资源所属的项目
| user | string | N/A | 资源所属用户
| source | string | N/A | 资源来源
| metadata.{key} | string | N/A | 使用metadata字段进行过滤，key可以是任意值
| start | string | datetime格式 | 起始时间
| start_timestamp_op | string | 只有gt、ge有效，其他值一律视为ge | 起始时间比较符，默认ge
| end | string | datetime格式 | 结束时间
| end_timestamp_op | string | 只有lt、le有效，其他值一律视为le | 起始时间比较符，默认le

当field为project、user、type时，operator只能为eq，否则报400错误。

注意：如果你错误的设置了一个不支持的field，例如/v2/meters/cpu?q.field=meta&q.op=eq&q.type=&q.value=1，则会返回400，同时告知你有哪些field被支持，消息体经json格式化后，形如：

~~~json
{
    "error_message": {
        "debuginfo": null,
        "faultcode": "Client",
        "faultstring": "Unknown argument: \"meta\": unrecognized field in query: [<Query umeta eq u1 None>], valid keys: [metaquery, pagination, project, resource, source, user]"
    }
}
~~~

此时如果你使用metaquery，例如/v2/meters/cpu?q.field=metaquery&q.op=eq&q.type=&q.value=1，将会得到错误的输出：   

~~~json
{
    "error_message": {
        "debuginfo": null,
        "faultcode": "Server",
        "faultstring": "unicode object has no attribute iteritems"
    }
}
~~~

其实你应该使用metadata，例如/v2/meters/cpu??q.field=metadata.flavor_id&q.op=eq&q.type=&q.value=1

* request body参数

无

* response body参数

见响应示例

* 相关配置

* JSON请求样例

curl -i -X GET -H 'X-Auth-Token: 8f97d271942147f8b316133ac8267da1' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'User-Agent: python-ceilometerclient' http://172.128.231.201:8777/v2/meters/image.download

* JSON响应样例

响应消息体是字符串，json格式化后为：

~~~json
[
    {
        "counter_name": "image.download",
        "counter_type": "delta",
        "counter_unit": "B",
        "counter_volume": 13147648.0,
        "message_id": "f428d746-8ee1-11e4-b699-000c29fb0ff8",
        "project_id": "d1578b5392f744b68dd8ad23412a8cd4",
        "recorded_at": "2014-12-28T22:36:24.339882",
        "resource_id": "d950d166-4b1a-4d00-8572-c401ab4fb85c",
        "resource_metadata": {
            "bytes_sent": "13147648",
            "destination_ip": "172.128.231.201",
            "event_type": "image.send",
            "host": "image.localhost",
            "image_id": "d950d166-4b1a-4d00-8572-c401ab4fb85c",
            "owner_id": "d1578b5392f744b68dd8ad23412a8cd4",
            "receiver_tenant_id": "d1578b5392f744b68dd8ad23412a8cd4",
            "receiver_user_id": "2630d3c577df426bab9a4d9bfa986297"
        },
        "source": "openstack",
        "timestamp": "2014-12-28T22:36:24.259770",
        "user_id": "2630d3c577df426bab9a4d9bfa986297"
    }
]
~~~

### 查询统计（List Statistics）

| REST VERB | URI | DESCRIPTION |
|:----------|:----|:------------|
| GET | /v2/meters/{meter_name}/statistics?period={period}&groupby={groupby}&aggregate={aggregate}&q.field={field}&q.op={operator}&q.type={type}&q.value={value} | 获取某个指标的统计信息

* request filter参数

| 参数名 | 参数类型 | 约束 | 必选 | 备注 |
|:-------|:---------|:-----|:-----|:-----|
| period | integer | >=0 | NO | 统计区间时间长度
| groupby | string | 依据数据库不同有所不同 | NO | 统计结果排序项，
| aggregate | string | ??? | NO | ???
| q.field | string | 见filed可选值表 | NO | 过滤关键字
| q.op | string | 依据q.field不同而有所不同 | NO | 过滤操作符
| q.type | string | N/A | NO | 过滤值的类型，不填，填了也不会生效
| q.value | string | 如果field为时间则需要为时间格式 | NO | 过滤值
| q.field | string | 见filed可选值表 | NO | 过滤关键字

groupby在MySQL中仅支持'user_id', 'project_id', 'resource_id'三个选项，其他值将返回501错误。

q.op当field为timestamp时，合法的值是lt, le, ge, gt，当field为其他值是，仅eq是合法值。

field可选值表

| 可选值 | 类型 | 约束 | 备注|
|:-------|:-----|:-----|:-----|
| resource | string | N/A | 资源唯一标识符（UUID）
| project | string | N/A | 资源所属项目唯一标识符（UUID）
| user | string | N/A | 资源所属用户唯一标识符（UUID）
| source | string | N/A | 资源来源
| timestamp | string | datetime格式 | 统计时间，当op为le,lt时指定的是结束时间，当op为ge,gt时指定的是开始时间
| start | string | datetime格式 | 起始时间
| start_timestamp_op | string | 只有gt、ge有效，其他值一律视为ge | 起始时间比较符，默认ge
| end | string | datetime格式 | 结束时间
| end_timestamp_op | string | 只有lt、le有效，其他值一律视为le | 起始时间比较符，默认le
| metadata.{key} | string | N/A | 资源的元数据，形如metadata.{key}，key取值无限制
| message_id | string | N/A | 数据点所对应的消息唯一标识符（UUID）
| meter | string | N/A | 不填，无效

注意：不要使用message_id进行过滤，因为那样只会查到一个数据点，进行统计没有实际意义。

* request body参数

无

* response body参数

见响应示例

* 相关配置

* JSON请求样例

ceilometer -d statistics -m image.download -q resource=d950d166-4b1a-4d00-8572-c401ab4fb85c -g project_id

curl -i -X GET -H 'X-Auth-Token: 38d2cc8fc4aa4a8bae02b96c79a507db' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'User-Agent: python-ceilometerclient' 'http://172.128.231.201:8777/v2/meters/image.download/statistics?q.field=resource&q.op=eq&q.type=&q.value=d950d166-4b1a-4d00-8572-c401ab4fb85c&groupby=project_id'

* JSON响应样例

响应消息体是字符串，json格式化后为：

~~~json
[
    {
        "avg": 13147648.0,
        "count": 1,
        "duration": 0.0,
        "duration_end": "2014-12-28T22:36:24.259770",
        "duration_start": "2014-12-28T22:36:24.259770",
        "groupby": {
            "project_id": "d1578b5392f744b68dd8ad23412a8cd4"
        },
        "max": 13147648.0,
        "min": 13147648.0,
        "period": 0,
        "period_end": "2014-12-28T22:36:24.259770",
        "period_start": "2014-12-28T22:36:24.259770",
        "sum": 13147648.0,
        "unit": "B"
    }
]
~~~

### 创建数据点（Create Sample）

| REST VERB | URI | DESCRIPTION |
|:----------|:----|:------------|
| POST | /v2/meters/{meter_name} | 创建数据点

* request filter参数

无

* request body参数

body消息体是字符串，内容是json列表，列表中的元素是字典，代表一个数据点，字段信息如下：

| 参数名 | 参数类型 | 约束 | 必选 | 备注 |
|:-------|:---------|:-----|:-----|:-----|
| counter_name | string | N/A | YES | 数据点对应的指标名称
| counter_type | string | 只能为gauge、cumulative、delta之一 | YES | 数据点对应的指标类型
| counter_unit | string | N/A | YES | 数据点对应的指标单位
| counter_volume | float | N/A | YES | 值，可以取负数！
| resource_id | string | N/A | YES | 资源唯一标识符（UUID）
| project_id | string | 仅admin可指定非自身 | NO | 资源所属租户唯一标识符（UUID）
| user_id | string | 仅admin可指定非自身 | NO | 资源所属用户唯一标识符（UUID）
| resource_metadata | string | json dict | NO | 资源元数据
| timestamp | string | datetime | NO | 时间戳
| message_signature | string | N/A | NO | 消息签名，不填，可以设置但没有效果

* response body参数

见响应示例

* 相关配置

* JSON请求样例

ceilometer -d sample-create --project-id d1578b5392f744b68dd8ad23412a8cd4 --user-id 2630d3c577df426bab9a4d9bfa986297 -r d950d166-4b1a-4d00-8572-c401ab4fb85c -m image.download --meter-unit B --meter-type delta --sample-volume 10086 --timestamp '2014-12-28T22:36:24.259770' --resource-metadata '{"status": "bad"}'

curl -i -X POST -H 'X-Auth-Token: da9aec1e13644bcdb1fd703cfb386fe3' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'User-Agent: python-ceilometerclient' -d '[{"counter_name": "image.download", "user_id": "2630d3c577df426bab9a4d9bfa986297", "resource_id": "d950d166-4b1a-4d00-8572-c401ab4fb85c", "timestamp": "2014-12-28T22:36:24.259770", "counter_unit": "B", "counter_volume": "10086", "project_id": "d1578b5392f744b68dd8ad23412a8cd4", "resource_metadata": {"status": "bad"}, "counter_type": "delta"}]' http://172.128.231.201:8777/v2/meters/image.download

请求体经过json格式化后为：

~~~json
[
    {
        "counter_name": "image.download",
        "counter_type": "delta",
        "counter_unit": "B",
        "counter_volume": "10086",
        "project_id": "d1578b5392f744b68dd8ad23412a8cd4",
        "resource_id": "d950d166-4b1a-4d00-8572-c401ab4fb85c",
        "resource_metadata": {
            "status": "bad"
        },
        "timestamp": "2014-12-28T22:36:24.259770",
        "user_id": "2630d3c577df426bab9a4d9bfa986297"
    }
]
~~~

* JSON响应样例

响应消息体是字符串，经过json格式化后为：

~~~json
[
    {
        "counter_name": "image.download",
        "counter_type": "delta",
        "counter_unit": "B",
        "counter_volume": 10086.0,
        "message_id": "9ed9413e-950f-11e4-bf95-000c29fb0ff8",
        "project_id": "d1578b5392f744b68dd8ad23412a8cd4",
        "resource_id": "d950d166-4b1a-4d00-8572-c401ab4fb85c",
        "resource_metadata": {
            "status": "bad"
        },
        "source": "d1578b5392f744b68dd8ad23412a8cd4:openstack",
        "timestamp": "2014-12-28T22:36:24.259770",
        "user_id": "2630d3c577df426bab9a4d9bfa986297"
    }
]
~~~

## 资源（Resource）

### 查询资源（List Resources）

| REST VERB | URI | DESCRIPTION |
|:----------|:----|:------------|
| GET | /v2/resources?meter_links={meter_links}&q.field={field}&q.op={operator}&q.type={type}&q.value={value} | 查询资源

* request filter参数

| 参数名 | 参数类型 | 约束 | 必选 | 备注 |
|:-------|:---------|:-----|:-----|:-----|
| meter_links | string | N/A | NO | 是否返回该资源关联的指标的链接，默认为True
| q.field | string | 见filed可选值表 | NO | 查询关键字
| q.op | string | 只能为lt、le、eq、ne、ge、gt其中之一 | NO | 操作符
| q.type | string | 未知 | NO | 可以不填，填了也没用，类型自动识别
| q.value | string | N/A | NO | 值

meter_links是个bool值，但是在URL里实际上是指定一个字符串，Ceilometer会将其转化为bool类型，转化规则如下：
t, true, on, y, yes, 1转化为True， 大小写不敏感。 其他则取值为False。

field可选值表

| 可选值 | 类型 | 约束 | 备注 |
|:-------|:-----|:-----|:-----|
| resource | string | N/A | 资源唯一标示符
| project | string | N/A | 资源所属项目
| user | string | N/A | 资源所属用户
| source | string | N/A | 资源来源
| metadata.{key} | string | N/A | 使用metadata字段进行过滤，key可以是任意值
| start_timestamp | string | datetime格式 | 起始时间
| start_timestamp_op | string | 只有gt、ge有效，其他值一律视为ge | 起始时间比较符，默认ge
| end_timestamp | string | datetime格式 | 结束时间
| end_timestamp_op | string | 只有lt、le有效，其他值一律视为le | 起始时间比较符，默认le
| pagination | string | N/A | 目前不支持，使用这个字段将返回501错误

注意：如果你想获取单个资源的信息，不建议使用resource进行过滤，推荐使用专门的[查询资源详情](#查询资源详情show-resource)接口。使用专门的接口显得您更专业，而且可以提高响应速度。

注意：如果你错误的设置了一个不支持的field，例如/v2/resources?q.field=meta&q.op=eq&q.type=&q.value=False，则会返回400，同时告知你有哪些field被支持，消息体经过json格式化后，形如：

~~~json
{
    "error_message": {
        "debuginfo": null,
        "faultcode": "Client",
        "faultstring": "Unknown argument: \"meta\": unrecognized field in query: [<Query umeta eq u1 None>], valid keys: [end_timestamp, end_timestamp_op, metaquery, pagination, project, resource, source, start_timestamp, start_timestamp_op, user]"
    }
}
~~~

此时如果你使用metaquery，例如/v2/resources?q.field=metaquery&q.op=eq&q.type=&q.value=False，将会得到错误的输出：

~~~json
{
    "error_message": {
        "debuginfo": null,
        "faultcode": "Server",
        "faultstring": "unicode object has no attribute iteritems"
    }
}
~~~

其实你应该使用metadata，例如/v2/resources?q.field=metadata.protected&q.op=eq&q.type=&q.value=False

* request body参数

无

* response body参数

见响应示例

* 相关配置

* JSON请求样例

curl -i -X GET -H 'User-Agent: python-ceilometerclient' -H 'Content-Type: application/json'  -H "X-Auth-Token: $(keystone token-get | awk 'NR==5{print $4}')" -k "https://metering.localdomain.com:8777/v2/resources"

* JSON响应样例

响应消息体是字符串，json格式化后为：

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

### 查询资源详情（Show Resource）

| REST VERB | URI | DESCRIPTION |
|:----------|:----|:------------|
| GET | /v2/resources/{resource_id} | 查询资源详情

* request filter参数

无

* request body参数

无

* response body参数

见响应示例

* 相关配置

* JSON请求样例

curl -i -X GET -H 'User-Agent: python-ceilometerclient' -H 'Content-Type: application/json'  -H "X-Auth-Token: $(keystone token-get | awk 'NR==5{print $4}')" -k "https://metering.localdomain.com:8777/v2/resources/2ff58fab-ee6c-40ee-90b7-299452ef5b92"

* JSON响应样例

响应消息体是字符串，json格式化后为：

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

## 复合查询（Query）

复合查询使用POST方法，把查询条件放到了请求消息体中。

### 复合查询告警（Query Alarms）

| REST VERB | URI | DESCRIPTION |
|:----------|:----|:------------|
| POST | /v2/query/alarms | 复合查询告警

* request filter参数

无

* request body参数

字符串，内容是json字典，包含三个字段

| 参数名 | 参数类型 | 约束 | 必选 | 备注 |
|:-------|:---------|:-----|:-----|:-----|
| filter | dict | | NO | 过滤条件
| orderby | list | | NO | 返回的结果排序规则
| limit | integer | 正整数 | NO | 返回的结果数量

filter是对告警的过滤条件，是一个内容为json字典的字符串，格式是{complex_op: [{simple_op: {field_name: value}}]}，complex_op只能是and或者or，simple_op只能是['=', '!=', '<', '<=', '>', '>=', '=<', '=>']其中之一。注意field_name必须是所查询资源的直接属性。

经过json格式化后形如：

~~~
{
    "and": [
        {
            "and": [
                {
                    "=": {
                        "project_id": "9d26e147-7b0d-48b3-9641-bd831919fd71"
                    }
                },
                {
                    "=": {
                        "state": "alarm"
                    }
                },
            ]
        },
        {
            "or": [
                {
                    "and": [
                        {
                            ">": {
                                "state_timestamp": "2013-12-01T18:00:00"
                            }
                        },
                        {
                            "<": {
                                "state_timestamp": "2013-12-01T18:15:00"
                            }
                        }
                    ]
                },
                {
                    "and": [
                        {
                            ">": {
                                "state_timestamp": "2013-12-01T18:30:00"
                            }
                        },
                        {
                            "<": {
                                "state_timestamp": "2013-12-01T18:45:00"
                            }
                        }
                    ]
                }
            ]
        }
    ]
}
~~~

它的意思是：过滤9d26e147-7b0d-48b3-9641-bd831919fd71租户下的状态为alarm的告警，并且这些告警是在2013-12-01T18:00:00到2013-12-01T18:15:00之间，或者在2013-12-01T18:30:00到2013-12-01T18:45:00之间被触发的。
在命令行中可以通过-f选项指定，例如：ceilometer -d query-alarms -f '{"and": [{"and": [{"=": {"project_id": "9d26e147-7b0d-48b3-9641-bd831919fd71"}}, {"=": {"state": "alarm"}}]}, {"or": [{"and": [{">": {"timestamp": "2013-12-01T18:00:00"}}, {"<": {"timestamp": "2013-12-01T18:15:00"}}]}, {"and": [{">": {"timestamp": "2013-12-01T18:30:00"}}, {"<": {"timestamp": "2013-12-01T18:45:00"}}]}]}]}'

orderby是一个字符串，内容是一个json列表，每个元素是一个{key: value}字典，key必须是所查询资源的的直接属性名称，value只能是asc、desc其中之一，不区分大小写。排在前面的key值享有优先排序权。
注意：虽然threshold_rule和combination_rule是告警的属性，但是在数据库中他们都统一为rule，因此，如果key指定为了threshold_rule或者combination_rule，会返回400错误，但是指定rule就没问题。
注意：告警属性只支持第一层属性，例如rule.threshold这种指定方式是不行的。

* response body参数

见响应示例

* 相关配置

* JSON请求样例

ceilometer -d query-alarms -l 1 -o '[{"timestamp": "asc"},{"state": "asc"}]'

curl -i -X POST -H 'X-Auth-Token: 400015cb3dbe424ba5db37ceb71e03c4' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'User-Agent: python-ceilometerclient' -d '{"orderby": "[{\"timestamp\": \"asc\"},{\"state\": \"asc\"}]", "limit": "1"}' http://172.128.231.201:8777/v2/query/alarms

请求体json格式化后为：

~~~json
{
    "limit": "1",
    "orderby": "[{\"timestamp\": \"asc\"},{\"state\": \"asc\"}]"
}
~~~

* JSON响应样例

响应是个字符串，json格式化后为：

~~~json
[
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
        "state_timestamp": "2015-01-04T22:59:35.247432",
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
            "threshold": 70.0
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
        "timestamp": "2015-01-04T18:38:17.705821",
        "type": "threshold",
        "user_id": "2630d3c577df426bab9a4d9bfa986297"
    }
]
~~~

### 复合查询告警历史（Query Alarm History）

| REST VERB | URI | DESCRIPTION |
|:----------|:----|:------------|
| POST | /v2/query/alarms/history | 复合查询告警历史

* request filter参数

无

* request body参数

参见[复合查询告警](#复合查询告警query-alarms)

* response body参数

见响应示例

* 相关配置

* JSON请求样例

例如，查找告警623df1be-ca06-431e-87ae-ab46750e2c03在2015-01-03T00:00:00到2015-01-04T20:00:00之间的变更记录，只查类型不为rule change的变更，结果按照时间戳降序、类型升序排序，只返回前10条。

ceilometer -d query-alarm-history -l 10 -o '[{"timestamp": "desc"}, {"type": "asc"}]' -f '{"and": [{">": {"timestamp": "2015-01-03T00:00:00"}}, {"<": {"timestamp": "2015-01-04T20:00:00"}}, {"=": {"alarm_id": "623df1be-ca06-431e-87ae-ab46750e2c03"}}, {"!=": {"type": "rule change"}}]}'

curl -i -X POST -H 'X-Auth-Token: be91fe144241402d87678e0a7a0d9100' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'User-Agent: python-ceilometerclient' -d '{"filter": "{\"and\": [{\">\": {\"timestamp\": \"2015-01-03T00:00:00\"}}, {\"<\": {\"timestamp\": \"2015-01-04T20:00:00\"}}, {\"=\": {\"alarm_id\": \"623df1be-ca06-431e-87ae-ab46750e2c03\"}}, {\"!=\": {\"type\": \"rule change\"}}]}", "orderby": "[{\"timestamp\": \"desc\"}, {\"type\": \"asc\"}]", "limit": "10"}' http://172.128.231.201:8777/v2/query/alarms/history

请求体经过json格式化后为：

~~~json
{
    "filter": "{\"and\": [{\">\": {\"timestamp\": \"2015-01-03T00:00:00\"}}, {\"<\": {\"timestamp\": \"2015-01-04T20:00:00\"}}, {\"=\": {\"alarm_id\": \"623df1be-ca06-431e-87ae-ab46750e2c03\"}}, {\"!=\": {\"type\": \"rule change\"}}]}",
    "limit": "10",
    "orderby": "[{\"timestamp\": \"desc\"}, {\"type\": \"asc\"}]"
}
~~~

* JSON响应样例

响应消息体是字符串，json格式化后为：

~~~json
[
    {
        "alarm_id": "623df1be-ca06-431e-87ae-ab46750e2c03",
        "detail": "{\"state\": \"ok\"}",
        "event_id": "da9ce15a-7694-433c-a101-f9c6e3b03060",
        "on_behalf_of": "d1578b5392f744b68dd8ad23412a8cd4",
        "project_id": "d1578b5392f744b68dd8ad23412a8cd4",
        "timestamp": "2015-01-04T19:12:14.743806",
        "type": "state transition",
        "user_id": "2630d3c577df426bab9a4d9bfa986297"
    },
    {
        "alarm_id": "623df1be-ca06-431e-87ae-ab46750e2c03",
        "detail": "{\"alarm_actions\": [], \"user_id\": \"2630d3c577df426bab9a4d9bfa986297\", \"name\": \"cpu-alarm\", \"state\": \"insufficient data\", \"timestamp\": \"2015-01-04T02:25:44.216495\", \"enabled\": true, \"state_timestamp\": \"2015-01-04T02:25:44.216495\", \"rule\": {\"meter_name\": \"cpu_util\", \"evaluation_periods\": 3, \"period\": 1800, \"statistic\": \"min\", \"threshold\": 80.0, \"query\": [{\"field\": \"resource_id\", \"type\": \"\", \"value\": \"10e8216e-4b36-4f93-942f-19b9f09e84e5\", \"op\": \"eq\"}], \"comparison_operator\": \"ge\", \"exclude_outliers\": false}, \"alarm_id\": \"623df1be-ca06-431e-87ae-ab46750e2c03\", \"time_constraints\": [{\"duration\": 10800, \"start\": \"0 23 * * *\", \"timezone\": \"\", \"name\": \"alarm-constraint-01\", \"description\": \"Time constraint at 0 23 * * * lasting for 10800 seconds\"}], \"insufficient_data_actions\": [], \"repeat_actions\": false, \"ok_actions\": [], \"project_id\": \"d1578b5392f744b68dd8ad23412a8cd4\", \"type\": \"threshold\", \"description\": \"Alarm when cpu_util is ge a min of 80.0 over 1800 seconds\"}",
        "event_id": "46bb9986-ea08-44b3-98d5-0558697adbc9",
        "on_behalf_of": "d1578b5392f744b68dd8ad23412a8cd4",
        "project_id": "d1578b5392f744b68dd8ad23412a8cd4",
        "timestamp": "2015-01-04T02:25:44.216495",
        "type": "creation",
        "user_id": "2630d3c577df426bab9a4d9bfa986297"
    }
]
~~~

### 复合查询数据点（Query Samples）

| REST VERB | URI | DESCRIPTION |
|:----------|:----|:------------|
| POST | /v2/query/samples | 复合查询数据点

* request filter参数

无

* request body参数

参见[复合查询告警](#复合查询告警query-alarms)

* response body参数

见响应示例

* 相关配置

* JSON请求样例

例如，查询在2014-12-28T20:00:00到2014-12-28T21:00:00之间的，指标为memory的数据点，仅返回一条：

ceilometer -d query-samples -f '{"and": [{">": {"timestamp": "2014-12-28T20:00:00"}}, {"<": {"timestamp": "2014-12-28T21:00:00"}}, {"=": {"meter": "memory"}}]}' -l 1

curl -i -X POST -H 'X-Auth-Token: bb41b48c1dfa414aa807fe1886d77bc3' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'User-Agent: python-ceilometerclient' -d '{"filter": "{\"and\": [{\">\": {\"timestamp\": \"2014-12-28T20:00:00\"}}, {\"<\": {\"timestamp\": \"2014-12-28T21:00:00\"}}, {\"=\": {\"meter\": \"memory\"}}]}", "limit": "1"}' http://172.128.231.201:8777/v2/query/samples

请求体经json格式化后为：

~~~json
{
    "filter": "{\"and\": [{\">\": {\"timestamp\": \"2014-12-28T20:00:00\"}}, {\"<\": {\"timestamp\": \"2014-12-28T21:00:00\"}}, {\"=\": {\"meter\": \"memory\"}}]}",
    "limit": "1"
}
~~~

* JSON响应样例

响应消息体是字符串，经过json格式化后为：

~~~json
[
    {
        "id": "10ad185a-8ed3-11e4-b699-000c29fb0ff8",
        "metadata": {
            "access_ip_v4": "None",
            "access_ip_v6": "None",
            "architecture": "None",
            "availability_zone": "None",
            "cell_name": "",
            "created_at": "2014-12-28 20:11:51+00:00",
            "deleted_at": "2014-12-28T20:49:49.573885",
            "disk_gb": "1",
            "display_name": "vm-01",
            "ephemeral_gb": "0",
            "event_type": "compute.instance.delete.end",
            "host": "compute.openstack",
            "hostname": "vm-01",
            "image_meta.base_image_ref": "d950d166-4b1a-4d00-8572-c401ab4fb85c",
            "image_meta.container_format": "bare",
            "image_meta.disk_format": "qcow2",
            "image_meta.min_disk": "1",
            "image_meta.min_ram": "0",
            "image_ref_url": "http://172.128.231.201:9292/images/d950d166-4b1a-4d00-8572-c401ab4fb85c",
            "instance_flavor_id": "1",
            "instance_id": "9e5c1931-eb85-42dd-ae7c-a12224dfd3c4",
            "instance_type": "m1.tiny",
            "instance_type_id": "2",
            "kernel_id": "",
            "launched_at": "",
            "memory_mb": "512",
            "node": "None",
            "os_type": "None",
            "progress": "",
            "ramdisk_id": "",
            "reservation_id": "r-wqs6rw81",
            "root_gb": "1",
            "state": "error",
            "state_description": "deleting",
            "tenant_id": "d1578b5392f744b68dd8ad23412a8cd4",
            "terminated_at": "",
            "user_id": "2630d3c577df426bab9a4d9bfa986297",
            "vcpus": "1"
        },
        "meter": "memory",
        "project_id": "d1578b5392f744b68dd8ad23412a8cd4",
        "recorded_at": "2014-12-28T20:49:49.770677",
        "resource_id": "9e5c1931-eb85-42dd-ae7c-a12224dfd3c4",
        "source": "openstack",
        "timestamp": "2014-12-28T20:49:49.600004",
        "type": "gauge",
        "unit": "MB",
        "user_id": "2630d3c577df426bab9a4d9bfa986297",
        "volume": 512.0
    }
]
~~~

## 数据点（Sample）

### 查询数据点（Get Samples）

| REST VERB | URI | DESCRIPTION |
|:----------|:----|:------------|
| GET | /v2/samples?limit={limit}&q.field={field}&q.op={operator}&q.type={type}&q.value={value} | 查询数据点

* request filter参数

| 参数名 | 参数类型 | 约束 | 必选 | 备注 |
|:-------|:---------|:-----|:-----|:-----|
| limit | integer | >=0 | NO | 返回数量
| q.field | string | 见filed可选值表 | NO | 查询关键字
| q.op | string | 只能为lt、le、eq、ne、ge、gt其中之一 | NO | 操作符
| q.type | string | 未知 | NO | 不填，填了也没用
| q.value | string | N/A | NO | 值

field可选值表

| 可选值 | 类型 | 约束 | 备注 |
|:-------|:-----|:-----|:-----|
| 可选值 | 类型 | 约束 | 备注|
|:-------|:-----|:-----|:-----|
| message_id | string | N/A | 数据点唯一标识符（UUUID）
| meter | string | N/A | 数据点对应的指标名称
| resource | string | N/A | 资源唯一标识符（UUID）
| project | string | N/A | 资源所属的项目
| user | string | N/A | 资源所属用户
| source | string | N/A | 资源来源
| metadata.{key} | string | N/A | 使用metadata字段进行过滤，key可以是任意值
| start | string | datetime格式 | 起始时间
| start_timestamp_op | string | 只有gt、ge有效，其他值一律视为ge | 起始时间比较符，默认ge
| end | string | datetime格式 | 结束时间
| end_timestamp_op | string | 只有lt、le有效，其他值一律视为le | 起始时间比较符，默认le

当field为project、user、type时，operator只能为eq，否则报400错误。

* request body参数

无

* response body参数

见响应示例

* 相关配置

* JSON请求样例

curl -i -X GET -H 'X-Auth-Token: 949eb857896347d19c4323c6bc4c1b3b' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'User-Agent: python-ceilometerclient' 'http://172.128.231.201:8777/v2/samples?limit=1'

* JSON响应样例

响应消息体是字符串，json格式化后为：

~~~json
[
    {
        "id": "965aa632-908d-11e4-88e3-000c29fb0ff8",
        "metadata": {
            "checksum": "d972013792949d0d3ba628fbe8685bce",
            "container_format": "bare",
            "created_at": "2014-11-04T17:44:13",
            "deleted": "False",
            "deleted_at": "None",
            "disk_format": "qcow2",
            "is_public": "False",
            "min_disk": "0",
            "min_ram": "0",
            "name": "myImage",
            "protected": "False",
            "size": "13147648",
            "status": "active",
            "updated_at": "2014-11-04T17:44:13"
        },
        "meter": "image",
        "project_id": "d1578b5392f744b68dd8ad23412a8cd4",
        "recorded_at": "2014-12-31T01:37:31.546006",
        "resource_id": "d950d166-4b1a-4d00-8572-c401ab4fb85c",
        "source": "openstack",
        "timestamp": "2014-12-31T01:37:31",
        "type": "gauge",
        "unit": "image",
        "user_id": null,
        "volume": 1.0
    }
]
~~~

### 查询数据点详情（Show Sample）

| REST VERB | URI | DESCRIPTION |
|:----------|:----|:------------|
| GET | /v2/samples/{id} | 查询数据点详情

注意：id是数据点的id，和message_id并不一致。

注意：此接口返回的字段并不比列表中的字段更多。使用此接口是方便查询单个的时候提高性能。

* request filter参数

无

* request body参数

无

* response body参数

见响应示例

* 相关配置

* JSON请求样例

curl -i -X GET -H 'X-Auth-Token: 949eb857896347d19c4323c6bc4c1b3b' -H 'Content-Type: application/json' -H 'Accept: application/json' -H 'User-Agent: python-ceilometerclient' 'http://172.128.231.201:8777/v2/samples/965aa632-908d-11e4-88e3-000c29fb0ff8'

* JSON响应样例

响应消息体是字符串，json格式化后为：

~~~json
{
    "id": "965aa632-908d-11e4-88e3-000c29fb0ff8",
    "metadata": {
        "checksum": "d972013792949d0d3ba628fbe8685bce",
        "container_format": "bare",
        "created_at": "2014-11-04T17:44:13",
        "deleted": "False",
        "deleted_at": "None",
        "disk_format": "qcow2",
        "is_public": "False",
        "min_disk": "0",
        "min_ram": "0",
        "name": "myImage",
        "protected": "False",
        "size": "13147648",
        "status": "active",
        "updated_at": "2014-11-04T17:44:13"
    },
    "meter": "image",
    "project_id": "d1578b5392f744b68dd8ad23412a8cd4",
    "recorded_at": "2014-12-31T01:37:31.546006",
    "resource_id": "d950d166-4b1a-4d00-8572-c401ab4fb85c",
    "source": "openstack",
    "timestamp": "2014-12-31T01:37:31",
    "type": "gauge",
    "unit": "image",
    "user_id": null,
    "volume": 1.0
}
~~~
