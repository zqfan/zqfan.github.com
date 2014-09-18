---
layout: post
title: "google app engine"
description: ""
category: "other"
tags: []
---
{% include JB/setup %}

## 大局域网相关

### google有效ip获取方式

有很多版本可供选择：

* https://code.google.com/p/goagent/issues/detail?id=14644，#31亲测可用
* https://github.com/PeerXu/google-ip-explorer，未验证

### appspot无法访问

将goagent/local/proxy.ini中profile/ipv4段下的appspot设置为`.appspot.com = google_hk,forcehttps,fakehttps`

### google-analytics无法访问

访问https://www.google.com.hk/analytics/作为替代

### gae不识别goagent证书

使用goagent代理上传gae应用时会报证书错误，fancy_urllib.InvalidCertificateException: Host 127.0.0.1:8087 returned an invalid certificate (_ssl.c:504: error:14090086:SSL routines:SSL3_GET_SERVER_CERTIFICATE:certificate verify failed)，将goagent/local/CA.crt中的证书拷贝到google_appengine/lib/cacerts/cacerts.txt末尾即可，[详见原文](https://chenj.in/2011/11/30/upload-application-to-gae-with-goagent-in-lan/)

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
