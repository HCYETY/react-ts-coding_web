import React from 'react';
import { Select, } from 'antd';
import { PROGRAM_LANGUAGE, PROGRAM_THEME } from 'src/common/const';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution';
import 'monaco-editor/esm/vs/editor/contrib/find/findController.js';
import { Client, TextOperation,  } from 'ot';
import ot from 'ot';
import { post } from 'api/index';
import { getCookie, nowTime } from 'src/common/utils';

interface Prop {
  sendCode?: any;        // 发送 websocket 请求的函数
  getProgramCode?: any;  // 获取代码
  codeObj?: any;
  language?: string;
}

interface State {

}

let monacoInstance: monaco.editor.IStandaloneCodeEditor = null;

export default class CodeEditor extends React.Component<Prop, State> {
  state = {
    language: 'javascript',
    theme: 'vs',
  }

  // 组件挂载后加载编辑器
  componentDidMount() {
    monacoInstance  = monaco.editor.create(document.getElementById("container"), {
      value: `头部
      作答时间
      阅卷
      删除面试间
      
      视频
      编辑冲突`,
      contextmenu: true,
      language:"javascript",
      theme: 'vs',
      minimap: {
        enabled: false
      }
    });

    // 获取编辑器的内容
    monacoInstance.onDidChangeModelContent((e) => {
      let newValue = monacoInstance.getValue();
      console.log(newValue)
      const { getProgramCode, sendCode, codeObj } = this.props;
      const cookie = getCookie();
      getProgramCode && getProgramCode(newValue);
      if (sendCode) {
        const { changes } = e;
        let docLength = monacoInstance.getModel().getValueLength(); // 文档长度
        let operationDoc = new TextOperation().retain(docLength); // 初始化一个operation，并保留文档原始内容
        for (let i = changes.length - 1; i >= 0; i--) {
          const change = changes[i];
          const restLength = docLength - change.rangeOffset - change.text.length; // 文档
          operationDoc = new TextOperation()
            .retain(change.rangeOffset) // 保留光标位置前的所有字符
            .delete(change.rangeLength) // 删除N个字符（如为0这个操作无效）
            .insert(change.text) // 插入字符
            .retain(restLength) // 保留剩余字符
            .compose(operationDoc); // 与初始operation组合为一个操作
        }

        const operation = operationDoc.toString();
        const time = nowTime();
        const operationObj = { operation, cookie, time };
//怎么发送？
//怎么接收？
//怎么更新？
        // sendCode(operationObj);
      }
    })
    
  }
  
  // componentDidUpdate() {
  //   monacoInstance.onDidChangeModelContent((e) => {
  //     const { codeObj } = this.props;
  //     console.log('要修改其他用户的代码了')
  //     console.log(codeObj)
  //     console.log(codeObj.code)
  //     monacoInstance.setValue('nihao')
  //     // monacoInstance.setValue(codeObj.code);
  //     // monacoInstance.setValue(this.props.codeObj.code);
  //   })
  // }
  
  // 动态修改语言
  changeLanguage = (value: any) => {
    monacoInstance.onDidChangeModelLanguage(e => {
      monaco.editor.setModelLanguage(monacoInstance.getModel(), value);
    })
    this.setState({ language: value });
  }
  // 动态修改主题
  changeTheme = (value: any) => {
    monaco.editor.defineTheme('myTheme', {
      base: value,// 要继承的基础主题，即内置的三个：vs、vs-dark、hc-black
      inherit: false,// 是否继承
      rules: [// 高亮规则，即给代码里不同token类型的代码设置不同的显示样式
        { token: '', foreground: '000000', background: 'fffffe' }
      ],
      colors: {// 非代码部分的其他部分的颜色，比如背景、滚动条等
        // [editorBackground]: '#FFFFFE'
      }
    });
    monaco.editor.setTheme('myTheme');
    this.setState({ theme: value });
  }
  
  // 组件卸载后销毁编辑器
  componentWillUnmount() {
    monacoInstance.dispose();
  }

  render() {
    const { language, theme } = this.state;

    return(
      <>
        <div className="right-top">
          <Select 
            defaultValue={ theme } 
            style={{ width: 120, margin: 10 }} 
            onChange={ this.changeTheme }
          >
            {
              PROGRAM_THEME.map(item => {
                return(
                  <Select.Option value={ item } key={ item }> { item } </Select.Option>
                )
              })
            }
          </Select>
          
          <Select 
            defaultValue={ language } 
            style={{ width: 120, margin: 10 }} 
            onChange={ this.changeLanguage }
          >
            {
              PROGRAM_LANGUAGE.map(item => {
                return(
                  <Select.Option value={ item } key={ item }> { item } </Select.Option>
                )
              })
            }
          </Select>
        </div>

        <div id="container" style={{ height: '560px' }}></div>
      </>
    )
  }
}