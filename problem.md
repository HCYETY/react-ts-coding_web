1. 如何搭建 react+ts 的项目架子？
> [使用create-react-app创建ts项目](https://www.cnblogs.com/feiyu159/p/14154963.html)
3. 按需引入antd，使组件生效？
> 一开始按照这篇文章去弄：[按需加载](https://blog.csdn.net/weixin_46398902/article/details/104505491)
> > 然而在“自定义”这一块却再次卡住，样式还是不能生效，于是谷歌 [解决方法](https://github.com/ant-design/ant-design-landing/issues/235)  
> > [官网的自定义主题 解决方法也或许有用](https://ant.design/docs/react/use-with-create-react-app-cn)
5. 启动并连接mysql数据库，同时打开MySQL workbench可视化工具方便查看数据？
> 在 [mysql官网上](https://dev.mysql.com/downloads/installer/) 安装好mysql后，用命令行启动mysql服务。这时报错：服务名无效，于是在网上找到了：[cmd命令行启动MySQL提示服务名无效/服务无法启动](https://blog.csdn.net/weixin_43720619/article/details/89036335)。没想到一波未平一波又起，mysql还是启动不了，就连【WIN+R，输入services.msc】手动启动都出现警告框：启动后停止，无奈又去找：[Mysql启动后停止的解决方法](https://www.cnblogs.com/pandaly/p/11738789.html)+[MySQL 服务无法启动](https://blog.csdn.net/qq_32682301/article/details/118339414)。这下总算启动mysql服务了。
> > 附：服务一直显示“正在启动”，则 [解决方法传送门](https://www.yisu.com/zixun/28154.html)。如果出现“错误: 无法终止 PID 为 7432 的进程。”则是你的权限问题，可以用管理员权限打开cmd，然后输入命令。   
> 接下来就是连接数据库了
8. ts报错：string 元素隐式具有 “any“ 类型，类型为 “string“ 的表达式不能用于索引类型 “{}“？
> 解决方法：在tsconfig.json文件添加配置：
`"suppressImplicitAnyIndexErrors": true`
10. 基于session 的身份验证？
> 流程：
> - 1.用户向服务器发送用户名和密码
> - 2.服务器验证通过后，创建 session，该 session 是一个键值对，我存入【登录状态，登录时间】
> - 3.同时还要设置cookie（这时会将session的相关信息自动存入cookie中；同时通过前后端分别配置，浏览器会自动将该cookie添加到请求头中，以后每次发送请求到服务器后便会自动发送这个cookie）
> - 4.前端的登录验证，只需要获取session中的登录状态（由后端返回，前端是查找不到的），若通过则跳转至首页；后端的登录验证需要获取请求头中的cookie（之前服务端自定义的）
> - 5.最后，前后端要设置登录拦截，防止用户在未登录的前提下访问到其他路径，这是不被允许的

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

> [React中setState如何同步更新](https://www.cnblogs.com/younghxp/p/14803548.html)

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


待改进：
1. 面试题模块导航栏展开不同步？
4. 编辑代码固定头部？
5. 代码编程功能：中间高度不写死？
6. 倒计时与 antd 倒计时组件有秒数上的误差？

7. 面试官阅卷功能：设计？111  redux、代码展示
8. “题目列表”功能完善？
9. 头部导航栏添加面包屑？1111  绑定路由
10. 富文本编辑器更换？
 
11. 代码编辑器删除小地图？111
12. 自定义答题时长传参失败?
13. webpack 打包无效？111
14. 候选人提交答案时之前的试题答案会被删除？
15. diff算法、双向数据绑定？ 222