import React from "react";
import Editor, { Plugins } from "react-markdown-editor-lite";
import MarkdownIt from 'markdown-it';
// import ReactMarkdown from "react-markdown";
import "react-markdown-editor-lite/lib/index.css";

// const mdParser = new ReactMarkdown();
// 初始化Markdown解析器
const mdParser = new MarkdownIt(/* Markdown-it options */);
const plugins = ['block-code-inline', 'block-code-block', 'link', 'list-unordered', 'list-ordered', 'full-screen'];

// 卸载掉所有编辑器的Header插件
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
      // <Editor
      //   ref={mdEditor}
      //   value={value}
      //   style={{
      //     height: "500px"
      //   }}
      //   onChange={ this.handleEditorChange }
      //   renderHTML={text => <ReactMarkdown source={text} />}
      // />

      // <Editor style={{ height: '500px' }} renderHTML={text => mdParser.render(text)} onChange={ this.handleEditorChange } />

      <Editor 
        shortcuts={ true }
        plugins={ plugins }
        placeholder="请输入评论内容"
        style={{ height: '100px' }} 
        renderHTML={text => mdParser.render(text)}  
      />
    )
  }
}