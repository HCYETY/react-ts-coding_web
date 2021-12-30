import React from 'react';
import {
  Form,
  Input,
  DatePicker,
  Radio,
  Select,
  Dropdown,
  Menu,
  Button,
  Space,
} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';

import { search } from 'api/modules/candidate';
import { searchEmail } from 'api/modules/user';
import { getHour, getMinute } from 'common/utils';

interface get{
  getHour?: any,
  getMinute?: any,
}

export default class Paper extends React.Component<get, any> {

  state = {
    candidateEmail: [] = [],
    setTime: false,
    hour: 0,
    minute: 0,
  }

  // 点击“邀请候选人”之后发送请求的函数
  onFocus = async () => {
    const res = await searchEmail({ interviewer: false });
    const getInform = res.data.ret;
    const arr: any[] = [];
    getInform.map((item: { email: string; }) => {
      // 数组去重
      if (arr.indexOf(item.email) === -1) {
        arr.push(item.email);
      }
    })
    this.setState({ candidateEmail: arr });
  }

  // 点击“作答时长”后的“选择时间”按钮调用的函数
  handleTime = () => {
    this.state.setTime === false ? this.setState({ setTime: true }) : this.setState({ setTime: false });
  }
  
  // 选中下拉菜单的值后调用函数，并传递对应值给父组件
  getHours = (e: any) => {
    this.setState({ hour: e.key });
    this.props.getHour(e.key);
  }
  getMinutes = (e: any) => {
    this.setState({ minute: e.key });
    this.props.getMinute(e.key);
  }


  // 不可选日期，限制“试卷截止日期”的选择范围
  range = (start: any, end: any) => {
    const result = [];
    for (let i = start; i < end; i += 1) {
      result.push(i);
    }
    return result;
  };
  disabledDate = (current: any) => {
    return current && current < moment().endOf('day');
  }
  disabledDateTime = () => {
    return {
      disabledHours: () => this.range(0, 24).splice(4, 20),
      disabledMinutes: () => this.range(30, 60),
      disabledSeconds: () => [55, 56],
    };
  }

  render() {
    const { candidateEmail, setTime, } = this.state;
    const hours = getHour(),  minutes = getMinute(); 
    const hour = (
      <Menu >
        {hours.map(item => {
          return(
            <Menu.Item onClick={ this.getHours } key={ item }> { item } </Menu.Item>
          )
        })}
      </Menu>
    )
    const minute = (
      <Menu >
        {minutes.map(item => {
          return(
            <Menu.Item onClick={ this.getMinutes } key={ item }> { item } </Menu.Item>
          )
        })}
      </Menu>
    )
  
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
          <Input placeholder="添加本试卷的名称"/>
        </Form.Item>

        <Form.Item
          name="paperDescription" 
          key="paperDescription"
          label="试卷描述" 
          className="paperDescription"
        >
          <Input.TextArea placeholder="添加本试卷的相关描述"/>
        </Form.Item>

        <Form.Item 
          name="timeBegin" 
          key="timeBegin"
          label="试卷开放时间" 
          className="time"
          >
          <DatePicker 
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm" 
            placeholder="选择试卷开放日期"
            locale={ locale }
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
            showNow={ true }
            disabledDate={ this.disabledDate }
            format="YYYY-MM-DD HH:mm" 
            placeholder="选择试卷截止日期"
            locale={ locale }
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
            {/* <Radio.Button onClick={ this.handleTime } className="choice-time-button">手动设置</Radio.Button>  */}
          </Radio.Group>
          {/* {
            setTime === false ? 
            <Radio.Group  buttonStyle="solid">
              <Radio.Button value="30分钟">30分钟</Radio.Button>
              <Radio.Button value="45分钟">45分钟</Radio.Button>
              <Radio.Button value="1小时">1小时</Radio.Button>
              <Radio.Button value="1小时30分钟">1小时30分钟</Radio.Button>
              <Radio.Button value="2小时">2小时</Radio.Button>
              <Radio.Button value="2小时30分钟">2小时30分钟</Radio.Button>
              <Radio.Button onClick={ this.handleTime } className="choice-time-button">手动设置</Radio.Button> 
            </Radio.Group> :
            <Space>
                <Dropdown overlay={ hour } overlayStyle={{ width: '20px', height: '20px',  }} placement="bottomLeft" trigger={['click']}>
                  <Input min={0} max={23} value={ this.state.hour } suffix="小时"></Input>
                </Dropdown>
                <Dropdown overlay={ minute } overlayStyle={{ width: '20', height: '20',  }} placement="bottomLeft" trigger={['click']}>
                  <Input min={0} max={55} value={ this.state.minute } suffix="分钟"></Input>
                </Dropdown>
                <Button onClick={ this.handleTime } className="choice-time-button">快速选择</Button>
            </Space >
          } */}
        </Form.Item>


        <Form.Item 
          name="candidate" 
          key="candidate"
          label="邀请候选人答卷（选填）"
        >
          <Select
            showSearch
            mode="multiple"
            placeholder="输入想邀请的候选人的邮箱账号"
            // optionFilterProp="children"
            onFocus={ this.onFocus }
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {
              candidateEmail.map((item: any) => {
                return(
                  <Select.Option value={ item } key={ item }>{ item }</Select.Option>
                )
              })
            }
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