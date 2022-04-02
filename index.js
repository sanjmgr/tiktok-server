const express = require('express')
const app = express()
const { WebcastPushConnection } = require('tiktok-livestream-chat-connector')

let username = 'bishallama_21'

let chatConnection = new WebcastPushConnection(username)

chatConnection
    .connect()
    .then(state => {
        console.info(`Connected to roomId ${state.roomId}`)
    })
    .catch(err => {
        console.error('Failed to connect', err)
    })

chatConnection.on('chat', data => {
    console.log(data)
    const chats = []
    app.get('/chat', (req, res) => {
        chats.push(data)
        res.send(chats)
    })
})

chatConnection.on('gift', data => {
    const gifts = []
    app.get('/gift', (req, res) => {
        gifts.push(data)
        res.send(gifts)
    })
})

chatConnection.on('streamEnd', () => {
    console.log('Stream ended')
})

// chatConnection.on('rawData', (messageTypeName, binary) => {
//     console.log(messageTypeName, binary)
// })

chatConnection.on('error', err => {
    console.error('Error!', err)
})

chatConnection.on('member', data => {
    console.log(`${data.uniqueId} joins the stream!`)
})

app.get('/', (req, res) => res.send('Hello World!'))

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server started at port ${PORT}`))
