import React, { PureComponent } from 'react';
import { Layout, Menu, Table, Button, Tag, Space, message } from 'antd';
import {
  DesktopOutlined,
  PieChartOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import './index.less'
import { showPaper } from 'src/api/modules/interface';
import { modifyPaper } from 'src/api/modules/interface';
import { addPaper } from 'src/api/modules/interface';
import { deletePaper } from 'src/api/modules/interface';

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

// 表格内容
const columns = [
  {
    title: '试卷',
    dataIndex: 'paper',
    sorter: (a: { paper: number; }, b: { paper: number; }) => a.paper - b.paper,
  },
  {
    title: '标签',
    dataIndex: 'tags',
    render: (tags: [string]) => (
      <span>
        {tags.map(tag => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </span>
    ),
  },
  {
    title: '难度',
    dataIndex: 'level',
    filters: [
      { text: '简单', value: '简单' },
      { text: '中等', value: '中等' },
      { text: '困难', value: '困难' },
    ],
    onFilter: (value: any, record: { level: string | any[]; }) => record.level.indexOf(value) === 0
  },
  {
    title: '通过率',
    dataIndex: 'pass',
    sorter: (a: { pass: number; }, b: { pass: number; }) => a.pass - b.pass,
  },
  { title: '完成时间', dataIndex: 'time' },
  {
    title: '状态',
    dataIndex: 'status',
    filters: [
      { text: '已完成', value: '已完成' },
      { text: '未开始', value: '未开始' },
      { text: '尝试中', value: '尝试中' },
    ],
    onFilter: (value: any, record: { status: string | any[]; }) => record.status.indexOf(value) === 0
  },
  {
    title: '操作',
    dataIndex: 'operation',
    render: (text: any, record: any) => (
      <Space size="middle">
        <a>修改试卷</a>
      </Space>
    ),
  },
];

class Interviewer extends PureComponent {
  state = {
    collapsed: false,
    loading: false,
    selectedRowKeys: [] = [],
    data: [] = []
  };

  // 在页面一渲染就立马从数据库中拿取所有试卷的数据
  componentDidMount() {
    showPaper().then((result: any) => {
      console.log(result.show, typeof result.show)
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
          status: res[i].status
        }
        arr.push(obj)
      }
      this.setState({data: arr})
    })
  }
// mysql密码：*/Bhi-(ro6er
  // 删除试卷的按钮事件
  delete = async () => {
    const arr = this.state.selectedRowKeys;
    let req: number[];
    if (arr) {
      for (let num of arr) {
        this.state.data.map(x => {
          console.log(arr);
          if (x['key'] === num) {
            req.push(x['paper']);
            return;
          }
        })
      }
      await deletePaper(req).then(a => message.success(a))
    }
  };
  // 新建试卷的按钮事件
  add = () => {
    
  };

  // 内容主体
  onSelectChange = (selectedRowKeys: any) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  };
  
  // 侧边栏
  onCollapse = (collapsed: any) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };


  render() {
    

    const { collapsed, loading, data, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return(
      <Layout style={{ minHeight: '100vh' }}>
        {/* 侧边栏 */}
        <Sider collapsible collapsed={collapsed} onCollapse={this.onCollapse}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
            <Menu.Item key="1" icon={<PieChartOutlined />}>
              面试题展示
            </Menu.Item>
            <Menu.Item key="2" icon={<DesktopOutlined />}>
              面试题管理
            </Menu.Item>
            {/* <SubMenu key="sub1" icon={<UserOutlined />} title="User">
              <Menu.Item key="3">Tom</Menu.Item>
              <Menu.Item key="4">Bill</Menu.Item>
              <Menu.Item key="5">Alex</Menu.Item>
            </SubMenu>
            <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
              <Menu.Item key="6">Team 1</Menu.Item>
              <Menu.Item key="8">Team 2</Menu.Item>
            </SubMenu>
            <Menu.Item key="9" icon={<FileOutlined />}>
              Files
            </Menu.Item> */}
          </Menu>
        </Sider>
        
        {/* 内容主体 */}
        <Layout className="site-layout">
          {/* 头部 */}
          <Header className="site-layout-background" style={{ padding: 0}} />
         
          {/* 中间 */}
          <Content className="site-layout-content">
            <Button className="site-layout-content-button" type="primary" onClick={this.delete} loading={loading} icon={<DeleteOutlined />}>
              删除试卷
            </Button>
            <Button className="site-layout-content-button" type="primary" onClick={this.add} loading={loading} icon={<PlusOutlined />}>
              新建试卷
            </Button>
            
            <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
          </Content>
          
          {/* 尾部 */}
          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
    )
  }
}

export default Interviewer;