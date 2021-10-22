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

        <div style={{ borderColor: 'rgba(0,10,32,.05)' }}>
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
                  level={ item['level'] }
                  point={ item['point'] }
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