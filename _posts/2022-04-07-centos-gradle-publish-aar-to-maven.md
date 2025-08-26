---
layout: post
title: CentOS 7 Using Gradle to Publish Android AAR to Maven
categories: Linux
description: not working
keywords: centos, gradle, maven, aar, android
---

**注意：因 Maven Central 更新，本文不再有效，请参考最新文章 [https://zqfan.github.io/2025/08/26/centos7-publish-android-to-maven-portal-with-gradle](https://zqfan.github.io/2025/08/26/centos7-publish-android-to-maven-portal-with-gradle)**

虽然在 Android Studio 中也可直接发布 AAR 文件到 Maven 中央仓库，但大型项目通常需要在专门的构建机器上完成打包和发布。本文简要介绍如何在 CentOS 7 操作系统上，使用 Gradle 发布 Android SDK AAR 文件到 Maven 中央仓库。

### 安装 Java 11

Android Gradle Plugin 依赖 Java 11 运行环境，执行命令 `yum install java-11-openjdk-devel` 安装完毕后，执行命令 `alternatives --config java`，可能的输出为：

```
There are 2 programs which provide 'java'.

  Selection    Command
-----------------------------------------------
*+ 1           java-1.8.0-openjdk.x86_64 (/usr/lib/jvm/java-1.8.0-openjdk-1.8.0.242.b08-0.el7_7.x86_64/jre/bin/java)
   2           java-11-openjdk.x86_64 (/usr/lib/jvm/java-11-openjdk-11.0.14.1.1-1.el7_9.x86_64/bin/java)

Enter to keep the current selection[+], or type selection number:
```

可直接 Ctrl + C 退出命令，只要获取到 Java 11 的安装路径即可，例如这里的 `/usr/lib/jvm/java-11-openjdk-11.0.14.1.1-1.el7_9.x86_64/bin/java`，对应的 `JAVA_HOME` 为 `/usr/lib/jvm/java-11-openjdk-11.0.14.1.1-1.el7_9.x86_64`。

### 安装 Android SDK

在 Android 官网找到下载页面，例如 [https://developer.android.com/studio#downloads](https://developer.android.com/studio#downloads)，找到 "Command line tools only" 章节，Platform 选择 Linux 栏，点击下载链接，拉到弹窗页面底部，勾选同意协议，右键下载按钮，复制链接地址，例如 [https://dl.google.com/android/repository/commandlinetools-linux-8092744_latest.zip](https://dl.google.com/android/repository/commandlinetools-linux-8092744_latest.zip)，打开 CentOS 终端命令行，执行以下命令：

```
# cd /opt
# mkdir android
# cd android
# wget https://dl.google.com/android/repository/commandlinetools-linux-8092744_latest.zip
# unzip commandlinetools-linux-8092744_latest.zip
```

### 安装 Android SDK 插件

此时如果我们直接在 Android 项目仓库根目录下执行 `./gradlew build` 命令，可能会得到报错：

```
# ./gradlew build
FAILURE: Build failed with an exception.

* What went wrong:
Could not determine the dependencies of task ':app:processReleaseResources'.
> Failed to install the following Android SDK packages as some licences have not been accepted.
     patcher;v4 SDK Patch Applier v4
     emulator Android Emulator
     platforms;android-31 Android SDK Platform 31
     platform-tools Android SDK Platform-Tools
     build-tools;30.0.2 Android SDK Build-Tools 30.0.2
     tools Android SDK Tools
  To build this project, accept the SDK license agreements and install the missing components using the Android Studio SDK Manager.
  Alternatively, to transfer the license agreements from one workstation to another, see http://d.android.com/r/studio-ui/export-licenses.html
  
  Using Android SDK: /opt/android/cmdline-tools/bin
```

根据错误信息指出的缺失 Android SDK 插件名，使用 `sdkmanager` 命令进行安装：

```
# export JAVA_HOME=/usr/lib/jvm/java-11-openjdk-11.0.14.1.1-1.el7_9.x86_64
# export ANDROID_SDK_ROOT=/opt/android/cmdline-tools
# export PATH=$PATH:$ANDROID_SDK_ROOT
# sdkmanager --sdk_root=/opt/android/cmdline-tools "patcher;v4" "emulator" "platforms;android-31" "platform-tools" "build-tools;30.0.2" "tools"
```

### Gradle 配置文件

因为目标是把 Android SDK AAR 文件发布到 Maven 中央仓库，我们需要在 Gradle 配置文件中指定 Maven 账号密码以及 GPG 密钥信息。打开 `~/.gradle/gradle.properties` 文件，编辑如下内容：

```
mavenUser = username
mavenPassword = password
signing.keyId = gpgId
signing.password = gpgPassword
signing.secretKeyRingFile = /path/to/.gnupg/secring.gpg
```

maven账号和密码由于官方服务器权限更新，需要用[user token](https://central.sonatype.org/publish/generate-token/)替代对应位置，否则可能报错：`> Failed to publish publication 'release' to repository 'maven'   > Could not PUT 'xxx.aar'. Received status code 401 from server: Content access is protected by token`

GPG 密钥信息可以使用 gpg2 工具生成，并上传公钥到服务器。如果环境上此前已经生成过密钥，使用 `gpg -K` 命令查看：

```
# gpg -K
/root/.gnupg/secring.gpg
------------------------
sec   2048R/12345678 2018-06-13
uid                  zqfan (zhiqiangfan) <zhiqiangfan@tencent.com>
ssb   2048R/******** 2018-06-1
```

`signing.keyId` 取值为此例中打印的 12345678 八位字符, `signing.secretKeyRingFile` 取值为此例中打印的 `/root/.gnupg/secring.gpg`，`signing.password` 密码真实值不会打印，需联系当初创建密钥者获取，或者 使用命令 `gpg2 gen-key` 重新生成。

### Grable Build 脚本

打开 Android 项目仓库下的 `build.gradle` 文件，找到其中的 `afterEvaluate.publishing.repositories` 配置，编辑如下：

```
        repositories {
            maven {
                def releasesRepoUrl = "https://oss.sonatype.org/service/local/staging/deploy/maven2/"
                def snapshotsRepoUrl = "https://oss.sonatype.org/content/repositories/snapshots/"
                url = version.endsWith('SNAPSHOT') ? snapshotsRepoUrl : releasesRepoUrl
                allowInsecureProtocol(true)
                credentials {
                    username = "$mavenUser"
                    password = "$mavenPassword"
                }
                authentication{
                    basic(BasicAuthentication)
                }
            }
        }
```

这里主要是设置 credentials 中的 username 和 password 字段。注意，这里必须如示例原文填写 "$mavenUser" 和 "$mavenPassword"，不要填写真实账号密码，因为此文件需要上传到 Git 仓库中。

### 发布到 Maven

在 Android 项目仓库根目录执行命令：

```
./gradlew clean build publish
```

执行成功后，到 [Nexus Repository Manager](https://oss.sonatype.org/#stagingRepositories) 网站上登录后，在左侧功能导航栏选择 `Staging Repositories`，选择刚上传的 AAR 文件，点击 `Close` 按钮，弹窗选择 `Confirm`，在页面下方选择 `Activity` 标签页观察进度，等待几分钟后如果没有报错，点击上方 `Refresh` 按钮，出现 `Release` 按钮，点击后弹窗确认，完成发布。

[原文](https://zqfan.github.io/2022/04/07/centos-gradle-publish-aar-to-maven) 由 [zqfan (zhiqiangfan@tencent.com)](https://github.com/zqfan) 发表。版权声明（License）: (CC 4.0) BY-NC-SA
