const CreateTrokenUser =(data)=>{
    return {name : data.name, id:data._id, role:data.role}
}
module.exports = {CreateTrokenUser};