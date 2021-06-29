const Article = require('../../models/Article');
const MetaphorCase = require('../../models/MetaphorCase');
const MetaphorModel = require('../../models/MetaphorModel');

var _ = require('lodash');

exports.get_Fetch_All_Metaphors_By_Model_Id = async(req, res, next) => {
    try {
        const { modelId } = req.params;

        const metaphors = await MetaphorCase
            .find({
                metaphorModel: {
                    _id: modelId
                }
            })
            .populate([
                { path: 'metaphorModel', model: 'MetaphorModel'}
            ])
            .exec();

        res.json(metaphors)
    } catch (err) {
        console.error(err);
        return next(err);
    }
}

exports.get_Fetch_All_Metaphor_Models = async(req, res, next) => {
    try {
        const metaphorModels = await MetaphorModel.find()

        res.json(metaphorModels)
    } catch (err) {
        console.error(err);
        return next(err);
    }
}


exports.post_Create_New_Metaphor_Case = async(req, res, next) => {
    try {
        const { 
            articleId,
            metaphorCaseBody,
            metaphorModel
        } = req.body;

        const article = await Article
            .findById(articleId)
            .populate([
                { path: 'metaphors', model: 'MetaphorCase'}
            ])
            .exec();

        console.log(article)

        if(!article) {
            let err = new Error('Article not found');
            err.status = 404;
            throw err;
        }

        const newMetaphorCase = new MetaphorCase({
            location: metaphorCaseBody.location,
            char_range: metaphorCaseBody.char_range,
            text: metaphorCaseBody.text,
            comment: metaphorCaseBody.comment,
            sourceArticleId: article._id
        });

        let model

        if(metaphorModel._id) {
            model = await MetaphorModel.findById(metaphorModel._id)
        } else {
            model = new MetaphorModel(metaphorModel);
    
            await model.save();
        }

        console.log(model)

        newMetaphorCase.metaphorModel = model

        await newMetaphorCase.save()

        if (Array.isArray(article.metaphors)) {
            article.metaphors = [...article.metaphors, newMetaphorCase]
        } else {
            article.metaphors = []
            article.metaphors = [...article.metaphors, newMetaphorCase]
        }

        await article.save();

        res.json({
            newMetaphorCase,
            updatedArticle: article,
            metaphorModel: model
        })
    } catch (err) {
        console.error(err);
        return next(err);
    }
}

exports.post_Create_New_Metaphor_Model = async(req, res, next) => {
    try {
        const { modelData } = req.body;

        const newModel = new MetaphorModel(modelData);

        await newModel.save();

        res.json(newModel);
    } catch (err) {
        console.error(err);
        return next(err);
    }
}

exports.put_Update_Metaphor_Case = async(req, res, next) => {
    try {
        const { 
            caseId, 
            updatedDataBody,
            updatedDataModel
        } = req.body;

        const metaphorCase = await MetaphorCase.findById(caseId);

        if(!metaphorCase) {
            let err = new Error('Case not found');
            err.status = 404;
            throw err;
        }

        if(updatedDataBody) {
            Object.keys(updatedDataBody).map(key => {
                return !_.isEqual(metaphorCase[key], updatedDataBody[key]) || !metaphorCase[key]
                    ? metaphorCase[key] = updatedDataBody[key]
                    : null
            });
        }


        if(updatedDataModel) {

            let model
    
            if(updatedDataModel._id) {
                model = await MetaphorModel.findById(updatedDataModel._id)
            } else {
                model = new MetaphorModel(updatedDataModel);
        
                await model.save();
            }
    
            console.log(model)
    
            metaphorCase.metaphorModel = model
        }


        await metaphorCase.save()

        res.json(metaphorCase);

    } catch (err) {
        console.error(err);
        return next(err);
    }
}

exports.put_Update_Metaphor_Model = async(req, res, next) => {
    try {
        const { id, updatedData } = req.body;

        let modelToUpdate = await MetaphorModel.findById(id);

        if(!modelToUpdate) {
            let err = new Error('Model not found');
            err.status = 404;
            throw err;
        }

        Object.keys(updatedData).map(key => {
            modelToUpdate[key] !== updatedData[key] || !modelToUpdate[key]
                ? modelToUpdate[key] = updatedData[key]
                : null
        });

        await modelToUpdate.save();

        res.json(modelToUpdate)
    } catch (err) {
        console.error(err);
        return next(err);
    }
}

exports.delete_Delete_Metaphor_Case = async(req, res, next) => {
    try {
        const { articleId, caseId } = req.body;

        let deletedCase = await MetaphorCase.findByIdAndDelete(caseId);

        let article = await Article
            .findById(articleId)
            .populate([
                { path: 'edition', model: 'Edition' },
                { path: 'metaphors', model: 'MetaphorCase'}
            ])
            .exec();

        article.metaphors = article.metaphors.filter(item => item._id !== caseId);


        await article.save()
        
        res.json({
            deletedCase,
            updatedArticle: article,
        })
    } catch (err) {
        console.error(err);
        return next(err);
    }
}

exports.delete_Delete_Metaphor_Model = async(req, res, next) => {
    try {
        const { id } = req.body;

        let deletedModel = await MetaphorModel.findByIdAndDelete(id);

        res.json(deletedModel);
    } catch (err) {
        console.error(err);
        return next(err);
    }
}
