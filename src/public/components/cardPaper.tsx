import React from 'react';
import { Form, Input, Card } from 'antd';
import 'style/components.css'

export default class CardPaper extends React.PureComponent{
  render() {
    return(
      <Card type="inner" title="面试题" extra={<a href="#">More</a>} className="innerCard">
        <Form.Item 
          label="题目"
          rules={[
            {required: true}
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item 
          name={['user', 'introduction']} 
          label="试题描述"
          rules={[
            {required: true}
          ]}
        >
          <Input.TextArea />
        </Form.Item>
      </Card>
    )
  }
}