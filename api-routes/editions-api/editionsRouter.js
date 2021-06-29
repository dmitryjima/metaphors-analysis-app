const express = require('express');
const router = express.Router();

const authMiddleware = require('../../middleware/auth');


// Import controllers
const editions_Controller = require('../../controllers/editions-controllers/editionsController');

// @Read
router.get('/', editions_Controller.get_Fetch_All_Editions);

// @Create
router.post('/create_new', editions_Controller.post_Create_New_Edition);

// @Update
router.put('/update', editions_Controller.put_Update_Edition);

router.post('/update_picture', editions_Controller.post_Update_Edition_Picture);

// @Delete
router.delete('/delete', editions_Controller.delete_Delete_Edition);


module.exports = router;