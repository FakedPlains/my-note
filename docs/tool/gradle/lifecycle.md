# Gradle 生命周期

## 项目的生命周期
> Gradle 项目的生命周期分为三大阶段：**Initialization-> Configuration -> Execution**

![Gradle 项目的生命周期](/img/tool/gradle/project-lifecycle.png)

### Initialization 阶段

  初始化构建

  - 执行 `Init Script`：`init.gradle` 会在每个项目 build 之前被调用，主要作用有：
    - 配置内部的仓库信息
    - 配置一些全局属性
    - 配置用户名和密码信息
  - 执行 `Setting Script`：初始化了一次构建所有参与的所有模块

### Configuration 阶段

  加载项目中所有模块的 `Build Script`，即：执行 `build.gradle` 中的语句，根据脚本代码创建对应的 `task`，最终根据所有 task 生成由 **Task 组成的有向无环图（DAG）**

  ![有向无环树](/img/tool/gradle/有向无环树.png)

### Execution 阶段

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
