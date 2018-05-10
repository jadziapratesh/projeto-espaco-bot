const env = require('./configEnv')
const firebase = require('firebase')
require('firebase/database')

firebase.initializeApp(env.firebase)
var database = firebase.database()

function db() {
    this.create = (chat, status) =>
        database.ref('grupos/' + chat.id).set({
            title: chat.title || (chat.last_name == null) ? chat.first_name : chat.first_name + ' ' + chat.last_name,
            type: chat.type,
            status: status
        }).catch(e => console.log(e))

    this.list = (callback) => 
        database.ref('grupos')
            .orderByChild('status')
            .equalTo(true)
            .once('value', (snapshot) => callback(snapshot.val()))
}

module.exports = new db()