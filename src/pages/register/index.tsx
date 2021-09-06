import React, { PureComponent } from 'react';
import { Form, Input } from 'antd';

import 'pages/login/style.less';
// import logoImg from '../../../img/logo.png';

const [form] = Form.useForm();
const onFinish = (values: any) => {
  console.log('Received values of Form: ', values);
};

class App extends PureComponent {
  render() {
    return (
      <div className="app-container">
        <div className="app-background"></div>

        <div className="app-header">
          <img src='../../../img/logo.png' alt="" />
          <h1>react-ts：在线编程笔试平台</h1>
        </div>

        <div className="app-content">
          <h2>用户注册</h2>
          <Form
            // {...formItemLayout}
            form={form}
            name="register"
            onFinish={onFinish}
            initialValues={{
              residence: ['zhejiang', 'hangzhou', 'xihu'],
              prefix: '86',
            }}
            scrollToFirstError
          >
            <Form.Item
              name="email"
              label="E-mail"
              rules={[
                {
                  type: 'email',
                  message: '输入的电子邮件无效!',
                },
                {
                  required: true,
                  message: '请输入您的电子邮件!',
                },
              ]}
            >
              <Input />
            </Form.Item>
        
            <Form.Item
              name="password"
              label="Password"
              rules={[
                {
                  required: true,
                  message: '请输入您的密码!',
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>
        
            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={['password']}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: '请确认密码!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('您输入的两个密码不匹配!'));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}
export default App;