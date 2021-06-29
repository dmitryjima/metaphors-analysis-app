const Article = require('../../models/Article');
const Edition = require('../../models/Edition');


const url = require('url');
const fs = require('fs').promises;
const multer = require('multer');
const { uuid } = require('uuidv4');

// Multer configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, ('./public/uploads_temp'));
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuid() + '-' + fileName)
    }
});

const upload = multer({ 
    storage, 
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
        }
    },
    limits: {fileSize: '15MB'} 
}); 

exports.get_Fetch_All_Editions = async (req, res, next) => {
    try {
        const editions = await Edition.find();
        res.json(editions);
    } catch (err) {
        return next(err)
    }
}

exports.post_Create_New_Edition = async (req, res, next) => {
    try {
        const { name, lang, description } = req.body;

        let newEdition = new Edition({
            name,
            lang,
            ...(description && { description })
        })

        const savedEditon = await newEdition.save()

        res.json(savedEditon)
    } catch (err) {
        console.error(err)
        return next(err)
    }
}

exports.post_Update_Edition_Picture = [
    upload.single('single_upload'),
    async(req, res, next) => {
        try {
            await fs.copyFile(req.file.path, path.join('public/uploads', req.file.filename));
            
            await fs.unlink(req.file.path);

            const { id } = req.body;

            let editionToUpdate = await Edition.findById(id);

            if(!editionToUpdate) {
                let err = new Error('Edition not found');
                err.status = 404;
                throw err;
            }

            if (editionToUpdate.pictureURL) {
                await fs.unlink('./public/' + editionToUpdate.pictureURL);
            }

            editionToUpdate.pictureURL = `${path.join('/uploads', req.file.filename)}`;

            await editionToUpdate.save();

            res.json(editionToUpdate);
        } catch (err) {
            console.log(err)
            return next(err);
        }
    }
]

exports.put_Update_Edition = async (req, res, next) => {
    try {
        const { id, updatedData } = req.body;

        let editionToUpdate = await Edition.findById(id);

        if(!editionToUpdate) {
            let err = new Error('Edition not found');
            err.status = 404;
            throw err;
        }

        Object.keys(updatedData).map(key => {
            editionToUpdate[key] !== updatedData[key] || !editionToUpdate[key]
                ? editionToUpdate[key] = updatedData[key]
                : null
        });

        await editionToUpdate.save()

        res.json(editionToUpdate)
    } catch (err) {
        console.log(err)
        return next(err)
    }
}

exports.delete_Delete_Edition = async (req, res, next) => {
    try {
        const { id } = req.body;

        const article = await Article.findOneAndDelete({ edition: id}).exec()

        if(article) {
            await Article.deleteMany({ edition: id}).exec()
        }
    
        const deletedEdition = await Edition.findByIdAndDelete(id);

        if(!deletedEdition) {
            let err = new Error('Edition not found');
            err.status = 404;
            throw err;
        }
    
        res.json(deletedEdition)
    } catch (err) {
        console.log(err)
        return next(err);
    }
}