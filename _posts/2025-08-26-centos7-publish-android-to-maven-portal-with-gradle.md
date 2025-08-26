---
layout: post
title: CentOS 7 Publish Android Project to Maven Portal with Gradle
categories: Linux
description:
keywords: centos, gradle, maven, android
---

虽然在 Android Studio 中也可直接发布到 Maven 中央仓库，但有些项目可能需要在专门的构建机器上完成打包和发布。本文简要介绍如何在 CentOS 7 操作系统上，使用 Gradle 发布 Android 项目到 Maven 中央仓库。

### 安装 JDK

本文升级 Android Gradle Plugin 到 8.2.0，依赖 JDK 17 运行环境，由于 CentOS 无法直接安装 JDK 17，选用了 [TencentKona JDK 17](https://github.com/Tencent/TencentKona-17)，执行命令

```
mkdir /opt/konajdk
cd /opt/konajdk
wget https://github.com/Tencent/TencentKona-17/releases/download/TencentKona-17.0.16/TencentKona-17.0.16.b1-jdk_linux-x86_64.tar.gz
tar -xzf TencentKona-17.0.16.b1-jdk_linux-x86_64.tar.gz
```
编辑 `~/.bashrc`，新增内容
```
export JAVA_HOME=/opt/konajdk/TencentKona-17.0.16.b1
export PATH=$JAVA_HOME/bin:$PATH
```

### 安装 Android SDK

在 Android 官网找到下载页面，例如 [https://developer.android.com/studio#downloads](https://developer.android.com/studio#downloads)，找到 "Command line tools only" 章节，Platform 选择 Linux 栏，点击下载链接，拉到弹窗页面底部，勾选同意协议，右键下载按钮，复制链接地址，例如 [https://dl.google.com/android/repository/commandlinetools-linux-13114758_latest.zip](https://dl.google.com/android/repository/commandlinetools-linux-13114758_latest.zip)，打开 CentOS 终端命令行，执行以下命令：

```
# cd /opt
# mkdir android
# cd android
# wget https://dl.google.com/android/repository/commandlinetools-linux-13114758_latest.zip
# unzip commandlinetools-linux-13114758_latest.zip
```
编辑 `~/.bashrc`，新增内容
```
export ANDROID_SDK_ROOT=/opt/android/
export PATH=$PATH:$ANDROID_SDK_ROOT:$ANDROID_SDK_ROOT/cmdline-tools/bin
```

### Grable Build 脚本

Maven 官方已经废弃旧的中央仓库，导致 Gradle 插件 maven-publish 无法继续工作，官方推荐社区插件 JReleaser，[https://central.sonatype.org/publish/publish-portal-gradle/](https://central.sonatype.org/publish/publish-portal-gradle/)。
该插件只给出了 Java 项目的例子，无法直接用于 Android 项目，[https://jreleaser.org/guide/latest/examples/maven/maven-central.html](https://jreleaser.org/guide/latest/examples/maven/maven-central.html)。
按照其中 Gradle 章节配置 `~/.jreleaser/config.toml` 文件，注意 `JRELEASER_MAVENCENTRAL_USERNAME ` 和 `JRELEASER_MAVENCENTRAL_PASSWORD` 要填写密钥 Token 而非实际的用户名密码。
我们还需要对 `build.gradle` 文件进行若干调整，示例如下：

```
plugins {
    id 'org.jreleaser' version '1.19.0'
    id 'com.android.library'
    id 'maven-publish'
    id 'signing'
}

version = '1.0.0'
afterEvaluate {
    publishing {
        publications {
            release(MavenPublication) {
                groupId = 'com.foo'
                artifactId = 'bar'
                version = project.version
                from components.release

                pom {
                    name = artifactId
                    description = "my project desc"
                    url = 'https://github.com/my-org/my-repo'
                    licenses {
                        license {
                            name = 'The Apache Software License, Version 2.0'
                            url = 'https://www.apache.org/licenses/LICENSE-2.0.txt'
                        }
                    }
                    developers {
                        developer {
                            id = 'github user id'
                            name = 'my full name'
                            email = 'foo@bar.com'
                        }
                    }
                    scm {
                        connection = 'scm:git:git://github.com/my-org/my-repo.git'
                        developerConnection = 'scm:git:ssh://git@github.com/my-org/my-repo.git'
                        url = 'https://github.com/my-org/my-repo'
                    }
                }
            }
        }
        repositories {
            maven {
                url = layout.buildDirectory.dir('staging-deploy')
            }
        }
    }
}

jreleaser {
    signing {
        active = 'ALWAYS'
        armored = true
    }
    deploy {
        maven {
            mavenCentral {
                sonatype {
                    active = 'ALWAYS'
                    url = 'https://central.sonatype.com/api/v1/publisher'
                    stagingRepository('build/staging-deploy')
                    // 选填，如果报错 pom 文件格式错误，需配置
                    verifyPom = false
                    // 必填，maven 中央仓库的 namespace，也就是以前的 groupId
                    namespace = 'com.foo'
                }
            }
        }
    }
    // 选填，如果在仓库根目录发布多个子项目，需配置
    gitRootSearch = true
}

android {
    compileSdk 33
    // 项目的namespace，非maven portal的namespace
    namespace "com.foo.bar"
    defaultConfig {
        minSdk 19
        targetSdk 33
        versionCode 1
        versionName "1.0.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        consumerProguardFiles "consumer-rules.pro"
    }
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
    // 必填，对应前文from components.release
    publishing {
        singleVariant('release') {
            withSourcesJar()
            withJavadocJar()
        }
    }
}
```

根目录的 `build.gradle` 文件配置如下：

```
buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.2.0'

        // NOTE: Do not place your application dependencies here; they belong
        // in the individual module build.gradle files
    }
    // 必填，否则发布阶段将会报错 compress 类找不到
    configurations.classpath {
        resolutionStrategy {
            force 'org.apache.commons:commons-compress:1.27.1'
        }
    }
}
```

### 发布到 Maven

在项目根目录执行命令：

```
./gradlew clean publish
./gradlew jreleaserDeploy
```

## 问题

- 报错：`Could not get unknown property ‘release’ for SoftwareComponentInternal set of type org.gradle.api.internal.component.DefaultSoftwareComponentContainer.`，需要在 `build.gradle` 的 `android` 项增加 `publishing` 方法。
- 报错：`java.lang.NoSuchMethodError: 'org.apache.commons.compress.archivers.zip.ZipFile$Builder org.apache.commons.compress.archivers.zip.ZipFile.builder()'`，需要在项目根目录 `build.gradle` 文件指定 apache commons-compress 依赖。单纯在子项目中指定依赖是无效的。
- 报错：`Failed to find target with hash string 'android-31' in: /opt/android/cmdline-tools`，升级到 `commandlinetools-linux-13114758_latest` 后，需将环境变量 `ANDROID_SDK_ROOT` 设置为 `/opt/android`。

[原文](https://zqfan.github.io/2022/04/07/centos-gradle-publish-aar-to-maven) 由 [zqfan (zhiqiangfan@tencent.com)](https://github.com/zqfan) 发表。版权声明（License）: (CC 4.0) BY-NC-SA
