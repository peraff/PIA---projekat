var mongo = require('mongoose'); 

module.exports = mongo.model('Procitana', mongo.Schema({
    nazivK: String,
    korisnik: String, 
    zanroviK: String
}));