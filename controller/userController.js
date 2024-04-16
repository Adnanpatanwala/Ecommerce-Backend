const UserSchema = require('../modal/User');
const {StatusCodes} = require('http-status-codes');
const customError = require('../errors');
const {CreateTrokenUser,customCookie} = require('../utils');
const {permission} = require('../utils');

const getAllUser = async(req,res)=>{
    const users = await UserSchema.find({role:'user'}).select('-password');
    res.status(StatusCodes.OK).json(users);
}
const getSingleUser = async(req,res)=>{
    const id = req.params.id;
    const user = await UserSchema.findOne({_id:id}).select('-password');
    if(!user){
        throw new customError.NotFoundError(`No user is fond with the id : ${id}`);
    }
     
    permission(req.playload,user._id);
    res.status(StatusCodes.OK).json(user);
}
const showCurrentUser = async(req,res)=>{
    res.status(StatusCodes.OK).json(req.playload);
}
const updateUser = async(req,res)=>{
    const {email,name} = req.body;
    if(!email || !name){
        throw new customError.BadRequestError("enter the details");
    }
      
    const data = await UserSchema.findOne({_id:req.playload.id});
    data.email  = email;
    data.name = name;
    await data.save(); 
    console.log(data);
    const token = CreateTrokenUser(data);
    const Cookie = customCookie({res,token});
    res.status(StatusCodes.OK).json(Cookie);
}
const userUpdatePassword = async(req,res)=>{
    const {newPassword,oldPassword} = req.body;
    if(!newPassword || !oldPassword){
        throw new customError.BadRequestError('Password not Found or password is incorrect');
    }
    const check = await UserSchema.findOne({_id:req.playload.id});
    const oldPasswordMatch = check.comparePassword(oldPassword);
    if(!oldPasswordMatch){
        throw new customError.BadRequestError("password is not the same")
    } 
    check.password = newPassword;
    await check.save();
    res.status(StatusCodes.OK).send("success password updated");
}

module.exports = {
    getAllUser,
    userUpdatePassword,
    updateUser,
    showCurrentUser,
    getSingleUser
}