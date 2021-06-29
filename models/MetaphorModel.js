const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MetaphorModelSchema = new Schema({
    name: {
        type: String,
        required: true
    },    
    comment: {
        type: String,
        required: false
    }
}, {
    collection: 'metaphor_models'
});


module.exports = mongoose.model('MetaphorModel', MetaphorModelSchema);