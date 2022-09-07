---
displayed_sidebar: gitSidebar
---
# Git 常用命令

### 设置用户签名

:::info

签名的作用是区分不同操作者身份。用户的签名信息在每一个版本的提交信息中能够看 到，以此确认本次提交是谁做的。Git 首次安装必须设置一下用户签名，否则无法提交代码。

:::

```shell showLineNumbers
git config --global user.name 用户名
git config --global user.emal 邮箱
```

:::caution 注意

这里设置用户签名和将来登录 GitHub（或其他代码托管中心）的账号没有任 何关系。

:::

```shell showLineNumbers
# 初始化本地库
git init
# 查看本地库状态
git status
# 添加到暂存区
git add 文件名
# 提交到本地库
git commit -m "日志信息" 文件名
# 查看历史记录
git reflog # 查看版本信息
git log # 查看版本详细信息
# 版本穿梭
git reset --hard 版本号
```

