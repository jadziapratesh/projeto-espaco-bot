require('dotenv').config()

const telegram_token = process.env.TELEGRAM_TOKEN
const youtube_token = process.env.YOUTUBE_TOKEN

module.exports = {
  telegram: {
    token: telegram_token,
    apiUrl: `https://api.telegram.org/bot${telegram_token}`
  },
  youtube: {
    token: youtube_token,
    apiUrl: `https://www.googleapis.com/youtube/v3/search?key=${youtube_token}`
  },
  firebase: {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASEURL,
    projectId: process.env.FIREBASE_PROJECTID,
    storageBucket: process.env.FIREBASE_STORAGEBUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID
  }
}