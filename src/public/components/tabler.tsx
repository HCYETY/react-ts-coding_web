import React from 'react';
import { Table, Space, Button, Tag, InputNumber, Select, Form, Input, Drawer, message, } from 'antd';
import { 
  PlusOutlined, 
  DeleteOutlined, 
  EditOutlined,
} from '@ant-design/icons';
import { FormInstance } from 'antd/es/form';
import PubSub from 'pubsub-js';

import { TAGS } from 'public/const';
import { getTestNum } from 'public/utils';
import Wangeditor from 'public/components/wangeditor';
import Wangeditors from 'public/components/wangeditor2';

export default class Tabler extends React.Component<any, any> {
  formRef = React.createRef<FormInstance>();

  state={
    value: 0,
    button: true,
    visible: false,             // 控制底下抽屉
    selectedRowKeys: [] = [],   // 获取选中哪一个试题
    testInform: '',             // 存储富文本内容
    testAnswer: '',             // 存储富文本内容
    tableArr: [] = [],          // 存储试题信息
  }

  // 订阅消息，获取 wangeditor 组件中富文本的内容
  token: string | PubSubJS.SubscriptionListener<any> = null;
  token2: string | PubSubJS.SubscriptionListener<any> = null;
  componentDidMount() {
    this.token = PubSub.subscribe('testInform', (_, data) => {
      this.setState({ testInform: data.test });
    });
    this.token2 = PubSub.subscribe('testAnswer', (_, data) => {
      this.setState({ testAnswer: data.test });
    });
    // 在“修改试卷”中修改试题，获取从父组件传过来的已有试题
    if (this.props.getTests) {
      this.setState({ tableArr: this.props.getTests });
    }
  }
  componentWillUnmount() {
    PubSub.unsubscribe(this.token);
    PubSub.unsubscribe(this.token2);
  }

  // 表格复选框的选择情况
  onSelectChange = (selectedRowKeys: any) => {
    this.setState({ selectedRowKeys });
  };
  // 获取单选框的值，更新状态
  onChange = (e: any) => {
    this.setState({ value: e.target.value })
  }
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

  // 从 testArr 数组中删除试题
  deleteTest = (values: any) => {
    const arr = this.state.selectedRowKeys;
    const ret = this.state.tableArr;
    if (arr.length !== 0) {
      for (let number of arr) {
        ret.forEach((item, index) => {
          if (item['testName'] === number) {
            ret.splice(index, 1);
          }
        })
      }
    } else if (values) {
      ret.forEach((item, index) => {
        if (item['testName'] === values) {
          ret.splice(index, 1);
        }
      })
    }
    this.setState({ tableArr: ret });
    this.props.getTest(this.state.tableArr);
  }
  // 将添加的试题加载到 testArr 数组中，在调用接口的时候作为参数传递
  addTest = async (values: any) => {
    const { tableArr, testInform, testAnswer } = this.state;
    let sign = null;
    tableArr.map(item => {
      if (item['testName'] === values.testName) {
        sign = item['testName'];
        return;
      }
    })
    if (!sign) {
      const obj = {
        key: values.testName,
        num: getTestNum(),
        testName: values.testName,
        description: testInform,
        answer: testAnswer,
        level: values.level,
        tags: values.tags,
        point: values.point,
      }
      this.setState({ 
        tableArr: [...tableArr, obj],
        visible: false, 
      });
      this.props.getTest(this.state.tableArr);
    } else {
      message.error('添加的试题名不能重复');
    }
  }
  // 修改试题
  handleModal = (record: any) => {
    this.setState({ visible: true, button: false });
    setTimeout(() => {
      // 表单重置
      this.formRef.current.resetFields();
      // 获取 Form 的 ref
      const form = this.formRef.current;
      // 要渲染的数据
      this.state.tableArr.forEach(item => {
        if (item && item['testName'] === record) {
          form.setFieldsValue(item);
          return;
        }
      })
    })
  };
  modifyTest = async (values: any) => {
    const obj = {
      key: values.testName,
      num: getTestNum(),
      testName: values.testName,
      description: this.state.testInform,
      answer: this.state.testAnswer,
      tags: values.tags,
      level: values.level,
      point: values.point,
    }
    const tableArr = [...this.state.tableArr];
    this.setState({
      visible: false,
      button: true,
      tableArr: tableArr.map((item) => item['testName'] === values.testName ? obj  : item),
    })
    this.props.getTest(this.state.tableArr);
  }
  

  render() {
    const { selectedRowKeys, visible, button, tableArr, } = this.state;
    console.log('=========', tableArr)
    const rowSelection = {
      onChange: this.onSelectChange,
      selectedRowKeys,
    };
    const columns = [
      { title: '试题号', dataIndex: 'num', key: 'num' },
      { title: '试题名', dataIndex: 'testName', key: 'testName' },
      {
        title: '标签', 
        dataIndex: 'tags', 
        key: 'tags',
        render: (tags: [string]) => (
          <span>
            {tags.map(tag => {
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
      { title: '难易度', dataIndex: 'level', key: 'level' },
      { title: '分数', dataIndex: 'point', key: 'point' },
      {
        title: '操作',
        key: 'action',
        render: (_: any, record: { [x: string]: string; }) => (
          <Space size="middle">
            <Button 
              className="site-layout-content-button" 
              icon={ <EditOutlined/> }
              onClick={ () => { this.handleModal(record['testName']) } }
            >
            </Button>
            <Button 
              className="site-layout-content-button" 
              icon={ <DeleteOutlined/> }
              onClick={ () => { this.deleteTest(record['testName']) } }
            >
            </Button>
          </Space>
        ),
      },
    ];

    return(
      <div>
        <Button 
          className="form-button-left" 
          type="primary" 
          onClick={ this.showDrawer } 
          icon={ <PlusOutlined /> }
          style={{ margin: '0px 0px 10px 10px' }}
          >
          添加试题
        </Button>

        <Button 
          className="form-button-left2" 
          type="primary" 
          onClick={ this.deleteTest } 
          icon={ <DeleteOutlined /> }
          style={{ margin: '0px 0px 10px 10px' }}
        >
          删除试题
        </Button>

        <Drawer
          title="编程题"
          width={720}
          placement="left"
          closable={true}
          onClose={ this.onClose }
          visible={ visible }
          bodyStyle={{ paddingBottom: 80 }}
          // extra={
          //   <Space>
          //     {/* icon={ < />} */}
          //     <Button icon={ <CompressOutlined /> }>全屏</Button>
          //     <Button onClick={ this.onClose }>取消</Button>
          //     <Button onClick={ this.addTest } type="primary">
          //       保存
          //     </Button>
          //   </Space>
          // }
        >
          <Form 
            // onFinish={ button === true ? this.props.addTest : this.modifyTest }
            onFinish={ button === true ? this.addTest : this.modifyTest }
            ref={ this.formRef }
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
              name="description" 
              key="description"
              label="题目" 
            >
              <Wangeditor/>
            </Form.Item>

            <Form.Item 
              name="answer" 
              key="answer"
              label="答案" 
            >
              <Wangeditors/>
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
              >
                { button === true ? '添加试题' : '修改试题' }
              </Button>
            </Form.Item>
          </Form>
        </Drawer>

        <Table 
          bordered
          columns={ columns } 
          dataSource={ [...tableArr] } 
          rowSelection={ rowSelection } 
          expandable={{
            expandedRowRender: record => <p dangerouslySetInnerHTML={{ __html: record['description'] }} />,
            rowExpandable: () => true,
          }}
        />
      </div>
    )
  }
}