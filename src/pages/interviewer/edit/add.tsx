import React from 'react';
import { Layout, Form, Input, Select, Button, Card, DatePicker, Radio, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

import 'style/add.less';
import { addPaper } from 'src/api/modules/interface';
import { TAGS } from 'public/const';
import Navbar from 'public/components/navbar';
import Head from 'public/components/header';
import Foot from 'public/components/footer';
import CardPaper from 'public/components/cardPaper';
import DropdownMenu from 'public/components/dropdownMenu';

export default class Add extends React.PureComponent{
  state={
    value: 0,
  }
  
  render() {
    const onChange = (e: any) => {
      this.setState({value: e.target.value})
    }
    const handleEmail = (value: any) => {
      console.log(`selected ${value}`);
    }
    const handleTags = () => {
      console.log()
    }

    const onFinish = async (values: any) => {
      console.log(values)
      const res = await addPaper(values);
      if (res.status) {
        message.success(res.msg);
        // window.location.href = '/edit';
      } else {
        message.error(res.msg);
      }
    };
  
    return(
      <Layout>
        <Navbar/>

        <Layout>
          <Head/>

          <div className="form" style={{ padding: 20, background: '#ececec' }}>
            <Card >
              <Form 
                // {...layout} 
                name="nest-messages" 
                onFinish={onFinish} 
              >

                <Form.Item 
                  name="paper" 
                  label="试卷名称" 
                  validateStatus="validating"
                  rules={[
                    {required: true}
                  ]}
                  className="paper"
                >
                  <Input />
                </Form.Item>

                <Form.Item name="level" label="试卷难度" className="level">
                  <Select>
                    <Select.Option value="简单" className="easy">简单</Select.Option>
                    <Select.Option value="中等" className="middle">中等</Select.Option>
                    <Select.Option value="困难" className="hard">困难</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item name="time" label="试卷起始时间" className="time">
                  <DatePicker.RangePicker />
                </Form.Item>
                
                <Form.Item name="tags" label="试卷标签" className="tags">
                  <Select 
                    mode="tags" 
                    style={{ width: '100%' }} 
                    placeholder="录入试卷标签" 
                    onChange={handleTags}
                  >
                    {
                      TAGS.map(x => (
                        <Select.Option key={x.key} value={x.value}>{x.value}</Select.Option>
                      ))
                    }
                  </Select>
                </Form.Item>

                <Form.Item name="candidate" label="邀请候选人答卷（选填）">
                  <Select 
                    mode="tags" 
                    style={{ width: '100%' }} 
                    placeholder="输入想邀请的候选人的邮箱账号" 
                    onChange={handleEmail}
                  >
                    {/* <Select.Option key={i.toString(36) + i}></Select.Option> */}
                  </Select>
                </Form.Item>

                <Form.Item  name="check"  label="试卷过期之后候选人/所有人是否可查看">
                  <Radio.Group onChange={onChange} value={this.state.value}>
                    <Radio value={1}>是</Radio>
                    <Radio value={0}>否</Radio>
                  </Radio.Group>
                </Form.Item>

                <CardPaper/>
                <Form.List name="names">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field, index) => (
                        <Form.Item key={field.key}>
                          <CardPaper/>
                          <MinusCircleOutlined
                            className="dynamic-delete-button"
                            onClick={() => remove(field.name)}
                          />
                        </Form.Item>
                      ))}

                      <Form.Item>
                        <Button
                          type="dashed"
                          onClick={() => add()}
                          style={{ width: '60%', marginTop: '20px' }}
                          icon={<PlusOutlined />}
                        >
                          新增面试题
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>

                <Form.Item wrapperCol={{ offset: 8 }}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </Form.Item>

              </Form>
            </Card>
          </div>

          <Foot/>
        </Layout>
      </Layout>
    )
  }
}