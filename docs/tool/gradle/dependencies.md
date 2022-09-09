# Gradle 依赖

## 依赖方式

Gradle 中的依赖分别为 **直接依赖，项目依赖，本地 jar 依赖**

```gradle
dependencies {
	// 直接依赖
	implementation 'org.apache.logging.log4j:log4j:2.17.2' 
	
	// 项目依赖
	// 依赖当前项目下的某个模块[子工程]
	implementation project(':subject01')
	
	// 直接依赖
	// 直接依赖本地的某个jar文件
	implementation files('libs/foo.jar', 'libs/bar.jar')
	// 配置某文件夹作为依赖项
	implementation fileTree(dir: 'libs', include: ['*.jar'])
}
```

- **直接依赖：**在项目中直接导入的依赖，就是直接依赖
  - 简写：`implementation 'org.apache.logging.log4j:log4j:2.17.2' `
  - 完整写法：`implementation group: 'org.apache.logging.log4j', name: 'log4j', version: '2.17`
    - implementation：依赖类型，类似 maven 中的依赖的 scope
    - group/name/version：共同定位一个远程仓库
- **项目依赖：**从项目的某个模块依赖另一个模块
  - 这种依赖方式是直接依赖本工程中的 library module，这个 library module 需要
- **本地依赖：**本地 jar 文件依赖

## 依赖的下载

当执行 build 命令时，gradle 就会去配置的依赖仓库中下载对应的 Jar，并应用到项目中

## 依赖类型

| 依赖类型           | 功能                                                         |
| ------------------ | ------------------------------------------------------------ |
| compileOnly        | 由 java 插件提供，适用于编译期需要而不需要打包的情况         |
| runtimeOnly        | 由 java 插件提供，只在运行期有效，编译时不需要，比如 mysql 驱动包 |
| implementation     | 由 java 插件提供，针对源码 [src/main 目录] ，在编译、运行时都有效 |
| testCompileOnly    | 由 java 插件提供，用于编译测试的依赖项，运行时不需要         |
| testRuntimeOnly    | 由 java 插件提供，只在测试运行时需要，而不是在测试编译时需要 |
| testImplementation | 由 java 插件提供，针对测试代码 [src/test 目录]               |
| providedCompile    | 由 war 插件提供支持，编译、测试阶段代码需要依赖此类 jar 包，而运行阶段容器已经提供了相应的支持，所以无需将这些文件打入到 war 包中了，例如 servlet-api.jar |
| api                | java-library 插件提供支持，这些依赖项可以传递性地导出给使用者，用于编译时和运行时 |
| compileOnlyApi     | java-library 插件提供支持，在声明模块和使用者在编译时需要的依赖项，但在运行时不需要 |

## api 和 implementation 区别

|              | api                                            | implementation                                     |
| :----------: | ---------------------------------------------- | -------------------------------------------------- |
|  **编译时**  | 能进行依赖传递，底层变，全部都要变，编译速度慢 | 不能进行依赖传递，底层变，不用全部都变，编译速度快 |
|  **运行时**  | 运行时会加载，所有模块的 class 都要被加载      | 运行时会加载，所有模块的 class 都要被加载          |
| **应用场景** | 适用于多模块依赖，避免重复依赖模块             | 多数情况下使用 implementation                      |

:::tip

除非涉及到多模块依赖，为了避免重复依赖，会使用 `api`，其它情况我们优先选择 `implementation`，拥有大量的 api 依赖项会显著增加构建时间

:::

## 依赖冲突及解决方案

> 依赖冲突是指 "在编译过程中, 如果存在某个依赖的多个版本，构建系统应该选择哪个进行构建的问题"

- 默认下，Gradle 会使用**最新版本的 jar 包**

Gradle 也为我们提供了一系列的解决依赖冲突的方法：

- **Exclude 排除某个依赖**

```gradle
dependencies {
	implementation('org.hibernate:hibernate-core:3.6.3.Final'){
		// 排除某一个库(slf4j)依赖:如下三种写法都行
		exclude group: 'org.slf4j' 
		exclude module: 'slf4j-api' 
		exclude group: 'org.slf4j',module: 'slf4j-api' 
	}
	// 排除之后,使用手动的引入即可
	implementation 'org.slf4j:slf4j-api:1.4.0' 
}
```

- **不允许依赖传递**

```gradle
dependencies {
	implementation('org.hibernate:hibernate-core:3.6.3.Final') {
		// 不允许依赖传递，一般不用
		transitive(false)
	}
// 排除之后,使用手动的引入即可
implementation 'org.slf4j:slf4j-api:1.4.0' 
}
```

:::tip

在添加依赖项时,如果设置 `transitive` 为 `false`，表示关闭依赖传递。即内部的所有依赖将不会添加到编译和运行时的类路径。

:::

- **强制使用某个版本**

```gradle
dependencies {
	implementation('org.hibernate:hibernate-core:3.6.3.Final')
	//强制使用某个版本!!【官方建议使用这种方式】
	implementation('org.slf4j:slf4j-api:1.4.0!!')
	
	//这种效果和上面那种一样,强制指定某个版本
	implementation('org.slf4j:slf4j-api:1.4.0') { 
		version {
			strictly("1.4.0")
		}
	}
}
```

<details>
  <summary>可以先查看当前项目中到底有哪些依赖冲突</summary>

```gradle
//下面我们配置，当 Gradle 构建遇到依赖冲突时，就立即构建失败
configurations.all() {
	Configuration configuration ->
		//当遇到版本冲突时直接构建失败
		configuration.resolutionStrategy.failOnVersionConflict()
}
```

</details>

