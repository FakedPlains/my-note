# Gradle 命令（任务执行）

:::info

**任务执行语法：`gradle [taskName...] [--option-name...]`** 

::: 

## 常见任务

### 构建项目、编译、测试、打包

```shell
gradle build
```

### 运行一个服务

- 需要 application 插件支持，并指定了主启动类才能运行

```gradle
plugins {
    id 'application'
}
mainClassName='xxx.xxx.Xxx'
```

```gradle
gradle run
```

### 清除当前项目的 build 目录

```shell
gradle clean
```

### 初始化 gradle 项目

```shell
gradle init
```

### 生成 wrapper 文件夹

```shell
gradle wrapper
```

### 执行自定义任务

```shell
gradle [taskName]
```



## 项目报告相关任务

### 项目列表

> 列出所选项目及子项目列表，以及层次结构的形式显示

```shell
gradle projects
```

### 任务列表

- 列出所选项目【当前 project,不包含父、子】的已分配给任务组的那些任务

```shell
gradle tasks
```

- 列出所选项目的所有任务

```shell
gradle tasks --all
```

- 列出所选项目中指定分组中的任务

```shell
gradle tasks --group="build setup"
```

### 显示某个任务的详细信息

```shell
gradle help --task someTask
```

### 项目依赖信息

> 查看整个项目的依赖信息，以依赖树的方式显示

```shell
gradle dependencies
```

### 属性列表

> 列出所选项目的属性列表

```shell
gradle properties
```

## 调试相关属性

- `-h, --help`：查看帮助信息
- `-v, --version`：打印 Gradle、Groovy、Ant、JVM 和操作系统版本信息
- `-S, --full-stacktrace`：打印出所有异常的完整(非常详细)堆栈跟踪信息

- `-s, --stacktrace`： 打印出用户异常的堆栈跟踪(例如编译错误)
- `-Dorg.gradle.daemon.debug=true`：调试 Gradle 守护进程
- `-Dorg.gradle.debug=true`：调试 Gradle 客户端进程
- `-Dorg.gradle.debug.port=(port number)`：指定启用调试时要侦听的端口号，默认值为 5005

## 性能选项

- `-build-cache, --no-build-cache`： 尝试重用先前版本的输出，默认关闭(off) 
- `--max-workers`：设置 Gradle 可以使用的 woker 数，默认值是处理器数 
- `-parallel, --no-parallel`： 并行执行项目。有关此选项的限制，请参阅并行项目执行，默认设置为关闭(off)

:::tip

备注：在 gradle.properties 中指 定这些选项中的许多 选项，因此不需要命令行标志

:::

## 守护进程选项

- `--daemon, --no-daemon`：使用 Gradle 守护进程运行构建，默认是 on
- ` --foreground`：在前台进程中启动 Gradle 守护进程。
- ` -Dorg.gradle.daemon.idletimeout=(number of milliseconds)`： Gradle Daemon 将在这个空闲时间的毫秒数之后停止自己，默认值为 10800000 (3 小时)

## 日志选项

- `-Dorg.gradle.logging.level=(quiet,warn,lifecycle,info,debug)`：通过 Gradle 属性设置日志记录级别
  - `-q, --quiet`：只能记录错误信息 
  - `-w, --warn`：设置日志级别为 warn 
  - `-i, --info`：将日志级别设置为 info
  - `-d, --debug`：登录调试模式(包括正常的堆栈跟踪)

## 其他

- `-x:-x, --exclude-task `：常见 gradle -x test clean build 
- `--rerun-tasks`：强制执行任务，忽略 up-to-date，常见 gradle build --rerun-tasks 
- `--continue`：忽略前面失败的任务，继续执行，而不是在遇到第一个失败时立即停止执行。每 个遇到的故障都将在构建结束时报告，常见：gradle build --continue。 
- `gradle init --type pom`：将 maven 项目转换为 gradle 项目(根目录执行) 

:::info

- `gradle 任务名`：任务名支持驼峰式命名风格的任务名缩写，如：connectTask 简写为：cT，执行任务 gradle cT
- Gradle 指令本质：一个个的 task[任务],，Gradle 中所有操作都是基于任务完成的

:::
