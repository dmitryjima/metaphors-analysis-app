const Article = require('../../models/Article');
const MetaphorCase = require('../../models/MetaphorCase');
const MetaphorModel = require('../../models/MetaphorModel');

exports.get_Fetch_All_Data = async(req, res, next) => {
    try {
        

        res.json({
            analysisData: {}
        })
    } catch (err) {
        console.error(err)
    }
}