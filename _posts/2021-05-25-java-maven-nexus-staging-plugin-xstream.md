---
layout: post
title: How To Upgrade Dependency For Maven Plugin
categories:
description:
keywords:
---

Maven is a build automation tool used primarily for Java projects. Sometimes the indirectly dependency package might be conflicted or need to upgrade for security issues, we need to configure it manually by ourself instead of automatically resolved by maven. And this will happen in build plugins too.

## Conclusion

use `dependencies` tag in `plugin` section to specify the direct or indirect dependencies for a plugin, like:

```
  <build>
    <plugins>
      <plugin>
        <groupId>{plugin group id}</groupId>
        <artifactId>{plugin artifact id}</artifactId>
        <dependencies>
          <dependency>
            <groupId>{dependency group id}</groupId>
            <artifactId>{depedency artifact id}</artifactId>
            <version>{the wanted version}</version>
          </dependency>
        </dependencies>
        ...
      </plugin>
      ...
    </plugins>
    ...
  </build>
```

## Real Case

Xstream has officially announced a high security fix version 1.4.17, to fix [CVE-2021-29505](https://x-stream.github.io/CVE-2021-29505.html), which can "result in execution of a local command on the server".

Unfortunately, I find out that the Tencent Cloud official SDK project [tencentcloud-sdk-java](https://github.com/TencentCloud/tencentcloud-sdk-java) will somehow download xstream 1.4.7 while compiling.
However, this project doesn't depend that package directly.
We can use command `mvn dependency:tree -Dverbose` to investigate its dependency tree.

```
# mvn dependency:tree -Dverbose
[INFO] --- maven-dependency-plugin:2.1:tree (default-cli) @ tencentcloud-sdk-java ---
[INFO] com.tencentcloudapi:tencentcloud-sdk-java:jar:3.1.273
[INFO] +- commons-logging:commons-logging:jar:1.2:compile
[INFO] +- com.squareup.okio:okio:jar:1.12.0:compile
[INFO] +- com.squareup.okhttp:okhttp:jar:2.5.0:compile
[INFO] |  \- (com.squareup.okio:okio:jar:1.6.0:compile - omitted for conflict with 1.12.0)
[INFO] +- com.google.code.gson:gson:jar:2.2.4:compile
[INFO] +- javax.xml.bind:jaxb-api:jar:2.3.0:compile
[INFO] \- com.squareup.okhttp:logging-interceptor:jar:2.7.5:compile
[INFO]    \- (com.squareup.okhttp:okhttp:jar:2.7.5:compile - omitted for conflict with 2.5.0)
```

Notice that this command cannot prints plugin's dependency tree, neither do `mvn dependency:analyze` nor `mvn dependency:resolve`. The command `mvn dependency:resolve-plugins` only prints first level dependency, for example, the nexus-staging-maven-plugin output like:

```
[INFO] Plugin Resolved: nexus-staging-maven-plugin-1.6.7.jar
[INFO]     Plugin Dependency Resolved: nexus-common-1.6.7.jar
[INFO]     Plugin Dependency Resolved: guava-14.0.1.jar
[INFO]     Plugin Dependency Resolved: nexus-client-core-2.9.1-02.jar
[INFO]     Plugin Dependency Resolved: spice-zapper-1.3.jar
[INFO]     Plugin Dependency Resolved: plexus-utils-3.0.8.jar
[INFO]     Plugin Dependency Resolved: plexus-interpolation-1.15.jar
[INFO]     Plugin Dependency Resolved: aether-api-1.13.1.jar
[INFO]     Plugin Dependency Resolved: logback-core-1.1.2.jar
[INFO]     Plugin Dependency Resolved: logback-classic-1.1.2.jar
```

Since I cannot find the proper command, I just remove all the plugins, and add them back one by one, finally it turns out that the nexus-staging-maven-plugin requires xstream package.
It is strange because even when I only run `mvn compile`, which should not trigger staging plugin, xstream will be downloaded anyway.

I've checked the source code of nexus-staging-maven-plugin 1.6.7, [https://github.com/sonatype/nexus-maven-plugins/blob/nexus-maven-plugins-1.6.7/staging/maven-plugin/pom.xml](https://github.com/sonatype/nexus-maven-plugins/blob/nexus-maven-plugins-1.6.7/staging/maven-plugin/pom.xml).
It is unlucky because this source code cannot run `mvn dependency:tree` directly, it's broken.
After fixing it by removing the broken dependency com.sonatype.nexus.plugins:nexus-staging-client, it shows that its dependency org.sonatype.nexus:nexus-client-core package requires xstream 1.4.7.
nexus-client-core has tagged 3.30.1-01 in its source repo [https://github.com/sonatype/nexus-public](https://github.com/sonatype/nexus-public), but not released in maven central repo, the latest available version is [2.14.20-02](https://search.maven.org/artifact/org.sonatype.nexus/nexus-client-core) for now, which still requires xstream 1.4.7.

PS: The test scope packge org.sonatype.sisu.litmus:litmus-testsupport requires xstream indirectly, via org.powermock:powermock-classloading-xstream.
But it is ok because the information in maven central repo shows that powermock packages are all excluded, [https://search.maven.org/artifact/org.sonatype.plugins/nexus-staging-maven-plugin/1.6.7/maven-plugin](https://search.maven.org/artifact/org.sonatype.plugins/nexus-staging-maven-plugin/1.6.7/maven-plugin), and litmus-testsupport is in test scope.

So what we need to do is explicitly upgrading xstream to 1.4.17 (also upgrade nexus-staging-maven-plugin to its latest 1.6.8, but not necessary) in plugin dependencies section, like:

```
  <build>
    <plugins>
      <plugin>
        <groupId>org.sonatype.plugins</groupId>
        <artifactId>nexus-staging-maven-plugin</artifactId>
        <version>1.6.8</version>
        <extensions>true</extensions>
        <configuration>
          <serverId>Releases</serverId>
          <nexusUrl>https://oss.sonatype.org/</nexusUrl>
          <autoReleaseAfterClose>true</autoReleaseAfterClose>
        </configuration>
        <dependencies>
          <dependency>
            <groupId>com.thoughtworks.xstream</groupId>
            <artifactId>xstream</artifactId>
            <version>1.4.17</version>
          </dependency>
        </dependencies>
      </plugin>
```

Unfortunately, xstream 1.4.7 => 1.4.17 is incompatible, even though according to its semantic version number, it is just a bug fix version.
When running `mvn deploy` command, it will fail with an error: `XPP3 pull parser library not present. Specify another driver. For example: new XStream(new DomDriver())`
After searching on web for a long time, it seems that there is no need to modify nexus-client-core source code (and in master branch they are still struggling to choose either removing xstream or upgrading it), just adding the missing xpp3 package will resolve it.
I don't know why but I think it might be that 1.4.17 or lower version just changed the default behavior, and leave the choice to user, hence the dependency is broken.
xpp3 is a very old package which seems no update since 2007, and I'm not sure if it will introduce new potential problems, but at least `mvn deploy` can success for now.

So the full settings of the new plugin is like (also upgrade nexus-client-core but might not be neccessary):

```
  <build>
    <plugins>
      <plugin>
        <groupId>org.sonatype.plugins</groupId>
        <artifactId>nexus-staging-maven-plugin</artifactId>
        <version>1.6.8</version>
        <extensions>true</extensions>
        <configuration>
          <serverId>Releases</serverId>
          <nexusUrl>https://oss.sonatype.org/</nexusUrl>
          <autoReleaseAfterClose>true</autoReleaseAfterClose>
        </configuration>
        <dependencies>
          <dependency>
            <groupId>com.thoughtworks.xstream</groupId>
            <artifactId>xstream</artifactId>
            <version>1.4.17</version>
          </dependency>
          <dependency>
            <groupId>org.sonatype.nexus</groupId>
            <artifactId>nexus-client-core</artifactId>
            <version>2.14.20-02</version>
          </dependency>
          <dependency>
            <groupId>xpp3</groupId>
            <artifactId>xpp3_min</artifactId>
            <version>1.1.4c</version>
          </dependency>
        </dependencies>
      </plugin>
```

update: do not upgrade xtream to it latest 1.4.18 because it breaks nexus-staging-maven-plugin 1.6.7. [https://github.com/x-stream/xstream/issues/263](https://github.com/x-stream/xstream/issues/263)

```
[ERROR] Failed to execute goal org.sonatype.plugins:nexus-staging-maven-plugin:1.6.8:deploy
(injected-nexus-deploy) on project tencentcloud-sdk-java: Execution
injected-nexus-deploy of goal org.sonatype.plugins:nexus-staging-maven-plugin:1.6.8:deploy
failed: Nexus connection problem to URL [https://oss.sonatype.org/ ]:
org.sonatype.nexus.rest.model.StatusResourceResponse -> [Help 1]
```


License: [(CC 4.0) BY-NC-SA](http://creativecommons.org/licenses/by-nc-sa/4.0/)
