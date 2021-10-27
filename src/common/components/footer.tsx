import React from 'react';
import { Layout } from 'antd';
const { Footer } = Layout;    
import 'style/basic.less';

export default class Foot extends React.PureComponent{
  render() {
    return(
      <Footer className="all-bottom-font">
        &copy;syandeg 的精心力作
      </Footer>
    )
  }
}