const Edition = require('../../models/Edition');
const Article = require('../../models/Article');
const MetaphorCase = require('../../models/MetaphorCase');
const MetaphorModel = require('../../models/MetaphorModel');

exports.get_Fetch_All_Data = async(req, res, next) => {
    try {

        // Content analysis charts
        resultsArticles = await Article.aggregate([

            {
                $match: {
                    fullyAnnotated: true
                }
            },

            {
                $lookup: {
                    from: "editions",
                    localField: "edition",
                    foreignField: "_id",
                    as: "editions_mapping"
                }
            },

/*             {
                $unset: [
                    "editions_mapping.pictureURL",
                    "editions_mapping.description"
                ]
            }, */

            {
                $project: {
                    heading: 1,
                    publication_date: 1,
                    tone: 1,
                    metaphors: 1,
                    lang: 1,
                    _id: 1,
                    "editions_mapping.lang": 1,
                    "editions_mapping.name": 1,
                    "editions_mapping._id": 1,
                }
            },

            {
                $sort: {
                    "publication_date": 1
                }
            },

            // Fallback
            {
                $group: {
                    _id: "$lang",
                    articles: {
                        $push: {
                            _id: "$_id",
                            publication_date: "$publication_date",
                            tone: "$tone",
                            edition: "$editions_mapping",
                            lang: "$lang",
                            metaphors: "$metaphors"
                        },
                    },
                }
            },

        ]);

        // Metaphor models chart
        const resultsMetaphorModels = await MetaphorModel.aggregate([

            {
                $lookup: {
                    from: "metaphor_cases",
                    localField: "_id",
                    foreignField: "metaphorModel",
                    as: "metaphors"
                }
            },

/*             {
                $unset: [
                    "metaphors.char_range",
                    "metaphors.metaphorModel"
                ]
            }, */


            {
                $project: {
                    _id: 1,
                    name: 1,
                    "metaphors._id": 1,
                    "metaphors.location": 1,
                    "metaphors.text": 1,
                    "metaphors.sourceArticleId": 1,
                    "metaphors.sourceEditionId": 1,
                    "metaphors.sourceEditionName": 1,
                    "metaphors.lang": 1,
                }
            },


            {
                $addFields: {
                    metaphors: "$metaphors",
                    length: { $size: "$metaphors" }
                }
            },

            {
                $sort: {
                    "length": -1
                }
            }

        ]);
        

        res.json({
            resultsArticles,
            resultsMetaphorModels
        });
    } catch (err) {
        console.error(err)
    }
}