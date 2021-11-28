import React from 'react';
import { Link, BrowserRouter as Router } from 'react-router-dom';
import { Breadcrumb, Col, Row } from 'antd';
import { LeftOutlined } from '@ant-design/icons';

import { routes } from 'common/const';
import { flattenRoutes } from 'common/utils';

interface Prop{
  url: string;
}

export default class Breadcrumbs extends React.Component<Prop> {

  componentWillReceiveProps(newProps: { match: { params: { id: any; }; }; }) {
    const id = newProps.match.params.id;
    console.log('id+++++', id)
    // 一些操作
  }
  
  getBreadcrumb = (flattenRoutes: any[], pathSection: string) => {
    return flattenRoutes.find((ele: { breadcrumbName: any; path: any; }) => {
      const { breadcrumbName, path } = ele;
      if (!breadcrumbName || !path) {
        throw new Error('Router中的每一个route必须包含 `path` 以及 `breadcrumbName` 属性');
      }
      return pathSection === path;
    });
  }
  
  getBreadcrumbs = (arr: any, location: any) => {
    // 初始化匹配数组match
    let matches: any[] = [];
    location
      // 取得路径名，然后将路径分割成每一路由部分.
      .split('?')[0]
      .split('/')
      // 对每一部分执行一次调用`getBreadcrumb()`的reduce.
      .reduce((prev: any, curSection: any) => {
        // 将最后一个路由部分与当前部分合并，比如当路径为 `/x/xx/xxx` 时，pathSection分别检查 `/x` `/x/xx` `/x/xx/xxx` 的匹配，并分别生成面包屑
        const pathSection = `${prev}/${curSection}`;
        // 对于 拆分的路径，从 flattenRoutes 中查找对应的路由
        const breadcrumb = this.getBreadcrumb(arr, pathSection);

        // 将面包屑导入到matches数组中
        matches.push(breadcrumb);

        // 传递给下一次reduce的路径部分
        return pathSection;
      });
    return matches;
  }
  
  render() {
    const url = window.location.pathname;
    const retArr = flattenRoutes(routes);
    const breadcrumbs = this.getBreadcrumbs(retArr, url);

    return(
      <div>
        <Row>
          <LeftOutlined onClick={ () => window.history.back() }/>
          <Breadcrumb>
            {
              breadcrumbs.map(item => (
                !item ? null :
                item.path === url ? 
                <Breadcrumb.Item key={ item.path }>
                  { item.breadcrumbName }
                </Breadcrumb.Item> : 
                <Breadcrumb.Item href={ item.path } key={ item.path }>
                  { item.breadcrumbName }
                </Breadcrumb.Item>
              ))
            }
          </Breadcrumb>
        </Row>
      </div>
    )
  }
}