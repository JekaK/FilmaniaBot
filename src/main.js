const Telegraf = require('telegraf');
const exp = require('express');
const app = exp();
const botToken = require('../config/config').botToken;
const tokenDb = require('../config/config').tokenDB;
const bot = new Telegraf(botToken);
const LocalSession = require('telegraf-session-local');
const request = require('request');
const util = require('../Util/Util');

setInterval(() => {
    bot.telegram.getWebhookInfo()
        .then((res) => {
            if (res.url === '') {
                bot.telegram.setWebhook('https://green.pubcrawlapp.net/' + botToken)
                    .then(() => {
                        console.log('Hook was set')
                    })
            }
        });
}, 2000);


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
bot.command('/start',ctx=>{
    ctx.reply('Hello')
});

bot.on('inline_query', (ctx) => {
    if (ctx.inlineQuery.query !== '')
        fetchData(ctx.inlineQuery.query, (b) => {
            const results = b.results.map((movie) => {
                return {
                    type: 'article',
                    id: movie.id,
                    title: movie.title,
                    description: movie.overview,
                    thumb_url: `http://image.tmdb.org/t/p/original${movie.poster_path}`,
                    input_message_content: {
                        message_text: `<b>${movie.title}</b>` +
                        `\n⭐ ${movie.popularity}` +
                        `\n📅 ${movie.release_date}` +
                        `\n🌐 ${movie.original_language}` +
                        `\n🎭 ${movie.genre_ids}` +
                        `\n\n${movie.overview}\n` +
                        `\n <a href="http://image.tmdb.org/t/p/original${movie.poster_path}">&#160;</a>`,
                        parse_mode: 'HTML',
                        disable_web_page_preview: false
                    }
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

/*
bot.startPolling();
*/
bot.telegram.setWebhook('https://green.pubcrawlapp.net/' + botToken);
app.use(bot.webhookCallback('/' + botToken));

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.listen(3800, () => {
    console.log(`Server run on port ${3800}`)
});

module.exports = {
    bot: bot
};