import React, { Component } from 'react';
import E from 'wangeditor'
// import { inject, observer } from 'mobx-react'
// import { withRouter } from 'react-router-dom'

// @withRouter @inject('appStore') @observer

interface Props{

}
interface state{
    editorContent:string
}
export default class Wangeditor extends Component<Props,state> {
    constructor(props:Props) {
        super(props);
        this.state = {
            editorContent:''
         };
    }

    componentDidMount() {
      const editor = new E('#div1');
      editor.config.placeholder = '请输入面试题的相关信息'
        // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
        // editor.config.onchange = (html:any) => {
        //     console.log(editor.txt.html())
        //     this.setState({
        //         // editorContent: editor.txt.text()
        //         editorContent: editor.txt.html()
        //     })
        // }
        editor.config.menus = [
            'head',  // 标题
            'bold',  // 粗体
            'fontSize',  // 字号
            'fontName',  // 字体
            'italic',  // 斜体
            'underline',  // 下划线
            'strikeThrough',  // 删除线
            'foreColor',  // 文字颜色
            'backColor',  // 背景颜色
            'link',  // 插入链接
            'list',  // 列表
            'justify',  // 对齐方式
            'quote',  // 引用
            'emoticon',  // 表情
            'image',  // 插入图片
            'table',  // 表格
            'video',  // 插入视频
            'code',  // 插入代码
            'undo',  // 撤销
            'redo'  // 重复
        ]
        editor.config.uploadImgShowBase64 = true
        editor.create()
    };

    render() {
        return (
          <div id="div1"></div>
        );
    }
}