# Gradle 文件操作

## 本地文件

- 使用 **`Project.file(java.lang.Object)`** 方法，通过指定文件的**相对路径或绝对路径**来对文件的操作,其中相对路径为相对当前 project [根 project 或者子 project] 的目录

- 示例：

```gradle
//使用相对路径
File configFile = file('src/conf.xml') configFile.createNewFile(); 

// 使用绝对路径
configFile = file('D:\\conf.xml')
println(configFile.createNewFile())

// 使用一个文件对象
configFile = new File('src/config.xml')
println(configFile.exists())
```

:::tip

使用 `Project.file(java.lang.Object)` 方法创建的 `File` 对象就是 `Java` 中的 `File` 对象，我们可以使用它就像在 Java 中使用一样

:::

## 文件集合

- 文件集合就是一组文件的列表，在 Gradle 中，文件集合用 `FileCollection` 接口表示 。使用**`Project.files(java.lang.Object[])`** 方法来获得一个文件集合对象
- 示例：

```gradle
def collection = files('src/test1.txt',new File('src/test2.txt'),['src/test3.txt', 'src/test4.txt']) 
collection.forEach() { File it ->
	it.createNewFile() // 创建该文件
	println it.name // 输出文件名
}
Set set1 = collection.files // 把文件集合转换为java中的Set类型
Set set2 = collection as Set
List list = collection as List // 把文件集合转换为java中的List类型
for (item in list) {
	println item.name
}
def union = collection + files('src/test5.txt') // 添加或者删除一个集合
def minus = collection - files('src/test3.txt') 
union.forEach() { File it ->
	println it.name
}
```

## 文件树

- **文件树是有层级结构的文件集合**，一个文件树它可以代表一个目录结构或一 ZIP 压缩包中的内容结构
- 文件树是从文件集合继承过来的，所以文件树具有文件集合所有的功能
- 使用 **`Project.fileTree(java.util.Map)`** 方法来创建文件树对象， 还可以使用过虑条件来包含或排除相关文件
- 示例：

```gradle
// 第一种方式:使用路径创建文件树对象，同时指定包含的文件
tree = fileTree('src/main').include('**/*.java')

//第二种方式:通过闭包创建文件树
tree = fileTree('src/main') {
	include '**/*.java' 
}
//第三种方式:通过路径和闭包创建文件树：具名参数给map传值
tree = fileTree(dir: 'src/main', include: '**/*.java') 
tree = fileTree(dir: 'src/main', includes: ['**/*.java', '**/*.xml', '**/*.txt'], exclude: '**/*test*/**')

// 遍历文件树的所有文件
tree.each { File file -> 
	println file 
	println file.name
}
```

## 文件拷贝

- 我们可以使用 **Copy 任务** 来拷贝文件，通过它可以过虑指定拷贝内容，还能对文件进行重命名操作等
- Copy 任务 必须指定一组需要拷贝的文件和拷贝到的目录，使用 **`CopySpec.from(java.lang.Object[])`** 方法指定**原文件**；使用 **`CopySpec.into(java.lang.Object)`** 方法指定**目标目录**
- 示例：

```gradle
task copyTask(type: Copy) {
	from 'src/main/resources' 
	into 'build/config' 
}
```

:::info

- `from()` 方法接受的参数和文件集合时 `files()`一样
  - 当参数为一个**目录**时，该目录下所有的文件都会被拷贝到指定目录下（目录自身不会被拷贝）
  - 当参数为一个**文件**时，该文件会被拷贝到指定目录；如果参数指定的文件不存在，就会被忽略
  - 当参数为一个 **Zip 压缩文件**，该压缩文件的内容会被拷贝到指定目录。
- `into()` 方法接受的参数与本地文件时 `file()` 一样

:::

- 在拷贝文件的时候还可以**添加过虑条件来指定包含或排除**的文件

```gradle
task copyTaskWithPatterns(type: Copy) {
	from 'src/main/webapp' 
	into 'build/explodedWar' 
	// highlight-start
	include '**/*.html' include '**/*.jsp' 
	exclude { details -> details.file.name.endsWith('.html') }
	// highlight-end
}
```

- 在拷贝文件的时候还可以对文件进行**重命名**操作

```gradle
task rename(type: Copy) {
	from 'src/main/webapp' into 'build/explodedWar' 
	// 使用一个闭包方式重命名文件
	// highlight-start
	rename { String fileName ->
		fileName.replace('-staging-', '')
	}
	// highlight-end
}
```

- 使用 **`Project.copy(org.gradle.api.Action)`** 方法 或 `project` 对象的 `copy` 方法来完成拷贝功能

```gradle
task copyMethod {
	doLast {
		copy {
			from 'src/main/webapp' 
			into 'build/explodedWar' 
			include '**/*.html' include '**/*.jsp' 
		}
	}
}
// 或
copy {
	//相对路径或者绝对路径
	from file('src/main/resources/ddd.txt') // file也可以换成 new File()
	into this.buildDir.absolutePath
}
```

## 归档文件

- 通常一个项目会有很多的 Jar 包，我们希望把项目打包成一个 WAR，ZIP 或 TAR 包进行发布，可以使用 Zip，Tar，Jar，War 和 Ear 任务来实现
- 示例：

```gradle
apply plugin: 'java' version=1.0
task myZip(type: Zip) {
	from 'src/main‘ into ‘build’ // 保存到build目录中
	baseName = 'myGame'
}
println myZip.archiveName
```

- 使用 **`Project.zipTree(java.lang.Object)`** 和 **`Project.tarTree(java.lang.Object)`** 方法来创建访问 Zip 压缩包的文 件树对象

```gradle
// 使用zipTree 
FileTree zip = zipTree('someFile.zip')
// 使用tarTree 
FileTree tar = tarTree('someFile.tar')
```

