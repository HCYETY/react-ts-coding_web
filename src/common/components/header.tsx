import React from 'react';
import { Layout, Avatar, } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import 'style/basic.less';
const { Header } = Layout;      

export default class Head extends React.PureComponent{
  render() {
    return(
      <Header className="all-header-top">
        <Avatar className="all-header-top-avatar" size="large" icon={<UserOutlined />} />
      </Header>
    )
  }
}