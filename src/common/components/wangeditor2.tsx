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

export default class Wangeditors extends Component<Props,state> {
	constructor(props:Props) {
		super(props);
		this.state = {
			editorContent:''
		};
	}

	componentDidMount() {
		editor = new E('#div2');
		editor.config.placeholder = '请输入面试题的相关信息'
		editor.config.menus = [
			'head',  					// 标题
			'bold',  					// 粗体
			'fontSize',  			// 字号
			'fontName',  			// 字体
			'italic', 				// 斜体
			'underline',  		// 下划线
			'strikeThrough',  // 删除线
			'list',  					// 序列
			'justify',			  // 对齐方式
			'image',  				// 插入图片
			'table',  				// 表格
			'video',  				// 插入视频
			'link',  					// 插入链接
			'quote',  				// 引用
			'code',  					// 插入代码
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
			PubSub.publish('testAnswer', { test: editor.txt.html() })
		}
		editor.create()
	};

	componentWillUnmount() {
		// 销毁编辑器
		editor.destroy()
		editor = null
	}
	
	render() {
		return (
			<div id="div2"></div>
		);
	}
}