const express = require('express');
const router = express.Router();

const authMiddleware = require('../../middleware/auth');

// Import controllers
const articles_Controller = require('../../controllers/articles-controllers/articlesController');

// @Read
router.get('/', articles_Controller.get_Fetch_All_Articles);

router.get('/edition/:editionId', articles_Controller.get_Fetch_All_Articles_By_EditionId);

// @Create
router.post('/create_new', authMiddleware, articles_Controller.post_Create_New_Article);

// @Update
router.put('/update_article_body', authMiddleware, articles_Controller.put_Update_Article_Body);

router.put('/update_article_toggle_annotated', authMiddleware, articles_Controller.put_Update_Article_Toggle_Annotated);

router.put('/update_article_tone', authMiddleware, articles_Controller.put_Update_Article_Tone);

router.put('/update_article_comment', authMiddleware, articles_Controller.put_Update_Article_Comment);

// @Delete
router.delete('/delete', authMiddleware, articles_Controller.delete_Delete_Article);


module.exports = router;