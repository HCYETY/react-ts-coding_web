import React from 'react';
import { Form, Input, Select, DatePicker } from 'antd';
import 'style/basicInform.less';

export default class BasicInform extends React.PureComponent{
  render() {
    return(
      <Form>
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
          <DropdownMenu />
          {/* {
            TAGS.map(x => (
              <Select.Option value={x.value}>{x.value}</Select.Option>
            ))
          } */}
        </Form.Item>
      </Form>
    )
  }
}