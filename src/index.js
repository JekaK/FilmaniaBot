const Telegraf = require('telegraf');
const exp = require('express');
const app = exp();
const botToken = require('../config/config').botToken;
const tokenDb = require('../config/config').tokenDB;
const bot = new Telegraf(botToken);
const LocalSession = require('telegraf-session-local');
const request = require('request');
const util = require('../Util/Util');
const path = require('path');
const bodyParser = require('body-parser');


function fetchData(query, cb) {
    request({
        method: 'GET',
        url: `http://api.themoviedb.org/3/search/movie?api_key=${tokenDb}&query=${query}&page=${1}`,
        headers: [
            {
                name: 'content-type',
                value: 'application/json;charset=utf-8'
            }
        ]
    }, (err, resp, body) => {
        let b = JSON.parse(body);
        util.genreIdChecker(b);
        cb(b)
    })
}


bot.on('inline_query', (ctx) => {
    if (ctx.inlineQuery.query !== '')
        fetchData(ctx.inlineQuery.query, (b) => {
            const results = b.results.map((movie) => {
                return {
                    type: 'article',
                    id: movie.id,
                    title: movie.title,
                    message_text: 'text'
                }
            });
            return ctx.answerInlineQuery(results, {
                cache_time: 0
            })
        });
    else {
        return ctx.answerInlineQuery()
    }
});


bot.use(Telegraf.log());
bot.use((new LocalSession({database: 'state.json'})).middleware());

bot.startPolling();

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.listen(3200, () => {
    console.log(`Server run on port ${3200}`)
});

module.exports = {
    bot: bot
};