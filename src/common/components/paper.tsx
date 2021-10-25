import React from 'react';
import {
  Form,
  Input,
  DatePicker,
  Radio,
  Select,
} from 'antd';

export default class Paper extends React.Component {



  render() {

    return(
      <>
        <Form.Item 
          name="paper" 
          key="paper"
          label="试卷名称" 
          rules={[
            { required: true }
          ]}
          className="paper"
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="paperDescription" 
          key="paperDescription"
          label="试卷描述" 
          className="paperDescription"
        >
          <Input.TextArea/>
        </Form.Item>

        <Form.Item 
          name="timeBegin" 
          key="timeBegin"
          label="试卷开始时间" 
          className="time"
          >
          <DatePicker 
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm" 
          />
        </Form.Item>

        <Form.Item 
          name="timeEnd" 
          key="timeEnd"
          label="试卷截止时间" 
          className="time"
          >
          <DatePicker 
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm" 
          />
        </Form.Item>

        <Form.Item 
          name="answerTime" 
          key="answerTime"
          label="试卷作答时长" 
          className="time"
        >
          <Radio.Group  buttonStyle="solid">
            <Radio.Button value="30分钟">30分钟</Radio.Button>
            <Radio.Button value="45分钟">45分钟</Radio.Button>
            <Radio.Button value="1小时">1小时</Radio.Button>
            <Radio.Button value="1小时30分钟">1小时30分钟</Radio.Button>
            <Radio.Button value="2小时">2小时</Radio.Button>
            <Radio.Button value="2小时30分钟">2小时30分钟</Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item 
          name="candidate" 
          key="candidate"
          label="邀请候选人答卷（选填）"
        >
          <Select 
            mode="tags" 
            style={{ width: '100%' }} 
            placeholder="输入想邀请的候选人的邮箱账号" 
          >
            {/* <Select.Option key={i.toString(36) + i}></Select.Option> */}
          </Select>
        </Form.Item>

        <Form.Item  
          name="check"  
          key="check"
          label="试卷过期之后候选人/所有人是否可查看"
        >
          <Radio.Group >
            <Radio value={ true } key="yes">是</Radio>
            <Radio value={ false } key="no">否</Radio>
          </Radio.Group>
        </Form.Item>
      </>
    )
  }
}