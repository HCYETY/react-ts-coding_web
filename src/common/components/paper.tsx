import React from 'react';
import {
  Form,
  Input,
  DatePicker,
  Radio,
  Select,
  Col,
  Row,
  Dropdown,
  Menu,
  Button,
  InputNumber,
  Space,
  Divider,
} from 'antd';
import { search } from 'api/modules/candidate/interface';
import { getHour, getMinute } from 'common/utils';

export default class Paper extends React.Component {

  state = {
    candidateEmail: [] = [],
    setTime: false,
    hour: 0,
    minute: 0,
  }

  onFocus = async () => {
    const res = await search();
    const getInform = res.data.show;
    const arr: any[] = [];
    getInform.map((item: { email: string; }) => {
      // 数组去重
      if (arr.indexOf(item.email) === -1) {
        arr.push(item.email);
      }
    })
    this.setState({ candidateEmail: arr });
  }

  handleTime = () => {
    this.state.setTime === false ? this.setState({ setTime: true }) : this.setState({ setTime: false });
  }

  getHours = (e: any) => {
    console.log('ddddddddddd')
    this.setState({ hour: e.key });
  }
  getMinutes = (e: any) => {
    this.setState({ minute: e.key });
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
    // const disabledDate = (current: number) => {
    //   return current < moment().startOf('day');
    // }
    console.log(this.state.hour, this.state.minute)
  
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
            // disabledDate={ disabledDate }
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
            format="YYYY-MM-DD HH:mm" 
            placeholder="选择试卷截止日期"
          />
        </Form.Item>

        <Form.Item 
          name="answerTime" 
          key="answerTime"
          label="试卷作答时长" 
          className="time"
        >
          {
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
            // <Space className="choice-time" split={<Divider type="vertical" />}>
            //   <Dropdown overlay={ hour } placement="bottomLeft" trigger={['click']}>
            //     <InputNumber min={0} max={23} addonAfter="小时"></InputNumber>
            //     <Input width='15' min={0} max={23} value={ this.state.hour }></Input>
            //   </Dropdown>
            //   <Dropdown overlay={ minute } placement="bottomLeft" trigger={['click']}>
            //     <InputNumber min={0} max={59} addonAfter="分钟"></InputNumber>
            //     <Input width='15' min={0} max={59} value={ this.state.minute }></Input>
            //   </Dropdown>
            //   <Button onClick={ this.handleTime } className="choice-time-button">快速选择</Button>
            // </Space >

            <Space className="choice-time" split={<Divider type="vertical" />}>
              <Select
                style={{ width: '100%' }}
                placeholder="单位：小时"
              >
                { hour }
              </Select>
              <Select
                style={{ width: '100%' }}
                placeholder="单位：分钟"
              >
                { minute }
              </Select>
            </Space>
          }
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