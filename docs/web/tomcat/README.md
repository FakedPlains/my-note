---
displayed_sidebar: javawebSidebar
---

# Tomcat 架构设计

![Tomcat 架构图](/img/core/javaweb/tomcat-x-design.png)

## 从组件角度看

- #### Server：

  > 表示**服务器**，提供一种方式来启动和停止整个系统，不必单独启动连接器和容器；是 Tomcat 构成的顶级元素，所有一切均包含在 server 中

- #### Service：

  > 表示**服务**，Server 可以运行多个服务。Server 的实现类 StandardServer 可以包含一个到多个 Services，Service 的实现类为 StandardService 调用了容器（Container）接口，其实是调用了 Servlet Engine（引擎），而且 StandardService 类中也指明了该 Service 归属的 Server

- #### Container：

  > 表示容器，可以看作 Servlet 容器

  - Engine —— 引擎
  - Host —— 主机
  - Context —— 上下文
  - Wrapper —— 包装器

- #### Connector：

  > 表示**连接器**，将 Service 和 Container 连接起来，首先它需要注册到一个 Service，它的作用是把来自客户端的请求转发到 Container（容器）

- #### Service 内部的支撑组件

  - Manager —— 管理器，用于管理会话 Session
  - Logger —— 日志器，用于管理日志
  - Loader —— 加载器，和类加载有关有关，只会开放给 Context 使用
  - Pipeline —— 管道组件，配合 Valve 实现过滤器功能
  - Valve —— 阀门组件，配合 Pipeline 实现过滤器功能
  - Realm —— 认证授权组件

## 从 web.xml 配置和模块对应角度

:::tip

上述模块的理解不是孤立的，它直接映射为Tomcat的web.xml配置

:::

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Server port="8005" shutdown="SHUTDOWN">
  <Listener className="org.apache.catalina.startup.VersionLoggerListener" />
  <Listener className="org.apache.catalina.core.AprLifecycleListener" SSLEngine="on" />
  <Listener className="org.apache.catalina.core.JreMemoryLeakPreventionListener" />
  <Listener className="org.apache.catalina.mbeans.GlobalResourcesLifecycleListener" />
  <Listener className="org.apache.catalina.core.ThreadLocalLeakPreventionListener" />

  <GlobalNamingResources>
    <Resource name="UserDatabase" auth="Container"
              type="org.apache.catalina.UserDatabase"
              description="User database that can be updated and saved"
              factory="org.apache.catalina.users.MemoryUserDatabaseFactory"
              pathname="conf/tomcat-users.xml" />
  </GlobalNamingResources>

  <Service name="Catalina">
    <Connector port="8080" protocol="HTTP/1.1"
               connectionTimeout="20000"
               redirectPort="8443"
			   URIEncoding="UTF-8"/>
   
    <Engine name="Catalina" defaultHost="localhost">
      <Realm className="org.apache.catalina.realm.LockOutRealm">
        <Realm className="org.apache.catalina.realm.UserDatabaseRealm"
               resourceName="UserDatabase"/>
      </Realm>

      <Host name="localhost"  appBase="webapps"
            unpackWARs="true" autoDeploy="true">
        <Valve className="org.apache.catalina.valves.AccessLogValve" directory="logs"
               prefix="localhost_access_log" suffix=".txt"
               pattern="%h %l %u %t &quot;%r&quot; %s %b" />
      </Host>
    </Engine>
  </Service>
</Server>
```

## 从一个完整请求的角度来看

