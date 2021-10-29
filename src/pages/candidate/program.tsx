import React from 'react';
import { Button, Form, Input, Select, Drawer, } from 'antd';
import {
  EllipsisOutlined,
  CheckSquareOutlined,
  LeftOutlined,
  RightOutlined,
  UnorderedListOutlined,
  CaretRightOutlined,
  DownOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

import 'style/programInform.less';
import CodeEditor from 'common/components/codeEditor';
import ProgramInform from 'common/components/programInform';
import { getUrlParam } from 'common/utils';
import { showTest, saveCode, candidateInform } from 'api/modules/interface';
import { PROGRAM_LANGUAGE, THEME } from 'src/common/const';

const url = getUrlParam('test');
const obj = { test: url, code: '' };

export default class Program extends React.Component {

  state = {
    code: '',
    language: 'javascript',
    theme: 'vs',
    visible: false,
  }

  getProgramCode = (value: any) => {
    this.setState({ code: value })
  }

  submitCode = async () => {
    const { code } = this.state;
    obj.code = code;
    const res = await candidateInform(obj);
    console.log(res);
  }

  handleChange = (value: any) => {
    this.setState({ language: value });
  }
  
  openModal = () => {
    this.setState({ visible: true });
  }
  onClose =() => {
    this.setState({ visible: false });
  }
  
  render() {
    const { language, theme, visible } = this.state;
    return(
      <div className="whole">

        <div className="left">
          <div className="left-box">
            <ProgramInform />
          </div>
            {this.state.code}

          <div className="left-bottom">
            <Drawer
              width={ 640 }
              visible={ visible }
              onClose={ this.onClose }
              placement="left"
            >
              
            </Drawer>

            <Button className="left-bottom-list left-bottom-button" onClick={ this.openModal }>
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

          {/* <div className="right-top">
            <Select 
              defaultValue={ language } 
              style={{ width: 120 }} 
              onChange={ this.handleChange }
              className="right-top-button"
            >
              {
                PROGRAM_LANGUAGE.map(item => {
                  return(
                    <Select.Option value={ item }> { item } </Select.Option>
                  )
                })
              }
            </Select>
            
            <Select 
              defaultValue={ theme } 
              style={{ width: 120 }} 
              onChange={ this.handleChange }
              className="right-top-button"
            >
              {
                THEME.map(item => {
                  return(
                    <Select.Option value={ item }> { item } </Select.Option>
                  )
                })
              }
            </Select>
          </div> */}

          <div className="right-content">
            <CodeEditor getProgramCode={ this.getProgramCode.bind(this) } language={ language }/>
          </div>

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