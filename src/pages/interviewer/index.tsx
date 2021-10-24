import React, { PureComponent } from 'react';
import { Layout } from 'antd';
const { Content } = Layout;

import Navbar from 'common/components/navbar';

export default class Interviewer extends PureComponent{
  render() {
    return(
      <Layout>
        <Navbar/>

        <Layout >
          <Content style={{ margin: '0 16px' }}>
            <div className="site-layout-background" style={{ padding: 24, minHeight: 360 }}>
              Bill is a cat.
            </div>
          </Content>
        </Layout>
      </Layout>
    )
  }
}