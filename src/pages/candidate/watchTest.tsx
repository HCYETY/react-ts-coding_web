import React from 'react';

// import 'style/candidate/programInform.less';
import ProgramInform from 'common/components/candidate/programInform';

export default class App extends React.Component {



  render() {

    return(
      <div className="whole candidate-site-layout">
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