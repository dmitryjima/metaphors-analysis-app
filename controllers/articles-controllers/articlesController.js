const Article = require('../../models/Article');
const MetaphorCase = require('../../models/MetaphorCase');


exports.post_Create_New_Article = async (req, res, next) => {
    try {
        const { 
            newArticle
        } = req.body;

        let createdArticle = new Article(newArticle)

        const savedArticle = await createdArticle.save()

        res.json(savedArticle)
    } catch (err) {
        console.error(err);
        return next(err)
    }
}

exports.get_Fetch_All_Articles = async (req, res, next) => {
    try {
        const articles = await Article
            .find()
            .populate([
                { path: 'edition', model: 'Edition' },
                { path: 'metaphors', model: 'MetaphorCase'}
            ])
            .exec();

        res.json(articles);
    } catch (err) {
        console.error(err);
        return next(err)
    }
}

exports.get_Fetch_All_Articles_By_EditionId = async (req, res, next) => {
    try {
        const { editionId } = req.params

        const articles = await Article
            .find({
                edition: {
                    _id: editionId
                }
            })
            .populate([
                { path: 'edition', model: 'Edition' },
                { path: 'metaphors', model: 'MetaphorCase'}
            ])
            .exec();

        res.json(articles);
    } catch (err) {
        console.error(err);
        return next(err)
    }
}


exports.put_Update_Article_Body = async (req, res, next) => {
    try {
        const { 
            id,
            updatedData 
        } = req.body;

        let articleToUpdate = await Article.findById(id)

        if(!articleToUpdate) {
            let err = new Error('Article not found');
            err.status = 404;
            throw err;
        }

        Object.keys(updatedData).map(key => {
            articleToUpdate[key] !== updatedData[key] || !articleToUpdate[key]
                ? articleToUpdate[key] = updatedData[key]
                : null
        });

        await articleToUpdate.save()

        let updatedArticle = await Article
            .findById(id)
            .populate([
                { path: 'edition', model: 'Edition' },
                { path: 'metaphors', model: 'MetaphorCase'}
            ])
            .exec();

        res.json(updatedArticle)
    } catch (err) {
        console.log(err)
        return next(err)
    }
}

exports.put_Update_Article_Toggle_Annotated = async (req, res, next) => {
    try {
        const { 
            id
        } = req.body;

        let articleToUpdate = await Article
            .findById(id)
            .populate([
                { path: 'edition', model: 'Edition' },
                { path: 'metaphors', model: 'MetaphorCase'}
            ])
            .exec();
                        
        if(!articleToUpdate) {
            let err = new Error('Article not found');
            err.status = 404;
            throw err;
        }

        articleToUpdate.fullyAnnotated = !articleToUpdate.fullyAnnotated;

        await articleToUpdate.save()

        res.json(articleToUpdate)
    } catch (err) {
        console.log(err)
        return next(err)
    }
}

exports.put_Update_Article_Tone = async (req, res, next) => {
    try {
        const { 
            id,
            tone
        } = req.body;

        let articleToUpdate = await Article
            .findById(id)
            .populate([
                { path: 'edition', model: 'Edition' },
                { path: 'metaphors', model: 'MetaphorCase'}
            ])
            .exec();

        if(!articleToUpdate) {
            let err = new Error('Article not found');
            err.status = 404;
            throw err;
        }

        articleToUpdate.tone = tone

        await articleToUpdate.save()

        res.json(articleToUpdate)
    } catch (err) {
        console.log(err)
        return next(err)
    }
}

exports.put_Update_Article_Comment = async (req, res, next) => {
    try {
        const { 
            id,
            comment
        } = req.body;

        let articleToUpdate = await Article
            .findById(id)
            .populate([
                { path: 'edition', model: 'Edition' },
                { path: 'metaphors', model: 'MetaphorCase'}
            ])
            .exec();

        if(!articleToUpdate) {
            let err = new Error('Article not found');
            err.status = 404;
            throw err;
        }

        articleToUpdate.comment = comment

        await articleToUpdate.save()

        res.json(articleToUpdate)
    } catch (err) {
        console.log(err)
        return next(err)
    }
}

exports.delete_Delete_Article = async (req, res, next) => {
    try {
        const { id } = req.body;
    
        const deletedArticle = await Article.findByIdAndDelete(id);

        if(!deletedArticle) {
            let err = new Error('Article not found');
            err.status = 404;
            throw err;
        }

        if(deletedArticle.metaphors && deletedArticle.metaphors.length > 0) {
            for(let i = 0; i++; i < deletedArticle.metaphors) {
                await MetaphorCase.findByIdAndDelete(deletedArticle.metaphors[i]._id)
            }
        }
    
        res.json(deletedArticle)
    } catch (err) {
        console.log(err)
        return next(err);
    }
}