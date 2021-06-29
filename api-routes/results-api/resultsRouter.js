const express = require('express');
const router = express.Router();

// Import controllers
const results_Controller = require('../../controllers/results-controllers/resultsController');

// @Read
router.get('/', results_Controller.get_Fetch_All_Data);







module.exports = router;