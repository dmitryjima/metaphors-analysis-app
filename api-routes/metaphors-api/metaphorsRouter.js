const express = require('express');
const router = express.Router();

const authMiddleware = require('../../middleware/auth');

// Import controllers
const metaphors_Controller = require('../../controllers/metaphors-controllers/metaphorsController');

// @Read
router.get('/metaphors_by_model/:modelId', metaphors_Controller.get_Fetch_All_Metaphors_By_Model_Id);

router.get('/all_metaphor_models', metaphors_Controller.get_Fetch_All_Metaphor_Models);

// @Create
router.post('/create_new_metaphor_case', metaphors_Controller.post_Create_New_Metaphor_Case);

router.post('/create_new_metaphor_model', metaphors_Controller.post_Create_New_Metaphor_Model);

// @Update
router.put('/update_metaphor_case', metaphors_Controller.put_Update_Metaphor_Case);

router.put('/update_metaphor_model', metaphors_Controller.put_Update_Metaphor_Model);

// @Delete
router.delete('/delete_metaphor_case', metaphors_Controller.delete_Delete_Metaphor_Case);

router.delete('/delete_metaphor_model', metaphors_Controller.delete_Delete_Metaphor_Model);


module.exports = router;