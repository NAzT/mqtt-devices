import TypeActions from './constants'

let initialState = {
  devices: [],
  arrayDevices: [],
  filterDevices: [],
  devicesOnline: [],
  devicesOffline: [],
  checkedOnline: false,
  checkedOffline: false,
  connection: false,
  lwt: [],
  specificUpdate: '',
      mqtt: {
    host: '',
    port: '',
    clientId: '',
    username: '',
    password: '',
    topic: ''
  }
}

export default function(state = initialState, action) {

  switch (action.type) {

    case TypeActions.MQTT_CONNECT :
      state.mqtt = {
        host: action.data.host,
        port: action.data.port,
        clientId: action.data.clientId,
        username: action.data.username,
        password: action.data.password,
        topic: action.data.topic
      }
      break

    case TypeActions.MQTT_DISCONNECT:

      break

    case TypeActions.MQTT_CONNECTION_SUCCESS:
      state.connection = true
      break

    case TypeActions.MQTT_MESSAGE_ARRIVED:
      let d = action.data.d
      let info = action.data.info
      let devices = state.devices
      let dataOffline = action.data
      if (state.lwt[`id-${info.id}`].status === 0) {
        dataOffline.classCardHeader = 'card-header bg-secondary'
      }

      if (devices[d.myName] === undefined) {
        devices[d.myName] = dataOffline
      } else {
        dataOffline.classCardHeader = 'card-header bg-success'
        devices[d.myName] = dataOffline
        state.specificUpdate = d.myName
      }

      Object.keys(devices).forEach((key, idx) => {
        if (state.arrayDevices[idx] === undefined) {
          state.arrayDevices[idx] = devices[key]
        } else {
          if (key === d.myName) {
            // console.log('update only ', key)
            devices[key].classUpdate = 'text-danger'
            state.arrayDevices[idx] = devices[key]

            setTimeout(() => {
              devices[key].classUpdate = 'text-primary'
              state.arrayDevices[idx] = devices[key]
            }, 2000)
          }
        }
      })
      break

    case TypeActions.MQTT_FILTER_DEVICES_NAME:

      break

    case TypeActions.CHECKED_ONLINE:

      break

    case TypeActions.CHECKED_OFFLINE:

      break

    case TypeActions.DEVICES_ONLINE:
      if (state.devicesOnline[action.data.d.myName] === undefined) {
        state.devicesOnline[action.data.d.myName] = action.data
      }
      return {...state, devicesOnline: [action.data.d.myName] = action.data}

    case TypeActions.DEVICES_OFFLINE:
      if (state.devicesOffline[action.data.d.myName] === undefined) {
        state.devicesOffline[action.data.d.myName] = action.data
      }
      return {...state, devicesOffline: [action.data.d.myName] = action.data}

    case TypeActions.LWT:
      state.lwt[`id-${action.data.id}`] = action.data
      break

    default:
      console.log('default state')
      return state

  }

}