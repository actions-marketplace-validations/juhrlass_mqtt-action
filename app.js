const mqtt = require('mqtt')
const core = require('@actions/core')

const maxReconnects = core.getInput('maxReconnects') !== '' ? core.getInput('maxReconnects') : 10
let reconnectCounter = 0

const options = {
  protocol: core.getInput('protocol'),
  host: core.getInput('host'),
  port: core.getInput('port'),
  username: core.getInput('username'),
  password: core.getInput('password')
}

const topic = core.getInput('topic')
const message = core.getInput('message')

console.log('Try connecting to mqtt broker with ' + maxReconnects + ' maximum reconnects')

const client = mqtt.connect(options)

client.on('connect', function () {
  console.log('Connected!')
  client.publish(topic, message, function (err) {
    if (!err) {
      console.log('Successfully published message to topic')
    } else {
      console.error('Could not publish message to topic')
    }
  })
  client.end()
})

client.on('reconnect', function () {
  if (reconnectCounter === maxReconnects) {
    client.end()
    process.exitCode = 1
  } else {
    reconnectCounter++
    console.log('Reconnect [' + reconnectCounter + '/' + maxReconnects + ']')
  }
})
