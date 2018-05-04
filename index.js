const env = require('./configEnv')
const express = require('express')
const Telegraf = require('telegraf')
const schedule = require('node-schedule')
const moment = require('moment')
const bot = new Telegraf(env.telegram.token)
const db = require('./firebase')
const yt = require('./youtube')
const app = express()

const PORT = process.env.PORT || 3000
const URL = process.env.URL || 'https://matchpet.net'

var last_videoId = null

bot.telegram.setWebhook(`${URL}/bot${env.telegram.token}`)

bot.start(ctx => {
    console.log('bot started by', ctx.chat)
    db.create(ctx.chat, true)
    msg = (ctx.chat.type) == 'private' ? 'Olá irmão das estrelas!' : 'Olá irmãos das estrelas'
    ctx.reply(msg)
})

const sendMessage = msg => {
    db.list(grupos => {
        Object.keys(grupos).forEach((chat_id) => {
            bot.telegram.sendMessage(chat_id, msg)
        })
    })
}

const checkYouTube = () => {
    yt.check(data => {
        console.log('checking youtube')
        if (data.items.length > 0 && data.items[0].id.videoId != last_videoId) {
            console.log('sending video', data.items[0].id.videoId)
            last_videoId = data.items[0].id.videoId
            sendMessage(data.items[0].snippet.title + ' https://youtube.com/watch?v=' + data.items[0].id.videoId)
        }
    })
}

const notification = new schedule.scheduleJob('*/5 * * * *', checkYouTube)

bot.hears(/(\bbn\s)(\bbot$|\bflad$|\bgrupo$|\birmãos das estrelas$|\bchat)/i, ctx => {
    // frase
    if (Math.random() < 0.5) r = `bn ${ctx.message.from.first_name}`
    else r = `bn ${ctx.message.from.first_name} ${ctx.message.from.last_name}`
    // exclamação
    if (Math.random() < 0.6) r = r + '!'
    else r = r + '!!!'
    // empolgação
    if (Math.random() < 0.2) r = r.toUpperCase()
    // emote adicional
    ctx.reply(r)
    if (Math.random() < 0.2) {
        var t = Math.random()
        if (t < 0.3) e = '😍😍😍😍😍😍'
        else if (t < 0.5) e = '👽👽👽👽👽👽👽'
        else if (t < 0.6) e = '❤️️❤️️❤️️❤️️❤️️'
        else e = '😂😂😂😂😂😂😂'
        setTimeout(() => ctx.reply(e), 10000)
    }
})

// app.get('/projetoEspacoBot', (req, res) => {
//     res.redirect('https://telegram.me/ProjetoEspacoBot')
// })

app.get('/', (req, res) => {
    res.send('Olá irmãos das estrelas!')
})

app.use(bot.webhookCallback(`/bot${env.telegram.token}`))

app.listen(PORT, () => {
    console.log(`Rodando o servidor na porta ${PORT}`)
})