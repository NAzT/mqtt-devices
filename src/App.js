import React, { Component } from 'react'
import Connection from './components/Connection.js'
import Filter from './components/Filter'
import Content from './components/Content'
import logo from './assets/cmmc-logo.png'

export default class App extends Component {

  constructor (props) {
    super(props)

    this.state = {
      hiddenDiv: 'none',
      devices: []
    }

    this.store = this.props.store
    this.getState = this.props.store.getState()

    this.store.subscribe(() => {

      if (Object.keys(this.getState.devices).length === 0) {
        this.setState({hiddenDiv: 'block'})
      } else {
        this.setState({hiddenDiv: 'none'})
      }

    })
  }

  render () {
    return (
      <div className="container">
        <div className="row" style={{marginTop: 20}}>
          <div className="col-12 col-md-12">
            <img src={logo} style={{height: 40, marginBottom: 20}} alt=""/>
          </div>
          <Filter connection={this.state.connection}/>
          <Connection store={this.props.store}/>
          <Content store={this.store} hiddenDiv={this.state.hiddenDiv}/>
        </div>
      </div>
    )
  }
}
