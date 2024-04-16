
const User = require('../modal/User'); 
const error = require('../errors'); 
const {customCookie,isValid} = require('../utils/index')
const { StatusCodes } = require('http-status-codes');
const {CreateTrokenUser} = require('../utils')

const login = async(req,res)=>{
    const {email,password} = req.body;
   
    if(!email || !password){
        throw new error.BadRequestError("enter the values");
    }
    const data = await User.findOne({email});
    if(!data){
        throw new error.UnauthenticatedError("no user found")
    }
    const pass = await data.comparePassword(password);

    if(!pass){
        throw new error.BadRequestError('Password is incorrect');
    }
    const tokendata = CreateTrokenUser(data);
    customCookie({res,tokendata})
    res.status(StatusCodes.CREATED).json({user:tokendata});
    
}

const register = async(req,res)=>{
    const {email} = req.body;
    const isPresent = await User.findOne({email});
    if(isPresent){
        throw new error.BadRequestError("Email is already is Present");
    }
    const data = await User.create(req.body);
    const tokendata = CreateTrokenUser(data);
    customCookie({res,tokendata})
    res.status(StatusCodes.CREATED).json({user:tokendata});
}
const logout = async(req,res)=>{
     res.cookie('token','logout',{
        httpOnly:true,
        expires:new Date(Date.now()),
     })
    res.status(StatusCodes.OK).send("logout");
}
module.exports = {
    login,
    register,
    logout
}