import React from 'react';
import { Link, BrowserRouter as Router } from 'react-router-dom';
import { 
  Layout, 
  Avatar, 
  Badge,
  Popover,
  Menu,
  Dropdown,
  Popconfirm,
  Breadcrumb,
} from 'antd';
import { 
  UserOutlined,
  LogoutOutlined, 
  StarOutlined,
  ContainerOutlined,
  FileOutlined,
} from '@ant-design/icons';

import 'style/basic.less';
import { logout } from 'api/modules/user';
import { getCookie } from 'common/utils';
import { LOGIN, routes } from 'common/const';
import { Route } from 'common/types';

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

  renderBreadCrumb = () => {
    const url = window.location.pathname;
    const newRoute = routes.find(item => item.path === url);
    console.log(newRoute)
    if (newRoute && newRoute.children && newRoute.children.length > 0) {
      newRoute.children.map(item => {
        return(
          <Breadcrumb.Item key={ url }>
            <Router>
              <Link to={ item.path }>{ item.breadcrumbName }</Link>
            </Router>
          </Breadcrumb.Item>
        )
      })
    } else {
      return(
        <Breadcrumb.Item key={ url }>
          <Router>
          <Link to={ url }>{ newRoute.breadcrumbName }</Link>
          </Router>
        </Breadcrumb.Item>
      )
    }
  }
  // itemRender = (route: Route, params: any, routes:Route[], paths: string[]) => {
  //   console.log('route', route)
  //   console.log('params', params)
  //   console.log('routes', routes)
  //   console.log('paths', paths)
  //   const location = window.location.pathname;
  //   const find = routes.find(item => item.path === location);
  //   return(
  //     <Router>
  //       <Link to={ find.path }>{ find.breadcrumbName }</Link>
  //     </Router>
  //   )
  //   // const last = routes.indexOf(route) === routes.length - 1;
  //   // return last ? ( 
  //   //   <span>{route.breadcrumbName}</span>
  //   // ) : (
  //   //   <Router>
  //   //     {/* <span>{ route.breadcrumbName }：</span> */}
  //   //     <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
  //   //   </Router>
  //   // );
  // }
  

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
          {/* {
            const newRoute = routes.find(item => item.path === window.location.pathname) 
            routes ? 
                <Breadcrumb>
                  { this.renderBreadCrumb() }
                </Breadcrumb>
              )
            }
          } */}

          <div className="all-header-avatar-box">
            <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
              <Avatar className="all-header-avatar" size="large" icon={<UserOutlined />} />
            </Dropdown>
          </div>

        </div>
      </>
    )
  }
}