import React, { PureComponent } from 'react';
import { Form, Input, Button, Checkbox, Card } from 'antd';
import { createBrowserHistory } from 'history'

import { UserOutlined, LockOutlined } from '@ant-design/icons';

import './style.less';
import logoImg from 'img/logo.png';
import {test_login} from 'api/modules/demo'
import {test_register} from 'api/modules/demo'

// 登录
const submit_login = async (values: any) => {
  const {account, password, remember} = values
  const data = { account, password }
  try {
    const res = await test_login(data)
    console.log(res)
    const ans:boolean = res.status
    const over:string = res.message
    // 登录成功，跳转至首页
    if (ans === true) {
      console.log('@',res.message)
      // this.props.history.push({})
      // return;
    } else {
      alert(over)
    }
  } catch(err) {
    console.log(err)
  }
};

// 注册
// const [form] = Form.useForm();
const submit_register = async (values: any) => {
  const {account, password} = values
  const data = { account, password }
  console.log(data)
  try {
    console.log('hhhh我也进来了')
    const res = await test_register(data)
    console.log('注册成功: ', res);
    console.log("前端调用后端接口成功", res.message)
    const ans:boolean = res.status
    const over:string = res.message
    // 注册成功
    if (ans === true) {
      console.log('注册成功')
      // this.props.history.push({})
    } else {
      alert(over)
    }
    // this.props.history.push({})
  } catch(err) {
    console.log(err)
  }
};

// 页签切换
const tabListNoTitle = [
  { key: 'login', tab: '登录' },
  { key: 'register', tab: '注册' }
];
const contentListNoTitle = {
  login:
  <Form name="normal_login" className="login-form" initialValues={{ remember: true }} onFinish={submit_login} >
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
    </Form.Item>
  </Form>,
  
  register: 
  <Form
  // {...formItemLayout}
  // form={form}
  name="register"
  className="register-form box"
  id="front"
  onFinish={submit_register}
  scrollToFirstError   // 提交失败自动滚动到第一个错误字段
  >
    <Form.Item
      name="account"
      label="邮箱账号"
      rules={[
        // {type: 'number', message: '输入的电子邮箱无效!'},
        {required: true, whitespace:true, message: '请输入您的电子邮箱!'},
        {len:10, message:'邮箱为10位数！'},
        {pattern:/^[0-9]+$/, message:'邮箱账号或者手机号码都只能为数字'}
      ]}
    >
      <Input suffix="@qq.com"/>
    </Form.Item>

    <Form.Item
      name="password"
      label="密码"
      rules={[
        {required: true, whitespace: true, message: '请输入密码!'},
        {min:6, message:'密码至少6位!'},
        {pattern:/^[a-zA-Z0-9_]+$/, message:'密码只能由英文、数字或下划线组成！'}
      ]}
      hasFeedback
    >
      <Input.Password />
    </Form.Item>

    <Form.Item
      name="confirm"
      label="确认密码"
      dependencies={['password']}
      hasFeedback
      rules={[
        {required: true, whitespace:true, message: '请确认密码!'},
        {min:6, message:'密码至少6位!'},
        {pattern:/^[a-zA-Z0-9_]+$/, message:'密码只能由英文、数字或下划线组成！'},
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

    {/* <Form.Item {...tailFormItemLayout}> */}
    <Form.Item>
      <Button type="primary" htmlType="submit" className="register-form-button">注册</Button>
    </Form.Item>
  </Form>
};



class Login extends PureComponent {
  state = {
    key: 'login',
    noTitleKey: 'login'
  };
  onTabChange = (key: string, type: string) => {
    console.log(key, type);
    this.setState({ [type]: key });
  };

  render() {
    return (
      <div className="app-container">
        <div className="app-background"></div>

        <div className="app-header">
          <img src={logoImg} alt="" />
          <h1>react-ts：在线编程笔试平台</h1>
        </div>

        <div className="app-content">
          <Card
            style={{ width: '100%' }}
            tabList={tabListNoTitle} // 页签标题列表
            activeTabKey={this.state.noTitleKey} // 当前激活页签的 key
            onTabChange={key => { // 页签切换的回调
              this.onTabChange(key, 'noTitleKey');
            }}
          >
            {contentListNoTitle[this.state.noTitleKey]}
          </Card>
        </div>
      </div>
    );
  }
}

export default Login;