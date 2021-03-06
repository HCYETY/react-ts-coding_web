import React from 'react';
import { Link, BrowserRouter as Router } from 'react-router-dom';
import { 
  Avatar, 
  Menu,
  Dropdown,
  Popconfirm,
  PageHeader,
  Switch 
} from 'antd';
import { 
  UserOutlined,
  LogoutOutlined, 
  StarOutlined,
  ContainerOutlined,
  FileOutlined,
} from '@ant-design/icons';

import 'style/basic.less';
import logoImg from 'img/logo.png';
import { logout } from 'api/modules/user';
import { getCookie } from 'common/utils';
import { CANDIDATE, LOGIN, } from 'common/const';
import Breadcrumbs from 'common/components/breadcrumbs';

export default class Head extends React.PureComponent{
  logOut = () => {
    const cookie = getCookie();
    console.log(cookie)
    logout({ cookie: cookie }).then(res => {
      console.log(res)
      if (res.data.status === true) {
        const cookie = getCookie();
        document.cookie = `session=${ cookie }; max-age=-1`    // 删除cookie
        window.location.href = LOGIN;
      }
    })
  }

  render() {
    const menu = (
      <Menu>
        <Menu.Item key="0">
          <a href="https://www.antgroup.com"><FileOutlined/>&nbsp;个人信息</a>
        </Menu.Item>
        <Menu.Item key="1">
          <a href="https://www.aliyun.com"><ContainerOutlined/>&nbsp;我的题解</a>
        </Menu.Item>
        <Menu.Item key="2">
          <a href="https://www.aliyun.com"><StarOutlined/>&nbsp;收藏夹</a>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="layout">
          <Popconfirm 
            title="您确定要 退出登录 吗？" 
            okText="确定" 
            cancelText="取消" 
            onConfirm={ this.logOut }
          >
            {/* <Button 
              className="site-layout-content-button" 
              icon={ <DeleteOutlined/> }
              type="primary" 
            >
              删除试卷
            </Button> */}
          <a >
            <LogoutOutlined/>&nbsp;退出登录
          </a>
          </Popconfirm>
        </Menu.Item>
      </Menu>
    );

    return(
      <>
        <div className="all-header-div"></div>
        <div className="all-header">
          <a href={ CANDIDATE }>
            <div className="all-header-logo">
              <img src={ logoImg }/>
              <h1>react-ts</h1>
            </div>
          </a>

          <Breadcrumbs/>

          <input id="modeCheckBox" type="checkbox"/>
          <label id="modeBtn" htmlFor="modeCheckBox"></label>

          <div className="all-header-avatar-box">
            <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
              <Avatar 
                className="all-header-avatar" 
                size="large" 
                icon={<UserOutlined />} 
                shape="square"
              />
            </Dropdown>
          </div>

        </div>
      </>
    )
  }
}