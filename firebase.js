const env = require('./configEnv')
const firebase = require('firebase')
require('firebase/database')

firebase.initializeApp(env.firebase)
var database = firebase.database()

function db() {
    this.create = (chat, status) =>
        database.ref('grupos/' + chat.id).set({
            title: chat.title || ((chat.last_name == null) ? chat.first_name : chat.first_name + ' ' + chat.last_name),
            type: chat.type,
            status: status
        }).catch(e => console.log(e))

    this.list = (callback) => 
        database.ref('grupos')
            .orderByChild('status')
            .equalTo(true)
            .once('value', (snapshot) => callback(snapshot.val()))

    this.apelidar = (chat, apelido) =>
        database.ref('apelidos/' + chat.id).set({
            username: chat.username,
            apelido: apelido
        }).catch(e => console.log(e))

    this.desapelidar = (chat) =>
        database.ref('apelidos/' + chat.id).remove()

    this.apelido = (id, callback) =>
        database.ref('apelidos/' + id)
            .child('apelido')
            .once('value', (snapshot) => callback(snapshot.val() || false))
}

module.exports = new db()