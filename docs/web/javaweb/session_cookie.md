---
displayed_sidebar: javawebSidebar
---

# 会话控制

## Cookie

### Cookie 的工作机制

- Cookie 信息是在服务器创建的
- Cookie 在服务器端被放在响应数据中返回给浏览器
- 浏览器接收到 Cookie 后，会把 Cookie 保存起来
- 浏览器保存了 Cookie 后每一个请求都会把路径匹配的 Cookie 带上

### Cookie 的时效性

- 会话级 Cookie：默认情况
  - 保存在浏览器的内存里，在浏览器关闭时被释放
- 持久化 Cookie：
  - 服务器端调用 Cookie 的 `setMaxAge()` 方法设置存活时间
    - 正数：还能存活的秒数
    - 0：告诉浏览器立即删除这个 Cookie
    - 负数：告诉浏览器这个 Cookie 是一个会话级 Cookie
  - 服务器把这个Cookie返回给浏览器时就等于通知浏览器：这个Cookie还能存在多长时间

### Cookie 的路径

- 每个 Cookie 都有 domain 和 path 两个属性
  - domain：表示这个 Cookie 属于哪个网站，通常以域名为值
  - path：表示这个 Cookie 属于网站下的哪一个具体的资源

## Session

### Session 的工作机制



### Session 的时效性

#### Session 时效性机制

- 每一个 Session 对象从创建出来就开始倒计时
- 在倒计时的过程中，一旦有请求访问了这个 Session，倒计时清零重新开始
- 一旦一个 Session 对象的倒计时结束，这个 Session 对象就会被释放

#### Session 时效性方法

- 设置 Session 最大的过期时间：`setMaxInactiveInterval(int interval)`
- 最大空闲时间默认为 1800 秒，即半个小时
- `invalidate()` 立即释放 Session 对象
