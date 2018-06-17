const Telegraf = require('telegraf')
const bot = new Telegraf(process.env.TELEGRAM_TOKEN, {telegram: {webhookReply: false}})
const db = require('./firebase')
const yt = require('./youtube')
const stickers = require('./stickers')

var last_videoId = null

bot.start(({ chat, reply }) => {
    console.log('== bot started by ==', chat)
    db.create(chat, true)
    msg = (chat.type) == 'private' ? 'Olá irmão das estrelas!' : 'Olá irmãos das estrelas'
    reply(msg)
})

const sendMessage = msg => {
    db.list().then(grupos => {
        Object.keys(grupos).forEach((chat_id) => {
            bot.telegram.sendMessage(chat_id, msg).catch(() => {
                grupos[chat_id].id = chat_id
                db.create(grupos[chat_id], false)
            })
        })
    })
}

const checkYouTube = () => {
    yt().then(data => {
        console.log('== checking youtube ==')
        if (data.items.length > 0 && data.items[0].id.videoId != last_videoId) {
            console.log('== sending video ==', data.items[0].id.videoId)
            last_videoId = data.items[0].id.videoId
            sendMessage(`${data.items[0].snippet.title} https://youtube.com/watch?v=${data.items[0].id.videoId}`)
        }
    })
}

bot.hears(/^oi$/i, ({ reply, message }) => {
    var r
    r = (Math.random() < 0.7) ? 'Oi' : 'Oiii'
    r = (Math.random() < 0.4) ? `${r} ❤️️❤️️❤️️` : `${r} 😂😂😂`
    reply(r, ({ 'reply_to_message_id': message.message_id }))
})

const bom_dia = '(\\bbd\\s|\\bbd$|\\bbom dia|\\bvon dos)'
const boa_tarde = '(\\bbt\\s|\\bbt$|\\bboa tarde)'
const boa_noite = '(\\bbn\\s|\\bbn$|\\bboa noite)'
bot.hears(RegExp(`${bom_dia}|${boa_tarde}|${boa_noite}`, 'i'), ({ match, message, reply }) => {
    var t = Math.random()
    var r
    if (RegExp(boa_noite, 'i').test(match[0])) {
        if (t < 0.03) r = 'Gooooood Niiiiiiight'
        else if (t < 0.1) r = 'noite boa a'
        else if (t < 0.7) r = 'bn'
        else r = 'boa noite'
    } else if (RegExp(boa_tarde, 'i').test(match[0])) {
        if (t < 0.7) r = 'bt'
        else r = 'boa tarde'
    } else {
        if (t < 0.03) r = 'von dos'
        else if (t < 0.7) r = 'bd'
        else r = 'bom dia'
    }
    // nome / apelido
    db.apelido(message.from.id).then(apelido => {
        if (apelido) {
            r = `${r} ${apelido}`
        } else {
            if (message.from.last_name == null || Math.random() < 0.5) r = `${r} ${message.from.first_name}`
            else r = `${r} ${message.from.first_name} ${message.from.last_name}`
        }
        // exclamação
        if (Math.random() < 0.6) r = `${r} !`
        else r = `${r} !!!`
        // empolgação
        if (Math.random() < 0.2) r = r.toUpperCase()
        else r = r.toLowerCase()
        // resposta
        reply(r)
        // emote adicional
        if (Math.random() < 0.2) {
            t = Math.random()
            if (t < 0.3) e = '😍😍😍😍😍😍'
            else if (t < 0.5) e = '👽👽👽👽👽👽👽'
            else if (t < 0.6) e = '❤️️❤️️❤️️❤️️❤️️'
            else e = '😂😂😂😂😂😂😂'
            setTimeout(() => reply(e), 10000)
        }
    })
})

bot.command(['/agenda', `/agenda@${process.env.BOT_USER}`], ({ reply }) => {
    reply('Todas Quartas, Sextas e Domingos as 21:30 !!')
})

bot.command(['/pede', `/pede@${process.env.BOT_USER}`], ({ reply }) => {
    var msg
    yt().then(data => {
        if (data.items.length > 0) msg = `${data.items[0].snippet.title} https://youtube.com/watch?v=${data.items[0].id.videoId}`
        else msg = 'A nave Interprise ainda não pousou, digite /agenda para saber quando iremos pousar !'
        reply(msg)
    })
})

bot.command(['/desisto', '/desistir'], ({ reply }) =>
    reply('Eu desisto de tudo que é injustiça. Eu desisto de tudo que contraria a bondade. Eu desisto de tudo que me leva a ser uma pessoa estúpida. Eu desisto de tudo que faz com que eu seja uma pessoa infeliz na minha vida. Eu desisto de ser infeliz. Eu desisto de ser uma pessoa mesquinha. Eu desisto de ficar enchendo sua paciência. Eu desisto de ser uma pessoa meiga e não ser tratado bem por você. Eu desisto de dar o meu amor pra você e você não retribuir em nada para mim. Eu desisto, desisto de ser apenas um tolo, mas eu aceito ser, aceito ser alguém importante... pra mim mesmo, porque eu tenho o criador e sou o criador porque o criador está dentro de mim.')
)

bot.hears(Object.keys(stickers), ({ replyWithSticker, match }) => {
    replyWithSticker(stickers[match])
})

bot.command('/banner', ({ replyWithSticker }) => {
    replyWithSticker('CAADAQADsQYAArhZlAoAAex598qxsNAC').then(
    replyWithSticker('CAADAQADsgYAArhZlAr_YiBRu7BuHQI')).then(
    replyWithSticker('CAADAQADswYAArhZlAqQMb2dpEXfeQI'))
})

bot.command('/apelidar', ({ message, replyWithMarkdown }) => {
    var tmp = message.from
    var nome = ((tmp.last_name == null) ? tmp.first_name : tmp.first_name + ' ' + tmp.last_name)
    var apelido = message.text.replace(/\/apelidar/, '').trim()
    if (apelido) {
        db.apelidar(tmp, apelido)
        replyWithMarkdown(`A partir de agora o *${nome}* será conhecido como *${apelido}* !`)
    } else {
        db.desapelidar(tmp)
        replyWithMarkdown(`Vou te chamar pelo seu nome, *${nome}* !`)
    }
})

bot.command('/vamos', ({ message, reply }) => {
    db.apelido(message.from.id).then(apelido => {
        reply(`Vamos pousar a nave Interprise, ${apelido || message.from.first_name} !`)
    })
})

bot.command('/spoiler', ({ reply }) => {
    reply('https://www.youtube.com/watch?v=QEGS3-l8Egk')
})

bot.command('/enviar', ({ message }) => {
    if (message.chat.id == process.env.YHWH) {
        console.log('== sending message ==')
        bot.telegram.sendMessage(process.env.SUPER_CHAT, message.text.replace(/\/enviar /, ''))
    }
})

bot.command('/bodao', ({ reply }) => {
    reply('https://twitter.com/Bodao1911/status/870302456932171776')
})

module.exports = { bot, checkYouTube }