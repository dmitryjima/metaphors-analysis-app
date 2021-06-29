const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    heading: {
        type: String,
        required: true
    },
    body: {
        type: String
    },    
    url: {
        type: String
    },
    publication_date: {
        type: Date
    },
    fullyAnnotated: {
        type: Boolean,
        default: false
    },
    tone: {
        type: String,
        enum: ['positive', 'negative', 'neutral']
    },
    comment: {
        type: String,
        required: false
    },
    edition: {
        type: Schema.Types.ObjectId,
        ref: 'Edition'
    },
    metaphors: [{
        type: Schema.Types.ObjectId,
        ref: 'MetaphorCase'
    }]
}, {
    collection: 'articles'
});


module.exports = mongoose.model('Article', ArticleSchema);