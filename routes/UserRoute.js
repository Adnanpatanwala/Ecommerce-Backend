const express = require('express');
const router = express.Router();
const {authorized, authenticateUser} = require("../middleware/authentication");
const { getAllUser,
    userUpdatePassword,
    updateUser,
    showCurrentUser,
    getSingleUser} = require('../controller/userController');

router.route('/').get(authenticateUser,authorized('admin','owner'),getAllUser);
router.route('/showMe').get(authenticateUser,showCurrentUser);
router.route('/userUpdatePassword').patch(authenticateUser,userUpdatePassword)
router.route('/updateUser').patch(authenticateUser,updateUser);
router.route('/:id').get(authenticateUser,getSingleUser)
module.exports = router;