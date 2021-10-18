import React from 'react';
import { 
  Layout, 
  Form, 
  Input, 
  InputNumber,
  Select, 
  Button, 
  DatePicker, 
  Radio, 
  message, 
  Drawer, 
  Space,
  Tag,
  Table,
  Popconfirm,
  Modal,
} from 'antd';
import { 
  PlusOutlined, 
  CompressOutlined, 
  RightOutlined, 
  ProfileOutlined, 
  DeleteOutlined, 
  EditOutlined,
} from '@ant-design/icons';
import { FormInstance } from 'antd/es/form';
import PubSub from 'pubsub-js';

import 'style/add.less';
import 'style/wangeditor.css';
import { addPaper, addTest } from 'src/api/modules/interface';
import { TAGS } from 'public/const';
import Navbar from 'public/components/navbar';
import Head from 'public/components/header';
import Foot from 'public/components/footer';
import Wangeditor from 'public/components/wangeditor';
import TestInform from 'public/components/testInorm';

export default class Add extends React.Component{
  formRef = React.createRef<FormInstance>();
  modalRef = React.createRef<FormInstance>();

  state={
    value: 0,                   // 更新单选框的值
    visible: false,             // 控制底下抽屉
    visible2: false,            // 控制侧边抽屉
    visible3: false,            // 控制弹出层
    button: true,               // 控制按钮样式
    tableArr: [] = [],          // 存储试题信息
    testInform: '',             // 存储富文本内容
    paperKey: '',               // 存储试卷名
    selectedRowKeys: [] = [],   // 获取选中哪一个试题
  }

  // 订阅消息，获取 wangeditor 组件中富文本的内容
  token: string | PubSubJS.SubscriptionListener<any> = null;
  componentDidMount() {
    this.token = PubSub.subscribe('testInform', (_, data) => {
      this.setState({ testInform: data.test });
    })
  }
  componentWillUnmount() {
    PubSub.unsubscribe(this.token);
  }
  
  // 获取单选框的值，更新状态
  onChange = (e: any) => {
    this.setState({value: e.target.value})
  }

  // 抽屉提交试卷信息至数据库
  submitPaper = async (values: any) => {
    console.log(values)
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
    console.log('添加试题信息')
    const req: string[] = this.state.tableArr.length > 0 ? this.state.tableArr : [];
    if (req[0] !== this.state.paperKey) {
      req.unshift(this.state.paperKey);
    }
    const res = await addTest(req);
    if (res.data.status) {
      message.success(res.msg);
      // window.location.href = '/edit';
    } else {
      message.error(res.msg);
    }
  }
  // 将添加的试题加载到 testArr 数组中，在调用接口的时候作为参数传递
  saveTest = async (values: any) => {
    const arr: any[] = this.state.tableArr.length > 0 ? this.state.tableArr : [];
    const obj = {
      key: values.testName,
      // num: this.state.id,
      testName: values.testName,
      description: this.state.testInform,
      answer: values.answer,
      level: values.level,
      tags: values.tags,
      point: values.point,
    }
    arr.push(obj);
    this.setState({ tableArr: arr, visible: false, });
  }
  // 从 testArr 数组中删除试题
  deleteTest = () => {
    const arr = this.state.selectedRowKeys;
    const ret = this.state.tableArr;
    if (arr.length !== 0) {
      for (let number of arr) {
        ret.forEach((item, index, arr) => {
          if (item['key'] === number) {
            ret.splice(index, 1);
          }
        })
      }
      this.setState({ tableArr: ret });
    }
  }
  // 表格复选框的选择情况
  onSelectChange = (selectedRowKeys: any) => {
    this.setState({ selectedRowKeys });
  };
  // 修改试题
  handleModal = (record: any) => {
    // 设置弹出层
    this.setState({ visible: true });
    // 表单重置
    this.formRef.current.resetFields();
    // 获取 Form 的 ref
    const form = this.formRef.current;
    // 要渲染的数据
    let singleData = null;  
    this.state.tableArr.forEach(item => {
      if (item && item['testName'] === record) {
        singleData = item;
        return singleData;
      }
    })
    form.setFieldsValue(singleData);
  };
  hideModal = () => {
    this.setState({ visible: false });
  };
  modifyTest = () => {
    this.setState({ visible: false });

  }
 
  
  // 两个抽屉的开关
  // “添加试卷”的抽屉
  showDrawer = () => {
    this.setState({ visible: true });
    // 添加新试卷时要将表单数据清空
    setTimeout(() => {
      this.formRef.current.resetFields();
    }, 0);
  };
  onClose = () => {
    this.setState({ visible: false });
  };
  // “完善试卷信息”的抽屉
  showDrawer2 = async () => {
    this.setState({ visible2: true });
  };
  onClose2 = () => {
    this.setState({ visible2: false });
  };


  render() {
    const { button, value, visible, visible2, visible3, tableArr, selectedRowKeys, } = this.state;
    const rowSelection = {
      onChange: this.onSelectChange,
      selectedRowKeys,
    };
    const columns = [
      // { title: '题号', dataIndex: 'num', key: 'num' },
      { title: '试题名', dataIndex: 'testName', key: 'testName' },
      {
        title: '标签', 
        dataIndex: 'tags', 
        key: 'tags',
        render: (tags: [string]) => (
          <span>
            {tags && tags.map(tag => {
              let color = tag.length > 2 ? 'geekblue' : 'green';
              if (tag === 'loser') {
                color = 'volcano';
              }
              return (
                <Tag color={color} key={tag}>
                  {tag}
                </Tag>
              );
            })}
          </span>
        )
      },
      { title: '难易度', key: 'level', dataIndex: 'level' },
      { title: '分数', dataIndex: 'point', key: 'point' },
      {
        title: '操作',
        key: 'action',
        render: (_: any, record: { key: React.Key }) => {
          return(
            <Space size="middle">
              <Button 
                className="site-layout-content-button" 
                icon={ <EditOutlined/> }
                onClick={ () => { this.handleModal(record.key) }}
              >
                修改试题
              </Button>
            </Space>
          )
        },
      },
    ];
  
    return(
      <Layout>
        <Navbar/>

        <Layout>
          <Head/>

          <div className="form">
            <Button 
              className="form-button-left" 
              type="primary" 
              onClick={ this.showDrawer } 
              icon={ <PlusOutlined /> }
              >
              添加试题
            </Button>

            <Button 
              className="form-button-left2" 
              type="primary" 
              onClick={ this.deleteTest } 
              icon={ <DeleteOutlined /> }
            >
              删除试题
            </Button>

            <Button 
              className="form-button-right"
              type="primary" 
              onClick={ this.showDrawer2 } 
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



            <Modal
              title="修改试卷信息"
              visible={ visible3 }
              onOk={ this.modifyTest }
              onCancel={ this.hideModal }
              okText="确认修改"
              cancelText="取消"
            >
              <Form
                ref={this.modalRef}
              >
                <Form.Item 
                  name="testName" 
                  key="testName"
                  label="试题名" 
                  rules={[
                    { required: true }
                  ]}
                >
                  <Input/>
                </Form.Item>

                <Form.Item 
                  name="test" 
                  key="test"
                  label="题目" 
                  // rules={[
                  //   { required: true }
                  // ]}
                >
                  {/* <Wangeditor/> */}
                </Form.Item>

                <Form.Item 
                  name="answer" 
                  key="answer"
                  label="答案" 
                  rules={[
                    { required: true }
                  ]}
                >
                  <Input.TextArea />
                </Form.Item>
              
                <Form.Item 
                  name="level" 
                  key="level"
                  label="难易度" 
                  rules={[
                    { required: true }
                  ]}
                >
                  <Select  style={{ width: 120 }}>
                    <Select.Option value="简单" key="easy">简单</Select.Option>
                    <Select.Option value="中等" key="middle">中等</Select.Option>
                    <Select.Option value="困难" key="hard">困难</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item 
                  name="tags" 
                  key="tags"
                  label="标签" 
                  rules={[
                    { required: true }
                  ]}
                >
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: '100%' }}
                    placeholder="Please select"
                  >
                    {
                      TAGS.map((arr: any) => {
                        return(
                          <Select.Option key={ arr.key } value={ arr.value }>{ arr.value }</Select.Option>
                        )
                      })
                    }
                  </Select>
                </Form.Item>
              
                <Form.Item 
                  name="point" 
                  key="point"
                  label="分数" 
                  rules={[
                    { required: true }
                  ]}
                >
                  <InputNumber min={0}/>
                </Form.Item>
              </Form>
            </Modal>



            <Drawer
              title="编程题"
              height={620}
              placement="bottom"
              closable={true}
              onClose={ this.onClose }
              visible={ visible }
              bodyStyle={{ paddingBottom: 80 }}
              // extra={
              //   <Space>
              //     {/* icon={ < />} */}
              //     <Button icon={ <CompressOutlined /> }>全屏</Button>
              //     <Button onClick={ this.onClose }>取消</Button>
              //     <Button onClick={ this.saveTest } type="primary">
              //       保存
              //     </Button>
              //   </Space>
              // }
            >
              <Form 
                onFinish={ this.saveTest }
                ref={ this.formRef }
              >
                {/* <Form.Item 
                  name="num" 
                  key="num"
                  label="题号" 
                  rules={[
                    { required: true }
                  ]}
                >
                  <InputNumber min={1}/>
                </Form.Item> */}

                <Form.Item 
                  name="testName" 
                  key="testName"
                  label="试题名" 
                  rules={[
                    { required: true }
                  ]}
                >
                  <Input/>
                </Form.Item>

                <Form.Item 
                  name="test" 
                  key="test"
                  label="题目" 
                  // rules={[
                  //   { required: true }
                  // ]}
                >
                  <Wangeditor/>
                </Form.Item>

                <Form.Item 
                  name="answer" 
                  key="answer"
                  label="答案" 
                  rules={[
                    { required: true }
                  ]}
                >
                  <Input.TextArea />
                </Form.Item>
              
                <Form.Item 
                  name="level" 
                  key="level"
                  label="难易度" 
                  rules={[
                    { required: true }
                  ]}
                >
                  <Select  style={{ width: 120 }}>
                    <Select.Option value="简单" key="easy">简单</Select.Option>
                    <Select.Option value="中等" key="middle">中等</Select.Option>
                    <Select.Option value="困难" key="hard">困难</Select.Option>
                  </Select>
                </Form.Item>

                <Form.Item 
                  name="tags" 
                  key="tags"
                  label="标签" 
                  rules={[
                    { required: true }
                  ]}
                >
                  <Select
                    mode="multiple"
                    allowClear
                    style={{ width: '100%' }}
                    placeholder="Please select"
                  >
                    {
                      TAGS.map((arr: any) => {
                        return(
                          <Select.Option key={ arr.key } value={ arr.value }>{ arr.value }</Select.Option>
                        )
                      })
                    }
                  </Select>
                </Form.Item>
              
                <Form.Item 
                  name="point" 
                  key="point"
                  label="分数" 
                  rules={[
                    { required: true }
                  ]}
                >
                  <InputNumber min={0}/>
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    // onClick={ this.handleReset }
                  >
                    添加试卷信息
                  </Button>
                </Form.Item>
              </Form>
            </Drawer>


            <Drawer
              title="完善试卷信息"
              width={ 720 }
              onClose={ this.onClose2 } // 点击遮罩层或右上角叉或取消按钮的回调
              visible={ visible2 } // Drawer 是否可见
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




            <Table 
              columns={ columns } 
              dataSource={ [...tableArr] } 
              expandable={{
                expandedRowRender: record => <p>{ record['description'] }</p>,
                rowExpandable: () => true,
              }}
              rowSelection={ rowSelection } 
              bordered
            />
          </div>

          <Foot/>
        </Layout>
      </Layout>
    )
  }
}