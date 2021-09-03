import React, {Component, useState} from "react"
import type { CSSProperties } from 'react';
import { message, Tabs, Button  } from 'antd';
import { LoginForm, ProFormText, ProFormCaptcha, ProFormCheckbox } from '@ant-design/pro-form';
import { UserOutlined, MobileOutlined, LockOutlined } from '@ant-design/icons';

import logo from './images/bg.jpg'
import './login.css'

export default () => {
        const [loginType, setLoginType] = useState<LoginType>('phone');
        type LoginType = 'phone' | 'account';
        const iconStyles = {
          marginLeft: '16px',
          color: 'rgba(0, 0, 0, 0.2)',
          fontSize: '24px',
          verticalAlign: 'middle',
          cursor: 'pointer',
        };

        return (
            <div className="login">
                <div className='bg'></div>
                <div className="App">
                    <Button type="primary">Button</Button>
                </div>
                <header className="login-header">
                    <img src={logo} alt="logo" />
                    <h1>React-ts项目：在线编程平台</h1>
                </header>

                <div className="login-content">
                    <h2>用户登录</h2>
                    <LoginForm
                        // logo={logo}
                        // title="在线编程平台"
                        // subTitle="实习项目"
                    >
                        <Tabs activeKey={loginType} onChange={(activeKey: string) => setLoginType(activeKey as LoginType)}>
                            <Tabs.TabPane key={'account'} tab={'账号密码登录'} />
                            <Tabs.TabPane key={'email'} tab={'邮箱登录'} />
                        </Tabs>

                        {loginType === 'account' && (
                        <>
                            <ProFormText
                                name="username"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <UserOutlined className={'prefixIcon'} />,
                                }}
                                placeholder={'用户名: admin or user'}
                                rules={[
                                    {required: true, whitespace:true, message: '用户名必须输入!'},
                                    {min:4, message:'用户名至少4位!'},
                                    {max:12, message:'用户名最多12位!'},
                                    {pattern:/^[a-zA-Z0-9_]+$/, message:'用户名必须是英文、数字或下划线组成！'}
                                ]}
                            />
                            <ProFormText.Password
                                name="password"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined className={'prefixIcon'} />,
                                }}
                                placeholder={'密码: ant.design'}
                                rules={[
                                    {required: true, whitespace:true, message: '密码必须输入!'},
                                    {min:4, message:'密码至少4位!'},
                                    {max:12, message:'密码最多12位!'},
                                    {pattern:/^[a-zA-Z0-9_]+$/, message:'密码必须是英文、数字或下划线组成！'}
                                ]}
                            />
                        </>
                        )}

                        {/* 待修改 */}
                        {loginType === 'phone' && (
                        <>
                            <ProFormText
                            fieldProps={{
                                size: 'large',
                                prefix: <MobileOutlined className={'prefixIcon'} />,
                            }}
                            name="mobile"
                            placeholder={'手机号'}
                            rules={[
                                {
                                required: true,
                                message: '请输入手机号！',
                                },
                                {
                                pattern: /^1\d{10}$/,
                                message: '手机号格式错误！',
                                },
                            ]}
                            />
                            <ProFormCaptcha
                            fieldProps={{
                                size: 'large',
                                prefix: <LockOutlined className={'prefixIcon'} />,
                            }}
                            captchaProps={{
                                size: 'large',
                            }}
                            placeholder={'请输入验证码'}
                            captchaTextRender={(timing: any, count: any) => {
                                if (timing) {
                                return `${count} ${'获取验证码'}`;
                                }
                                return '获取验证码';
                            }}
                            name="captcha"
                            rules={[
                                {
                                required: true,
                                message: '请输入验证码！',
                                },
                            ]}
                            onGetCaptcha={async () => {
                                message.success('获取验证码成功！验证码为：1234');
                            }}
                            />
                        </>
                        )}

                        <div style={{ marginBottom: 24 }} >
                            <a style={{float: 'right'}} > 点击注册 </a>
                        </div>
                    </LoginForm>
                </div>
            </div>
        )
    }