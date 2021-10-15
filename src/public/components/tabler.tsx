import React from 'react';
import { Table, Space, Button, Tag } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

export default class Tabler extends React.Component{
  // 从 testArr 数组中删除试题
  deleteTest = (values: any) => {
    console.log('可以删除的元素', values)
  }

  render() {
    const columns = [
      { title: '题号', dataIndex: 'num', key: 'num' },
      { title: '题目', dataIndex: 'testName', key: 'testName' },
      {
        title: '标签', 
        dataIndex: 'tags', 
        key: 'tags',
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
        )
      },
      { title: '难易度', key: 'level', dataIndex: 'level' },
      { title: '分数', dataIndex: 'point', key: 'point' },
      {
        title: '操作',
        key: 'action',
        render: () => (
          <Space size="middle">
            <Button 
              className="site-layout-content-button" 
              icon={<DeleteOutlined/>}
              onClick={this.deleteTest}
            >
            </Button>
          </Space>
        ),
      },
    ];

    return(
      <Table 
        columns={ columns } 
        dataSource={ tableArr } 
        expandable={{
          expandedRowRender: record => <p>{ record['description'] }</p>,
          rowExpandable: record => record['test'],
        }}
      />
    )
  }
}