import React from 'react';
import { Form, Input, Card } from 'antd';
import Wangeditor from 'public/components/wangeditor';
import 'style/components.css';

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
          rules={[
            {required: true}
          ]}
        >
          <Wangeditor />
        </Form.Item>
      </Card>
    )
  }
}