const cfg = require ('../../config/config.js');
const nTwitch = require('node-twitch').default;

const twitch = new nTwitch({
    client_id: cfg.twitch.CLIENT_ID,
    client_secret: cfg.twitch.CLIENT_SECRET
});

const getStream = async (streamer) => {
    try {
        const stream = await twitch.getStreams({channels: [streamer]})
        return stream.data.length ? stream.data[0] : false;
    } catch (err) {
        return console.error(err);
    }
};

const getUser = async (streamer) => {
    try {
        const user = await getStream(streamer).then(user => user.user_name);
        return user;
    } catch (err) {
        return console.error(err);
    }
};

const getGame = async (streamer) => {
    try {
        const game = await getStream(streamer).then(game => game.game_name)
        return game;
    } catch (err) {
        return console.error(err);
    }
};

module.exports = { getStream, getUser, getGame};