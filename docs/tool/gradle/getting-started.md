# Gradle 入门

## Gradle 的安装

### 1.安装 JDK

### 2.下载并解压到指定路径

### 3.配置环境变量

- 配置 GRADLE_HOME
- 配置 GRADLE_USER_HOME
  - GRALE_USER_HOME 相当于配置 Gradle 本地仓库位置和 Gradle Wrapper 缓存目录

### 4.检测是否安装成功

```shell
gradle -v
```

### 5.修改下载源

在 gradle 的 init.d 目录下创建以 .gradle 结尾的文件，可以实现在 build 开始执行之前做一些操作

- 在 init.d 文件夹创建 init.gradle 文件

```gradle
allprojects {
	repositories { 
		mavenLocal() 
		maven { name "Alibaba" ; url "https://maven.aliyun.com/repository/public" } 
		maven { name "Bstek" ; url "https://nexus.bsdn.org/content/groups/public/" } 
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

- 启用 init.gradle 文件的方式：

  1.在命令行指定文件,例如：gradle --init-script yourdir/init.gradle -q taskName。可以多次输入此命令来指定多个init文件 

  2.把init.gradle文件放到 USER_HOME/.gradle/ 目录下 

  3.把以.gradle结尾的文件放到 USER_HOME/.gradle/init.d/ 目录下 

  4.把以.gradle结尾的文件放到 GRADLE_HOME/init.d/ 目录下

  如果存在上面的4种方式的2种以上，gradle会按上面的1-4序号依次执行这些文件，如果给定目录下存在多个init脚本，会 按拼音a-z顺序执行这些脚本，每个init脚本都存在一个对应的gradle实例,你在这个文件中调用的所有方法和属性，都会 委托给这个gradle实例，每个init脚本都实现了Script接口

- 仓库地址说明

  - mavenLocal(): 指定使用maven本地仓库，而本地仓库在配置maven时settings文件指定的仓库位置。如E:/repository，gradle 查找jar包顺序如下：USER_HOME/.m2/settings.xml >> M2_HOME/conf/settings.xml >> USER_HOME/.m2/repository 
  - maven { url 地址}，指定maven仓库，一般用私有仓库地址或其它的第三方库【比如阿里镜像仓库地址】。 
  - mavenCentral()：这是Maven的中央仓库，无需配置，直接声明就可以使用。 
  - jcenter():JCenter中央仓库，实际也是是用的maven搭建的，但相比Maven仓库更友好，通过CDN分发，并且支持https访 问,在新版本中已经废弃了，替换为了mavenCentral()。 
  - 总之, gradle可以通过指定仓库地址为本地maven仓库地址和远程仓库地址相结合的方式，避免每次都会去远程仓库下载 依赖库。这种方式也有一定的问题，如果本地maven仓库有这个依赖，就会从直接加载本地依赖，如果本地仓库没有该 依赖，那么还是会从远程下载。但是下载的jar不是存储在本地maven仓库中，而是放在自己的缓存目录中，默认在 USER_HOME/.gradle/caches目录,当然如果我们配置过GRADLE_USER_HOME环境变量，则会放在 GRADLE_USER_HOME/caches目录,那么可不可以将gradle caches指向maven repository。我们说这是不行的，caches下载 文件不是按照maven仓库中存放的方式

## Gradle 的目录结构

```
project
 |
 |--- build: 封装编译后的字节码、打成的报、测试报告等
 |--- gradle
 |	   |--- gradle-wrapper.jar
 |	   |--- gradle-wrapper.properties
 |--- src
 |	   |--- main
 |	   |	 |--- java
 |	   |	 |--- resource
 |	   |	 |--- webapp
 |	   |		   |--- WEB_INF
 |	   |		   |	 └--- web.xml
 |	   |		   └--- index.jsp
 |	   └--- test
 |			 |--- java
 |			 └--- resource
 |--- gradlew
 |--- gradlew.bat: 包装前启动脚本
 |--- build.gradle: 构建脚本，类似于 maven 中的 pom.xml
 └--- setting.gradle: 设置文件，定义项目及子项目名称信息，和项目是一一对应关系
```

1. 只有war工程才有webapp目录，对于普通的jar工程并没有webapp目录 
2.  gradlew与gradlew.bat执行的指定wrapper版本中的gradle指令,不是本地安装的gradle指令

## Gradle 的常用指令

### 初始化 Gradle 项目

```shell
gradle init
```

### 清空 build 目录

```shell
gradle clean
```

### 编译业务代码和配置文件

```shell
gradle classes
```

### 编译测试代码，生成测试报告

```shell
gradle test
```

### 构建项目

```shell
gradle build
```

### 跳过测试构建

```shell
gradle build -x test
```

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

  
