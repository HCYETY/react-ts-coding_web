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



export default class Edit extends React.PureComponent {
  state = {
    loading: false,
    selectedRowKeys: [] = [],
    data: [] = [],
    onrow: '',
  };

  // 在页面一渲染就立马从数据库中拿取所有试卷的数据
  componentDidMount() {
    showPaper().then((result: any) => {
      const arr = [];
      for (let i = 0; i < result.show.length; i++) {
        const res = result.show;
        const obj = {
          key: i,
          paper: res[i].paper,
          tags: res[i].tags,
          level: res[i].level,
          pass: res[i].pass,
          time: res[i].time,
          status: res[i].status,
          paperNum: res[i].paperNum,
          remaining_time: res[i].remaining_time,
          check: res[i].check === true ? '是' : '否 ',
        }
        arr.push(obj)
      }
      this.setState({data: arr});
      console.log(this.state.data)
    })
  }

  // 删除试卷的按钮事件
  delete = async () => {
    const arr = this.state.selectedRowKeys;
    let req: number[] = [];
    if (arr.length !== 0) {
      for (let num of arr) {
        this.state.data.map(x => {
          if (x['key'] === num) {
            req.push(x['paper']);
            return;
          }
        })
      }
      await deletePaper(req).then((ans) => {
        this.setState({data: ans.data});
        message.success(ans.msg);
      })
    }
  };
  // 新建试卷的按钮事件
  add = async () => {
    window.location.href = '/add';
  };

  // 内容主体
  onSelectChange = (selectedRowKeys: any) => {
    this.setState({ selectedRowKeys });
  };

  onRow(key: any, record: number) {//表格行操作
    console.log('row', key, record)
    this.setState({ selectedRowKeys: new Array(key) });
  }
  

  render() {

    const { loading, data, selectedRowKeys, onrow } = this.state;
    const rowSelection = {
      onChange: this.onSelectChange,
      selectedRowKeys,
    };

    // 表格内容
    const columns = [
      { title: '试卷', dataIndex: 'paper' },
      {
        title: '标签',
        dataIndex: 'tags',
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
        ),
      },
      {
        title: '难度',
        dataIndex: 'level',
        filters: FILTERS_LEVEL,
        onFilter: (value: any, record: { level: string | any[]; }) => record.level.indexOf(value) === 0
      },
      {
        title: '通过率',
        dataIndex: 'pass',
        sorter: (a: { pass: number; }, b: { pass: number; }) => a.pass - b.pass,
      },
      { title: '截止时间', dataIndex: 'time' },
      { title: '剩余时间', dataIndex: 'remainingTime' },
      {
        title: '试题数量',
        dataIndex: 'paperNum',
        sorter: (a: { paperNum: number; }, b: { paperNum: number; }) => a.paperNum - b.paperNum,
      },
      {
        title: '状态',
        dataIndex: 'status',
        filters: FILTERS_STATUS,
        onFilter: (value: any, record: { status: string | any[]; }) => record.status.indexOf(value) === 0
      },
      { title: '试卷过期候选人能否查看', dataIndex: 'check' },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text: any, record: any) => (
          <Space size="middle">
            <a href={`/modify?paper=${onrow}`}>修改试卷</a>
          </Space>
        ),
      },
    ];

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
              onConfirm={this.delete}
            >
              <Button 
                className="site-layout-content-button" 
                icon={<DeleteOutlined/>}
                loading={loading} 
                type="primary" 
              >
                删除试卷
              </Button>
            </Popconfirm>

            <Button 
              className="site-layout-content-button" 
              icon={<PlusOutlined/>}
              onClick={this.add} 
              loading={loading} 
              type="primary" 
            >
              新建试卷
            </Button>
            
            <Table 
              rowSelection={rowSelection} 
              columns={columns} 
              dataSource={data} 
              onRow={(record) => {
                return {
                  onClick: () => {
                    this.setState({onrow: record.paper})
                    console.log(record)
                  }}
                }}
            />
          </Content>

          <Foot />
        </Layout>
      </Layout>
    )
  }
}