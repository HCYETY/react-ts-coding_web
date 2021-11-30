import React from 'react';
import { Link } from 'react-router-dom';
import {
  Col,
  Table,
  Tag,
  Button,
  Form,
  Select,
  Modal,
  FormInstance,
  DatePicker,
  message,
} from 'antd';
import {
  FileSearchOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/zh-cn';
import locale from 'antd/es/date-picker/locale/zh_CN';
import copy from 'copy-to-clipboard';

import Navbar from 'common/components/navbar';
import { createInterview, findInterview } from 'api/modules/interview';
import { searchEmail } from 'api/modules/user';
import { findEmail, transTime } from 'src/common/utils';

interface Prop {
  interviewer: string[];
  candidate: string;
  interview_begin: string;
  interviewer_room: number;
  interviewer_link: string;
  candidate_link: string;
}

interface informObj {

}
interface State {
  visible: boolean;
  value: boolean;
  interviewerArr: string[];
  candidateArr: string[];
  informArr: informObj[];
}

export default class interviewManage extends React.Component<Prop, State> {

  formRef = React.createRef<FormInstance>();
  
  state = {
    visible: false,
    value: true,
    interviewerArr: [],
    candidateArr: [],
    informArr: [],
  }

  componentDidMount() {
    this.renderInform();
  }

  // 渲染表格信息
  renderInform = () => {
    findInterview().then(result => {
      const arr = result.data.ret.slice();
      arr.map((item: { interview_begin_time: string; }) => {
        const time = transTime(+item.interview_begin_time);
        item.interview_begin_time = time;
      })
      this.setState({ informArr: arr });
    })
  }

  // 创建面试间，即打开对话框时请求所有面试官和候选人的邮箱
  showModal = async () => {
    const res = await findEmail();
    const { allCandidate, allInterview } = res;
    this.setState({ visible: true, candidateArr: allCandidate, interviewerArr: allInterview });
  }
  // 点击“创建”时的回调函数
  handelModal = () => {
    const value = this.formRef.current.getFieldsValue();
    value.linkPath = window.location.origin;
    createInterview({ inform: value }).then(res => {
      // if (res.data.status === true) {
        message.success(res.msg);
        this.setState({ visible: false });
        this.renderInform();
      // }
    })
  }
  // 关闭对话框
  cancelModal = () => {
    this.setState({ visible: false });
  }

  // 禁止日期选择器选择当时之前的时间作为面试开始时间
  disabledDate = (current: any) => {
    return current && current < moment().endOf('day');
  }

  render() {
    const { visible, value, candidateArr, interviewerArr, informArr } = this.state;
    const interviewArr = [
      { 
        title: '面试官',
        dataIndex: 'interviewer',
        key: 'interviewer',
        render: (arr: any) => (
          <span>
            { arr.map((item: string) => {
                return (
                  <Col>
                    <Tag color="skyblue" key={ item }> { item } </Tag>
                  </Col>
                );
              }) }
          </span>
        ),
      },
      { title: '候选人', dataIndex: 'candidate', key: 'candidate' },
      { title: '面试时间', dataIndex: 'interview_begin_time', key: 'interview_begin_time' },
      { title: '面试房间号', dataIndex: 'interview_room', key: 'interview_room' },
      { 
        title: '面试官面试房间链接', 
        dataIdex: 'interviewer_link', 
        key: 'interviewer_link',
        render: (arr: any) => (
          <div>
            <a onClick={ () => {
              copy(`${ window.location.origin }${ arr['interviewer_link'] }`)
              message.success('复制成功：面试官面试房间链接'); 
            }}>
              <FileSearchOutlined />点击复制
            </a>
          </div>
        )
      },
      { 
        title: '候选人面试房间链接', 
        dataIdex: 'candidate_link', 
        key: 'candidate_link',
        render: (arr: any) => (
          <div>
            <a onClick={ () => {
              copy(`${ window.location.origin }${ arr['candidate_link'] }`);
              message.success('复制成功：候选人面试房间链接');
            }}>
              <FileSearchOutlined />点击复制
            </a>
          </div>
        )
      },
    ]

    return(
      <div className="site-layout">
        <Navbar/>
        <Button onClick={ this.showModal } type="primary">添加新面试</Button>

        <Table
          columns={ interviewArr }
          dataSource={ informArr }
        />

        <Modal 
          title="创建面试间"
          visible={ visible } 
          onOk={ this.handelModal } 
          onCancel={ this.cancelModal }
          okText="确定创建"
          cancelText="取消"
        >
          <Form name="form_in_modal" ref={ this.formRef }>
            <Form.Item 
              label="面试官邮箱" 
              name="interviewer" 
              key="interviewer"
              rules={[
                { required: true }
              ]}
            >
              <Select
                showSearch
                mode="multiple"
                placeholder="选择参与面试的面试官邮箱账号"
              >
                {
                  interviewerArr.map((item: any) => {
                    return(
                      <Select.Option value={ item } key={ item }>{ item }</Select.Option>
                    )
                  })
                }
              </Select>
            </Form.Item>
            
            <Form.Item 
              label="候选人邮箱" 
              name="candidate" 
              key="candidate"
              rules={[
                { required: true }
              ]}
            >
              <Select showSearch placeholder="选择参与面试的候选人邮箱账号" >
                {
                  candidateArr.map((item: any) => {
                    return(
                      <Select.Option value={ item } key={ item }>{ item }</Select.Option>
                    )
                  })
                }
              </Select>
            </Form.Item>

            <Form.Item 
              label="面试开始时间" 
              name="interview_begin_time" 
              key="interview_begin_time"
              rules={[
                { required: true }
              ]}
            >
              <DatePicker 
                showTime={{ format: 'HH:mm' }}
                showNow={ true }
                disabledDate={ this.disabledDate }
                format="YYYY-MM-DD HH:mm" 
                placeholder="选择面试开始时间"
                locale={ locale }
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}