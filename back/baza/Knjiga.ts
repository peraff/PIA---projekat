var mongo = require('mongoose'); 

module.exports = mongo.model('Knjiga', mongo.Schema({
    nazivK: String,
    autoriK: String,
    datumK: String, 
    zanroviK: String,
    opisK: String,
    slikaK: String, 
    odobrena: Boolean
}));