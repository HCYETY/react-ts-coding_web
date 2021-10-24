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
import Navbar from 'common/components/navbar';
import { ADD, FILTERS_LEVEL, FILTERS_STATUS, MODIFY } from 'common/const';
import { showPaper, showTest } from 'api/modules/interface';
import { deletePaper } from 'api/modules/interface';
import { handleRemainingTime } from 'common/utils';

const { Content } = Layout;

export default class Edit extends React.Component {
  state = {
    selectedRowKeys: [] = [],
    data: [] = [],
  };

  // 在页面一渲染就立马从数据库中拿取所有试卷的数据
  componentDidMount() {
    showPaper().then((result: any) => {
      const res = result.data;
      console.log(res)
      const arr = handleRemainingTime(res, 2);
      this.setState({ data: arr });
    })
  }

  // 删除试卷的按钮事件
  delete = async () => {
    const arr = this.state.selectedRowKeys;
    console.log(arr)
    if (arr.length !== 0) {
      const res = await deletePaper(arr);
      res.data.map((ch: { check: string | number; key: string; paper: string; }) => {
        ch.check = ch.check === 1 ? '是' : '否';
        ch.key = ch.paper;
      })
      this.setState({ data: res.data });
      message.success(res.msg);
    }
  };
  // 新建试卷的按钮事件
  add = () => {
    window.location.href = ADD;
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

    
    return(
      <Layout >
        <Navbar/>

        <Layout>
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
                title='开始时间'
                dataIndex='time_begin'
                key='time_begin'
              />

              <Table.Column 
                title='截止时间'
                dataIndex='time_end'
                key='time_end'
              />

              <Table.Column 
                title='剩余时间'
                dataIndex='remaining_time'
                key='remaining_time'
              />

              <Table.Column 
                title='作答时长'
                dataIndex='answer_time'
                key='answer_time'
              />

              <Table.Column 
                title='操作'
                dataIndex='action'
                key='action'
                fixed='right'
                render={
                  (text: any, record: any) => {
                    console.log(record)
                    return(
                      <Space size="middle">
                        <a href={`${ MODIFY }?paper=${ record.paper }`}>修改试卷</a>
                      </Space>
                    )
                  }
                }
              />
            </Table>
          </Content>
        </Layout>
      </Layout>
    )
  }
}