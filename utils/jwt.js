const jwt = require('jsonwebtoken');

const CreateJwt =({tokendata})=>{
    return  jwt.sign(tokendata,process.env.JWT_STRING,{expiresIn:process.env.JWT_EXP});
}

const isValid = ({token}) =>{
    return jwt.verify(token,process.env.JWT_STRING);
}
const customCookie = ({res,tokendata})=>{
    const token =  CreateJwt({tokendata});
    const oneday = 1000*60*60*24;
    res.cookie('token',token,{
        httpOnly: true,
        expires : new Date(Date.now()+oneday),
        secure:process.env.CHECK=='production',
        signed: true
    })
    
}
module.exports = {
    CreateJwt,
    isValid,
    customCookie
}