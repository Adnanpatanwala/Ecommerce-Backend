const custerror = require('../errors');

const permission = (requestedUser,responseUser)=>{
    // console.log(requestedUser);
    if(requestedUser.role==='admin') return;
    if(requestedUser.id===responseUser.toString())return;
    throw new custerror.UnauthorizedError("you are not authorized to use this");

}
module.exports = permission;