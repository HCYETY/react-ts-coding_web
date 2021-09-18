import React, { PureComponent } from 'react'

import {test_submit} from '../../api/modules/demo'

class Home extends PureComponent {
  submit = async() => {
    const res = await test_submit()
    alert(res.message)
  }
  render() {
    return(
      <div>
        你好呀，你终于来啦
        <button onClick={this.submit}>向服务器发送请求</button>
      </div>
    )
  }
}

export default Home;