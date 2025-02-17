const express = require('express');
const router = express.Router();
const contentController = require('../controller/contentController');


// Public routes
router.get('/get/:type', contentController.getContent);
// router.get('/all', contentController.getAllContent);

// Protected routes (admin only)
router.put('/update/:type', contentController.updateContent);

// New route for updating single content item
router.put('/update/:type/item/:itemIndex', contentController.updateContentItem);

module.exports = router;
