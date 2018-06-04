const axios = require('axios')

module.exports =
    new Promise((resolve) =>
        axios.get(`https://www.googleapis.com/youtube/v3/search?key=${process.env.YOUTUBE_TOKEN}&part=snippet&channelId=${process.env.CHANNEL_ID}&eventType=live&type=video&fields=items(id%2Csnippet%2Ftitle)`)
            .then((res) => resolve(res.data))
            .catch(e => console.log(e))
    )