import React from 'react';
import { Layout, Avatar, } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import 'style/basic.less';
const { Header } = Layout;      

export default class Head extends React.PureComponent{
  render() {
    return(
      <>
        <div className="all-header-div"></div>
        <div className="all-header">
          <Avatar className="all-header-avatar" size="large" icon={<UserOutlined />} />
        </div>
      </>
    )
  }
}