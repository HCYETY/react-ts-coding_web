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

import { addPaper, addTest } from 'src/api/modules/interface';
import Navbar from 'public/components/navbar';
import Head from 'public/components/header';
import Foot from 'public/components/footer';
import Tabler from 'public/components/tabler';
import Paper from 'public/components/paper';

export default class Add extends React.Component<any, any> {
  modalRef = React.createRef<FormInstance>();

  state={
    visible: false,            // 控制侧边抽屉
    button: true,               // 控制【右上角“下一步”】按钮样式
    tableArr: [] = [],          // 存储试题信息
    paperKey: '',               // 存储试卷名
  }

  // 抽屉提交试卷信息至数据库
  submitPaper = async (values: any) => {
    console.log(values)
    this.setState({ button: false, visible: false, paperKey: values.paper });
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
          <Head/>

          <div 
            className="form"
            style={{ padding: '20px', borderColor: '#ececec' }}
          >

            <Button 
              className="form-button-right"
              type="primary" 
              onClick={ this.showDrawer } 
              icon={ button === true ? <RightOutlined /> : <EditOutlined /> }
              disabled={ tableArr.length > 0 ? false : true }
              style={{ margin: '0px 10px 10px 0px', float: 'right' }}
            >
              { button === true ? '下一步' : '查看试卷信息' }
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