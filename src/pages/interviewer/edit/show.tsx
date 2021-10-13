import React from 'react';
import { 
  Layout, 
  Table, 
  Button, 
  Tag, 
  Space,
  message,
  Popconfirm,
  Drawer,
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
    visible: false, 
    placement: 'left'
  };

  // 在页面一渲染就立马从数据库中拿取所有试卷的数据
  componentDidMount() {
    showPaper().then((result: any) => {
      const arr: any[] = [];
      const res = result.show;
      // res.map((arr: any) => {
      //   const obj = {
      //     key: arr.paper,
      //     paper: arr.paper,
      //     tags: arr.tags,
      //     pass: arr.pass,
      //     time: arr.time,
      //     paperNum: arr.paperNum,
      //     remainingTime: arr.remaining_time,
      //     candidate: arr.candidate,
      //     check: arr.check === true ? '是' : '否 ',
      //   };
      //   arr.push(obj);
      // })
      for (let i = 0; i < result.show.length; i++) {
        const obj = {
          key: i,
          paper: res[i].paper,
          tags: res[i].tags,
          pass: res[i].pass,
          time: res[i].time,
          paperNum: res[i].paperNum,
          remainingTime: res[i].remaining_time,
          candidate: res[i].candidate,
          check: res[i].check === true ? '是' : '否 ',
        }
        arr.push(obj)
      }
      this.setState({ data: arr });
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
  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };
  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  onChange = (e: { target: { value: any; }; }) => {
    this.setState({
      placement: e.target.value,
    });
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

    const { loading, data, selectedRowKeys, onrow, placement, visible } = this.state;
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
              // loading={loading} 
              type="primary" 
              // onClick={this.showDrawer}
            >
              新建试卷
            </Button>
            
            <Table 
              rowSelection = {rowSelection} 
              dataSource = {data} 
              bordered
              scroll = {{ x: 1500, y: 350 }}
              // onRow={(record) => {
              //   return {
              //     onClick: () => {
                //       this.setState({onrow: record.paper})
              //       console.log(record)
              //     }}
              //   }}
              >
              <Table.Column 
                title = '试卷'
                dataIndex = 'paper'
                key = 'paper'
                fixed = 'left'  
              />
              <Table.Column 
                title = '标签'
                dataIndex = 'tags'
                key = 'tags'
                render = {(tags: [string]) => (
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
                )}
              />
              <Table.ColumnGroup title="候选人">
                <Table.Column title="邮箱" dataIndex="candidate" key="candidate" />
                <Table.Column title="试卷过期能否查看" dataIndex="check" key="check" />
              </Table.ColumnGroup>
              <Table.Column 
                title='试题数量'
                dataIndex='paperNum'
                key='paperNum'
                sorter={(a: { paperNum: number; }, b: { paperNum: number; }) => a.paperNum - b.paperNum}
              />
              <Table.Column 
                title='截止时间'
                dataIndex='time'
                key='time'
              />
              <Table.Column 
                title='剩余时间'
                dataIndex='remainingTime'
                key='remainingTime'
              />
              <Table.Column 
                title='通过率'
                dataIndex='pass'
                key='pass'
                sorter={(a: { pass: number; }, b: { pass: number; }) => a.pass - b.pass}
              />
              <Table.Column 
                title='操作'
                dataIndex='action'
                key='action'
                fixed='right'
                render={(text: any, record: any) => (
                  <Space size="middle">
                    <a href={`/modify?paper=${onrow}`}>修改试卷</a>
                  </Space>
                )}
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