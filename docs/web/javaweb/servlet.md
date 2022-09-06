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

![ServletLife](/img/core/javaweb/Servlet生命周期.png)

### Servlet 容器

- 负责容器内对象的创建、初始化、工作、异常处理、清理、销毁等等各个方面
- 通常是单例的

### HttpServlet 的继承关系

![HttpServlet](/img/core/javaweb/HttpServlet.png)

## 创建 Servlet 容器

### 创建 XxxServlet 类

- **方式一：实现 Servlet 接口**

  ```java showLineNumbers 
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

  ```java showLineNumbers 
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

```xml showLineNumbers 
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

```java showLineNumbers 
public interface ServletConfig {
    public String getServletName();

    public ServletContext getServletContext();

    public String getInitParameter(String name);
  
    public Enumeration<String> getInitParameterNames();
}
```

- web.xml 中的配置

  ```xml showLineNumbers 
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

- 获取 web.xml 中配置的上下文参数 context-param：`getInitParameter()`
- 获取当前工程路径：`getContextPath()`
- 获取工程部署后在服务器硬盘上的绝对路径：`getRealPath(String path)`
- 像 Map 一样存取数据



## 请求 (Request) 与响应 (Resposne)

### 请求 (HttpServletRequest 类)

> 只要有请求进入 Tomcat 服务器，Tomcat 服务器就会把请求过来的 HTTP 协议信息解析封装到 Request 对象中，然后传递到 service 方法（doGet 和 doPost）中，可以通过 HttpServletRequest 对象获取到所有的请求信息

#### 常用方法

- 获取请求的资源路径：`getRequestURI()`
- 获取请求的统一资源定位符：`getRequestURL()`
- 获取客户端的 ip 地址：`getRemoteHost()`
- 获取请求头：`getHeader()`
- 获取请求参数：`getParameter()`
- 获取请求参数（多个值）：`getParameterValues()`
- 获取请求方法：`getMethod()`
- 设置域数据：`setAttribute(key, value)`
- 获取域数据：`getAttribute(key)`
- 获取请求转发对象：`getRequestDispatcher()`

#### 获取请求参数

- 获取一个值的请求参数：`request.getParameter()`
- 获取多个值的请求参数：`request.getParameterValues()`

#### 请求的转发

> 请求转发是指服务器收到请求后，从一个资源跳转到另一个资源的操作

```java 
request.getRequestDispatcher("").forward(request, response);
```

#### 设置字符集，解决请求中文乱码问题

- GET 请求：在 Tomcat 的 server.xml 中配置 `URIEncoding = “UTF-8”`
- POST 请求：在**获取请求参数前**，调用 `request.setCharacterEncoding("UTF-8") `

### 响应 (HttpServletResponse 类)

> 每次请求进来，Tomcat 服务器都会创建要给 Response 对象传递给 Servlet 程序去使用，HttpServletResponse 表示所有响应的信息，通过HttpServletResponse 设置返回给客户端的信息

#### 获取输出流

- 字节流：`response.getOutputStream()`
- 字符流：`response.getWriter()`

#### 请求重定向

> 请求重定向是指客户端给服务发送请求，然后服务器回传给客户端一个新地址，让客户端去访问这个新地址

```java
response.sendRedirect("");
```

#### 设置字符集，解决响应中文乱码问题

- 方式一：设置服务器端对应响应体数据的编码字符集，还需要设置浏览器的解码字符集（不推荐）

  ```java
  // 设置服务器字符集为 UTF-8
  resp.setCharacterEncoding("UTF-8");
  // 通过响应头，设置浏览器也使用 UTF-8 字符集
  resp.setHeader("Content-Type", "text/html; charset=UTF-8");
  ```

- 方式二：设置浏览器本次响应体的内容类型，等于设置浏览器的解码字符集，服务器会自动使用这个字符集编码

  ```java
  resp.setContentType("text/html; charset=UTF-8");
  ```

### 转发与重定向的对比

|                 转发                 |                重定向                |
| :----------------------------------: | :----------------------------------: |
|               一次请求               |               两次请求               |
| 浏览器地址栏显示的是第一个资源的地址 | 浏览器地址栏显示的是第二个资源的地址 |
|     全程使用同一个 request 对象      |     全程使用不同的 request 对象      |
|            在服务器端完成            |            在浏览器端完成            |
|       目标资源地址由服务器解析       |         目标资源由浏览器解析         |
|    目标资源可以在 WEB-INF 目录下     |    目标资源不能在 WEB-INF 目录下     |
|       目标资源仅限于本应用内部       |        目标资源可以是外部资源        |
