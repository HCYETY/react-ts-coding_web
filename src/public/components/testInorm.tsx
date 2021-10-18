import React from 'react';
import { Form, Input, Select, InputNumber, Modal, } from 'antd';
import { FormInstance } from 'antd/es/form';
import Wangeditor from './wangeditor';
import { TAGS } from '../const';
import PubSub from 'pubsub-js';

let tableArr: any = null;
export default class TestInform extends React.Component{
  componentDidMount() {
    PubSub.subscribe('modifyTest', (_, data) => {
      tableArr = data.inform
    })
  }
  state = {
    visible: false,
  }
  formRef = React.createRef<FormInstance>();

  // 修改试题
  handleModal = (record: any) => {
    // 设置弹出层
    this.setState({ visible3: true });
    console.log('dddddd', record)

    // 获取 Form 的 ref
    const form = this.formRef.current;
    // tableArr 是全部数据，onrow 是单个试题的数据
    // 要渲染的数据
    let ch = null;  
    tableArr.forEach((item: { [x: string]: any; }) => {
      if (item && item['testName'] === record) {
        ch = item;
        console.log('kkkkkkkkk', item['testName'])
        return ch;
      }
    })
    form.setFieldsValue(ch)
    
    // form.initialValues(this.state.tableArr)
    // const curForm = form.validateFields();
    // curForm.then((val: any) => {
    //   const { tableArr } = this.state;
    //   console.log('val', val)
    //   console.log('usrForm', curForm)
    // }).catch((error: any) => {
    //   console.log('error', error);
    // })
  };
  hideModal = () => {
    this.setState({ visible3: false });
  };
  modifyTest = () => {
    this.setState({ visible3: false });

  }
  
  render() {
    const { visible } = this.state;

    return(
      <Modal
        title="修改试卷信息"
        visible={ visible }
        onOk={ this.modifyTest }
        onCancel={ this.hideModal }
        okText="确认修改"
        cancelText="取消"
      >
        <Form
          ref={this.formRef}
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
    )
  }
}