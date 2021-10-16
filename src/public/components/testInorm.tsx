import React from 'react';
import { Form, Input, Select, InputNumber, } from 'antd';
import Wangeditor from './wangeditor';
import { TAGS } from '../const';

export default class testInform extends React.Component{
  render() {
    return(
      <Form

      >
        <Form.Item 
            name="testName" 
            key="testName"
            label="试题名" 
            rules={[
              { required: true }
            ]}
          >
            <Input/>
          </Form.Item>

          <Form.Item 
            name="test" 
            key="test"
            label="题目" 
            // rules={[
            //   { required: true }
            // ]}
          >
            <Wangeditor/>
          </Form.Item>

          <Form.Item 
            name="answer" 
            key="answer"
            label="答案" 
            rules={[
              { required: true }
            ]}
          >
            <Input.TextArea />
          </Form.Item>
        
          <Form.Item 
            name="level" 
            key="level"
            label="难易度" 
            rules={[
              { required: true }
            ]}
          >
            <Select  style={{ width: 120 }}>
              <Select.Option value="简单" key="easy">简单</Select.Option>
              <Select.Option value="中等" key="middle">中等</Select.Option>
              <Select.Option value="困难" key="hard">困难</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item 
            name="tags" 
            key="tags"
            label="标签" 
            rules={[
              { required: true }
            ]}
          >
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Please select"
            >
              {
                TAGS.map((arr: any) => {
                  return(
                    <Select.Option key={ arr.key } value={ arr.value }>{ arr.value }</Select.Option>
                  )
                })
              }
            </Select>
          </Form.Item>
        
          <Form.Item 
            name="point" 
            key="point"
            label="分数" 
            rules={[
              { required: true }
            ]}
          >
            <InputNumber min={0}/>
          </Form.Item>
        </Form>
    )
  }
}