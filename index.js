require('dotenv').config()
const { bot, checkYouTube } = require('./bot')
const express = require('express')
const schedule = require('node-schedule')
const app = express()

const PORT = process.env.PORT || 3000

const notification = new schedule.scheduleJob('* * * * *', checkYouTube)

bot.telegram.setWebhook(`${process.env.URL}/bot${process.env.TELEGRAM_TOKEN}`)

app.get('/projetoEspacoBot', (req, res) => {
    res.redirect('https://telegram.me/ProjetoEspacoBot')
})

app.get('/', (req, res) => {
    res.send('Olá irmãos das estrelas!')
})

app.use(bot.webhookCallback(`/bot${process.env.TELEGRAM_TOKEN}`))

app.listen(PORT, () => {
    console.log(`Rodando o servidor na porta ${PORT}`)
})