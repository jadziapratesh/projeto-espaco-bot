const admin = require('firebase-admin')
const jwt = require('jsonwebtoken')
const fs = require('fs')

var serviceAccount = jwt.verify(fs.readFileSync('./private.key', 'utf8'), process.env.JWT)

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASEURL
})
const database = admin.database()

function db() {
    this.create = (chat, status) =>
        database.ref('grupos/' + chat.id).set({
            title: chat.title || ((chat.last_name == null) ? chat.first_name : chat.first_name + ' ' + chat.last_name),
            type: chat.type,
            status: status
        }).catch(e => console.log(e))

    this.list = () =>
        new Promise((res) =>
            database.ref('grupos')
                .orderByChild('status')
                .equalTo(true)
                .once('value', (snapshot) => res(snapshot.val()))
        )

    this.apelidar = (chat, apelido) =>
        database.ref('apelidos/' + chat.id).set({
            username: chat.username,
            apelido: apelido
        }).catch(e => console.log(e))

    this.desapelidar = (chat) =>
        database.ref('apelidos/' + chat.id).remove()

    this.apelido = (id) =>
        new Promise((res) =>
            database.ref('apelidos/' + id)
                .child('apelido')
                .once('value', (snapshot) => res(snapshot.val() || false))
        )
}

module.exports = new db()