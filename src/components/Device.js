import React, { Component } from 'react'
import TimeUpdate from './TimeUpdate'
import ModalDevice from './ModalDevice'

let moment = require('moment-timezone')
moment.locale('th')

window.checkMillisUpdate = 0

class Device extends Component {

  constructor (props) {
    super(props)
    this.data = this.props.data
    this.state = {
      classUpdate: 'text-primary'
    }
    this.runtime = moment.now() - this.data.d.millis
  }

  componentWillReceiveProps (nextProps) {
    window.checkMillisUpdate = nextProps.data.d.millis
  }

  shouldComponentUpdate (nextProps, nextState) {
    let shouldUpdate = false
    if (nextProps.data.d.millis > this.data.d.millis) {
      shouldUpdate = true
      this.data = {
        ...nextProps.data,
        ...{classCardHeader: 'card-header bg-success'}
      }
      this.runtime = moment.now() - this.data.d.millis
    }
    return shouldUpdate
  }

  componentDidMount () {
    this.timer = setInterval(() => {
      let currentMillis = moment.now() - this.data.d.millis
      let timeout = (60000 * 5) // 5 minute
      // console.log('currentMillis : ', currentMillis, ' run time : ', this.runtime)
      if ((currentMillis - this.runtime) > timeout) {
        // console.log(this.data.d.myName,' offline.')
        this.data.classCardHeader = 'card-header bg-secondary'
        this.forceUpdate()
      }
    }, 1000)
  }

  componentWillUnmount () {
    clearInterval(this.timer)
  }

  handleOnClick = (e) => {
    e.preventDefault()
    return <ModalDevice/>
  }

  render () {
    return (
      <div className="col-12 col-md-3">
        <div className="form-group">
          <div className="card">
            <div className={this.data.classCardHeader}>
              <span style={{color: 'white'}}>{this.data.d.myName}</span>
            </div>
            <div className="card-body text-primary">
              <p>ip : {this.data.info.ip}</p>
              <p>heap : {this.data.d.heap}</p>
              <p>run time : {moment(this.runtime).fromNow()}</p>
              <p>millis : {this.data.d.millis}</p>
              <p>prefix : {this.data.info.prefix}</p>

              <TimeUpdate data={this.data}/>

              <ModalDevice data={this.data}/>

            </div>
          </div>
        </div>
      </div>
    )
  }

}

export default Device