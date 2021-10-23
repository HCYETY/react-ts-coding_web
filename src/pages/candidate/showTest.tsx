import React from 'react';

import { getUrlParam } from 'public/utils';
import Test from 'public/components/test';
import Head from 'public/components/header';
import Foot from 'public/components/footer';
import { showTest } from 'src/api/modules/interface';

export default class ShowTest extends React.Component {
  state = {
    tableArr: [] = [],
  }

  async componentDidMount() {
    const url = getUrlParam('paper');
    const res = await showTest({ paper: url });
    this.setState({ tableArr: res.data });
    console.log(this.state.tableArr);
  }

  render() {
    const { tableArr } = this.state;

    return(
      <div >
        <Head />

        <div style={{ borderRadius: '10px', boxShadow: '0 0 6px #000', width: '60%', 
  margin: '30px', border: '1px solid black' }}>
          {
            tableArr.map(item => {
              return(
                <Test
                  num={ item['num'] }
                  title={ item['test_name'] }
                  key={ item['test_name'] }
                  tags={ item['tags'] }
                  // testsNum={ item['paper']['tests_num'] }
                  timeBegin={ item['paper']['time_begin'] }
                  timeEnd={ item['paper']['time_end'] }
                  level={ item['level'] }
                  point={ item['point'] }
                  status={ item['check'] }
                >

                </Test>
              )
            })
          }
        </div>

        <Foot />
      </div>
    )
  }
}