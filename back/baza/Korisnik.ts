var mongo = require('mongoose'); 

module.exports = mongo.model('Korisnik', mongo.Schema({
    ime: String,
    prezime: String,
    lozinka: String, 
    korIme: String,
    mejl: String,
    tip: String,
    drzava: String,
    grad: String,
    datum: String, 
    slika: String
}));