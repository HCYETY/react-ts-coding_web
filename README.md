## 项目概述
该项目是一个在线编程笔试平台，主要功能是候选人在线完成代码编写，面试官可查看编程结果。  
该项目包含了前端和后端两种技术栈，前端采用的是React框架，后端采用的是NodeJs。
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
## 项目进度
- [x] 2021-09-04：实现登录/注册的静态页面
- [x] 2021-09-19：实现登录/注册逻辑（包括账号密码登录、登录拦截，session 身份验证）
- [x] 2021-09-29：初步部署前后端项目到阿里云服务器
- [x] 2021-10-04：购买域名并实现自动化部署项目
- [x] 2021-10-05：支持使用邮箱 登录和注册
- [x] 2021-10-09：支持新建/删除试卷，在“新建试卷”里新建/修改/删除试题，发送邮件至候选人邮箱
- [ ] 支持“退出登录”
## 项目文件简介

## 项目模块实现逻辑
### 1. 注册模块
- 1）这里先实现的是账号密码的注册。前端获取到输入框的值（账号、密码），然后通过 axios （或其他方法）配合后端接口将其发送至后端 【发送请求】   
- 2）后端先定义好接口以便前端调用（可用postman，方便测试接口是否正确），之后后端【接收前端请求】，获取请求中的数据（即账号、密码）   
- 3）后端根据账号查找数据库中是否存在相同账号的用户：如果有，说明该用户已注册过，不能重复注册；如果没有，则可以进行注册。无论是否可以注册，后端都要返回信息告知前端该用户的注册情况，以便用户进行下一步操作 【响应请求】  
- 4）前端获取后端响应回来的数据，进行相对应的执行语句：注册成功则跳转路由至登录界面，否则告知用户注册失败的原因。
### 2. 登录模块
- 1）同1.1一样，先将账号、密码发送至后端 【发送请求】  
- 2）同1.2一样，后端定义好接口，确保接口能顺利被调用，同时要 【接收请求】
- 3）后端根据账号拿出存在数据库中的用户数据，对比前端密码是否正确，若正确则返回登陆状态（isLogin: true）【响应请求】  
- 4）前端获取后端响应的数据，简单判断实现登录跳转，否则需注册  

> 然而这样简单地实现登录功能，用户是可能通过控制台篡改后端的响应数据的，从而也能实现登录跳转。故这里进行 session 身份验证，一方面防止用户恶意篡改，另一方面实现登录拦截（防止用户未经登录便通过 url 跳过登录验证）

- 5）在后端【接收前端请求】后，若密码匹配正确，则生成一个长度为 20 左右的包含数字和大小写字母的随机数，然后将这个随机数①存进该用户的信息中，以便在维护登录状态时可以根据用户账号获取；②生成一个 cookie ，将 session 存进该 cookie 中，然后前后端分别配置之后，就会在前端每次向后端请求数据时，请求头中自动带上 cookie 。最后设一个字段标识登录状态，返回给前端，以便前端判断是否登录成功  
- 6）前端拿到后端响应数据中的 isLogin 后，进行相应的登录处理。但若用户在未登录状态下通过 url 访问非登录页，就需要登录拦截，【前端拿取 cookie ，如果 cookie 存在】

### 3. 部署服务器
- 1）将项目部署至线上，使得任何用户在不同条件下也能够访问。那么首先需要一个服务器，网上有很多教程，能够教会大家如何拥有属于自己的服务器，这里不再赘述。本人使用的是阿里云的linux/CentOs7.7服务器（据说 21 年底，CentOs 官方将不再维护 CentOs8了，大家看看要配哪个系统好吧）。  
- 2）当大家拥有自己的服务器后，就需要配置各种环境以运行项目，网上虽然有相关的资料，但杂多繁乱，本人当初因为配置环境浪费了很多时间，这里贴下 @b站up主CodeSheep 的 pdf ，真是一个很好的配置说明，一条龙服务，很快就能配置大部分必备的环境：链接：https://pan.baidu.com/s/1yKVkabO-N-MCx4UwRbbKcQ 
提取码：h464

> 这里将会使用基础和进阶的方法部署项目，先说手动的比较麻烦的部署流程，毕竟事情要一步一步来，从易到难嘛。

- 3-1）将本地项目打包成 dist 包  
- 3-2）打开 Xshell 工具，在 nginx 已经配合好的前提下，修改 nginx 的配置文件：
```js
// 找到【 nginx 的安装目录下的 conf】，修改 conf 下的 nginx.conf 。
// 举例：我的安装路径是 /usr/local/nginx ，所以 vim /usr/local/nginx/conf/nginx.conf
// 进到文件里面后，按 i 可以进入编辑模式修改文件，修改好后按 esc 可以退出编辑模式，然后输入 :wq 保存并退出文件

// 修改配置如下：
// 1. 在第一行加上 user root;
// 2. 找到 server{ location / {} }，修改如下
server {
  listen       80;
  server_name  localhost;

  #charset koi8-r;

  #access_log  logs/host.access.log  main;

  // 这里修改
  location / {
    root   { nginx 的安装目录/html/xxx};
    // eg. root   /usr/local/nginx/html/dist，dist 为打包后的前端项目;
    index  index.html index.htm;
  }
}

// 配置好 nginx.conf 后，保存退出，重启 nginx
// 重启命令为 { nginx 的安装路径/sbin/nginx -s reload }，举例：/usr/local/nginx/sbin/nginx -s reload
```
- 3-3）打开 Xftp 工具，找到 { nginx 的安装路径/html/ }，例如 /usr/local/nginx/html/ ，将 dist 包上传至 html 目录下。访问 ip 地址就可以看到前端项目的静态界面了  

> 前端项目的部署相对来说简单一些，只要将打包后的文件夹上传到服务器即可（配置好 nginx 的前提下）。下面看下后端项目的部署：

- 4-1） 配置好 Tomcat ，相关教程看 上文3.2 的 pdf   
- 4-2）在 Tomcat 的安装目录下新建一个文件夹，用来存放后端项目，这里命名为 myApp 。打开 Xftp 工具，选中要上传的后端文件，拖拽实现上传  
- 4-3）打开 Xshell 工具，用命令行进入 myApp ，安装项目所需的依赖 `npm install` 。用 pm2 监控项目，先全局安装 pm2 `npm install pm2 -g` ，然后用 pm2 启动项目入口文件 `pm2 start {入口文件} ` 。到这里，后端项目的部署也完成啦，咕咕咕~

> 费了九牛二虎之力终于将项目部署上去了，但很快发现，这样很麻烦，难道每次开发后都要手动传文件啥的吗，有没有一种 运行一条类似 `npm run deploy` 的命令便可实现项目部署的 自动化的部署方法，很高兴地告诉大家，是有的，一起往下看看吧。

- 5）前端项目的部署无非是打包--登录服务器--上传打包文件，后端项目的部署无非是收集需要上传的文件--登录服务器--上传文件--服务器安装依赖--重启服务。那么想法便是用一条指令 `npm run deploy` 完成前后端项目各自部署的全部过程，即执行两次 `npm run deploy` ，一次前端，一次后端，然后就可以访问 ip 或域名进行交互。
- 6-1）前端更加具体的自动化部署工作流程大致如下：①运行脚本命令；②脚本读取配置文件--包含服务器host、port、web目录及本地目录等信息；③打包生成 dist 包--`npm run build`；④scp 连接服务器；⑤将本地打包的 dist 上传至 `/usr/local/nginx/html/` ；⑥获取脚本命令的自定义参数，这里的参数为服务器主机和密码，并赋值给服务器配置文件（第⑥点是为了防止将服务器的主机和密码泄露在项目中）。  
- 6-2）逻辑实现：  
```js
// 在 package.json 文件的 scripts 字段定义脚本命令 "deploy"
"scripts": {
  "deploy": "node ./deploy/index.js"
}

// 在项目根目录下新建文件夹 deploy ，并在 deploy 下新建文件 index.js 。开始编写 index.js ：
// 1.引入 scp2 ，用于连接服务器
const client = require('scp2');
// 2.服务器的配置选项
const server = {
  host: '', // ip 地址
  port: 22, // 端口号
  username: 'root', // 用户名
  password: '', // 密码
  path: '/usr/local/nginx/html/dist'  // 存放项目的路径
}
// 4.用解构赋值获取脚本命令后面的两个参数：主机和密码
const [ , , host, password] = process.argv;
server.host = host;
server.password = password;
// 3.连接服务器并上传 dist 包到服务器的指定目录 path
client.scp('dist/', {
  port: server.port,
  host: server.host,
  username: server.username,
  password: server.password,
  path: server.path
}, function(err) {
  if (err) {
    console.log('文件上传失败', err)
  } else {
    console.log('文件上传成功');
  }
})

// 之后执行【 npm run deploy { 服务器主机 } { 服务器密码 } 】便可实现前端项目的自动化部署了
```

- 7-1）后端更加具体的自动化部署工作流程大致如下：①将需要上传的文件手动复制到一个文件夹里，这个文件夹我命名为 oppService ；②运行脚本命令；③脚本读取配置文件--包含服务器host、port 和 oppService 目录以及 deploy.sh 脚本等信息；④调用 node-ssh API 连接服务器；⑤将 oppService 文件夹上传至服务器指定目录；⑥进入 oppService 以执行 deploy.sh 脚本；⑦获取 npm scripts 命令的自定义参数，这里的参数为服务器主机和密码，并赋值给服务器配置文件（第⑥点是为了防止将服务器的主机和密码泄露在项目中）

- 7-2）逻辑实现：
```js
// 同样在 package.json 文件的 scripts 字段定义脚本命令 "deploy"
"scripts": {
  "deploy": "node ./deploy/index.js"
}


// 在项目根目录下新建文件夹 deploy ，并在 deploy 下新建文件 index.js 。开始编写 index.js ：
// 1.引入 node-ssh 模块 ，准备调用内置 API
const node_ssh = require('node-ssh').NodeSSH;
const ssh = new node_ssh();
// 6.用解构赋值获取脚本命令后面的两个参数：主机和密码，并存入 config 中
const [ , , host, password] = process.argv;
// 2.服务器的配置选项
const config = {
  path: {
    localPath: 'oppService/',
    romotePath: '/usr/local/apache-tomcat-8.5.71/Online-programming-platform_service',
  },
  romote: {
    host: host,
    port: 22,
    username: 'root',
    password: password
  }
}
function uploadFile() {
  // 3.连接服务器
  ssh.connect(config.romote)
  .then(() => {
    // 4.上传 dist 包到服务器的指定目录 path
    ssh.putDirectory(config.path.localPath, config.path.romotePath)
    .then(() => {
      // 5.执行脚本，完成文件上传后服务器的后备工作
      ssh.execCommand('sh deploy.sh', { cwd: config.path.romotePath })
      .then((res) => {
        if (!res.stderr) {
          process.exit(0);
        }
      })
    }).catch(err => {
      console.log(err)
    })
  }).catch(err => {
    console.log('服务器连接失败！！')
  })
}
uploadFile();


// 编写 deploy.sh 脚本
#!/usr/local/node-v12.16.3-linux-x64/bin/node

# 先关闭之前的服务，安装依赖之后再重启
pm2 stop src/app.ts

# 查看文件中是否已经包含 node_modules ，如果有则先删除
file='node_modules'
if [ -e $file ]; then
  rm -rf $file
  npm cache clean --force
fi
# 重新安装依赖
npm install

# 查看8080端口是否被占用，有则 kill
port=8080
pid=$(netstat -nlp | grep :$port | awk '{print $7}' | awk -F"/" '{ print $1 }')
if [ -n "$pid" ]; then
  kill -9 $pid;
fi

# 启动 pm2
pm2 start ./src/app.ts
```

### 4. 面试官模块
- 1）