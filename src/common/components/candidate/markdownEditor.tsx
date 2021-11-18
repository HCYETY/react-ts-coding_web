// import React from 'react';
// import Editor, { Plugins } from "react-markdown-editor-lite";
// import MarkdownIt from 'markdown-it';
// // import ReactMarkdown from "react-markdown";
// import "react-markdown-editor-lite/lib/index.css";

// import 'style/candidate/markdownEditor.css';
// // 1. 引入markdown-it库
// import markdownIt from 'markdown-it'

// const plugins = ['block-code-inline', 'block-code-block', 'link', 'list-unordered', 'list-ordered', 'full-screen'];
// // 2. 生成实例对象
// const mdParser = new MarkdownIt();

// export default class ProgramInform extends React.Component {

//   state = {
//     code: '',
//   }

//   parse = (e: any) => {
//     console.log(e)
//     const content = e.target.vlaue;
//     console.log(content)
//     mdParser.render(content);
//     this.setState({ code: content });
//   }

//   render() {
//     const { code } = this.state;

//     return (
//       <div className="markdownEditConainer">
//         <textarea 
//           className="edit" 
//           onChange={this.parse} // 编辑区内容每次修改就更新变量htmlString的值
//         />
//         <div 
//           className="show" 
//           dangerouslySetInnerHTML={{ __html: code }} // 将html字符串解析成真正的html标签
//         />
//       </div>
//     )
//   }
// }






import React from 'react';
import Editor, { Plugins } from "react-markdown-editor-lite";
import MarkdownIt from 'markdown-it';
import "react-markdown-editor-lite/lib/index.css";
import 'style/candidate/markdownEditor.css';

const ReactMarkdown = require('react-markdown')
const input = '# This is a header\n\nAnd this is a paragraph'

const plugins = ['block-code-inline', 'block-code-block', 'link', 'list-unordered', 'list-ordered', 'full-screen'];
const mdParser = new MarkdownIt();
// Editor.unuse(Plugins.Header);
Editor.use(Plugins.AutoResize, {
  min: 20, // 最小高度
  max: 50, // 最大高度
});

export default class MarkdownEditor extends React.Component {

  // handleEditorChange = ({ html, text }) => {
  //   console.log('handleEditorChange', html, text);
  // }

  render() {

    return(
      // <div className="editor">
      //   <textarea className="editor-textarea" name="" id="" cols={30} rows={10}></textarea>
      //   <div className="editor-bottom"></div>
      // </div>

      <ReactMarkdown source={input} >

      </ReactMarkdown>
      
      // <Editor 
      //   shortcuts={ true }
      //   plugins={ plugins }
      //   placeholder="请输入评论内容"
      //   style={{ height: '500px' }} 
      //   renderHTML={text => mdParser.render(text)}  
      // />
    )
  }
}