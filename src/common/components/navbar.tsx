import React from 'react';
import { NavLink } from "react-router-dom";
import { Menu } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import 'style/basic.less';
import { COMMUNICATE, MANAGE, SHOW_EXAM } from '../const';

export default class Navbar extends React.PureComponent {

  state = {
    selectedKeysArr: [] = [MANAGE],
    openKeys: ['writtenExamination'],
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

  onOpenChange = (keys: any[]) => {
    const { openKeys } = this.state;
    const rootSubmenuKeys = ['writtenExamination', 'interview'];
    const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys: keys });
    } else {
      this.setState({ openKeys: latestOpenKey ? [latestOpenKey] : [] });
    }
  }

  render() {
    const { selectedKeysArr, openKeys } = this.state;
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
        openKeys={ openKeys }	// 当前展开的 SubMenu 菜单项 key 数组
        onOpenChange={ this.onOpenChange }
        mode="inline"
        theme="dark"
        className="all-left-menu"
      >
        <div className="all-left-logo" />

        <Menu.SubMenu key="writtenExamination" icon={<AppstoreOutlined />} title="笔试">
          <Menu.Item key="manage" icon={ <DesktopOutlined />} >
            <NavLink to={ MANAGE }>面试题管理</NavLink>
          </Menu.Item>
          <Menu.Item key="showExam" icon={ <PieChartOutlined />} >
            <NavLink to={ SHOW_EXAM }>阅卷</NavLink>
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.SubMenu key="interviewExamination" icon={<AppstoreOutlined />} title="面试">
          <Menu.Item key="communicate" icon={ <PieChartOutlined />} >
            <NavLink to={ COMMUNICATE }>面试间</NavLink>
          </Menu.Item>
        </Menu.SubMenu>
      </Menu>
    )
  }
}