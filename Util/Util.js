const genre = require('../const/const').genre;


function genreIdChecker(body) {

    body.results.forEach((item, i, arr) => {
        item.genre_ids.forEach((genreId, iGenre, arr) => {
            genre.forEach((gObj, i, arr) => {
                if (genreId === gObj.id) {
                    item.genre_ids[iGenre] = gObj.name
                }
            })
        })
    });
}

module.exports = {
    genreIdChecker
};
