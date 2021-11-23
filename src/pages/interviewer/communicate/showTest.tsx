import React from 'react';
import { Button, Tag } from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import 'style/interviewer/showTest.less';
import { getExamLevel } from 'src/common/utils';
import { testObj } from 'common/types';

interface Prop {
  inform: testObj;
  getTest: any;
}

interface State {

}

export default class ShowTest extends React.Component<Prop, State> {

  setTest = () => {
    const { inform } = this.props;
    this.props.getTest(inform);
  }

  render() {
    const { inform } = this.props;

    return(
      <div className="inform">
        <div className="inform-top">
          <div className="inform-top-left">
            { inform.test_name }
          </div>
          <div className="inform-top-right">
            <StarOutlined />
            <StarFilled />
          </div>
        </div>
        <div className="inform-status">
          <div className={ getExamLevel(inform.level) }>{ inform.level }</div>
          <div className="inform-tags">
            { 
              inform.tags.map(item => {
                return(
                  <Tag>{ item }</Tag>
                )
              })
            }
          </div>
        </div>
        <div 
          className="inform-content" 
          dangerouslySetInnerHTML={{ __html: inform.test }}
        >
        </div>
        <div className="inform-bottom">
          <div className="inform-bottom-left">
            <span>共考核次/通过率</span>
          </div>
          <div className="inform-bottom-right">
            <Button onClick={ this.setTest }>出题</Button>
          </div>
        </div>
      </div>
    )
  }
}