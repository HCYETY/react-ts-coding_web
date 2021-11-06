import React from 'react';
import { 
  Layout, 
  Avatar, 
  Badge,
  Popover,
  Menu,
  Dropdown,
  Popconfirm,
} from 'antd';
import { 
  UserOutlined,
  LogoutOutlined, 
  StarOutlined,
  ContainerOutlined,
  FileOutlined,
} from '@ant-design/icons';

import 'style/basic.less';
import { logout } from 'src/api/modules/interface';
import { getCookie } from 'common/utils';
import { LOGIN } from 'common/const';
const { Header } = Layout;      

export default class Head extends React.PureComponent{

  logOut = () => {
    const cookie = getCookie();
    console.log(cookie)
    logout({ cookie: cookie }).then(res => {
      console.log(res)
      if (res.data.status === true) {
        window.location.href = LOGIN;
      }
    })
  }

  render() {

    const menu = (
      <Menu>
        <Menu.Item key="0">
          <a href="https://www.antgroup.com"><FileOutlined />个人信息</a>
        </Menu.Item>
        <Menu.Item key="1">
          <a href="https://www.aliyun.com"><ContainerOutlined />我的题解</a>
        </Menu.Item>
        <Menu.Item key="2">
          <a href="https://www.aliyun.com"><StarOutlined />收藏夹</a>
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
            <LogoutOutlined />退出登录
          </a>
          </Popconfirm>
        </Menu.Item>
      </Menu>
    );
    
    return(
      <>
        <div className="all-header-div"></div>
        <div className="all-header">
          
          <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
            <div className="all-header-avatar-box">
              <Avatar className="all-header-avatar" size="large" icon={<UserOutlined />} />
            </div>
          </Dropdown>

        </div>
      </>
    )
  }
}