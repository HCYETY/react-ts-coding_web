import React from 'react';
import 'style/candidate/countDown.less';
import { getDays } from 'common/utils';

export default class CountDown extends React.Component<any, any> {

  state = {
    days: 1,
    hours: 1,
    minutes: 1,
    seconds: 1,
  }

  componentDidMount = () => {
    // 获取更新后的 this.props.over ，这里使用 setTimeout ，或许有更好的方法？
    setTimeout(() => {
      if (this.props.over === true) {
        this.setState({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        })
      } else {
        this.countDown();
      }
    }, 500);
  };
  
	countDown = () => {
    this.timer = setInterval(() => {
      const nowtime = new Date().getTime();
      const endtime = this.props.endTime;
      const { days, hours, minutes, seconds } = this.state;
      this.setState({
        days: getDays(nowtime, endtime, 1),
        hours: getDays(nowtime, endtime, 2),
        minutes: getDays(nowtime, endtime, 3),
        seconds: getDays(nowtime, endtime, 4),
      })
      if (days===0 && hours===0 && minutes===0 && seconds===0) {
        this.props.submitPaper();
      }
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