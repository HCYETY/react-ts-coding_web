## 项目地址
GitHub 前端仓库地址：[https://github.com/HCYETY/Online-programming-platform](https://github.com/HCYETY/Online-programming-platform)

GitHub 后端仓库地址：[https://github.com/HCYETY/Online-programming-platform_service](https://github.com/HCYETY/Online-programming-platform_service)

项目演示地址：[http://www.syandeg.com](http://www.syandeg.com)
## 项目介绍
在线编程笔试平台是一个前后端分离项目，按照用户角色（面试官和候选人）分为面试官侧和候选人侧，主要功能是候选人在线完成代码编写，面试官可查看编程结果。

项目主要功能：

## 项目技术栈
前端：React + TypeScript ，后端：NodeJs + MYSQL + Koa 。
## 项目结构
## 项目任务拆解
1. 登录/注册模块
- 支持邮箱登录和注册
- 支持“退出登录”功能
2. 面试题模块
3. 在线编程模块
4. 在线留言模块
5. 在线编程模块支持自动刷新
6. 在线留言模块改成实时文字聊天
7. 在线语音聊天模块
8. 在线编程模块支持运行JS代码
9.  在线编程模块支持协同编辑
## 技术选型
|技术|说明|理由|
|:--:|:--:|:--:|
|Ant Design|前端 UI 设计|成熟的 UI 组件库，GitHub 上有 `166 watch` & `32.5k fork` & `78.1k star`|
||||
||||
||||
## 项目进度
- [x] 2021-09-04：实现登录/注册的静态页面
- [x] 2021-09-19：实现登录/注册逻辑（包括账号密码登录、登录拦截，session 身份验证）
- [x] 2021-09-29：初步部署前后端项目到阿里云服务器
- [x] 2021-10-04：购买域名并实现自动化部署项目
- [x] 2021-10-05：支持使用邮箱 登录和注册
- [x] 2021-10-09：面试官侧支持新建/删除试卷，在“新建试卷”里新建/修改/删除试题，发送邮件至候选人邮箱
- [x] 2021-10-15：候选人侧展示试卷、开始编程、提交试卷
- [x] 2021-10-16：支持“退出登录”
- [ ] 2021-10-30：
- [x] 2021-10-31：搭建个人博客
- [x] 2021-11-06：沉淀项目所学，写博客中
- [x] 2021-11-14：评论功能雏形（但因暂无该需求，先放一边）
- [x] 2021-11-23：实现试题筛选功能，完成编程模块 
- [ ] 2021-12-01：
- [x] 2021-12-03: 实现在线聊天功能
- [ ] 2021-12-10：解决编辑冲突问题
- [x] 2021-12-14：项目持续待机中，先学小程序开发去了
## 项目展示
### PC 端
1. 登录/注册
![登录界面](https://z3.ax1x.com/2021/11/02/IkyIBQ.png)
![注册界面](https://z3.ax1x.com/2021/11/02/Ik63gf.png)
#### 面试官侧
2. 试题管理
![试卷展示](https://s4.ax1x.com/2022/02/18/H7OIxS.png)
![添加试题之试卷信息](https://s4.ax1x.com/2022/02/18/H7X6zT.png)
![添加试题之试题信息](https://s4.ax1x.com/2022/02/18/H7Xhw9.png)
![修改试卷1](https://s4.ax1x.com/2022/02/18/H7XLOe.png)
![修改试卷2](https://s4.ax1x.com/2022/02/18/H7jekn.png)
3. 阅卷管理
![试卷展示](https://s4.ax1x.com/2022/02/18/H7jMlT.png)
![试卷详细信息之1](https://s4.ax1x.com/2022/02/18/H7jYkR.png)
![试卷详细信息之2](https://s4.ax1x.com/2022/02/18/H7j0XD.png)
![试卷详细信息之3](https://s4.ax1x.com/2022/02/18/H7js7d.png)
![批阅试卷](https://s4.ax1x.com/2022/02/18/H7jR9P.png)
4. 面试间管理
![面试间信息展示](https://s4.ax1x.com/2022/02/18/H7jfc8.png)
![添加面试间](https://s4.ax1x.com/2022/02/18/H7jbhq.png)
5. 面试间入口
![进入面试间](https://s4.ax1x.com/2022/02/18/H7jO3V.png)
#### 候选人侧