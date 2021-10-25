import React from 'react';
import { Button, Form, Input } from 'antd';
import {
  EllipsisOutlined,
  CheckSquareOutlined,
} from '@ant-design/icons';

import 'style/programInform.less';
import CodeEditor from 'common/components/codeEditor';
import ProgramInform from 'common/components/programInform';
import { getUrlParam } from 'common/utils';
import { showTest } from 'api/modules/interface';


export default class Program extends React.Component {

  submitProgram = (values: any) => {
    // console.log(values)
  }
  
  render() {

    return(
      <div className="whole">

        <div className="left">
          <ProgramInform />
        </div>

        <div className="right">
          <Form  onFinish={ this.submitProgram }>
            <CodeEditor />
            {/* <Form.Item name="program">
              <Input.TextArea ></Input.TextArea>
            </Form.Item>
            <Form.Item> 
              <Button >提交代码</Button>
            </Form.Item> */}
          </Form>
        </div>

      </div>
    )
  }
}