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
import { LOOK_OVER, PAPER_CONSULT } from 'src/common/const';
import Navbar from 'src/common/components/navbar';

export default class LookOver extends React.Component {

  state = {
    tableArr: [] = [],
  }
  componentDidMount() {
    search().then(result => {
      const res = result.data.show;
      const arr: any[] = [];
      res.map((item: { email: string; paper: string; look_over: PAPER_CONSULT; }) => {
        if (arr.indexOf(item.paper) === -1) {
          arr.push(item);
        }
      })
      arr.map(item => {
        item.look_over === false ? item.look_over = PAPER_CONSULT.NO : item.look_over = PAPER_CONSULT.YES;
      })
      this.setState({ tableArr: arr });
    })
  }

  render() {
    const { tableArr } = this.state;
    const columns = [
      { title: '试卷', dataIndex: 'paper', key: 'paper' },
      { title: '候选人邮箱', dataIndex: 'email', key: 'email' },
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
                onClick: () => { window.location.href = `${ LOOK_OVER }?exam=${ record['test_name'] }` }, // 点击行
                onMouseEnter: event => { console.log('xxxxx', record) }, // 鼠标移入行
              };
            }}
          />
        </Layout.Content>
      </div>
    )
  }
}