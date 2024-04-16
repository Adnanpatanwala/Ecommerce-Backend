const express = require('express');
const router = express.Router();

const {createProduct,getAllProducts,getSingleProduct,updateProduct,uploadImage,deletProduct} = require('../controller/ProductController');
const {authorized,authenticateUser} = require('../middleware/authentication');
const {getSingleProductReview} = require('../controller/ReviewController');

router.route('/').post([authenticateUser,authorized('admin')],createProduct).get(getAllProducts);

router.route('/uploadImage').post([authenticateUser,authorized('admin')],uploadImage);


router.route('/:id').get(getSingleProduct).patch([authenticateUser,authorized('admin')],updateProduct).delete([authenticateUser,authorized('admin')],deletProduct);

router.route('/:id/reviews').get(getSingleProductReview);
module.exports = router;