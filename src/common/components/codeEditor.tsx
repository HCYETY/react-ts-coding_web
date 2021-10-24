import React from 'react';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js';
import 'monaco-editor/esm/vs/basic-languages/javascript/javascript.contribution';

const monacoInstance=monaco.editor.create(document.getElementById("monaco"),{
  value:`console.log("hello,world")`,
  language:"javascript"
})
monacoInstance.dispose();//使用完成销毁实例

export default class CodeEditor extends React.Component {



  render() {

    return(
      <div id="monaco">
      </div>
    )
  }
}


// import React from 'react';
// import MonacoEditor  from 'react-monaco-editor';

// import logo from 'img/bg.jpg';

// // const defaultCode = 
// // `export default {
// //   name: 'name',
// //   code: 'code'
// // }`;

// export default class CodeEditor extends React.Component<any, any> {
//   constructor(props: any) {
//     super(props);
//     this.state = {
//       code: 'ni',
//     }
//     this.onChangeHandle = this.onChangeHandle.bind(this);
//   }
//   onChangeHandle(value: any, e: any) {
//       this.setState({
//         code: value
//       });
//   }
//   editorDidMountHandle(editor: any, monaco: any) {
//     console.log('editorDidMount', editor);
//     editor.focus();
//   }
//   render() {
//     const code = this.state.code;
//     const options = {
//       selectOnLineNumbers: true,
//       renderSideBySide: false
//     };
//     return (
//       <div >
//         <div className="App">
//           <header className="App-header">
//             <img src={logo} className="App-logo" alt="logo" />
//             <h1 className="App-title">Welcome to React</h1>
//           </header>
//         </div>
//         <div className="wrapper">
//           <div className="editor-container" >
//           <MonacoEditor
//             language="javascript"
//             value={code}
//             options={options}
//             onChange={this.onChangeHandle}
//             editorDidMount={this.editorDidMountHandle}
//           />
//           </div>
//           <div className="view"  contentEditable={true}>
//           {this.state.code}
//           </div>
//         </div>
//       </div>
//     );
//   }
// }