import React, { LegacyRef } from 'react';
import { 
  Layout, 
  Form, 
  Input, 
  Select, 
  Button, 
  DatePicker, 
  Radio, 
  message, 
  Drawer, 
} from 'antd';
import { 
  RightOutlined, 
  ProfileOutlined, 
  EditOutlined,
} from '@ant-design/icons';
import { FormInstance } from 'antd/es/form';

import 'style/add.less';
import { addPaper, addTest } from 'src/api/modules/interface';
import Navbar from 'public/components/navbar';
import Head from 'public/components/header';
import Foot from 'public/components/footer';
import Tabler from 'public/components/tabler';

export default class Add extends React.Component<any, any> {
  modalRef = React.createRef<FormInstance>();
  // testRef: LegacyRef<T> | undefined;

  state={
    value: 0,                   // 更新单选框的值
    visible: false,            // 控制侧边抽屉
    button: true,               // 控制【右上角“下一步”】按钮样式
    tableArr: [] = [],          // 存储试题信息
    paperKey: '',               // 存储试卷名
  }

  // 获取单选框的值，更新状态
  onChange = (e: any) => {
    this.setState({value: e.target.value})
  }


  // 抽屉提交试卷信息至数据库
  submitPaper = async (values: any) => {
    this.setState({ button: false, visible2: false, paperKey: values.paper });
    const res = await addPaper(values);
    if (res.data.status) {
      message.success(res.msg);
    } else {
      message.error(res.msg);
    }
  };
  // 表格提交试题信息至数据库
  submitTest = async () => {
    const req: string[] = this.state.tableArr.length > 0 ? this.state.tableArr : [];
    if (req[0] !== this.state.paperKey) {
      req.unshift(this.state.paperKey);
    }
    const res = await addTest(req);
    if (res.data.status) {
      message.success(res.msg);
      window.location.href = '/edit';
    } else {
      message.error(res.msg);
    }
  }
  // “完善试卷信息”的抽屉
  showDrawer = async () => {
    this.setState({ visible: true });
  };
  onClose = () => {
    this.setState({ visible: false });
  };

  getTest = (val: any) => {
    this.setState({ tableArr: val });
  }


  render() {
    const { button, visible, tableArr, value, } = this.state;
  
    return(
      <Layout>
        <Navbar/>

        <Layout>
          <Head/>

          <div className="form">
          {/* <div className="form" addTest={ this.addTest.bind(this) }> */}

            <Button 
              className="form-button-right"
              type="primary" 
              onClick={ this.showDrawer } 
              icon={ button === true ? <RightOutlined /> : <EditOutlined /> }
              disabled={ tableArr.length > 0 ? false : true }
            >
              { button === true ? '下一步' : '查看试卷信息' }
            </Button>

            <Button 
              className="form-button-right"
              type="primary" 
              onClick={ this.submitTest } 
              icon={ <ProfileOutlined /> }
              disabled={ button === true ? true : false }
            >
              创建试卷
            </Button>

            <Drawer
              title="完善试卷信息"
              width={ 720 }
              onClose={ this.onClose } // 点击遮罩层或右上角叉或取消按钮的回调
              visible={ visible } // Drawer 是否可见
              bodyStyle={{ paddingBottom: 80 }}
            >
              <Form 
                name="nest-messages" 
                onFinish={ this.submitPaper } 
              >

                <Form.Item 
                  name="paper" 
                  key="paper"
                  label="试卷名称" 
                  validateStatus="validating"
                  rules={[
                    { required: true }
                  ]}
                  className="paper"
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="paperDescription" 
                  label="试卷描述" 
                  className="paperDescription"
                >
                  <Input.TextArea/>
                </Form.Item>

                <Form.Item 
                  name="time" 
                  key="time"
                  label="试卷起止时间" 
                  className="time"
                >
                  <DatePicker.RangePicker />
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

                <Form.Item  name="check"  label="试卷过期之后候选人/所有人是否可查看">
                  <Radio.Group onChange={ this.onChange } value={ value }>
                    <Radio value={1} key="yes">是</Radio>
                    <Radio value={0} key="no">否</Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8 }}>
                  <Button type="primary" htmlType="submit">
                    保存试卷信息
                  </Button>
                </Form.Item>
              </Form>
            </Drawer>

            <Tabler getTest={ this.getTest.bind(this) }/>
          </div>

          <Foot/>
        </Layout>
      </Layout>
    )
  }
}