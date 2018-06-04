require('dotenv').config()
const bot = require('./bot')
const express = require('express')
const app = express()

const PORT = process.env.PORT || 3000
const URL = process.env.URL

var last_videoId = null

bot.telegram.setWebhook(`${URL}/bot${process.env.TELEGRAM_TOKEN}`)

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