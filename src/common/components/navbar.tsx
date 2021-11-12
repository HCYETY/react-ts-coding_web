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
import { EDIT, INTERVIEWER, LOOK_OVER } from '../const';

export default class Navbar extends React.PureComponent {

  state = {
    selectedKeysArr: [] = [EDIT],
  }

  handleClick = (value: any) => {
    this.setState({ selectedKeysArr: value.keyPath })
  };
  // //这个方法是实现菜单高亮的核心方法
  // setActiveMenu = (location: { pathname: any; }) => {
  //   //拿到当前浏览器的hash路径
  //  const pathname = location.pathname;
  //  //
  //  for (let node of this.menuTree) {
  //      //使用正则判断当前浏览器path是否与菜单项中的key相匹配，此正则可以匹配动态路径（类似于/product/:id这种传参的路由），所以即便是动态路由也能高亮对应菜单
  //       const isActivePath = new RegExp(`^${node.key}`).test(pathname);
  //       if (isActivePath) {
  //          const openKeys = [];
  //          const selectedKeys = [node.key];
  //          //判断当前菜单是否有父级菜单，如果有父级菜单需要将其展开
  //          while (node.parent) {
  //            openKeys.push(node.parent.key);
  //            node = node.parent;
  //          }
  //          this.setState({
  //            defaultOpenKeys: openKeys,
  //            defaultSelectedKeys: selectedKeys
  //          });
  //          return;
  //       }
  //  }


  render() {
    const { selectedKeysArr } = this.state;
    // 动态获取 url 的路径，使选中的菜单及时更新
    // 由于每次渲染后数值更新，所以每次 push 都只有一个值
    // const pathname = window.location.pathname;
    // let selectedKeysArr = [];
    // selectedKeysArr.push(pathname);

    return(
      <Menu
        onSelect={ this.handleClick }
        // selectedKeys={ selectedKeysArr }
        // selectedKeys={ [window.location.pathname] }
        defaultSelectedKeys={[window.location.pathname]}  // 初始选中的菜单项 key 数组	
        // defaultOpenKeys={['sub1']}  // 初始展开的 SubMenu 菜单项 key 数组	
        mode="inline"
        // onSelect={ this.selectMenu }
        theme="dark"
        className="all-left-menu"
      >
        <div className="all-left-logo" />

        <Menu.Item key="interviewer" icon={ <PieChartOutlined />} >
          <NavLink to={ INTERVIEWER }>面试题展示</NavLink>
        </Menu.Item>

        <Menu.Item key="edit" icon={ <DesktopOutlined />} >
          <NavLink to={ EDIT }>面试题管理</NavLink>
        </Menu.Item>

        <Menu.Item key="lookOver" icon={ <DesktopOutlined />} >
          <NavLink to={ LOOK_OVER }>阅卷</NavLink>
        </Menu.Item>

        <Menu.SubMenu key="sub2" icon={<AppstoreOutlined />} title="Navigation Two">
          <Menu.Item key="5">Option 5</Menu.Item>
          <Menu.Item key="6">Option 6</Menu.Item>
        </Menu.SubMenu>
      </Menu>
    )
  }
}