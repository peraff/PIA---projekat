var mongo = require('mongoose'); 

module.exports = mongo.model('Komentar', mongo.Schema({
    nazivK: String,
    korisnik: String, 
    komentar: String,
    ocena: Number,
    autoriK: String
}));