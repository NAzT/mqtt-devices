import mqtt from 'mqtt'
import TypeActions from './redux/constants'
import store from './redux/store'

let moment = require('moment-timezone')
moment.locale('th')

window.MQTTGlobal = ''

const MQTT_Connect = (init) => {

  console.log(init)

  let options = {
    clientId: init.clientId,
    clean: true,
    port: parseInt(init.port, 0)
  }

  if (init.username || init.password) {
    options.username = init.username
    options.password = init.password
  }

  let client = mqtt.connect('mqtt://' + init.host, options)

  client.on('connect', function () {
    client.subscribe(init.topic)
    client.subscribe('CMMC/+/lwt')
    // client.publish("CMMC/4639313/$/command", "OFF")
    window.MQTTGlobal = client
    store.dispatch({
      type: TypeActions.MQTT_CONNECTION_SUCCESS
    })
  })

  client.on('message', function (topic, message, packet) {

    try {
      let messageIncome = JSON.parse(message.toString())

      if (messageIncome.status !== undefined && messageIncome.id !== undefined) { // lwt check
        store.dispatch({
          type: TypeActions.LWT,
          data: messageIncome
        })
      }

      if (messageIncome.d !== undefined && messageIncome.info !== undefined) {
        messageIncome.d.timestamp = moment.now()
        store.dispatch({
          type: TypeActions.MQTT_MESSAGE_ARRIVED,
          data: messageIncome
        })
        if (packet.retain) {
          messageIncome.classCardHeader = 'card-header bg-secondary'
          store.dispatch({
            type: TypeActions.DEVICES_OFFLINE,
            data: messageIncome
          })
        } else {
          messageIncome.classCardHeader = 'card-header bg-success'
          store.dispatch({
            type: TypeActions.DEVICES_ONLINE,
            data: JSON.parse(message.toString())
          })
        }
      }

    } catch (e) {

    }

  })

}

const MQTT_Reconnect = () => {
  window.MQTTGlobal.reconnect()
}

const MQTT_Disconnect = () => {
  window.MQTTGlobal.end()
  store.dispatch({
    type: TypeActions.MQTT_DISCONNECT
  })
}

const MQTT_Publish = (topic, value) => {
  // console.log(topic, value)
  // console.log(window.MQTTGlobal)
  // debugger
  window.MQTTGlobal.publish(topic, value)
}

export {
  MQTT_Connect,
  MQTT_Disconnect,
  MQTT_Reconnect,
  MQTT_Publish
}
