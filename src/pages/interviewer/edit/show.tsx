import React from 'react';
import { 
  Layout, 
  Table, 
  Button, 
  Tag, 
  Space,
  message,
  Popconfirm,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';

import 'style/show.less';
import Navbar from 'public/components/navbar';
import Head from 'public/components/header';
import Foot from 'public/components/footer';
import { FILTERS_LEVEL, FILTERS_STATUS } from 'public/const';
import { showPaper } from 'src/api/modules/interface';
import { deletePaper } from 'src/api/modules/interface';

const { Content } = Layout;

export default class Edit extends React.Component {
  state = {
    selectedRowKeys: [] = [],
    data: [] = [],
    onrow: '',
  };

  // 在页面一渲染就立马从数据库中拿取所有试卷的数据
  componentDidMount() {
    showPaper().then((result: any) => {
      console.log(result)
      const arr: any[] = [];
      const res = result.data;
      for (let i = 0; i < res.length; i++) {
        const obj = {
          key: i,
          paper: res[i].paper,
          paper_description: res[i].paper_description,
          tests_num: res[i].tests_num,
          paper_point: res[i].paper_point,
          candidate: res[i].candidate,
          check: res[i].check === 1 ? '是' : '否 ',
          time: res[i].time,
          remaining_time: res[i].remaining_time,
        }
        arr.push(obj)
      }
      this.setState({ data: arr });
    })
  }

  // 删除试卷的按钮事件
  delete = async () => {
    const arr = this.state.selectedRowKeys;
    let req: number[] = [];
    if (arr.length !== 0) {
      for (let num of arr) {
        req.push(this.state.data[num]);
      }
      const res = await deletePaper(req);
      console.log(res)
      // res.map((ch: { check: string | number; }) => {
      //   ch.check = ch.check === 1 ? '是' : '否';
      // })
      this.setState({ data: res.data });
      message.success(res.msg);
    }
  };
  // 新建试卷的按钮事件
  add = () => {
    window.location.href = '/add';
  };

  // 表格复选框的选择情况
  onSelectChange = (selectedRowKeys: any) => {
    this.setState({ selectedRowKeys });
  };

  render() {
    const { data, selectedRowKeys, onrow, } = this.state;
    const rowSelection = {
      onChange: this.onSelectChange,
      selectedRowKeys,
    };

    
    return(
      <Layout >
        <Navbar/>

        <Layout>
          <Head/>
         
          <Content className="site-layout-content">
            <Popconfirm 
              title="您确定要 删除试卷 吗？" 
              okText="确定删除" 
              cancelText="取消" 
              onConfirm={ this.delete }
            >
              <Button 
                className="site-layout-content-button" 
                icon={ <DeleteOutlined/> }
                type="primary" 
              >
                删除试卷
              </Button>
            </Popconfirm>

            <Button 
              className="site-layout-content-button" 
              icon={ <PlusOutlined/> }
              onClick={ this.add } 
              type="primary" 
            >
              新建试卷
            </Button>
            
            <Table 
              rowSelection={ rowSelection } 
              dataSource={ [...data] } 
              bordered
              scroll={{ x: 1500, y: 350 }}
              onRow={
                record => {
                  return {
                    onClick: () => {
                      this.setState({ onrow: record['paper'] })
                    }
                  }
                }
              }
            >
              <Table.Column 
                title='试卷'
                dataIndex='paper'
                key='paper'
                fixed='left'  
              />

              <Table.Column
                title="试卷描述"
                dataIndex="paper_description"
                key="paperDescription"
              />

              <Table.Column 
                title='试题数量'
                dataIndex='tests_num'
                key='tests_num'
                sorter={ (a: { tests_num: number; }, b: { tests_num: number; }) => a.tests_num - b.tests_num }
                />

              <Table.Column
                title="试卷总分"
                dataIndex="paper_point"
                key="paper_point"
                sorter={ (a: { paper_point: number; }, b: { paper_point: number; }) => a.paper_point - b.paper_point }
              />

              <Table.ColumnGroup title="候选人">
                <Table.Column 
                  title="邮箱" 
                  dataIndex="candidate" 
                  key="candidate" 
                />
                <Table.Column 
                  title="试卷过期能否查看" 
                  dataIndex="check" 
                  key="check" 
                />
              </Table.ColumnGroup>

              <Table.Column 
                title='截止时间'
                dataIndex='time'
                key='time'
              />

              <Table.Column 
                title='剩余时间'
                dataIndex='remaining_time'
                key='remaining_time'
              />

              <Table.Column 
                title='操作'
                dataIndex='action'
                key='action'
                fixed='right'
                render={
                  (text: any, record: any) => (
                    <Space size="middle">
                      <a href={`/modify?paper=${ onrow }`}>修改试卷</a>
                    </Space>
                  )
                }
              />
            </Table>
          </Content>

          <Foot />
        </Layout>
      </Layout>
    )
  }
}




  // // 表格内容
  // const columns: any = [
  //   { 
  //     title: '试卷', 
  //     dataIndex: 'paper', 
  //     key: 'paper', 
  //     width: 160, 
  //     fixed: 'left' 
  //   },
  //   {
  //     title: '标签',
  //     dataIndex: 'tags',
  //     key: 'tags',
  //     render: (tags: [string]) => (
  //       <span>
  //         {tags.map(tag => {
  //           let color = tag.length > 2 ? 'geekblue' : 'green';
  //           if (tag === 'loser') {
  //             color = 'volcano';
  //           }
  //           return (
  //             <Tag color={color} key={tag}>
  //               {tag}
  //             </Tag>
  //           );
  //         })}
  //       </span>
  //     ),
  //   },
  //   { title: '试卷过期候选人能否查看', dataIndex: 'check' },
  //   { title: '受邀的候选人的邮箱', dataIndex: 'candidate' },
  //   {
  //     title: '试题数量',
  //     dataIndex: 'paperNum',
  //     width: 120,
  //     sorter: (a: { paperNum: number; }, b: { paperNum: number; }) => a.paperNum - b.paperNum,
  //   },
  //   { title: '截止时间', dataIndex: 'time' },
  //   { title: '剩余时间', dataIndex: 'remainingTime' },
  //   {
  //     title: '通过率',
  //     dataIndex: 'pass',
  //     width: 120,
  //     sorter: (a: { pass: number; }, b: { pass: number; }) => a.pass - b.pass,
  //   },
  //   {
  //     title: '操作',
  //     dataIndex: 'operation',
  //     width: 120,
  //     fixed: 'right',
  //     render: (text: any, record: any) => (
  //       <Space size="middle">
  //         <a href={`/modify?paper=${onrow}`}>修改试卷</a>
  //       </Space>
  //     ),
  //   },
  // ];