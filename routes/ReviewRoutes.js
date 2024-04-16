const express = require('express');
const router = express.Router();
const {CreateReviews,getAllReviews,getSingleReviews,updateReviews,deleteReviews} = require('../controller/ReviewController');
 

const {authenticateUser} = require('../middleware/authentication');
router.route('/').get(getAllReviews).post(authenticateUser,CreateReviews)
router.route('/:id').get(getSingleReviews).patch(authenticateUser,updateReviews).delete(authenticateUser,deleteReviews);

 

module.exports = router;