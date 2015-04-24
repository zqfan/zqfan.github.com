---
layout: post
title: "google app engine"
description: ""
category: ""
tags: []
---
{% include JB/setup %}

# Install Google App Engine SDK

0. install SDK: `curl https://sdk.cloud.google.com/ | bash`
0. restart your shell, sign in to Google Cloud Platform: `gcloud auth login`,
0. install App Engine package for Python: `gcloud components update gae-python`

### 大中华局域网相关问题

头两个命令均需翻墙。第三个命令不需要翻墙，我的环境上如果翻墙直接报错：ERROR: (gcloud.components.update) Failed to fetch component listing from server. Check your network settings and try again.

第二步建议使用`gcloud auth login --no-launch-browser`，避免不必要的麻烦（本来是可以自动切换挺方便的，呵呵），登录时可能会遇到问题：

~~~
Traceback (most recent call last):
  File "/home/zqfan/google-cloud-sdk/./lib/googlecloudsdk/gcloud/gcloud.py", line 209, in <module>
    main()
  File "/home/zqfan/google-cloud-sdk/./lib/googlecloudsdk/gcloud/gcloud.py", line 205, in main
    _cli.Execute()
  File "/home/zqfan/google-cloud-sdk/./lib/googlecloudsdk/calliope/cli.py", line 621, in Execute
    result = args.cmd_func(cli=self, args=args)
  File "/home/zqfan/google-cloud-sdk/./lib/googlecloudsdk/calliope/backend.py", line 1088, in Run
    result = command_instance.Run(args)
  File "/home/zqfan/google-cloud-sdk/./lib/googlecloudsdk/calliope/exceptions.py", line 86, in TryFunc
    return func(*args, **kwargs)
  File "/home/zqfan/google-cloud-sdk/lib/googlecloudsdk/gcloud/sdktools/auth/login.py", line 83, in Run
    creds = self.DoWebFlow(args.launch_browser)
  File "/home/zqfan/google-cloud-sdk/lib/googlecloudsdk/gcloud/sdktools/auth/login.py", line 141, in DoWebFlow
    return c_store.AcquireFromWebFlow(launch_browser=launch_browser)
  File "/home/zqfan/google-cloud-sdk/./lib/googlecloudsdk/core/credentials/store.py", line 394, in AcquireFromWebFlow
    http=_Http())
  File "/home/zqfan/google-cloud-sdk/./lib/googlecloudsdk/core/credentials/flow.py", line 160, in Run
    credential = flow.step2_exchange(code, http=http)
  File "/home/zqfan/google-cloud-sdk/./lib/oauth2client/util.py", line 129, in positional_wrapper
    return wrapped(*args, **kwargs)
  File "/home/zqfan/google-cloud-sdk/./lib/oauth2client/client.py", line 1825, in step2_exchange
    headers=headers)
  File "/home/zqfan/google-cloud-sdk/./lib/httplib2/__init__.py", line 1608, in request
    (response, content) = self._request(conn, authority, uri, request_uri, method, body, headers, redirections, cachekey)
  File "/home/zqfan/google-cloud-sdk/./lib/httplib2/__init__.py", line 1350, in _request
    (response, content) = self._conn_request(conn, request_uri, method, body, headers)
  File "/home/zqfan/google-cloud-sdk/./lib/httplib2/__init__.py", line 1278, in _conn_request
    raise ServerNotFoundError("Unable to find the server at %s" % conn.host)
httplib2.ServerNotFoundError: Unable to find the server at accounts.google.com
~~~

sdk中验证时没有给httplib2设置代理，我们需要hack代码手动添加代理，根据错误堆栈信息，找到client.py的1825行，在此之前加上如下内容：

~~~
    import socks
    http.proxy_info = httplib2.ProxyInfo(socks.PROXY_TYPE_HTTP, '127.0.0.1', 8087)
    http.disable_ssl_certificate_validation = True
~~~

头两行指定使用goagent的代理地址，第三行指定关闭ssl证书验证，觉得危险的请另寻出路。证书问题可能跟goagent的证书设置有关系，我的环境上不改就报：httplib2.SSLHandshakeError: [Errno 1] _ssl.c:510: error:14090086:SSL routines:SSL3_GET_SERVER_CERTIFICATE:certificate verify failed。

改完后执行`gcloud auth login --no-launch-browser`，必须用新生成的code进行验证。登录成功会提示`gcloud config set project PROJECT`。

# Follow the tutorial in GAE document

# Caution

* data store read quota非常低，每天只有五万次，每读一行都算一次读操作，很可能一不小心就超了，然后你当天就再也读不了了，除非你开启付费功能。建议热点数据用memcache。

License: [(CC 3.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/3.0/)
