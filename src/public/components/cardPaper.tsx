import React from 'react';
import { 
  Form, 
  Input, 
  Card, 
  Modal, 
  Button,
  Radio,
} from 'antd';
import Wangeditor from 'public/components/wangeditor';
import 'style/components.css';

interface Values {
  title: string;
  description: string;
  modifier: string;
}

interface CollectionCreateFormProps {
  visible: boolean;
  onCreate: (values: Values) => void;
  onCancel: () => void;
}


export default class CardPaper extends React.PureComponent{
  state = {
    visible,
    onCreate,
    onCancel,
  }
  render() {
    const [visible, setVisible] = useState(false);

    const onCreate = (values: any) => {
      console.log('Received values of form: ', values);
      setVisible(false);
    };

    return(
      <div>
        <Button
          type="primary"
          onClick={() => {
            setVisible(true);
          }}
        >
          添加试题
        </Button>
        <CollectionCreateForm
          visible={visible}
          onCreate={onCreate}
          onCancel={() => {
            setVisible(false);
          }}
        />


        <Modal
          visible={visible}
          title="Create a new collection"
          okText="Create"
          cancelText="Cancel"
          onCancel={onCancel}
          onOk={() => {
            form
              .validateFields()
              .then(values => {
                form.resetFields();
                onCreate(values);
              })
              .catch(info => {
                console.log('Validate Failed:', info);
              });
          }}
        >
          <Form
            form={form}
            layout="vertical"
            name="form_in_modal"
            initialValues={{ modifier: 'public' }}
          >
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Please input the title of collection!' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input type="textarea" />
            </Form.Item>
            <Form.Item name="modifier" className="collection-create-form_last-form-item">
              <Radio.Group>
                <Radio value="public">Public</Radio>
                <Radio value="private">Private</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Modal>
      </div>
      // <Card type="inner" title="面试题" extra={<a href="#">More</a>} className="innerCard">
      //   <Form.Item 
      //     label="题目"
      //     rules={[
      //       {required: true}
      //     ]}
      //   >
      //     <Input />
      //   </Form.Item>

      //   <Form.Item 
      //     name={['user', 'introduction']} 
      //   >
      //     <Input.TextArea></Input.TextArea>
      //     {/* <Wangeditor />
      //     <textarea style={{display: 'none'}} name="mytxtIntro" id="txtIntro"></textarea> */}
      //   </Form.Item>
      // </Card>
    )
  }
}