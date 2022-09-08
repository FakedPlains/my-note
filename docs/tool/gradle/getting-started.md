# Gradle 入门

## Gradle 的安装

### 1.安装 JDK

### 2.下载并解压到指定路径

### 3.配置环境变量

- 配置 `GRADLE_HOME`
- 配置 `GRADLE_USER_HOME`
  - `GRALE_USER_HOME` 相当于配置 Gradle 本地仓库位置和 Gradle Wrapper 缓存目录

### 4.检测是否安装成功

```shell
gradle -v
```

### 5.修改下载源

:::info
在 gradle 的 init.d 目录下创建以 .gradle 结尾的文件，可以实现在 build 开始执行之前做一些操作
:::

- 在 init.d 文件夹创建 init.gradle 文件

```gradle
allprojects {
	repositories { 
	    // 指定使用maven本地仓库，而本地仓库在配置 maven 时 settings 文件指定的仓库位置
	    // gradle 查找 jar 包顺序如下：USER_HOME/.m2/settings.xml >> M2_HOME/conf/settings.xml >> USER_HOME/.m2/repository 
		mavenLocal() 
		// 指定maven仓库，一般用私有仓库地址或其它的第三方库
		maven { name "Alibaba" ; url "https://maven.aliyun.com/repository/public" } 
		maven { name "Bstek" ; url "https://nexus.bsdn.org/content/groups/public/" } 
		// 这是Maven的中央仓库，无需配置，直接声明就可以使用
		mavenCentral()
	}
	buildscript {
		repositories { 
			maven { name "Alibaba" ; url 'https://maven.aliyun.com/repository/public' } 
			maven { name "Bstek" ; url 'https://nexus.bsdn.org/content/groups/public/' } 
			maven { name "M2" ; url 'https://plugins.gradle.org/m2/' }
		}
	}
}
```
:::tip
- `gradle` 可以通过指定仓库地址为本地 `maven 仓库地址` 和 `远程仓库地址` 相结合的方式，避免每次都会去远程仓库下载依赖库
- 下载的 `jar` 不是存储在本地 `maven 仓库` 中，而是放在自己的**缓存目录**中，默认在 `USER_HOME/.gradle/caches` 目录
- 如果配置过 `GRADLE_USER_HOME` 环境变量，则会放在 `GRADLE_USER_HOME/caches` 目录
:::

<details>
  <summary>启用 <code>init.gradle</code> 文件的方式</summary>

  1.在命令行指定文件，例如：<code>gradle --init-script yourdir/init.gradle -q taskName</code><br/>
    可以多次输入此命令来指定多个init文件 

  2.把 <code>init.gradle</code> 文件放到 <code>USER_HOME/.gradle/</code> 目录下 

  3.把以 <code>.gradle</code> 结尾的文件放到 <code>USER_HOME/.gradle/init.d/</code> 目录下 

  4.把以 <code>.gradle</code> 结尾的文件放到 <code>GRADLE_HOME/init.d/</code> 目录下

  如果存在上面的 4 种方式的 2 种以上，gradle 会按上面的 1-4 序号依次执行这些文件，如果给定目录下存在多个 <code>init 脚本</code>，会按拼音 a-z 顺序执行这些脚本，每个 <code>init 脚本</code> 都存在一个对应的 <code>gradle实例</code>，你在这个文件中调用的所有方法和属性，都会委托给这个 <code>gradle 实例</code>，每个 <code>init 脚本</code> 都实现了 <code>Script 接口</code>
</details>

## Gradle 的目录结构

```
project
 ├── build: 封装编译后的字节码、打成的报、测试报告等
 ├── gradle
 │	  ├── gradle-wrapper.jar
 |	  └── gradle-wrapper.properties
 ├── src
 |	  ├── main
 |	  |    ├── java
 |	  |	   ├── resource
 |	  |	   └── webapp
 |	  |		    ├── WEB_INF
 |	  |		    |	 └── web.xml
 |	  |		    └── index.jsp
 |	  └── test
 |		   ├── java
 |		   └── resource
 ├── gradlew
 ├── gradlew.bat: 包装前启动脚本
 ├── build.gradle: 构建脚本，类似于 maven 中的 pom.xml
 └── setting.gradle: 设置文件，定义项目及子项目名称信息，和项目是一一对应关系
```

:::caution 注意
`gradlew` 与 `gradlew.bat` 执行的指定 wrapper 版本中的 gradle 指令,不是本地安装的 gradle 指令
:::

## Wrapper 包装器

### 概述

- Gradle Wrapper 实际上就是对 Gradle 的一层包装，用于解决实际开发中可能会遇到的不同的项目需要不同版本的 Gradle 问题
- 项目中的gradlew、gradlew.cmd脚本用的就是wrapper中规定的gradle版本。
- gradle指令用的是本地gradle
- 所以gradle指令和gradlew指令所使用的gradle版本有可能是不一样的

- 执行 gradle wrapper 时，可以指定一些参数来控制 Wrapper 的生成
  - `--gradle-version`：用于指定使用的 Gradle 版本
  - `--gradle-distribution-url`：用于指定下载站 Gradle 发行版的 url 地址

### GradleWrapper 执行流程

- 第一次执行 ./gradlew build 命令的时候，gradlew 会读取 gradle-wrapper.properties 文件的配置信息 
- 准确的将指定版本的 gradle 下载并解压到指定的位置(GRADLE_USER_HOME目录下的wrapper/dists目录中) 
- 并构建本地缓存(GRADLE_USER_HOME目录下的caches目录中),下载再使用相同版本的gradle就不用下载了 
- 之后执行的 ./gradlew 所有命令都是使用指定的 gradle 版本。

![gradlewrapper执行流程](/img/tool/gradle/gradlewrapper执行流程.png)

- gradle-wrappre.properties 解读

  ```properties
  # 下载后 Gradle 压缩包解压后存储的主目录
  distributionBase=GRADLE_USER_HOME
  # 相对于 distributionBase 的解压后的 Gradle 压缩包的目录
  distributionPath=wrapper/dists
  # Gradle 发行版压缩包的下载地址
  distributionUrl=https\://services.gradle.org/distributions/gradle-7.4-bin.zip
  zipStoreBase=GRADLE_USER_HOME
  zipStorePath=wrapper/dists
  ```

  
