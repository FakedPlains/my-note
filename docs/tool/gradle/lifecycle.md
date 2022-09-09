# Gradle 生命周期

## 项目的生命周期
> Gradle 项目的生命周期分为三大阶段：**Initialization-> Configuration -> Execution**

![Gradle 项目的生命周期](/img/tool/gradle/project-lifecycle.png)

### Initialization 初始化阶段

  初始化构建

  - 执行 `Init Script`：`init.gradle` 会在每个项目 build 之前被调用，主要作用有：
    - 配置内部的仓库信息
    - 配置一些全局属性
    - 配置用户名和密码信息
  - 执行 `Setting Script`：`settings.gradle` 初始化了一次构建所有参与的所有模块
  - 在 `settings.gradle` 执行完后，会回调 **Gradle 对象的 `settingsEvaluated()` 方法**
  - 在构造所有工程 build.gradle 对应的 Project 对象后，也即初始化阶段完毕，会回调 Gradle 对象的 **`projectsLoaded()`** 方法

### Configuration 配置阶段

- Gradle 会循环执行每个工程的 **`build.gradle`** 脚本文件
- 执行当前工程 build.gradle 前，会回调 **Gradle 对象的 `beforeProject()` 方法和当前 Project 对象的 `beforeEvaluate()` 方法**

:::caution 注意

虽然 beforeEvalute() 属于 project 的生命周期,，但是此时 build script 尚未被加载,，所以 `beforeEvaluate()` 的设置依然要在 `init script` 或 `setting script` 中进行，不要在 build script 中使用 project.beforeEvaluate() 方法

:::

- 执行当前工程 build.gradle 后，会回调 **Gradle 对象的 `afterProject()` 方法和当前 Project 对象的 `afterEvaluate()` 方法**
- 所有工程的 build.gradle 执行完毕后，会回调 **Gradle 对象的 `projectsEvaluated()` 方法**
- 构建 Task 依赖有向无环图后，也就是配置阶段完毕，会回调 **TaskExecutionGraph 对象的 `whenReady()` 方法**

  ![有向无环树](/img/tool/gradle/有向无环树.png)

### Execution 执行阶段

- Gradle 会循环执行 Task 及其依赖的 Task
- 当前 Task 执行之前,会回调 **TaskExecutionGraph 对象的 `beforeTask()` 方法**
- 当前 Task 执行之后,会回调 **TaskExecutionGraph 对象的 `afterTask()` 方法**

- 所有的 Task 执行完毕后，会回调 **Gradle 对象的 `buildFinish()` 方法**

:::tip Gradle 执行脚本文件的时候会生成对应的实例

- **Gradle 对象**：在项目初始化时构建，全局单例存在，只有这一个对象 
- **Project 对象**：每一个 build.gradle 文件都会转换成一个 Project 对象，类似于 maven 中的 pom.xml 文件
- **Settings 对象**：settings.gradle 会转变成一个 settings 对象，和整个项目是一对一的关系，一般只用到include 方法 
- **Task 对象**：从前面的有向无环图中，gradle 最终是基于Task的，一个项目可以有一个或者多个Task 

:::

## settings.gradle 文件

- **作用：**主要在项目初始化阶段确定引入需要加入到项目构建中的工程，为构建项目工程树做准备
- **内容：**定义了当前 gradle 项目及子项目 project 的项目名称
- **名字：**为 settings.gradle 文件，不能发生变化
- **对应实例：**与 `org.gradle.api.initialization.Settings` 实例是一一对应关系，每个项目只有一个 settings 文件

```gradle
// 根项目名称
rootProject.name = 'root'
// 包含的子工程名称
include 'subproject01'
include 'subproject02'
include 'subproject03'
// 包含的子工程下的子工程名称
include 'subproject01:subproject011'
include 'subproject01:subproject02'
```

:::tip

- 一个子工程只有在 settings 文件中配置了才会被 gradle 识别

- 项目名称中 “:” 代表项目的分隔符，类似路径中的 “/”，如果以 “:” 开头则表示相对于 root project，gradle 会为每个带有 build.gradle 脚本文件的工程构建一个与之对应的 Project 对象

:::

## build.gradle 文件

- `build.gradle` 是一个 **gradle 的构建脚本文件**，支持 java、groovy 等语言
- 每个 project 都会有一个 `build.gradle` 文件，该文件是**项目构建的入口**，可配置版本、插件、依赖库等信息
- 每个 build 文件都有一个对应的 **Project 实例**，对 `build.gradle` 文件配置，本质就是设置 **Project 实例的属性和方法**
- Root Project 可以获取到所有 Child Project，在 Root Project 的 build 文件中可以对 Child Project 统一配置，比如应用的插件、依赖的 maven 中心仓库等

### 常见属性代码

```gradle
// 指定使用什么版本的JDK语法编译源代码,跟编译环境有关,在有java插件时才能用
sourceCompatibility = JavaVersion.VERSION_11
// 指定生成特定于某个JDK版本的class文件:跟运行环境有关,在有java插件时才能用
targetCompatibility = JavaVersion.VERSION_11
// 业务编码字符集,注意这是指定源码解码的字符集[编译器]
compileJava.options.encoding "UTF-8"
// 测试编码字符集,注意这是指定源码解码的字符集[编译器]
compileTestJava.options.encoding "UTF-8"
// 编译JAVA文件时采用UTF-8:注意这是指定源码编码的字符集【源文件】
tasks.withType(JavaCompile) { 
	options.encoding = "UTF-8"
}
//编译JAVA文件时采用UTF-8:注意这是指定文档编码的字符集【源文件】
tasks.withType(Javadoc) { 
	options.encoding = "UTF-8"
}
```

:::tip

- group+name+version 类似于 maven 的 group+artifactId+version
- encoding 解决业务代码与测试代码中文乱码问题

:::

### Repositories

```gradle
repositories {
	//gradle 中会按着仓库配置的顺序，从上往下依次去对应的仓库中找所需要的jar包: 
	//如果找到，则停止向下搜索，如果找不到，继续在下面的仓库中查找
	//指定去本地某个磁盘目录中查找:使用本地file文件协议:一般不用这种方式
	maven { url 'file:///D:/repos/mavenrepos3.5.4'} 
	maven { url "$rootDir/lib/release" }
	//指定去maven的本地仓库查找
	mavenLocal()
	//指定去maven的私服或者第三方镜像仓库查找
	maven { name "Alibaba" ; url "https://maven.aliyun.com/repository/public" } 
	maven { name "Bstek" ; url "https://nexus.bsdn.org/content/groups/public/" }
	//指定去maven的远程仓库查找:即 https://repo.maven.apache.org/maven2/ 
	mavenCentral()
	//去google仓库查找
	google()
}
```

### Subprojects 与 Allprojects

- `allprojects` 是对所有 project (包括 Root Project+ Child Project [当前工程和所有子工程]) 的进行统一配置 
- `subprojects` 是对所有 Child Project 的进行统一配置

```gradle
allprojects() { //本质Project中的allprojects方法，传递一个闭包作为参数。
	apply plugin: 'java' 
	ext {
		junitVersion = '4.10'
		.. 
	}
	task allTask{
		... 
	}
	repositories {
		... 
	}
	dependencies {
		... 
	}
}
subprojects(){ 
	… // 同上面allprojects中的方法。
}
```

:::info

- 直接在根 project 配置 repositories 和 dependencies 则只针对根工程有效。

- 可以在对单个 Project 进行单独配置

  ```gradle
  project('subject01') {
  	task subject01 {
  		doLast {
  			println 'for subject01' 
  		}
  	}
  }
  ```

:::

###  ext 用户自定义属性

Project 和 Task 都允许用户添加额外的自定义属性，要添加额外的属性，通过应用所属对象的 ext 属性即可实现。添加之后可以通过 ext 属性对自定义属性读取和设置，如果要同时添加多个自定义属性，可以通过 ext 代码块：

```gradle
//自定义一个Project的属性
ext.age = 18
//通过代码块同时自定义多个属性
ext {
	phone = 19292883833
	address="北京尚硅谷"
}
task extCustomProperty {
    //在task中自定义属性
    ext {
    	desc = "奥利给"
    }
    doLast {
        println "年龄是：${age}"
        println "电话是：${phone}"
        println "地址是：${address}"
        println "尚硅谷：${desc}"
    }
}
```

:::info

`ext` 配置的是用户自定义属性，而 `gradle.properties` 中一般定义 **系统属性、环境变量、项目属性、JVM 相关配置** 信息。例如 `gradle.properties` 文件案例：加快构建速度的，gradle.properties 文件中的属性会**自动在项目运行时加载**

```properties
# 设置此参数主要是编译下载包会占用大量的内存，可能会内存溢出
org.gradle.jvmargs=-Xms4096m -Xmx8192m
# 开启gradle缓存
org.gradle.caching=true 
# 开启并行编译
org.gradle.parallel=true 
# 启用新的孵化模式
org.gradle.configureondemand=true 
# 开启守护进程
org.gradle.daemon=true
```

:::

### Buildscript

`buildscript` 里是 gradle 脚本执行所需依赖，分别是对应的 maven 库和插件

```gradle
import org.apache.commons.codec.binary.Base64
buildscript {
    repositories { 
    	mavenCentral()
    }
    dependencies {
    	classpath group: 'commons-codec', name: 'commons-codec', version: '1.2' 
    }
}
tasks.register('encode') {
    doLast {
    	def byte[] encodedString = new Base64().encode('hello world\n'.getBytes())
    	println new String(encodedString)
    }
}
```

-  buildscript{} 必须在 build.gradle 文件的最前端
- 对于多项目构建，项目的 buildscript() 方法声明的依赖关系可用于其所有子项目的构建脚本
- 构建脚本依赖可能是 Gradle 插件

```gradle
//老式 apply 插件的引用方式,使用 apply+buildscript
buildscript {
    ext {
    	springBootVersion = "2.3.3.RELEASE" 
    }
    repositories { 
    	mavenLocal() 
    	maven { url 'http://maven.aliyun.com/nexus/content/groups/public' }
    	jcenter()
    }
    //此处引入插件
    dependencies {
    	classpath("org.springframework.boot:spring-boot-gradle-plugin:${springBootVersion}")
    }
}
apply plugin: 'java' // 核心插件，无需事先引入
apply plugin: 'org.springframework.boot' // 社区插件，需要事先引入,才能应用，不必写版本号
```

