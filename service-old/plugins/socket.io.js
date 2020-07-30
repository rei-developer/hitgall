import Vue from 'vue'
import io from 'socket.io-client'

Vue.prototype.$socket = io(process.env.SOCKET_HOST_URL, {
    path: '/socket.io',
    transports: ['websocket'],
    secure: true
})