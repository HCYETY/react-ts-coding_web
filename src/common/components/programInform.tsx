import React from 'react';
import { List, Tabs, Tooltip, Comment } from 'antd';
import {
  ClockCircleOutlined,
  ProfileOutlined,
  CommentOutlined,
  ExperimentOutlined,
  LikeOutlined,
  DislikeOutlined,
  DislikeFilled,
  LikeFilled,
  VerticalAlignTopOutlined,
} from '@ant-design/icons';
import moment from 'moment';

// import 'style/code.css';
// import 'style/program.less'
import { getExamLevel, getUrlParam } from 'common/utils';
import { showTest } from 'api/modules/test/interface';
import Wangeditor from './wangeditor';
import { TEST_LEVEL } from '../const';

export default class ProgramInform extends React.Component {
  state = {
    testInform: {},
    likes: 0,        // 赞的数量
    dislikes: 0,     // 踩的数量
    liked: '',       // 标识用户点击的是“赞”还是“踩”
    replys: 0,       // 单条评论的回复数量
  }
  callback: (activeKey: string) => void;

  componentDidMount() {
    const url = getUrlParam('test');
    showTest({ test: url }).then(res => {
      this.setState({ testInform: res.data.show })
    })
  }

  // 点击“评论”操作列表中的“点赞”时的函数
  like = () => {
    this.setState({ likes: 1, dislikes: 0, liked: 'like' });
  }
  // 点击“评论”操作列表中的“”时的函数
  dislike = () => {
    this.setState({ likes: 0, dislikes: 1, liked: 'dislike'});
  }
  reply = () => {

  }

  render() {
    const { testInform, likes, dislikes, liked, replys, } = this.state;
    const data = [
      {
        actions: [
          <Tooltip key="comment-basic-like" title="Like">
            <span onClick={ this.like }>
              { liked === 'like' ? <LikeFilled /> : <LikeOutlined />}
              <span className="comment-action">{ likes === 0 ? '赞' : likes }</span>
            </span>
          </Tooltip>,
          <Tooltip key="comment-basic-dislike" title="Dislike">
            <span onClick={ this.dislike }>
              { liked === 'dislike' ? <DislikeFilled /> : <DislikeOutlined /> }
              <span className="comment-action">{ dislikes === 0 ? '踩' : dislikes }</span>
            </span>
          </Tooltip>,
          <Tooltip key="comment-basic-reply-check" title="Reply check">
            <span onClick={ this.reply }>
              <CommentOutlined />
              <span className="comment-action">查看 { replys } 条回复</span>
            </span>
          </Tooltip>,
          <Tooltip key="comment-basic-reply-to" title="Reply to">
            <span onClick={ this.reply }>
              <VerticalAlignTopOutlined />
              <span className="comment-action">回复</span>
            </span>
          </Tooltip>,
        ],
        author: 'syandeg',
        avatar: 'https://joeschmoe.io/api/v1/random',
        content: (
          <p>
            We supply a series of design principles, practical patterns and high quality design
            resources (Sketch and Axure), to help people create their product prototypes beautifully and
            efficiently.
          </p>
        ),
        datetime: (
          <Tooltip title={moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss')}>
            <span>{moment().subtract(1, 'days').fromNow()}</span>
          </Tooltip>
        ),
      }
    ];

    return(
      <>
        <Tabs onChange={ this.callback }>
          <Tabs.TabPane  
            tab={
              <span>
                <ProfileOutlined />
                题目描述
              </span>
            }
            key='test'
          >
            <div className="describe-top">
              <h3>{ testInform['num'] }. { testInform['test_name'] }</h3>
              <div className="describe-top-tag">
                难度：<span className={ getExamLevel(testInform['level']) }>{ testInform['level'] }</span>
              </div>
            </div>
            <div className="describe-content">
              <span dangerouslySetInnerHTML = {{ __html: testInform['test']}}></span>
            </div>
          </Tabs.TabPane>

          <Tabs.TabPane 
            tab={
              <span>
                <CommentOutlined />
                评论
              </span>
            }
            key='comments'
          >
            <Wangeditor />
            <List
              className="comment-list"
              header={`${data.length} replies`}
              itemLayout="horizontal"
              dataSource={data}
              renderItem={item => (
                <li>
                  <Comment
                    actions={item.actions}
                    author={item.author}
                    avatar={item.avatar}
                    content={item.content}
                    // datetime={item.datetime}
                  />
                </li>
              )}
            />
          </Tabs.TabPane>

          <Tabs.TabPane 
            tab={
              <span>
                <ExperimentOutlined />
                题解
              </span>
            }
            key='solution'
          >
            <span dangerouslySetInnerHTML = {{ __html: testInform['answer']}}></span>
          </Tabs.TabPane>

          <Tabs.TabPane 
            tab={
              <span>
                <ClockCircleOutlined />
                提交记录
              </span>
            } 
            key='submissions' 
          >

          </Tabs.TabPane>
        </Tabs>
      </>
    )
  }
}