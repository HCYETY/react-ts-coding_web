import React from 'react';
import { Select, } from 'antd';
import { PROGRAM_LANGUAGE, PROGRAM_THEME } from 'src/common/const';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution';
import 'monaco-editor/esm/vs/editor/contrib/find/findController.js';

interface Prop {
  sendCode?: any;        // 发送 websocket 请求的函数
  getProgramCode?: any;  // 获取代码
  code: any;
}

interface State {

}

let monacoInstance: monaco.editor.IStandaloneCodeEditor = null;

export default class CodeEditor extends React.Component<Prop, State> {
  state = {
    language: 'javascript',
    theme: PROGRAM_THEME.VS,
  }

  // 组件挂载后加载编辑器
  componentDidMount() {
    monacoInstance  = monaco.editor.create(document.getElementById("container"), {
      value: `console.log("hello,world")`,
      contextmenu: true,
      language:"javascript",
      theme: PROGRAM_THEME.VS,
    });

    // 获取编辑器的内容
    monacoInstance.onDidChangeModelContent((e) => {
      const newValue = monacoInstance.getValue();
      const { getProgramCode, sendCode } = this.props;
      getProgramCode && getProgramCode(newValue);
      sendCode && sendCode(newValue);
    })
    
  }
  
  // 组件卸载后销毁编辑器
  componentWillUnmount() {
    monacoInstance.dispose();
  }
  
  // 动态修改语言
  changeLanguage = (value: any) => {
    this.setState({ language: value });
    monaco.editor.setModelLanguage(monacoInstance.getModel(), this.state.language);
  }
  // 动态修改主题
  // changeTheme = (value: any) => {
  //   this.setState({ theme: value });
  //   monaco.editor.defineTheme('myTheme', {
  //     base: 'vs',// 要继承的基础主题，即内置的三个：vs、vs-dark、hc-black
  //   inherit: false,// 是否继承
  //   rules: [// 高亮规则，即给代码里不同token类型的代码设置不同的显示样式
  //       { token: '', foreground: '000000', background: 'fffffe' }
  //   ],
  //   colors: {// 非代码部分的其他部分的颜色，比如背景、滚动条等
  //       [editorBackground]: '#FFFFFE'
  //   }
  //   });
  //   monaco.editor.setTheme('myTheme');
  //   console.log('修改主题')
  // }

  render() {
    const { language, theme } = this.state;
    console.log('+++++++++++++++++++++++++++', this.props.code)

    return(
      <>
        <div className="right-top">
          <Select 
            defaultValue={ language } 
            style={{ width: 120 }} 
            onChange={ this.changeLanguage }
            className="right-top-button"
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