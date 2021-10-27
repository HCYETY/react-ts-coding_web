import React from 'react';
import { NavLink } from "react-router-dom";
import { Layout, Avatar, Menu } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  UploadOutlined,
  UserOutlined
} from '@ant-design/icons';

import 'style/basic.less';
import { EDIT, INTERVIEWER } from '../const';

export default class Basic extends React.Component {

  state = {
    collapsed: false,
  };

  onCollapse = (collapsed: any) => {
    this.setState({ collapsed });
  };

  render() {
    const { collapsed } = this.state;

    // 动态获取 url 的路径，使选中的菜单及时更新
    // 由于每次渲染后数值更新，所以每次 push 都只有一个值
    const pathname = window.location.pathname;
    let selectedKeysArr = [];
    selectedKeysArr.push(pathname);

    return(
      <div>
        <Layout.Header className="top">
          <Avatar className="avatar" size="large" icon={ <UserOutlined /> } />
        </Layout.Header>

        <Layout.Sider 
          collapsible                     // 菜单栏是否可收起
          collapsed={ collapsed }         // 菜单栏当前收起状态
          onCollapse={ this.onCollapse }  // 菜单栏展开-收起时的回调函数
          className="left"
        >
          <div className="logo" />
          <Menu 
            theme="dark" 
            // api 的参数限制：只能是数组
            selectedKeys={selectedKeysArr}
          >
            <Menu.Item key="edit" icon={ <DesktopOutlined /> }>
              <NavLink to={ EDIT }>面试题管理</NavLink>
            </Menu.Item>
            <Menu.Item key="interviewer" icon={ <PieChartOutlined />} >
              <NavLink to={ INTERVIEWER }>面试题展示</NavLink>
            </Menu.Item>
          </Menu>
        </Layout.Sider>

        <div className="bottom">
          @syandeg 呕心沥血之作
        </div>

      </div>
    )
  }
}