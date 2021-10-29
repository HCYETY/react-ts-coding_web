import React from 'react';
import 'style/countDown.less';
import { getDays, nowTime } from 'common/utils';

export default class CountDown extends React.Component<any, any> {

  state = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  }

  componentDidMount = () => {
    this.countDown();
  };
  
	countDown = () => {
    this.timer = setInterval(() => {
      const nowtime = nowTime();
      const endtime = this.props.endTime;
      this.setState({
        days: getDays(nowtime, endtime, 1),
        hours: getDays(nowtime, endtime, 2),
        minutes: getDays(nowtime, endtime, 3),
        seconds: getDays(nowtime, endtime, 4),
      })
      console.log('hhhhhhhhhhhhhhhhhhh')
    }, 1000);
	}
  timer: NodeJS.Timeout;
  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const { days, hours, minutes, seconds } = this.state;

    return(
      <div className="time-box">

        <div className="time"> 
          <div className="times"> { days } </div>
          <h2> 天 </h2>
        </div>

        <div className="time"> 
          <div className="times"> { hours } </div>
          <h2> 时 </h2>
        </div>

        <div className="time"> 
          <div className="times"> { minutes } </div>
          <h2> 分 </h2>
        </div>

        <div className="time"> 
          <div className="times"> { seconds } </div>
          <h2> 秒 </h2>
        </div>

      </div>
    )
  }
}