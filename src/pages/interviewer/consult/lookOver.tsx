import React from 'react';
import { 
  Layout,
  Table,
  Tag,
} from 'antd';
import { 
} from '@ant-design/icons';
import { getCookie } from 'src/common/utils';
import { search } from 'src/api/modules/candidate/interface';
import { PAPER_CONSULT } from 'src/common/const';
import Navbar from 'src/common/components/navbar';

export default class LookOver extends React.Component {

  state = {
    tableArr: [] = [],
  }
  componentDidMount() {
    search().then(result => {
      const res = result.data.show;
      const arr: any[] = [];
      console.log(res)
      res.map((item: { email: string; paper: string; look_over: boolean | PAPER_CONSULT; }) => {
        if (arr.indexOf(item.paper && item.email) === -1) {
          arr.push(item);
        }
      })
      arr.map(item => {
        item.look_over = item.look_over === false ? PAPER_CONSULT.NO : PAPER_CONSULT.YES;
      })
      this.setState({ tableArr: arr });
    })
  }

  render() {
    const { tableArr } = this.state;
    const columns = [
      { title: '试卷', dataIndex: 'paper', key: 'paper' },
      { title: '待批阅', dataIndex: 'look_over', key: 'look_over' },
      {
        title: '阅卷进度', 
        dataIndex: 'progress', 
        key: 'progress',
        // render: (tags: [string]) => (
        //   <span>
        //     {
        //       tableArr.map(tag => {
        //       let color = tag.length > 2 ? 'geekblue' : 'green';
        //       if (tag === 'loser') {
        //         color = 'volcano';
        //       }
        //       return (
        //         <Tag color={color} key={tag}>
        //           {tag}
        //         </Tag>
        //       );
        //     })}
        //   </span>
        // )
      },
    ];
    
    return(
      <div className="site-layout">
        <Navbar/>
        <Layout.Content>
          <Table
            bordered
            columns={ columns } 
            dataSource={ [...tableArr] } 
            onRow={record => {
              return {
                onClick: event => { console.log('hhhh', event) }, // 点击行
                onMouseEnter: event => { console.log('xxxxx', event.detail) }, // 鼠标移入行
              };
            }}
          />
        </Layout.Content>
      </div>
    )
  }
}