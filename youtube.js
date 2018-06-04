const axios = require('axios')

module.exports = (callback) =>
    axios.get(`https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_TOKEN}&part=snippet&channelId=${process.env.CHANNEL_ID}&eventType=live&type=video&fields=items(id%2Csnippet%2Ftitle)`)
        .then((res, data) => callback(res.data))
        .catch(e => console.log(e))