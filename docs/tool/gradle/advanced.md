# Gradle 进阶

## Gradle 项目的生命周期

> Gradle 项目的生命周期分为三大阶段：**Initialization-> Configuration -> Execution**

![Gradle 项目的生命周期](/img/tool/gradle/project-lifecycle.png)

- **Initialization 阶段：**

  初始化构建

  - 执行 `Init Script`：`init.gradle` 会在每个项目 build 之前被调用，主要作用有：
    - 配置内部的仓库信息
    - 配置一些全局属性
    - 配置用户名和密码信息
  - 执行 `Setting Script`：初始化了一次构建所有参与的所有模块

- **Configuration 阶段：**

  加载项目中所有模块的 `Build Script`，即：执行 `build.gradle` 中的语句，根据脚本代码创建对应的 `task`，最终根据所有 task 生成由 **Task 组成的有向无环图（DAG）**

  ![有向无环树](/img/tool/gradle/有向无环树.png)

- **Execution 阶段：**

  根据上个阶段构建好的有向无环图，按顺序执行 Task【Action 操作】

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

## Task

### 任务入门

```gradle
task A {
    // 分配任务组
    grout "abc"
    // 任务的配置段：在配置阶段执行
    println "root taskA"
    // 任务的行为：在执行阶段执行
    doFirst {
        println "root taskA doFirst"
    }
    doLast {
        println "root taskA doLast"
    }
}
```

```sh
gradle -i A
```

:::tip

- task 的配置段是在配置阶段执行
- task 的行为（`doFirst`、`doLast`）是在执行阶段执行

:::

### 任务的行为

>  doFirst、doLast 两个方法可以在任务内部定义，也可以在任务外部定义

```gradle
def map = new HashMap<String, Object>()
// action 属性可以设置为闭包，设置 task 自身的行为
map.put("action", {println "taskA..."})

task (map, "A") {
    // 任务的配置段：在配置阶段执行
    println "root taskA"
    // 任务的行为：在执行阶段执行
    // 在 task 内部定义 doFirst、doLast
    doFirst {
        println "root taskA doFirst"
    }
    doLast {
        println "root taskA doLast"
    }
}

// 在 task 外部定义 doFirst、doLast
A.doFirst {
    println "root taskA doFirst outer"
}

A.doLast {
    println "root taskA doLast outer"
}
```

输出如下

```shell
> Configure project :
root taskA

> Task :A
root taskA doFirst outer
root taskA doFirst
taskA...
root taskA doLast
root taskA doLast outer
```

:::info

任务自身的 action 和添加的 doLast、doFirst 方法，底层都被放入到一个 Action 的 List 中

设置 action【任务自身的行为】时，先将 action 添加到列表中，后续执行 doFirst 的时候 doFirst 在 action 前面添加，执行 doLast 的时候 doLast 在 action 后面添

:::
![TaskList.png](/img/tool/gradle/TaskList.png)

### 任务的依赖方式

```gradle
task A {
    doLast {
        println "Task A"
    }
}
task B {
    doLast {
        println "Task B"
    }
}
```

- #### 参数方式依赖

  ```gradle
  task C(dependsOn: [A, B]) {
      doLast {
          println "Task C"
      }
  }
  ```

- #### 内部依赖

  ```gradle
  task C {
      dependsOn = [A, B]
      doLast {
          println "Task C"
      }
  }
  ```

- #### 外部依赖

  ```gradle
  task C {
      doLast {
          println "Task C"
      }
  }
  C.dependsOn(A, B)
  ```

:::tip
task 也支持跨项目依赖 `dependsOn(":subproject01:A")`
:::

:::info

- 当一个 Task 依赖多个 Task 的时候，被依赖的 Task 之间如果没有依赖关系，那么它们的执行顺序是随机的,并 无影响。
- 重复的依赖只会在执行一次

:::

### 任务定义方式

#### 方式一：

> 通过 Project 中的 `task()` 方法

```groovy
Task task(String s)

Task task(String s, Closure clouser)

Task task(Map<String, ?> map, String s)

Task task(Map<String, ?> map, String s, Closure clouse)

Task task(String s, Action<? super Task> action)
```

#### 方式二：

> 通过 tasks 对象的 `create()` 或 `register()` 方法

```groovy
public interface TaskContainer {
    Task create(Map<String, ?> map)
    
    Task create(String s, Closure closure) 
    
    Task create(Map<String, ?> map, Closure closure) 
    
    Task create(String s)
    
	// register执行的是延迟创建，只有当 task 被需要使用的时候才会被创建
    TaskProvider<Task> register(String s)
}
```

- 我们可以在定义任务的同时指定任务的属性

| 配置项      | 描述                                 | 默认值      |
| ----------- | ------------------------------------ | ----------- |
| type        | 基于一个存在的 Task 来创建           | DefaultTask |
| overwrite   | 是否替换存在的 Task，配合 type 使用  | false       |
| dependsOn   | 用于配置任务的依赖                   | []          |
| action      | 添加到任务中的一个 Action 或一个闭包 | null        |
| description | 用于配置任务的描述                   | null        |
| group       | 用于配置任务的分组                   | null        |

### 任务类型

| 常见任务类型             | 作用                                                         |
| ------------------------ | ------------------------------------------------------------ |
| Delete                   | 删除文件或目录                                               |
| Copy                     | 将文件复制到目标目录中。此任务还可以在复制时重命名和筛选文件 |
| CreateStartScripts       | 创建启动脚本                                                 |
| Exec                     | 执行命令行进程                                               |
| GenerateMavenPom         | 生成 Maven 模块描述符(POM)文件                               |
| GradleBuild              | 执行 Gradle 构建                                             |
| Jar                      | 组装 JAR 归档文件                                            |
| JavaCompile              | 编译 Java 源文件                                             |
| Javadoc                  | 为 Java 类生成 HTML API 文档                                 |
| PublishToMavenRepository | 将 MavenPublication 发布到 mavenartifactrepostal             |
| Tar                      | 组装 TAR 存档文件                                            |
| Test                     | 执行 JUnit (3.8.x、4.x 或 5.x)或 TestNG 测试                 |
| Upload                   | 将 Configuration 的构件上传到一组存储库                      |
| War                      | 组装 WAR 档案                                                |
| Zip                      | 组装 ZIP 归档文件。默认是压缩 ZIP 的内容                     |

- 示例

```gradle
tasks.register('myClean', Delete) {
	delete buildDir
}
```

- 自定义 Task 类型

```groovy
def myTask = task MyDefinitionTask (type: CustomTask)
myTask.doFirst() {
	println "task 执行之前 执行的 doFirst方法" 
}
myTask.doLast(){
	println "task 执行之后 执行的 doLast方法" 
}
class CustomTask extends DefaultTask {
	// @TaskAction表示Task本身要执行的方法
	@TaskAction
	def doSelf(){
		println "Task 自身 在执行的in doSelf" 
    }
}
```

### 任务的执行顺序

- dependsOn 强制依赖方式
- 通过 Task 输入输出
- 通过 API 指定执行顺序

### 动态分配任务

```gradle
4.times { counter ->
	tasks.register("task$counter") {
		doLast {
			println "I'm task number $counter"
        }
	}
}
tasks.named('task0') { dependsOn('task2', 'task3') }
```

### 任务的开启与关闭

每个任务都有一个 `enabled` 默认为 `true` 的标志，将其设置为 `false` 阻止执行任何任务动作。禁用的任务将标记为 “**跳过**”

```gradle
task disableMe {
	doLast {
		println 'This task is Executing...' 
	}
	enabled(true) // 直接设置任务开启，默认值为 true
}
disableMe.enabled = false //设置关闭任务
```

### 任务的超时

- 每个任务都有一个 `timeout` 可用于限制其执行时间的属性
- 当任务达到超时时，其任务执行线程将被中断。该任务将被标记为失败。终结器任务仍将运行
- 如果使用 `--continue`，其他任务可以在此之后继续运行
- 不响应中断的任务无法超时，Gradle 的所有内置任务均会及时响应超时

```gradle
task a() {
	doLast {
		Thread.sleep(1000)
		println "当前任务a执行了"
	}
	timeout = Duration.ofMillis(500)
}
```

### 任务的查找

```gradle
task atguigu {
	doLast {
		println "让天下没有难学的技术：尚硅谷"
	}
}

//根据任务名查找
tasks.findByName("atguigu").doFirst({println "尚硅谷校区1：北京...."})
tasks.getByName("atguigu").doFirst({println "尚硅谷校区2：深圳...."})

//根据任务路径查找【相对路径】
tasks.findByPath(":atguigu").doFirst({println "尚硅谷校区3：上海...."})
tasks.getByPath(":atguigu").doFirst({println "尚硅谷校区4：武汉...."})
```

### 任务的规则

```gradle
task hello {
	doLast {
		println 'hello 尚硅谷的粉丝们' 
	}
}

tasks.addRule("对该规则的一个描述，便于调试、查看等"){
	String taskName -> task(taskName) {
		doLast {
			println "该${taskName}任务不存在，请查证后再执行" 
		}
	}
}
```

### 任务的断言

- 断言就是一个条件表达式
- Task 有一个 `onlyIf` 方法，接收一个闭包作为参数，如果闭包返回 true 则执行该任务，否则跳过

```gradle
task hello {
	doLast {
		println 'hello 尚硅谷的粉丝们' 
	}
}

hello.onlyIf { !project.hasProperty('fensi') }
```

- 通过-P 为 Project 添加 fensi 属性

### 默认任务

Gradle 允许您定义一个或多个默认任务，在没有指定其他任务时执行

```gradle
defaultTasks 'myClean', 'myRun' 
tasks.register('myClean'){
	doLast {
		println 'Default Cleaning!' 
	}
}
tasks.register('myRun') {
	doLast {
		println 'Default Running!' 
	}
}
tasks.register('other') {
	doLast {
		println "I'm not a default task!" 
	}
}
```

