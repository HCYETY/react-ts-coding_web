import React, { PureComponent } from 'react';
import { testSubmit } from 'api/modules/demo';

class Candidate extends PureComponent {
  submit = async () => {
    const res = await testSubmit();
    alert(res.message);
  }
  render() {
    return(
      <div>
        你好呀，你终于来啦
        <button onClick={this.submit}>向服务器发送请求</button>
        候选人模块
      </div>
    )
  }
}

export default Candidate;