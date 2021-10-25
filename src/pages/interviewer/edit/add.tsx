import React from 'react';
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
  Tag, 
} from 'antd';
import { 
  RightOutlined, 
  ProfileOutlined, 
  EditOutlined,
} from '@ant-design/icons';
import { FormInstance } from 'antd/es/form';

import { addPaper, addTest } from 'api/modules/interface';
import Navbar from 'common/components/navbar';
import Tabler from 'common/components/tabler';
import Paper from 'common/components/paper';
import { EDIT } from 'common/const';
import { getCookie } from 'src/common/utils';

export default class Add extends React.Component<any, any> {
  modalRef = React.createRef<FormInstance>();

  state={
    visible: false,            // 控制侧边抽屉
    button: true,               // 控制【右上角“下一步”】按钮样式
    tableArr: [] = [],          // 存储试题信息
    paper: '',               // 存储试卷名
    candidateEmail: [] = [],
    watch: true,
  }

  // 抽屉提交试卷信息至数据库
  submitPaper = async (values: any) => {
    const cookie = getCookie();
    const obj = { cookie, values };
    const res = await addPaper(obj);
    if (res.data.status) {
      message.success(res.msg);
      this.setState({ 
        button: false, 
        visible: false, 
        paper: values.paper, 
        candidateEmail: values.candidate, 
        watch: values.check 
      });
    } else {
      message.error(res.msg);
    }
  };
  // 表格提交试题信息至数据库
  submitTest = async () => {
    const { tableArr, paper, watch, candidateEmail } = this.state;
    // const req: string[] = tableArr.length > 0 ? tableArr : [];
    const obj = {
      data: tableArr,
      paper,
      watch,
      candidateEmail
    }
    const res = await addTest(obj);
    if (res.data.status) {
      message.success(res.msg);
      window.location.href = EDIT;
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
  // 获取 tabler 组件的表格数据
  getTest = (val: any) => {
    this.setState({ tableArr: val });
  }


  render() {
    const { button, visible, tableArr, } = this.state;
  
    return(
      <Layout>
        <Navbar/>

        <Layout>
          <div 
            className="form"
            style={{ padding: '20px', borderColor: '#ececec' }}
          >

            <Button 
              className="form-button-right"
              type="primary" 
              onClick={ this.showDrawer } 
              icon={ <RightOutlined /> }
              disabled={ button === true ? false : true }
              style={{ margin: '0px 10px 10px 0px', float: 'right' }}
            >
              下一步
            </Button>

            <Button 
              className="form-button-right"
              type="primary" 
              onClick={ this.submitTest } 
              icon={ <ProfileOutlined /> }
              disabled={ button === true ? true : false }
              style={{ margin: '0px 10px 10px 0px', float: 'right' }}
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

                <Paper />

                <Form.Item wrapperCol={{ offset: 8 }}>
                  <Button type="primary" htmlType="submit">
                    提交试卷信息
                  </Button>
                </Form.Item>
              </Form>
            </Drawer>

            <Tabler getTest={ this.getTest.bind(this) }/>
          </div>
        </Layout>
      </Layout>
    )
  }
}