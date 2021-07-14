const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MetaphorCaseSchema = new Schema({
    location: {
        type: String,
        enum: ['heading', 'body']
    },
    char_range: [Number],
    text: {
        type: String,
        required: true
    },    
    comment: {
        type: String,
        required: false
    },
    metaphorModel: {
        type: Schema.Types.ObjectId,
        ref: 'MetaphorModel'
    },
    sourceArticleId: {
        type: String
    },
    sourceEditionId: {
        type: String
    },
    sourceEditionName: {
        type: String
    },
    lang: {
        type: String
    }
}, {
    collection: 'metaphor_cases'
});


module.exports = mongoose.model('MetaphorCase', MetaphorCaseSchema);