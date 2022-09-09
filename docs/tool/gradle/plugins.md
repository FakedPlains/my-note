# Gradle 插件

## 使用插件的原因

- 促进代码重用、减少功能类似代码编写、提升工作效率
- 促进项目更高程度的模块化、自动化、便捷化
- 可插拔式的扩展项目的功能

## 插件的作用

- 可以添加任务 【task】到项目中，从而帮助完成测试、编译、打包等
- 可以添加依赖配置到项目中
- 可以向项目最终拓展新的扩展属性、方法等
- 可以对项目进行一些约定

## 插件的分类和使用

### 脚本插件

> 脚本插件的本质就是一个脚本文件，使用脚本插件时通过 ` apply from:` 将脚本加载进来就可以了，后面的脚本文件可以是本地的，也可以是网络上的脚本文件

- version.gradle 文件

```gradle
ext {
	company= "尚硅谷" 
	cfgs = [
		compileSdkVersion : JavaVersion.VERSION_1_8
	]
	spring = [
		version : '5.0.0' 
	]
}
```

- 在 build.gradle 中使用这个脚本文件

```gradle
apply from: 'version.gradle' //map作为参数
task taskVersion{
	doLast{
		println "公司名称为：${company},JDK版本是${cfgs.compileSdkVersion},版本号是${spring.version}" 
	}
}
```

:::info

脚本文件是模块化的基础，可按功能把我们的脚本进行拆分一个个公用、职责分明的文件，然后在主脚本文件引用， 比如：将很多共有的库版本号一起管理、应用构建版本一起管理等

:::

### 二进制插件（对象插件）

> 二进制插件[对象插件]就是实现了 `org.gradle.api.Plugin` 接口的插件，每个 Java Gradle 插件都有一个 plugin

#### 内部插件

```gradle
// 使用方式1：Map具名参数,全类名
apply plugin:org.gradle.api.plugins.JavaPlugin
// org.gradle.api.plugins默认导入：使用方式2
apply plugin:JavaPlugin
//核心插件，无需事先引入，使用方式3:插件的id
apply plugin: 'java'

//也可以使用闭包作为 project.apply 方法的一个参数
apply {
	plugin 'java'
}
```

#### 第三方插件

- 如果是使用第三方发布的二进制插件，一般需要配置对应的仓库和类路径

```gradle
//使用传统的应用方式
buildscript { 
	ext {
		springBootVersion = "2.3.3.RELEASE"
	}
	repositories { 
		mavenLocal() 
		maven { url 'http://maven.aliyun.com/nexus/content/groups/public' }
		jcenter()
	}
	// 此处先引入插件
	dependencies { 
		classpath("org.springframework.boot:spring-boot-gradle-plugin:${springBootVersion}")
	}
}
//再应用插件
apply plugin: 'org.springframework.boot' //社区插件,需要事先引入，不必写版本号
```

- 如果是第三方插件已经被托管在 https://plugins.gradle.org/ 网站上，就可以不用在 buildscript 里配置 classpath 依赖了，直接使用新出的 plugins DSL 的方式引用

```gradle
plugins {
	id 'org.springframework.boot' version '2.4.1' 
}
```

:::tip

如果使用老式插件方式 `buildscript{}` 要放在 `build.gradle` 文件的最前面，而新式 `plugins{}` 没有该限制

:::

#### 自定义插件

```gradle
interface GreetingPluginExtension {
	Property<String> getMessage()
	Property<String> getGreeter()
}
class GreetingPlugin implements Plugin<Project> {
	void apply(Project project) {
		def extension = project.extensions.create('greeting', GreetingPluginExtension)
		project.task('hello') {
			doLast {
				println "${extension.message.get()} from ${extension.greeter.get()}"
			}
		}
	}
}
apply plugin: GreetingPlugin
// Configure the extension using a DSL block
greeting { message = 'Hi' greeter = 'Gradle' }
```

- [官网文档地址]([Developing Custom Gradle Plugins](https://docs.gradle.org/current/userguide/custom_plugins.html))
