import React from 'react';
import { NavLink, BrowserRouter as Router, Route } from 'react-router-dom';
import { 
  Layout, 
  Table, 
  Button, 
  Tag, 
  Space,
  message,
  Popconfirm,
  Row,
  Col,
} from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  FormOutlined,
} from '@ant-design/icons';

import Navbar from 'common/components/navbar';
import { TEST_ADD, TEST_MODIFY } from 'common/const';
import { showPaper, deletePaper } from 'api/modules/paper';
import { getCookie, handleTime } from 'common/utils';
import Head from 'common/components/header';

export default class Edit extends React.Component {
  state = {
    selectedRowKeys: [] = [],
    data: [] = [],
  };

  // 在页面一渲染就立马从数据库中拿取所有试卷的数据
  componentDidMount() {
    const cookie = getCookie();
    showPaper({ cookie: cookie, interviewer: true }).then((result: any) => {
      const res = result.data.show;
      const arr = handleTime(res, 2);
      this.setState({ data: arr });
    })
  }

  // 删除试卷的按钮事件
  delete = async () => {
    const arr = this.state.selectedRowKeys;
    if (arr.length !== 0) {
      const res = await deletePaper(arr);
      const ret = handleTime(res.data);
      this.setState({ data: ret });
      message.success(res.msg);
    }
  };
  // 新建试卷的按钮事件
  add = () => {
    window.location.href = TEST_ADD;
    // return(
    //   <Link to={ TEST_ADD }></Link>
    // )
  };

  // 表格复选框的选择情况
  onSelectChange = (selectedRowKeys: any) => {
    setTimeout(() => {
      this.setState({ selectedRowKeys });
    }, 0);
  };

  render() {
    const { data, selectedRowKeys } = this.state;
    const rowSelection = {
      onChange: this.onSelectChange,
      selectedRowKeys,
    };
    const columns  = [
      { title: '试卷', dataIndex: 'paper', key: 'paper' },
      // { title: '试卷', dataIndex: 'paper', key: 'paper', fixed: 'left' },
      { title: '试卷描述', dataIndex: 'paper_description', key: 'paper_description' },
      { 
        title: '试题数量', 
        dataIndex: 'tests_num', 
        key: 'tests_num', 
        sorter: (a: { tests_num: number; }, b: { tests_num: number; }) => a.tests_num - b.tests_num,
      },
      { 
        title: '试卷总分', 
        dataIndex: 'paper_point', 
        key: 'paper_point', 
        sorter: (a: { paper_point: number; }, b: { paper_point: number; }) => a.paper_point - b.paper_point,
      },
      { 
        title: '候选人', 
        children: [
          {
            title: '邮箱账号',
            dataIndex: 'candidate',
            key: 'candidate',
            width: 175,
            render: (candidate: any) => (
              <span>
                {
                  candidate.map((item: string) => {
                    let color = item.length > 16 ? 'green' : 'geekblue';
                    return (
                      <Col>
                        <Tag color={ color } key={ item }>
                          { item }
                        </Tag>
                      </Col>
                    );
                  })
                }
              </span>
            ),
          },
          {
            title: '试卷过期能否查看',
            dataIndex: 'check',
            key: 'check',
          },
        ],
      },
      { title: '开始时间', dataIndex: 'time_begin', key: 'time_begin' },
      { title: '截止时间', dataIndex: 'time_end', key: 'time_end' },
      { title: '剩余时间', dataIndex: 'remaining_time', key: 'remaining_time' },
      { title: '作答时长', dataIndex: 'answer_time', key: 'answer_time' },
      {
        title: '操作', 
        dataIndex: 'action', 
        key: 'action',
        // fixed: 'right',
        render: (text: any, record: any) => {
          return(
            <Space size="middle">
              <NavLink to={ `${ TEST_MODIFY }?paper=${ record.paper }` }>
                <FormOutlined/>修改试卷
              </NavLink>
            </Space>
          )
        }
      },
    ]
    
    return(
      <div className="site-layout">
        <Navbar/>

        <Layout.Content className="site-layout-content">
          <Popconfirm 
            title="您确定要 删除试卷 吗？" 
            okText="确定删除" 
            cancelText="取消" 
            onConfirm={ this.delete }
          >
            <Button 
              icon={ <DeleteOutlined/> }
              type="primary"
              style={{ margin: '0px 5px 8px 10px' }}
            >
              删除试卷
            </Button>
          </Popconfirm>

          <Button 
            icon={ <PlusOutlined/> }
            onClick={ this.add } 
            type="primary"
            style={{ margin: '0px 5px 8px 10px' }}
          >
            新建试卷
          </Button>
          
          <Table 
            rowSelection={ rowSelection } 
            columns={ columns }
            dataSource={ [...data] } 
            bordered
            scroll={{ y: 550 }}
            // scroll={{ x: 1500, y: 550 }}
          />
        </Layout.Content>
      </div>
    )
  }
}