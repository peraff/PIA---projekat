var mongo = require('mongoose'); 

module.exports = mongo.model('Citanje', mongo.Schema({
    nazivK: String,
    korisnik: String,
    procitao: Number,
    ukupno: Number
}));