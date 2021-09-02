1. 如何搭建 react+ts 的项目架子？
> [解决方法](https://www.cnblogs.com/feiyu159/p/14154963.html)
2. 图片导入，ts不比js，那应该如何操作？
3. 按需引入antd，使组件生效？
4. 运行`npm start`时报“内存溢出”？
    ```
    执行 npm 命令时报错：
    FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
    ```
    原因是 JavaScript堆内存不足。Node 是基于V8引擎，在 Node 中通过 JavaScript 使用内存时只能使用部分内存（64位系统下约为1.4 GB，32位系统下约为0.7 GB）