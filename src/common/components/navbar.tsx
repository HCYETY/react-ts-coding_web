import React from 'react';
import { NavLink } from "react-router-dom";
import { Layout, Menu } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import 'style/basic.less';

const { Sider } = Layout;
const { SubMenu } = Menu;

export default class Navbar extends React.PureComponent {

  handleClick = (e: any) => {
    console.log('click ', e);
  };

  render() {

    // 动态获取 url 的路径，使选中的菜单及时更新
    // 由于每次渲染后数值更新，所以每次 push 都只有一个值
    const pathname = window.location.pathname;
    let selectedKeysArr = [];
    selectedKeysArr.push(pathname);

    return(
      <Menu
      onClick={this.handleClick}
      defaultSelectedKeys={['interviewer']}
      // defaultOpenKeys={['sub1']}
      // mode="inline"
      theme="dark"
      className="all-left-menu"
      >
        <div className="all-left-logo" />

        <Menu.Item key="edit" icon={<DesktopOutlined />}>
          <NavLink to="/edit">面试题管理</NavLink>
        </Menu.Item>

        <Menu.Item key="interviewer" icon={<PieChartOutlined />}>
          <NavLink to="/interviewer">面试题展示</NavLink>
        </Menu.Item>

          {/* <SubMenu key="sub1" icon={<MailOutlined />} title="Navigation One">
            <Menu.ItemGroup key="g1" title="Item 1">
              <Menu.Item key="1">Option 1</Menu.Item>
              <Menu.Item key="2">Option 2</Menu.Item>
            </Menu.ItemGroup>
            <Menu.ItemGroup key="g2" title="Item 2">
              <Menu.Item key="3">Option 3</Menu.Item>
              <Menu.Item key="4">Option 4</Menu.Item>
            </Menu.ItemGroup>
          </SubMenu>
          <SubMenu key="sub2" icon={<AppstoreOutlined />} title="Navigation Two">
            <Menu.Item key="5">Option 5</Menu.Item>
            <Menu.Item key="6">Option 6</Menu.Item>
            <SubMenu key="sub3" title="Submenu">
              <Menu.Item key="7">Option 7</Menu.Item>
              <Menu.Item key="8">Option 8</Menu.Item>
            </SubMenu>
          </SubMenu>
          <SubMenu key="sub4" icon={<SettingOutlined />} title="Navigation Three">
            <Menu.Item key="9">Option 9</Menu.Item>
            <Menu.Item key="10">Option 10</Menu.Item>
            <Menu.Item key="11">Option 11</Menu.Item>
            <Menu.Item key="12">Option 12</Menu.Item>
          </SubMenu> */}
      </Menu>
    )
  }
}