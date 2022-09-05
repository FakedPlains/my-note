---
displayed_sidebar: javawebSidebar
---

# Servlet 控制器

## Servlet 概述

### 功能概述

- Servlet 控制器，在系统中作为总体的调度控制
- 具体功能
  - 接受请求
  - 根据业务逻辑处理请求
  - 分发页面（转发、重定向）
  - 返回响应

### 生命周期

| 生命周期环节 |                          调用的方法                          |        时机        | 次数 |
| :----------: | :----------------------------------------------------------: | :----------------: | :--: |
|   创建对象   |                          无参构造器                          | 默认：第一次请求时 |  1   |
|    初始化    |             `init(ServletConfig servletConfig)`              |     创建对象后     |  1   |
|   处理请求   | `service(ServletRequest servletRequest, ServletResponse servletResponse)` |    接收到请求后    |  n   |
|   销毁对象   |                         `destroy()`                          |   Web应用卸载时    |  1   |

### Servlet 容器

- 负责容器内对象的创建、初始化、工作、异常处理、清理、销毁等等各个方面
- 通常是单例的

### HttpServlet 的继承关系

![HttpServlet](/img/core/javaweb/HttpServlet.png)

## 创建 Servlet 容器

### 创建 XxxServlet 类

- **方式一：实现 Servlet 接口**

  ```java
  public class HelloServlet implements Servlet {
      @Override
      public void init(ServletConfig config) throws ServletException {
      }
  
      @Override
      public ServletConfig getServletConfig() {
          return null;
      }
  
      // service 方法用于处理请求
      @Override
      public void service(ServletRequest req, ServletResponse res) throws ServletException, IOException {
          System.out.println("Hello, World");
      }
  
      @Override
      public String getServletInfo() {
          return null;
      }
  
      @Override
      public void destroy() {
      }
  }
  ```
  
- **方式二：继承 HttpServlet 类**

  ```java
  public class HelloServlet extends HttpServlet {
      // doGet() 方法用于处理 Get 请求
      @Override
      protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
          System.out.println("HelloServlet doGet()...");
      }
  
      // doGet() 方法用于处理 Post 请求
      @Override
      protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
          System.out.println("HelloServlet doPost()...");
      }
  }
  ```
  


### 在 web.xml 中配置 servlet

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">
    <!-- servlet 标签给 Tomcat 配置 Servlet 程序 -->
    <servlet>
        <!-- servlet-name 标签 Servlet 程序起一个别名（一般是类名） -->
        <servlet-name>HelloServlet</servlet-name>
        <!-- `servlet-class` 是 Servlet 程序的全类名，指明当前的 Servlet 容器 -->
        <servlet-class>com.servlet.HelloServlet</servlet-class>
    </servlet>
    <!-- servlet-mapping 标签给 servlet 程序配置访问地址映射 -->
    <servlet-mapping>
        <!-- servlet-name 标签配置当前访问地址所对应的 Servlet 程序的别名 -->
        <servlet-name>HelloServlet</servlet-name>
        <!--
			url-pattern 标签配置访问地址
				- / 斜杠在服务器解析的时候，表示地址为：http://ip:port/工程路径 
				- /hello 表示地址为：http://ip:port/工程路径/hello 
		-->
        <url-pattern>/hello</url-pattern>
    </servlet-mapping>
</web-app>
```

## 辅助 Servlet 工作的对象

### ServletConfig 类

- 主要功能
  - 获取 Servlet 程序别名 servlet-name
  - 获取 ServletContext 对象
  - 获取初始化参数 init-param

```java
public interface ServletConfig {
    public String getServletName();

    public ServletContext getServletContext();

    public String getInitParameter(String name);
  
    public Enumeration<String> getInitParameterNames();
}
```

- web.xml 中的配置

  ```xml
  <!-- servlet 标签给 Tomcat 配置 Servlet 程序 -->
  <servlet>
      <!--servlet-name 标签 Servlet 程序起一个别名（一般是类名） -->
      <servlet-name>HelloServlet</servlet-name>
      <!--servlet-class 是 Servlet 程序的全类名-->
      <servlet-class>com.atguigu.servlet.HelloServlet</servlet-class>
      <!--init-param 是初始化参数-->
      <init-param>
          <!--是参数名-->
          <param-name>username</param-name>
          <!--是参数值-->
          <param-value>root</param-value>
      </init-param>
  </servlet>
  ```

### ServletContext 类

#### 概述

- ServletContext 是一个接口，表示 Servlet 上下文对象，代表整个 Web 应用，生命周期和整个 Web 应用的生命周期一致
- 一个 web 工程，只有一个 ServletContext 对象实例
- ServletContext 在 web 工程启动时创建，在 web 工程停止时销毁

#### 主要功能

- 获取 web.xml 中配置的上下文参数 context-param
- 获取当前工程路径
- 获取工程部署后在服务器硬盘上的绝对路径
- 像 Map 一样存取数据

