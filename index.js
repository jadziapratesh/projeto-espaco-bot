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
const URL = process.env.URL

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

const bom_dia = '(\\bbd\\s|\\bbd$|\\bbom dia|\\bvon dos)'
const boa_tarde = '(\\bbt\\s|\\bbt$|\\bboa tarde)'
const boa_noite = '(\\bbn\\s|\\bbn$|\\bboa noite)'
const regex = new RegExp(bom_dia + '|' + boa_tarde + '|' + boa_noite, 'i')
bot.hears(regex, ctx => {
    var t = Math.random()
    if (RegExp(boa_noite, 'i').test(ctx.update.message.text)) {
        if (t < 0.03) r = 'Gooooood Niiiiiiight'
        else if (t < 0.1) r = 'noite boa a'
        else if (t < 0.7) r = 'bn'
        else r = 'boa noite'
    } else if (RegExp(boa_tarde, 'i').test(ctx.update.message.text)) {
        if (t < 0.7) r = 'bt'
        else r = 'boa tarde'
    } else {
        if (t < 0.03) r = 'von dos'
        else if (t < 0.7) r = 'bd'
        else r = 'bom dia'
    }
    // nome
    if (ctx.message.from.last_name == null || Math.random() < 0.5) r = `${r} ${ctx.message.from.first_name}`
    else r = `${r} ${ctx.message.from.first_name} ${ctx.message.from.last_name}`
    // exclamação
    if (Math.random() < 0.6) r = `${r} !`
    else r = `${r} !!!`
    // empolgação
    if (Math.random() < 0.2) r = r.toUpperCase()
    else r = r.toLowerCase()
    // emote adicional
    ctx.reply(r)
    if (Math.random() < 0.2) {
        t = Math.random()
        if (t < 0.3) e = '😍😍😍😍😍😍'
        else if (t < 0.5) e = '👽👽👽👽👽👽👽'
        else if (t < 0.6) e = '❤️️❤️️❤️️❤️️❤️️'
        else e = '😂😂😂😂😂😂😂'
        setTimeout(() => ctx.reply(e), 10000)
    }
})

bot.command('/vamos', ctx => {
    ctx.reply(`Vamos pousar a nave Interprise, ${ctx.message.from.first_name} !`)
})

bot.command('/spoiler', ctx => {
    ctx.reply('https://www.youtube.com/watch?v=QEGS3-l8Egk')
})

bot.command('/agenda', ctx => {
    ctx.reply('Todas Quartas, Sextas e Domingo as 21:30!!')
})

bot.command('/enviar', ctx => {
    if (ctx.message.chat.id == process.env.YHWH) {
        console.log('sending message')
        bot.telegram.sendMessage(process.env.SUPER_CHAT, ctx.message.text.replace(/\/enviar /, ''))
    }
})

bot.command('/bodao', ctx => {
    ctx.reply('https://twitter.com/Bodao1911/status/870302456932171776')
})

app.get('/projetoEspacoBot', (req, res) => {
    res.redirect('https://telegram.me/ProjetoEspacoBot')
})

app.get('/', (req, res) => {
    res.send('Olá irmãos das estrelas!')
})

app.use(bot.webhookCallback(`/bot${env.telegram.token}`))

app.listen(PORT, () => {
    console.log(`Rodando o servidor na porta ${PORT}`)
})
