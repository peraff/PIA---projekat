var mongo = require('mongoose'); 

module.exports = mongo.model('Desavanja', mongo.Schema({
    naziv: String,
    pocetak: String,
    kraj: String,
    opis: String
}));