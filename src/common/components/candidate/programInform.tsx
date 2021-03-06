import React from 'react';
import { List, Tabs, Tooltip, Comment, Avatar } from 'antd';
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
import { getCookie, getExamLevel, getUrlParam } from 'common/utils';
import { showTest } from 'api/modules/test';
import { comment } from 'api/modules/candidate';
import { TEST_LEVEL } from 'common/const';
import Wangeditor from 'common/components/interviewer/wangeditor';
import MarkdownEditor from 'common/components/candidate/markdownEditor';

const cookie: string = getCookie();
  
export default class ProgramInform extends React.Component {
  authorRef = React.createRef<ProgramInform>();

  state = {
    testInform: {},
    likes: 0,         // 赞的数量
    dislikes: 0,      // 踩的数量
    replys: 0,        // 单条评论的回复数量
    checkLike: '',        // 标识用户点击的是“赞”还是“踩”
    checkReply: false // 标识用户是否点击了“查看评论”
  }
  callback: (activeKey: string) => void;

  componentDidMount() {
    const url = getUrlParam('test');
    showTest({ test: url }).then(res => {
      this.setState({ testInform: res.data.show })
    })
    comment().then(res => {

    })
  }

  // 点击“评论”操作列表中的“赞”时的函数
  like = () => {
  // console.log(this.authorRef.current.focus())
  
    // const { likes } = this.state;
    // comment({ like_num: likes + 1, cookie, status: true }).then(res => {
    //   this.setState({ likes: res.like_num, checkLike: 'like' });
    // })
  }
  // 点击“评论”操作列表中的“踩”时的函数
  dislike = () => {
    const { dislikes } = this.state;
    comment({ dislike_num: dislikes + 1, cookie, status: true }).then(res => {
      this.setState({ dislikes: res.dislike_num, checkLike: 'dislike'});
    })
  }
  // 点击“评论”操作列表中的“查看评论”时的函数
  checkReply = () => {
    const { checkReply } = this.state;
    checkReply === false ? this.setState({ checkReply: true }) : this.setState({ checkReply: false });
  }
  // 点击“评论”操作列表中的“回复”时的函数
  reply = () => {
    // comment({ comments, cookie, status: true }).then(res => {
      
    // })
  }
  // 创建评论
  createReply = () => {

  }

  render() {
    const { testInform, likes, dislikes, checkLike, replys, checkReply, } = this.state;
    const data = [
      {
        actions: [
          <Tooltip key="comment-basic-like" title="点赞">
            <span onClick={ this.like }>
              { checkLike === 'like' ? <LikeFilled /> : <LikeOutlined />}
              <span className="comment-action">{ likes === 0 ? '赞' : likes }</span>
            </span>
          </Tooltip>,
          <Tooltip key="comment-basic-dislike" title="踩">
            <span onClick={ this.dislike }>
              { checkLike === 'dislike' ? <DislikeFilled /> : <DislikeOutlined /> }
              <span className="comment-action">{ dislikes === 0 ? '踩' : dislikes }</span>
            </span>
          </Tooltip>,
          <Tooltip key="comment-basic-reply-check" title="查看回复">
            <span onClick={ this.checkReply }>
              <CommentOutlined />
              <span className="comment-action">
                { checkReply === false ? `查看 ${ replys } 条回复` : "收起回复" }
              </span>
            </span>
          </Tooltip>,
          <Tooltip key="comment-basic-reply-to" title="回复">
            <span onClick={ this.reply }>
              <VerticalAlignTopOutlined />
              <span className="comment-action">回复</span>
            </span>
          </Tooltip>,
        ],
        author: (
          <Tooltip key="comment-basic-author" title="用户邮箱" ref={this.authorRef}>1164939253@qq.com</Tooltip>
        ),
        avatar: 'https://joeschmoe.io/api/v1/random',
        content: (
          <p>
            We supply a series of design principles, practical patterns and high quality design
            resources (Sketch and Axure), to help people create their product prototypes beautifully and
            efficiently.
          </p>
        ),
        datetime: (
          <Tooltip title={moment().subtract(2, 'days').format('YYYY-MM-DD HH:mm:ss')}>
            <span>{moment().subtract(2, 'days').fromNow()}</span>
          </Tooltip>
        ),
      }
    ];

    return(
      <>
        <Tabs onChange={ this.callback }>
          <Tabs.TabPane  
            tab={ <span> <ProfileOutlined/> 题目描述 </span> }
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
            tab={ <span> <CommentOutlined/> 评论 </span> }
            key='comments'
          >
            {/* <MarkdownEditor /> */}
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
                    datetime={item.datetime}
                  >
                    {
                      checkReply === false ? null :
                      <Comment
                        actions={[<span key="comment-nested-reply-to">Reply to</span>]}
                        author={<a>Han Solo</a>}
                        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />}
                        content={
                          <p>
                            We supply a series of design principles, practical patterns and high quality design
                            resources (Sketch and Axure).
                          </p>
                        }
                      >
                      </Comment>
                    }
                  </Comment>
                </li>
              )}
            />
          </Tabs.TabPane>

          <Tabs.TabPane 
            tab={ <span> <ExperimentOutlined/> 题解 </span> }
            key='solution'
          >
            <span dangerouslySetInnerHTML = {{ __html: testInform['answer']}}></span>
          </Tabs.TabPane>

          <Tabs.TabPane 
            tab={ <span> <ClockCircleOutlined/> 提交记录 </span> } 
            key='submissions' 
          >

          </Tabs.TabPane>
        </Tabs>
      </>
    )
  }
}