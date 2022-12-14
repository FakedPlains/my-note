/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
    docs: [
        {
            type: 'category',
            label: '全栈知识',
            collapsible: false,
            collapsed: false,
            link: {type: "doc", id: "core/README"},
            items: [
                {
                    type: 'category',
                    label: '基础',
                    collapsible: true,
                    collapsed: false,
                    items: [
                        {
                            type: 'doc',
                            label: 'Java 知识体系',
                            id: 'core/basic/java/README'
                        },
                        {
                            type: 'doc',
                            label: 'Golang 知识体系',
                            id: 'core/basic/golang/README'
                        },
                    ],
                },
                {
                    type: 'category',
                    label: '数据库',
                    collapsible: true,
                    collapsed: false,
                    items: [
                        {
                            type: 'doc',
                            label: 'MySQL',
                            id: 'core/database/mysql/README'
                        },
                        {
                            type: 'doc',
                            label: 'MongoDB',
                            id: 'core/database/mongodb/README'
                        },
                        {
                            type: 'doc',
                            label: 'Redis',
                            id: 'core/database/redis/README'
                        },
                    ],
                },
                {
                    type: 'category',
                    label: 'Web 基础',
                    collapsible: true,
                    collapsed: false,
                    items: [
                        {
                            type: "doc",
                            label: "Java Web",
                            id: 'core/web/javaweb/README'
                        },
                    ]
                },
                {
                    type: 'category',
                    label: '框架 | 中间件',
                    collapsible: true,
                    collapsed: false,
                    items: [
                        {
                            type: 'doc',
                            label: 'Mybatis',
                            id: 'core/framework/mybatis/README'
                        },
                        {
                            type: 'doc',
                            label: 'Spring',
                            id: 'core/framework/spring/README'
                        },
                        {
                            type: 'doc',
                            label: 'SpringBoot',
                            id: 'core/framework/springboot/README'
                        },
                        {
                            type: 'doc',
                            label: 'SpringCloud',
                            id: 'core/framework/springcloud/README'
                        },
                    ]
                },
                {
                    type: 'category',
                    label: '工具 | 部署',
                    collapsible: true,
                    collapsed: false,
                    link:{
                        type: 'generated-index',
                    },
                    items: [
                        {
                            type: 'doc',
                            label: 'Git',
                            id: 'core/tool/git/README'
                        },
                        {
                            type: 'doc',
                            label: 'Maven',
                            id: 'core/tool/maven/README'
                        },
                        {
                            type: 'doc',
                            label: 'Gradle',
                            id: 'core/tool/gradle/README'
                        },
                        {
                            type: 'doc',
                            label: 'Linux',
                            id: 'core/tool/linux/README'
                        },
                    ]
                }
            ]
        },
    ],
    javaSidebar: [
        {
            type: 'category',
            label: 'Java 知识体系',
            collapsible: false,
            collapsed: false,
            items: [
                {type: 'doc', id: 'basic/java/oop', label: '面向对象'},
                {type: 'doc', id: 'basic/java/JDBC', label: 'JDBC'},
            ]
        }
    ],
    javawebSidebar: [
        {
            type: 'category',
            label: 'Java Web',
            collapsible: false,
            collapsed: false,
            items: [
                {
                    type: 'doc',
                    label: 'Servlet 控制器',
                    id: 'web/javaweb/servlet'
                },
                {
                    type: 'doc',
                    label: '会话控制',
                    id: 'web/javaweb/session_cookie'
                },
                {
                    type: 'doc',
                    label: 'Filter 过滤器',
                    id: 'web/javaweb/filter'
                },
                {
                    type: 'doc',
                    label: 'Listener 监听器',
                    id: 'web/javaweb/listener'
                },
            ]
        },
        {
            type: "category",
            label: "Tomcat 源码解析",
            collapsible: false,
            collapsed: false,
            items: [
                {
                    type: 'doc',
                    label: 'Tomcat 概述',
                    id: 'web/tomcat/README'
                },
            ]
        }
    ],
    gitSidebar: [
        {
            type: 'category',
            label: 'Git 使用指南',
            collapsible: false,
            collapsed: false,
            items: [
                {type: 'doc', id: 'tool/git/common-cmds', label: 'Git 常用命令'},
                {type: 'doc', id: 'tool/git/branch-cmds', label: 'Git 分支操作'},
                {type: 'doc', id: 'tool/git/remote-cmds', label: 'Git 远程仓库操作'},
            ]
        }
    ],
    // mavenSidebar: [
    //   {
    //     type: 'category',
    //     label: 'Maven 项目构建',
    //     collapsed: false,
    //     collapsible: false,
    //     items: [
    //     ]
    //   }
    // ]
    gradleSidebar: [
        {
            type: 'category',
            label: 'Gradle',
            collapsed: false,
            collapsible: false,
            link: {type: 'doc', id: 'core/tool/gradle/README'},
            items: [
                {type: 'doc', label: 'Gradle 入门', id: 'tool/gradle/getting-started'},
                {type: 'doc', label: 'Gradle 生命周期与配置文件', id: 'tool/gradle/lifecycle'},
                {type: 'doc', label: 'Gradle 任务', id: 'tool/gradle/task'},
                {type: 'doc', label: 'Gradle 文件操作', id: 'tool/gradle/file-operator'},
                {type: 'doc', label: 'Gradle 依赖', id: 'tool/gradle/dependencies'},
                {type: 'doc', label: 'Gradle 插件', id: 'tool/gradle/plugins'},
                {type: 'doc', label: 'Gradle buildSrc 项目', id: 'tool/gradle/buildSrc'},
                {type: 'doc', label: 'Gradle 项目发布', id: 'tool/gradle/publish'},
                {type: 'doc', label: 'Gradle 命令', id: 'tool/gradle/command'},
            ]
        }
    ]
};

module.exports = sidebars;
