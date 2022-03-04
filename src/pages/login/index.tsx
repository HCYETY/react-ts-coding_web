import React, { PureComponent } from 'react';
import { Form, Input, Button, Checkbox, Tabs, Radio, message, Row, Col, FormInstance } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import 'style/login/login.less';
import logoImg from 'img/logo.png';
import { sendEmail, testLogin, testRegister } from 'api/modules/user';
import { TEST_MANAGE, CANDIDATE } from 'common/const';
import { transTime } from 'common/utils';

export default class Login extends PureComponent<any> {
  // 页签切换
  state = {
    activeKey: 'login',
    value: 0, // 身份标识，0 为候选人，1 为面试官
    email: '', // 获取邮箱账号时动态赋值
    count: 60, // “获取验证码” 与 “60秒后重发”的更新标记
    clickTime: 0,
  };

  getEmail = (event: any) => {
    this.setState({email: event.target.value});
  }

  formRef = React.createRef<FormInstance>();
  // 获取验证码
  sendCaptcha = () => {
    // 得到 Form 实例
    const form = this.formRef.current
    // 使用 getFieldsValue 获取多个字段值
    const email = form.getFieldValue('email')

    sendEmail({ email }).then((ans) => {
      if (ans.data.status === false) {
        message.error(ans.msg);
      } else {
        message.success(ans.msg);
        const captchaTime = ans.data.captchaTime;
        const afterTime = captchaTime + 60000;
        this.setState({ clickTime: afterTime });
        this.countdown();
      }
    });
  }
  // 倒计时
  timer: NodeJS.Timeout = null;
  countdown = () => {
    const { count, clickTime } = this.state;
    if (count !== 0) {
      this.setState({ clickTime: clickTime - 1000, count: count - 1 });
    } else {
      this.setState({ clickTime: 0, count: 60 });
      return;
    }
    this.timer = setTimeout(() => this.countdown(), 1000)
  }
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  // 登录
  submitLogin = async (values: any) => {
    try {
      const { email, cypher, remember } = values;
      const data = { email, cypher };
      const res = await testLogin(data);
      // 登录成功
      if (res.data.isLogin === true) {
        message.success(res.msg);
        if (res.data.interviewer === true) {
          window.location.href = TEST_MANAGE;
        } else {
          window.location.href = CANDIDATE;
        }
      } else {
        // 登录失败
        message.error(res.msg);
      }
    } catch(err) { message.error(err); }
  };
  // 使用测试账号登录，传值为 true 则面试官登录，否则为候选人登录
  testLogin = async (identity: boolean) => {
    const email = identity === true ? '1164939253@qq.com' : 'lxlandsx@outlook.com';
    const cypher = '111111';
    const data = { email, cypher };
    const res = await testLogin(data);
    // 登录成功
    if (res.data.isLogin === true) {
      message.success(res.msg);
      if (res.data.interviewer === true) {
        window.location.href = TEST_MANAGE;
      } else {
        window.location.href = CANDIDATE;
      }
    }
  }
  // 注册
  submitRegister = async (values: any) => {
    try {
      const res = await testRegister(values);
      // 注册成功
      if (res.data.status === true) {
        message.success(res.msg);
        // 在当前页跳转至登录界面
        this.setState({ activeKey: 'login' });
      } else {
        message.error(res.msg);
      }
    } catch(err) { message.error(err); }
  };

  // 切换页签
  change = (key: string) => {
    this.setState({ activeKey: key });
  }

  render() {
    const { activeKey } = this.state;

    return (
      <div className="app-container">
        <div className="app-background"></div>

        <div className="app-header">
          <img src={ logoImg } alt="" />
          <h1>react-ts：在线编程笔试平台</h1>
        </div>

        <div className="app-content">
          <Tabs activeKey={ activeKey } onChange={ this.change } centered>

            <Tabs.TabPane tab="测试登录" key="test">
              <Row>
                <Button 
                  type="primary" 
                  className='testLogin-form-button' 
                  onClick={ () => this.testLogin(true) }
                >
                  面试官账号登录
                </Button>
              </Row>
              <Row>
                <Button 
                  type="primary" 
                  className='testLogin-form-button' 
                  onClick={ () => this.testLogin(false) }
                >
                  候选人账号登录</Button>
              </Row>
            </Tabs.TabPane>

            <Tabs.TabPane tab="邮箱登录" key="login">
              <Form 
                name="normal_login" 
                className="login-form" 
                initialValues={{ remember: true }} 
                onFinish={ this.submitLogin } 
              >
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true, 
                      whitespace: true, 
                      message: '请输入邮箱账号!'
                    }, {
                      min: 15, 
                      message: '邮箱账号最少为 15 位数!'
                    }, {
                      pattern: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
                      message: '邮箱账号不符合规范'
                    }
                  ]}
                >
                  <Input 
                    prefix={ <UserOutlined className="site-form-item-icon" /> } 
                    placeholder="邮箱账号" 
                  />
                </Form.Item>
                {/* <Form.Item
                  name="account"
                  rules={[
                    {
                      required: true, 
                      whitespace:true, 
                      message: '请输入邮箱账号或者手机号码!'
                    },
                    {
                      min:10, 
                      message:'邮箱账号为10位数!'
                    },
                    {
                      max:11, 
                      message:'手机号码为11位数!'
                    },
                    {
                      pattern:/^[0-9]+$/, 
                      message:'邮箱账号或者手机号码都只能为数字'
                    }
                  ]}
                >
                  <Input 
                    prefix={<UserOutlined className="site-form-item-icon" />} 
                    placeholder="邮箱账号或者手机号码" 
                    suffix="@qq.com"
                  />
                </Form.Item> */}
              
                <Form.Item
                  name="cypher"
                  rules={[
                    {
                      required: true, 
                      whitespace:true,
                      message: '请输入密码!'
                    }, {
                      min:6, 
                      message:'密码至少6位!'
                    }, {
                      pattern:/^[a-zA-Z0-9_]+$/, 
                      message:'密码只能由英文、数字或下划线组成！'
                    }
                  ]}
                >
                  <Input
                    prefix={ <LockOutlined className="site-form-item-icon" /> }
                    type="password"
                    placeholder="输入密码"
                  />
                </Form.Item>
              
                <Form.Item>
                  <Form.Item 
                    name="remember" 
                    valuePropName="checked" 
                    noStyle
                  >
                    <Checkbox>记住密码</Checkbox>
                  </Form.Item>
                  <a className="login-form-forgot">忘记密码</a>
                </Form.Item>
              
                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    className="login-form-button"
                  > 登录 </Button>
                </Form.Item>
              </Form>
            </Tabs.TabPane>

            <Tabs.TabPane tab="邮箱注册" key="register">
              <Form
                name="register"
                className="register-form"
                id="front"
                onFinish={ this.submitRegister }
                scrollToFirstError   // 提交失败自动滚动到第一个错误字段
                ref={ this.formRef }
              >
                <Form.Item
                  name="email"
                  label="邮箱账号"
                  rules={[
                    {
                      required: true, 
                      whitespace: true, 
                      message: '请输入您的电子邮箱!'
                    }, {
                      min: 15,
                      message: '邮箱最少为15位数！'
                    }, {
                      pattern: /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/,
                      message: '邮箱账号不符合规范'
                    }
                  ]}
                >
                  <Input onChange={ this.getEmail } ref="myEmail"/>
                </Form.Item>
                {/* <Form.Item
                  name="account"
                  label="邮箱账号"
                  rules={[
                    {
                      required: true, 
                      whitespace:true, 
                      message: '请输入您的电子邮箱!'
                    },
                    {
                      len:10, 
                      message:'邮箱为10位数！'
                    },
                    {
                      pattern:/^[0-9]+$/, 
                      message:'邮箱账号或者手机号码都只能为数字'
                    }
                  ]}
                >
                  <Input suffix="@qq.com"/>
                </Form.Item> */}

                <Form.Item
                  name="cypher"
                  label="密码"
                  rules={[
                    {
                      required: true, 
                      whitespace: true, 
                      message: '请输入密码!'
                    }, {
                      min:6, 
                      message:'密码至少6位!'
                    }, {
                      pattern:/^[a-zA-Z0-9_]+$/, 
                      message:'密码只能由英文、数字或下划线组成！'
                    }
                  ]}
                  hasFeedback
                >
                  <Input.Password />
                </Form.Item>

                <Form.Item label="验证码" >
                  <Row gutter={8}>
                    <Col span={12}>
                      <Form.Item
                        name="captcha"
                        noStyle
                        rules={[
                          { 
                            required: true, 
                            message: '请输入验证码!' 
                          }
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Button
                        disabled={ this.state.clickTime === 0 ? false : true }
                        onClick={ this.sendCaptcha }
                      >
                        { this.state.clickTime === 0 ? '获取验证码' : this.state.count + '秒后重发' }
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>
                {/* <Form.Item
                  name="confirm"
                  label="确认密码"
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    {
                      required: true, 
                      whitespace:true,
                      message: '请确认密码!' 
                    },
                    {
                      min:6,  
                      message:'密码至少6位!' 
                    },
                    {
                      pattern:/^[a-zA-Z0-9_]+$/,  
                      message:'密码只能由英文、数字或下划线组成！' 
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
                </Form.Item> */}

                <Form.Item  name="identity"  label="面试官">
                  <Radio.Group value={ this.state.value }>
                    <Radio value={ 1 }>是</Radio>
                    <Radio value={ 0 }>否</Radio>
                  </Radio.Group>
                </Form.Item>
                
              <Form.Item>
                  <Button type="primary" htmlType="submit" className="register-form-button">注册</Button>
                </Form.Item>
              </Form>
            </Tabs.TabPane>

          </Tabs>
        </div>
      </div>
    );
  }
}