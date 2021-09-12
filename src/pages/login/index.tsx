import React, { PureComponent } from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import './style.less';
import logoImg from 'img/logo.png';
import {test_login} from 'api/modules/demo'

const onFinish = async (values: any) => {
  const {account, password, remember} = values
  const data = { account, password }
  try {
    const res = await test_login(data)
    console.log('登录成功: ', values);
    console.log("前端调用后端接口成功", res.data)
  } catch(err) {
    console.log(err)
  }
};

class App extends PureComponent {
  render() {
    return (
      <div className="app-container">
        <div className="app-background"></div>

        <div className="app-header">
          <img src={logoImg} alt="" />
          <h1>react-ts：在线编程笔试平台</h1>
        </div>

        <div className="app-content">
          <h2>用户登录</h2>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="account"
              rules={[
                {required: true, whitespace:true, message: '请输入邮箱账号或者手机号码!'},
                {min:10, message:'邮箱账号为10位数!'},
                {max:11, message:'手机号码为11位数!'},
                {pattern:/^[0-9]+$/, message:'邮箱账号或者手机号码都只能为数字'}
              ]}
            >
              <Input 
                prefix={<UserOutlined className="site-form-item-icon" />} 
                placeholder="邮箱账号或者手机号码" 
                suffix="@qq.com"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {required: true, whitespace:true, message: '请输入密码!'},
                {min:6, message:'密码至少6位!'},
                {pattern:/^[a-zA-Z0-9_]+$/, message:'密码只能由英文、数字或下划线组成！'}
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="输入密码"
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住密码</Checkbox>
              </Form.Item>
              <a className="login-form-forgot" href="">忘记密码</a>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" className="login-form-button">登录</Button>
              还没注册？<a className="register" href="../register/index">点击注册</a>
            </Form.Item>
          </Form>
        </div>
      </div>
    );
  }
}

export default App;