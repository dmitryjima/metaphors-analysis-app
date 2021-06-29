const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EditionSchema = new Schema({
    lang: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    pictureURL: {
        type: String,
        required: false
    },
    description: {
        type: String,
        required: false
    }
}, {
    collection: 'editions'
});


module.exports = mongoose.model('Edition', EditionSchema);