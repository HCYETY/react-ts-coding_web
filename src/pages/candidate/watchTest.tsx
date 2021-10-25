import React from 'react';

import 'style/programInform.less';
import ProgramInform from 'common/components/programInform';

export default class App extends React.Component {



  render() {

    return(
      <div className="whole">
        <div className="left">
          <ProgramInform />
        </div>

        <div className="right">
          <span>你好</span>
        </div>
      </div>
    )
  }
}