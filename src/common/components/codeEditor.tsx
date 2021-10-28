import React from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution';
import 'monaco-editor/esm/vs/editor/contrib/find/findController.js';

let monacoInstance: monaco.editor.IStandaloneCodeEditor = null;

export default class CodeEditor extends React.Component<any, any> {
  // 组件挂载后加载编辑器
  componentDidMount() {
    monacoInstance  = monaco.editor.create(document.getElementById("container"), {
      value: `console.log("hello,world")`,
      contextmenu: true,
      language:"typescript",
      theme: 'vs',
    });

    // 获取编辑器的内容
    monacoInstance.onDidChangeModelContent((event) => {
      const newValue = monacoInstance.getValue();
      this.props.getProgramCode(newValue);
    })
    
    // 动态修改语言
    monacoInstance.onDidChangeModelLanguage((event) => {
      monaco.editor.setModelLanguage(monacoInstance.getModel(), this.props.language);
    })
  }

  // 组件卸载后销毁编辑器
  componentWillUnmount() {
    monacoInstance.dispose();
  }

  render() {
    return(
      <div id="container" style={{ height: '100vh' }}></div>
    )
  }
}