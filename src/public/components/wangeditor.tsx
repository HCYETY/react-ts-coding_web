import React, { Component } from 'react';
import E from 'wangeditor';
import PubSub from 'pubsub-js';
// import { inject, observer } from 'mobx-react'
// import { withRouter } from 'react-router-dom'

// @withRouter @inject('appStore') @observer

interface Props{

}
interface state{
	editorContent:string
}

let editor: E = null;

export default class Wangeditor extends Component<Props,state> {
	constructor(props:Props) {
		super(props);
		this.state = {
			editorContent:''
		};
	}

	componentDidMount() {
		editor = new E('#div1');
		editor.config.placeholder = '请输入面试题的相关信息'
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
		editor.config.uploadImgShowBase64 = true;
		editor.config.uploadImgMaxLength = 5;
		editor.config.uploadImgParams = {
			fileBytes: '',
			// maxBytes: 204800,
			// thumbHeight: 120,
			// thumbWidth: 120
		}
		editor.config.onchange = () => {
			PubSub.publish('testInform', { test: editor.txt.html() })
		}
		editor.create()
		editor.txt.html('<h1>你好呀，我是syandeg</h1>')
	};
	
	render() {
		return (
			<div id="div1"></div>
		);
	}
}