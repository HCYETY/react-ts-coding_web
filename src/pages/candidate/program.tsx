import React from 'react';
import { Button, Form, Input } from 'antd';
import {
  EllipsisOutlined,
  CheckSquareOutlined,
  LeftOutlined,
  RightOutlined,
  UnorderedListOutlined,
  CaretRightOutlined,
  DownOutlined,
} from '@ant-design/icons';

import 'style/programInform.less';
import CodeEditor from 'common/components/codeEditor';
import ProgramInform from 'common/components/programInform';
import { getUrlParam } from 'common/utils';
import { showTest, saveCode, candidateInform } from 'api/modules/interface';

const url = getUrlParam('test');
const obj = { test: url, code: '' };

export default class Program extends React.Component {

  state = {
    code: '',
  }

  getProgramCode = (value: any) => {
    console.log(value)
    this.setState({ code: value })
  }

  submitCode = async () => {
    const { code } = this.state;
    obj.code = code;
    const res = await candidateInform(obj);
    console.log(res);
  }
  
  render() {

    return(
      <div className="candidate-site-layout whole">

        <div className="left">
          <ProgramInform />
          { this.state.code }
          <div className="left-bottom">
            <Button className="left-bottom-list left-bottom-button">
              <UnorderedListOutlined />
              题目列表
            </Button>
            <Button className="left-bottom-next left-bottom-button">
              下一题
              <RightOutlined />
            </Button>
            <Button className="left-bottom-previous left-bottom-button">
              <LeftOutlined />
              上一题
            </Button>
          </div>
        </div>

        <div className="right">
          <CodeEditor getProgramCode={ this.getProgramCode.bind(this) }/>

          <div className="right-bottom">
            {/* <div> */}
              <Button 
                className="right-bottom-submit right-bottom-button"
                type="primary"
                onClick={ this.submitCode }
              >
                提交
              </Button>
              <Button 
                className="right-bottom-execute right-bottom-button"
              >
                <CaretRightOutlined />
                执行代码
                <DownOutlined />
              </Button>
            {/* </div> */}
          </div>
        </div>

      </div>
    )
  }
}