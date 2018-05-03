const env = require('./configEnv')
const axios = require('axios')

function YouTube() {
    this.check = (callback) =>
        axios.get(env.youtube.apiUrl + '&part=snippet&channelId=UCXkoYq6nMIVH5iu-0Z35N4A&eventType=live&type=video&fields=items(id%2Csnippet%2Ftitle)')
            .then((res, data) => callback(res.data)).catch(e => console.log(e))
}

module.exports = new YouTube()