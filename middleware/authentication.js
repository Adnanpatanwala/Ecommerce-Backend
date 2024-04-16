const customError  = require('../errors');
const {isValid} = require('../utils/jwt');

const authenticateUser = async(req,res,next)=>{
    const token = req.signedCookies.token;
    if(!token){
        throw new customError.UnauthenticatedError("authentication failed")
    }
    try {
        const {name,id,role} = isValid({token});
        req.playload = {name,id,role}; 
        next();
    } catch (error) {
        throw new customError.UnauthenticatedError("authentication failed")
    }
}

const authorized = (...roles)=>{
    return (req,res,next)=>{
            if(!roles.includes(req.playload.role)){
                throw new customError.UnauthorizedError('not authorized to use')
            }
            next(); 
    }
}

module.exports = {
    authenticateUser,
    authorized
}