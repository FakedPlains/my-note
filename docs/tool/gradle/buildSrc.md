# Gradle buildSrc 项目

## buildSrc 本工程插件项目

:::info

**buildSrc 是 Gradle 默认的插件目录，编译 Gradle 的时候会自动识别这个目录，将其中的代码编译为插件**

:::

### 1. 创建 buildSrc 的 Module

- 首先建立一个名为 `buildSrc` 的 java Moudle
- 将 buildSrc 从 `setting.gradle` 中 `included modules` 移除，重新构建
- 只保留 build.gradle 和 src/main 目录，其他全部删掉

:::caution

注意名字一定是 **buildSrc**，不然会找不到插件

:::

### 2. 修改 build.gradle 文件

```gradle
apply plugin: 'groovy' //必须
apply plugin: 'maven-publish'

dependencies {
    implementation gradleApi() //必须
    implementation localGroovy() //必须
}

repositories {
    google()
    jcenter()
    mavenCentral() //必须
}

//把项目入口设置为 src/main/groovy
sourceSets {
    main {
        groovy {
            srcDir 'src/main/groovy'
        }
    }
}
```

### 3. 创建插件类

- 在 **`src/main/groovy/`** 下创建 groovy 类

```groovy
package cloud.zfwproject

import org.gradle.api.Plugin
import org.gradle.api.Project

class Text implements Plugin<Project> {
    @Override
    void apply(Project project) {
        // 具体操作
        project.task("valley") {
            doLast {
                println("自定义 valley 插件")
            }
        }
    }
}
```

### 4. 创建配置文件

- 在 **`src/main/resources/META-INF/gradle-plugins/`** 目录下创建 **`properties`** 文件
- cloud.zfwproject.plugin.properties 文件

```properties
implementation-class=cloud.zfwproject.Text
```

### 5. 引入插件

- 在要使用的 module 的 **`build.gradle`** 中引入插件 

```gradle
apply plugin: 'cloud.zfwproject.plugin'
```

## 发布插件至 maven 仓库中

### 1. 创建 Module

- 将上述 buildSrc 目录复制一份，修改文件夹名，然后在 **`settings.gradle`** 文件中使用 include 引入

### 2. 修改 build.gradle 文件

- 修改 **`build.gradle`** 文件，发布到 maven 仓库中

```gradle
apply plugin: 'groovy' // 必须
apply plugin: 'maven-publish' //必须

dependencies {
    implementation gradleApi() //必须
    implementation localGroovy() //必须
}

repositories {
    google()
    jcenter()
    mavenCentral() //必须
}

//把项目入口设置为 src/main/groovy
sourceSets {
    main {
        groovy {
            srcDir 'src/main/groovy'
        }
    }
}

publishing {
    publications {
        myLibrary(MavenPublication) {
        	//指定GAV坐标信息
            groupId = 'cloud.zfwproject.plugin'
            artifactId = 'library'
            version = '1.1'
            from components.java // 发布jar包
            // from components.web // 引入war插件，发布war包
        }
    }
    repositories {
    	// 发布到本地
        maven { url "$rootDir/lib/release" }
        // 发布项目到私服中
        /*maven {
            name = 'myRepo' // name属性可选,表示仓库名称，url必填
            // 发布地址:可以是本地仓库或者maven私服
            // url = layout.buildDirectory.dir("repo")
            // url='http://my.org/repo'
            // change URLs to point to your repos, e.g. http://my.org/repo
            // 认证信息:用户名和密码
            credentials {
                username = 'joe'
                password = 'secret'
            }
        }*/
    }
}
```

### 3. 发布插件

- 执行 **`publish`** 指令，发布到根 project 或者 maven 私服

### 4. 使用插件

- 在项目级 `build.gradle` 文件中将插件添加到 `classpath`

```gradle
buildscript {
    repositories {
        maven { url "$rootDir/lib/release" }
    }
    dependencies {
        classpath: "cloud.zfwproject.plugin:library:1.1"
    }
}

apply plugin: 'cloud.zfwproject.plugin'
```

