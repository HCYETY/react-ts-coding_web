import React, { PureComponent } from 'react';
import { Layout, Menu, Breadcrumb } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  FileOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

class Interviewer extends PureComponent {
  state = {
    collapsed: false,
  };
  onCollapse = (collapsed: any) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    const { collapsed } = this.state;
    return(
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" icon={<PieChartOutlined />}>
              面试题展示
            </Menu.Item>
            <Menu.Item key="2" icon={<DesktopOutlined />}>
              面试题管理
            </Menu.Item>
            {/* <SubMenu key="sub1" icon={<UserOutlined />} title="User">
              <Menu.Item key="3">Tom</Menu.Item>
              <Menu.Item key="4">Bill</Menu.Item>
              <Menu.Item key="5">Alex</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
              <Menu.Item key="6">Team 1</Menu.Item>
              <Menu.Item key="8">Team 2</Menu.Item>
            </SubMenu>
            <Menu.Item key="9" icon={<FileOutlined />}>
              Files
            </Menu.Item> */}
          </Menu>
        </Sider>
        <Layout className="site-layout">
          <Header className="site-layout-background" style={{ padding: 0}} />
          <Content style={{ margin: '10px 16px', backgroundColor: 'skyblue' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>User</Breadcrumb.Item>
              <Breadcrumb.Item>Bill</Breadcrumb.Item>
            </Breadcrumb>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              <div className="title">
                <span>共有1张试卷</span>
                <a href="/admin/user-edit" className="btn btn-primary new">添加试卷</a>
                <a href="/admin/user-edit" className="btn btn-primary new">批量删除试卷</a>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>编号</th>
                    <th>用户名</th>
                    <th>邮箱</th>
                    <th>开始时间</th>
                    <th>结束时间</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th>1</th>
                    <th>12</th>
                    <th>98</th>
                    <th>09.01</th>
                    <th>01.01</th>
                    <th>
                      <a href="/admin/user-edit?id={{@$value._id}}" className="glyphicon glyphicon-edit"></a>
                    </th>
                  </tr>
                </tbody>
              </table>
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
    )
  }
}

export default Interviewer;