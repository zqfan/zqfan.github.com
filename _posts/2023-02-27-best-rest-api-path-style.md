---
layout: post
title: ReSTful 命名风格最佳实践
categories: API
description: restful api naming style best practice
keywords: API, REST, AWS, OpenStack
---

REST，全拼为 Representational State Transfer，或者说 ReSTful API 是一套系统化约定的风格集合，既不是协议也不是标准，只是一种风格。API 开发者可以有不同的实现方式，这就意味者 API URI 中路径（Path）、QueryString 请求参数和请求体参数命名风格，也可以有多种选择。那么，那种命名风格最好呢？

例如，如果我们提供一个 API 返回 `Hello World!` 信息，可选的风格可能有如下几种：

1. 小驼峰：`https://zqfan.cc/api/v1/helloWorld`
1. 大驼峰：`https://zqfan.cc/api/v1/HelloWorld`
1. 全小写：`https://zqfna.cc/api/v1/helloworld`
1. 下划线：`https://zqfan.cc/api/v1/hello_world`
1. 横杠：`https://zqfan.cc/api/v1/hello-world`

答案也很简单，任意选一个，并贯彻到所有接口就可以了。但是知易行难，这并不是一件容易的事情。

我们挑选比较有名的商业云计算代表 AWS 和 开源云计算代表 OpenStack 两家的 API 分析一下。

## AWS S3 API

[AWS S3 API](https://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html) 几乎是对象存储领域的业界标准了，其他厂商提供对象存储服务的时候，是否兼容 AWS S3 API 是用户 的一大诉求。我们将目前（2023-02-27）S3 所有 API 分类如下：

一元单词，无法区分风格的（注意，由于 REST API 本身没有名称，此处仅为代称）：
1. CopyObject
1. CreateBucket
1. CreateMultipartUpload
1. DeleteBucket
1. DeleteBucketAnalyticsConfiguration
1. DeleteBucketCors
1. DeleteBucketEncryption
1. DeleteBucketInventoryConfiguration
1. DeleteBucketLifecycle
1. DeleteBucketMetricsConfiguration
1. DeleteBucketPolicy
1. DeleteBucketReplication
1. DeleteBucketTagging
1. DeleteBucketWebsite
1. DeleteObjects
1. GetBucketAccelerateConfiguration
1. GetBucketAcl
1. GetBucketAnalyticsConfiguration
1. GetBucketCors
1. GetBucketEncryption
1. GetBucketInventoryConfiguration
1. GetBucketLifecycle
1. GetBucketLifecycleConfiguration
1. GetBucketLocation
1. GetBucketLogging
1. GetBucketMetricsConfiguration
1. GetBucketNotification
1. GetBucketNotificationConfiguration
1. GetBucketPolicy
1. GetBucketReplication
1. GetBucketTagging
1. GetBucketVersioning
1. GetBucketWebsite
1. GetObjectTorrent
1. HeadBucket
1. ListBuckets
1. PutBucketAccelerateConfiguration
1. PutBucketAcl
1. PutBucketAnalyticsConfiguration
1. PutBucketCors
1. PutBucketEncryption
1. PutBucketInventoryConfiguration
1. PutBucketLifecycle
1. PutBucketLifecycleConfiguration
1. PutBucketLogging
1. PutBucketMetricsConfiguration
1. PutBucketNotification
1. PutBucketNotificationConfiguration
1. PutBucketPolicy
1. PutBucketReplication
1. PutBucketTagging
1. PutBucketVersioning
1. PutBucketWebsite
1. PutObject

小驼峰风格，共计：
1. [AbortMultipartUpload](https://docs.aws.amazon.com/AmazonS3/latest/API/API_AbortMultipartUpload.html), uploadId
1. [CompleteMultipartUpload](https://docs.aws.amazon.com/AmazonS3/latest/API/API_CompleteMultipartUpload.html), uploadId
1. DeleteBucketOwnershipControls, ownershipControls
1. DeleteObject, versionId
1. DeleteObjectTagging, versionId
1. DeletePublicAccessBlock, publicAccessBlock
1. GetBucketOwnershipControls, ownershipControls
1. GetBucketPolicyStatus, policyStatus
1. GetBucketRequestPayment, requestPayment
1. GetObjectAcl, versionId
1. GetObjectAttributes, versionId
1. GetObjectRetention, versionId
1. GetObjectTagging, versionId
1. GetPublicAccessBlock, publicAccessBlock
1. HeadObject, partNumber, versionId
1. PutBucketOwnershipControls, ownershipControls
1. PutBucketRequestPayment, requestPayment
1. PutObjectAcl, versionId
1. PutObjectRetention, versionId
1. PutObjectTagging, versionId
1. PutPublicAccessBlock, publicAccessBlock
1. RestoreObject, versionId
1. UploadPart, partNumber, uploadId
1. UploadPartCopy, partNumber, uploadId

横杠风格，共计：
1. [DeleteBucketIntelligentTieringConfiguration](https://docs.aws.amazon.com/AmazonS3/latest/API/API_DeleteBucketIntelligentTieringConfiguration.html), intelligent-tiering
1. GetBucketIntelligentTieringConfiguration, intelligent-tiering
1. GetObjectLockConfiguration, object-lock
1. ListBucketAnalyticsConfigurations, continuation-token
1. ListBucketIntelligentTieringConfigurations. intelligent-tiering, continuation-token
1. ListBucketInventoryConfigurations, continuation-token
1. ListBucketMetricsConfigurations, continuation-token
1. ListMultipartUploads, encoding-type, key-marker, max-uploads, upload-id-marker
1. ListObjects, encoding-type, max-keys
1. ListObjectsV2, list-type, continuation-token, encoding-type, fetch-owner, max-keys, start-after
1. ListObjectVersions, encoding-type, key-marker, max-keys, version-id-marker
1. PutBucketIntelligentTieringConfiguration, intelligent-tiering
1. PutObjectLockConfiguration, object-lock
1. SelectObjectContent, select-type

小驼峰和横杠混合风格，共计：
1. GetObject, partNumber, versionId, response-cache-control, response-content-disposition, response-content-encoding, response-content-language, response-content-type, response-expires
1. GetObjectLegalHold, versionId, legal-hold
1. ListParts, uploadId, max-parts, part-number-marker
1. PutObjectLegalHold, versionId, legal-hold

大驼峰风格，共计：
1. WriteGetObjectResponse, WriteGetObjectResponse

可以看到，小驼峰和横杠风格的大致相同，并且有个别接口两者都出现了（均为请求参数），此外还有极个别的大驼峰参数。

阅读 AWS S3 API 文档还能够发现，许多接口将一些参数定义在 HTTP 头部中，同时也有其他参数定义在 URI 和请求体中。出现在 HTTP 头部的参数基本为全小写横杠分隔（x-amz-前缀，HTTP 标准头部则为大驼峰横杠分隔），但也有例外 [GetObject](https://docs.aws.amazon.com/AmazonS3/latest/API/API_GetObject.html) 出现大驼峰和横杠的头部。涉及到术语 MD5 时，采用的是大写，但其他术语又是全小写，如 sdk，mfa，sha1。出现在请求体中的均为大驼峰。

### AWS S3 Control API
我们再看看 AWS S3 Control API，分析发现：

一元单词，无法区分风格，共计：
1. CreateBucket
1. CreateJob
1. DeleteBucket
1. DeleteBucketPolicy
1. DeleteBucketTagging
1. DeleteJobTagging
1. DescribeJob
1. GetBucket
1. GetBucketPolicy
1. GetBucketTagging
1. GetBucketVersioning
1. GetJobTagging
1. GetMultiRegionAccessPoint
1. GetMultiRegionAccessPointPolicy
1. GetMultiRegionAccessPointRoutes
1. PutBucketPolicy
1. PutBucketTagging
1. PutBucketVersioning
1. PutJobTagging
1. UpdateJobPriority

全小写风格，共计：
1. CreateAccessPoint
1. CreateAccessPointForObjectLambda
1. DeleteAccessPoint
1. DeleteAccessPointForObjectLambda
1. DeleteAccessPointPolicy
1. DeleteAccessPointPolicyForObjectLambda
1. DeleteBucketLifecycleConfiguration
1. DeleteStorageLensConfiguration
1. DeleteStorageLensConfigurationTagging
1. GetAccessPoint
1. GetAccessPointConfigurationForObjectLambda
1. GetAccessPointForObjectLambda
1. GetAccessPointPolicy
1. GetAccessPointPolicyForObjectLambda
1. GetBucketLifecycleConfiguration
1. GetMultiRegionAccessPointPolicyStatus
1. GetStorageLensConfiguration
1. GetStorageLensConfigurationTagging
1. PutAccessPointConfigurationForObjectLambda
1. PutAccessPointPolicy
1. PutAccessPointPolicyForObjectLambda
1. PutBucketLifecycleConfiguration
1. PutStorageLensConfiguration
1. PutStorageLensConfigurationTagging
1. SubmitMultiRegionAccessPointRoutes

小驼峰风格，共计：
1. DeletePublicAccessBlock
1. GetPublicAccessBlock
1. ListJobs
1. ListMultiRegionAccessPoints
1. ListRegionalBuckets
1. PutPublicAccessBlock
1. UpdateJobStatus

全小写和小驼峰混合风格，共计：
1. GetAccessPointPolicyStatus
1. GetAccessPointPolicyStatusForObjectLambda
1. ListAccessPoints
1. ListAccessPointsForObjectLambda
1. ListStorageLensConfigurations

横杠风格，共计：
1. CreateMultiRegionAccessPoint
1. DeleteMultiRegionAccessPoint
1. PutMultiRegionAccessPointPolicy

横杠和下划线混合风格，共计：
1. DescribeMultiRegionAccessPointOperation

我们可以看到，AWS S3 Control API 更偏向全小写风格，也有小驼峰以及小驼峰混合全小写的情况，也有横杠风格，极个别出现横杠和下划线混合的情况。

## OpenStack Nova API

OpenStack 是以开源云计算操作系统为目标，运营得较好的社区。代码检视比较严格，尤其是核心项目。我们选择其中最核心的计算模块，也是元老项目的 Nova 为例，分析下 [OpenStack Nova API](https://docs.openstack.org/api-ref/compute/) 的风格。

Nova 的 API 风格更为彻底的遵循了 REST 风格，和 AWS S3 API 还在使用 XML 不同，Nova 使用 Json 格式进行数据交互。但是风格统一程度和 AWS 一样，并不高。

Path 中参数命名风格：
- 变量参数统一下划线风格
- 固定路径名横杠风格，较多，例如 `/servers/{server_id}/remote-consoles`
- 固定路径名横杠和下划线混用，较少，例如 `/servers/{server_id}/os-volume_attachments`

QueryString 中参数命名风格：
- 下划线风格，最多，例如 `access_ip_v4`
- 横杠风格，较多，例如 `changes-since`
- 小驼峰，较少，例如 `minDisk`

请求体中参数命名风格：
- 小驼峰风格，较多，例如 `flavorRef`
- 下划线风格，较多，例如 `availability_zone`
- 冒号风格，较多，例如 `os:scheduler_hints.build_near_host_ip`
- 横杠，较少，例如 `OS-DCF:diskConfig`

对于资源的多种操作，将其定义为 `POST /servers/{server_id}/action`，在请求体中给出 action 实际参数名，风格为大驼峰。

也有使用 GET 语义的操作，例如 `GET /os-hosts/{host_name}/reboot` 重启机器。

[原文](https://zqfan.github.io/) 由 [zqfan (zhiqiangfan@tencent.com)](https://github.com/zqfan) 发表。版权声明（License）: (CC 4.0) BY-NC-SA
