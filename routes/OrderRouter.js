const express = require('express');
const router = express.Router();
const {getAllOrders, getSingleOrder, getCurrentUserOrders,createOrder, updateOrder} = require('../controller/OrderController');
const {authenticateUser,authorized} = require('../middleware/authentication');

router.route('/').get(authenticateUser,authorized('admin'),getAllOrders).post(authenticateUser,createOrder);
router.route('/showAllMyOrders').get(getCurrentUserOrders);
router.route('/:id').get(authenticateUser,getSingleOrder).patch(authenticateUser,updateOrder);


module.exports = router;