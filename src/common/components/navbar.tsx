import React from 'react';
import { NavLink } from "react-router-dom";
import { Menu } from 'antd';
import {
  RobotOutlined,
  TeamOutlined,
  AppstoreOutlined,
  ProfileOutlined,
  ReadOutlined,
} from '@ant-design/icons';
import 'style/basic.less';
import { INTERVIEW_MANAGE, INTERVIEW_ENTRANCE, TEST_MANAGE, SHOW_EXAM } from 'common/const';

export default class Navbar extends React.Component {

  state = {
    openKeys: ['writtenExamination'],
  }

  onOpenChange = (keys: any[]) => {
    let { openKeys } = this.state;
    const rootSubmenuKeys = ['writtenExamination', 'interviewExamination'];
    let latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys: keys });
    } else {
      latestOpenKey = latestOpenKey ? [latestOpenKey] : [];
      this.setState({ openKeys: latestOpenKey });
    }
  }

  render() {
    // const { openKeys } = this.state;
    const selectedKeys = [`/${ window.location.pathname.split('/')[1] }`];

    return(
      <Menu
        selectedKeys={ selectedKeys }   // 当前选中的菜单项
        openKeys={ this.state.openKeys }	          // 当前展开的 SubMenu 菜单项 key 数组
        onOpenChange={ this.onOpenChange.bind(this) }
        mode="inline"
        theme="dark"
        className="all-left-menu"
      >
        <div className="all-left-logo" />

        <Menu.SubMenu key="writtenExamination" icon={<AppstoreOutlined />} title="笔试">
          <Menu.Item key={ TEST_MANAGE } icon={ <ProfileOutlined /> } >
            <NavLink to={ TEST_MANAGE }>试题管理</NavLink>
          </Menu.Item>
          <Menu.Item key={ SHOW_EXAM } icon={ <ReadOutlined /> } >
            <NavLink to={ SHOW_EXAM }>阅卷管理</NavLink>
          </Menu.Item>
        </Menu.SubMenu>

        <Menu.SubMenu key="interviewExamination" icon={<AppstoreOutlined />} title="面试">
          <Menu.Item key={ INTERVIEW_MANAGE } icon={ <RobotOutlined /> } >
            <NavLink to={ INTERVIEW_MANAGE }>面试间管理</NavLink>
          </Menu.Item>
          <Menu.Item key={ INTERVIEW_ENTRANCE } icon={ <TeamOutlined /> } >
            <NavLink to={ INTERVIEW_ENTRANCE }>面试间入口</NavLink>
          </Menu.Item>
        </Menu.SubMenu>

      </Menu>
    )
  }
}