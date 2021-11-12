1. 如何搭建 react+ts 的项目架子？
> [使用create-react-app创建ts项目](https://www.cnblogs.com/feiyu159/p/14154963.html)
2. 图片导入，ts不比js，那应该如何操作？
3. 按需引入antd，使组件生效？
> 一开始按照这篇文章去弄：[按需加载](https://blog.csdn.net/weixin_46398902/article/details/104505491)
> > 然而在“自定义”这一块却再次卡住，样式还是不能生效，于是谷歌 [解决方法](https://github.com/ant-design/ant-design-landing/issues/235)  
> > [官网的自定义主题 解决方法也或许有用](https://ant.design/docs/react/use-with-create-react-app-cn)
4. 运行`npm start`时报“内存溢出”？（暂无解决方法）
    ```
    执行 npm 命令时报错：
    FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
    ```
> 原因是 JavaScript堆内存不足。Node 是基于V8引擎，在 Node 中通过 JavaScript 使用内存时只能使用部分内存（64位系统下约为1.4 GB，32位系统下约为0.7 GB）
> > 解决方法：手动删除 `node_modules`文件，然后在项目根目录下 `(c)npm install` ，最后就可以 `(c)npm start` 了。
5. 启动并连接mysql数据库，同时打开MySQL workbench可视化工具方便查看数据？
> 在 [mysql官网上](https://dev.mysql.com/downloads/installer/) 安装好mysql后，用命令行启动mysql服务。这时报错：服务名无效，于是在网上找到了：[cmd命令行启动MySQL提示服务名无效/服务无法启动](https://blog.csdn.net/weixin_43720619/article/details/89036335)。没想到一波未平一波又起，mysql还是启动不了，就连【WIN+R，输入services.msc】手动启动都出现警告框：启动后停止，无奈又去找：[Mysql启动后停止的解决方法](https://www.cnblogs.com/pandaly/p/11738789.html)+[MySQL 服务无法启动](https://blog.csdn.net/qq_32682301/article/details/118339414)。这下总算启动mysql服务了。
> > 附：服务一直显示“正在启动”，则 [解决方法传送门](https://www.yisu.com/zixun/28154.html)。如果出现“错误: 无法终止 PID 为 7432 的进程。”则是你的权限问题，可以用管理员权限打开cmd，然后输入命令。   
> 接下来就是连接数据库了
6. 后端服务的着手实现？
> 本项目的后端所采用的的技术栈是 koa+mysql ，这篇文章：[Koa中间件使用之koa-router](https://www.jianshu.com/p/f169c342b4d5)
7. React中实现翻转卡片效果之登录注册，却报错：Cannot read properties of null (reading 'style')？
![](img/2.png)![](img/3.png)
> 本人最后使用antd的Card组件----页签卡片
8. ts报错：string 元素隐式具有 “any“ 类型，类型为 “string“ 的表达式不能用于索引类型 “{}“？
> 解决方法：在tsconfig.json文件添加配置：
`"suppressImplicitAnyIndexErrors": true`
9. 前端axios发送请求后，接收不到后端响应的数据，报错 Error: Request failed with status code 404？
![](img/4.jpg)
> 解决方法：我这里是因为对mysql数据库的处理有误：注册的时候没有new一个用户对象，而是直接将前端传过来的用户信息直接存储。因此，使用正确的typeorm语句，即可解决报错
10. 基于session 的身份验证？
> 流程：
> - 1.用户向服务器发送用户名和密码
> - 2.服务器验证通过后，创建 session，该 session 是一个键值对，我存入【登录状态，登录时间】
> - 3.同时还要设置cookie（这时会将session的相关信息自动存入cookie中；同时通过前后端分别配置，浏览器会自动将该cookie添加到请求头中，以后每次发送请求到服务器后便会自动发送这个cookie）
> - 4.前端的登录验证，只需要获取session中的登录状态（由后端返回，前端是查找不到的），若通过则跳转至首页；后端的登录验证需要获取请求头中的cookie（之前服务端自定义的）
> - 5.最后，前后端要设置登录拦截，防止用户在未登录的前提下访问到其他路径，这是不被允许的
11. react如何进行登录拦截？  
由于react并不像Vue一样有路由拦截的api，故需要我们自己实现登录拦截的功能  

有两种方案：
- 在每个组件中，根据 props 上的 history 对象来进行跳转   
- 进行全局的路由守卫处理  

这里采用方法二：
- 需要考虑的点：
  - 未登录状态下，若访问非登录页，则跳转至登录页
  - 登录状态下，随意访问

14. 路由跳转后找不到文件路径，报错404?
当我将本地打包后的前端项目（dist文件夹）上传到服务器的 /usr/local/nginx/html/ 目录下后，在 nginx 正常启动、服务器防火墙以及安全组开放对应端口的前提下，我兴高采烈地打开我的 ip 地址，如我预料的成功打开了前端项目的页面。于是我开始登录注册，但老天爷似乎总喜欢跟人开玩笑，我登录跳转后居然报错：404 Not Found。根据我的另一篇文章 [解决报错的思路]()，这时我应该查看 url 的情况，看它是否符合预期
> [react部署完以后，刷新页面会报错找不到视图](https://www.jianshu.com/p/ffb7e3445414)

15. 引用nodejs模块报错：node_ssh is not a constructor？
```js
const ssh = new node_ssh();
TypeError: node_ssh is not a constructor
```
原因：根据网上的说法，是由于 node 官方尚未解决的一个 bug 导致的。  
解决方法：
```js
const node_ssh = require('node-ssh').NodeSSH;
const ssh = new node_ssh();
```
16. 

17. 

18. 不能加载静态资源？
![](img/6.png)

19. antd4 点击 Table 时获取当前行的数据？
```js
// 在 Table 下添加属性 onRow
onRow = {(record) => {
  return {
    onClick: () => {
      console.log(record);//这里是点击行的数据，可以把需要的数据存入state，然后在操作栏调用
    }
  }
}
```

21. 同步获取 promise.then() 中的值？
解决方法：Promise封装结合async/await
```js
// 方法一：
async componentDidMount() {
  const res = await showPaper();
  this.setState({ xxx: res.xxx });
}

// 方法二：
showPaper().then((res) => { xxx: res.xxx });
```
> [React中setState如何同步更新](https://www.cnblogs.com/younghxp/p/14803548.html)

22. 动态获取后端接口响应回来的对象后，设置默认值报错：Uncaught Error: Objects are not valid as a React child (found: object with keys {}). If you meant to render a collection of children, use an array instead.
23. 获取后端返回值后，使用antd4的表单组件并将返回值作为初始值赋给表单？
解决思路：首先查看官方文档，得知可以通过给 <Form> 设置 initialValues ，参数为键值对。但这时候会发现表单值没显示出来，其实是因为 Form 约定 initialValues 只初始化一次。由于本项目使用的是类组件，所以这里通过添加 loading 判断，获取数据成功后设置 false ，再渲染表单
```js
export default class Modify extends React.Component{
  this.state = { loading: true };

  // 调用后端接口，然后将 loading 设置为 false
  showPaper().then(res => {
    this.setState({ loading: false });
  })

  render() {
    const { loading } = this.state
    return(
      {!loading && (
        <Form initialValues={detail}>
          <Form.Item name="age" label="age">
            <Input />
          </Form.Item>
        </Form>
      )}
    )
  }
}
```

24. 封装下拉菜单？

25. 两个字符串（yyyy-mm-dd 形式）如何作减法？
解法一：typescript 项目可以导入[ date-fns 包](https://blog.csdn.net/fsxxzq521/article/details/85715213)，这个包封装了对日期的一系列操作，其中可以使用 `differenceInDays(): 获得两个时间相差几天` ，然后再做剑法即可。
解法二：为了求个日期之间的天数而引入一个包，这样其实不太好，能不依赖包就尽量不依赖比较好，所以我就自己封装了一个方法去求出我想要的数值
```js

```

26. 在一个组件中调用另一个组件中的方法（组件间的通信）？
由于是 react 项目，加上我的组件是非嵌套组件（不是兄弟组件等等，两个组件间没有毛线关系那种），所以采用发布消息与订阅机制。首先 `npm install pubsub-js` ，安装下插件，然后查看它的使用方法，分别在组件中发布与订阅消息，就可以实现两个非嵌套组件的值传递了。

27. Table 组件中表格的内容展示与内容数据不符，用 state 监听后数据渲染依然不同步？
解决思路：在使用表格内容的地方打印数据，看数据在业务逻辑的实现下是否正确；若正确，则说明是使用方法不对。我这里的问题是对数组的处理姿势不对。在 Table 组件的 dataSource 属性中解构数据，如果是对象，则解构后加个“[]”。
this.setState 的数据更新若不同步，可通过 setTimeout(() => {}) 解决
28. 使用 typeorm 保存一对多/多对一关系，并联表增删查改？
增：
```js

```
删：先删除从表，再删除主表
```js
import { getRepository } from "typeorm";

const paperRepository = getRepository(TestPaper);
const testReporitory = getRepository(Test);

// 先删除带外键的副表的数据
const deleteTest = await getRepository(Test)
.createQueryBuilder('xxx')
.leftJoinAndSelect('xxx.paper', 'paper.tests')
.where('xxx.paper = :paperKey', { paperKey: paperKey })
.getMany();
await testReporitory.remove(deleteTest);

// 然后再删除主表的数据
await paperRepository.delete({ paper: ctx.request.paper });
```
29.  Drawer 组件中 Form 组件的数据重置和回显？
30.  React 使用 Table 组件渲染富文本内容，并在同一个页面使用多个实例（支持多个富文本）？
在要渲染富文本的标签中添加属性，如下：
```js
<div dangerouslySetInnerHTML = {{ __html: xxx}} />
```
31. 组件间的通信？
32. 定时器触发试卷提交？








待改进：
2. 面试题模块导航栏高亮更新？
4. 头部导航栏的设置？
5. 富文本编辑器完善？
6. 答题时长手动设置？111
7. 修改信息时日期初始化？111
8. 日期选择器更改为中文？111
9. 编辑代码固定头部？
10. 代码编辑器删除小地图？
11. 代码中间高度不写死？
12. “题目列表”补充？111