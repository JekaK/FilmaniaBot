const Telegraf = require('telegraf');
const exp = require('express');
const app = exp();
const botToken = require('../config/config').botToken;
const tokenDb = require('../config/config').tokenDB;

const path = require('path');
const bodyParser = require('body-parser');


function fetchData(){
    request({
        method: 'GET',
        url: `http://api.themoviedb.org/3/search/movie?api_key=${dbToken}&query=${req.body.query}&page=${req.body.page}`,
        headers: [
            {
                name: 'content-type',
                value: 'application/json;charset=utf-8'
            }
        ]
    }, (err, resp, body) => {
        let b = JSON.parse(body);
        util.genreIdChecker(b);
        handleResponse(res, 200, b)
    })
}


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