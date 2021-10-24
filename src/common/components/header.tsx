import React from 'react';
import { Layout, Avatar, } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import 'style/components.css';
const { Header } = Layout;      

export default class Head extends React.PureComponent{
  render() {
    return(
      <Header className="site-layout-header">
        <Avatar className="avatar" size="large" icon={<UserOutlined />} />
      </Header>
    )
  }
}