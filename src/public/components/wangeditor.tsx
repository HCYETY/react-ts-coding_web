import React, { Component } from 'react';
import E from 'wangeditor';
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
			console.log(editor.txt.html())
		}
		editor.create()
		editor.txt.html('<h1>你好呀，我是syandeg</h1>')
	};
	
	getHtml = () => {
		console.log('你真聪明');
		return editor.txt.html();
	}
	
	getText = () => {
		console.log('我知道，这还用你说');
		return editor.txt.text();
	}
	
	setHtml = () => {
		editor.txt.html('你好呀！syandeg ，今天也要加油呀！')
	}
	
	// 使用 onchange 函数监听内容的变化，并实时更新到 state 中
	onchange = (newHtml: any) => {
		console.log(newHtml);
	}

	render() {
		return (
			<div id="div1" ></div>
		);
	}
}