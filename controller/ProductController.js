const {StatusCodes} = require('http-status-codes');
const ProductSchema = require('../modal/Product');
const { NotFoundError } = require('../errors');
const path = require('path');
const { BadRequestError } = require('../errors');

const createProduct = async(req,res)=>{
     
    req.body.user = req.playload.id;
    const data = await ProductSchema.create(req.body);
    res.status(StatusCodes.CREATED).send(data);
}
const getAllProducts = async(req,res)=>{
    const data = await ProductSchema.find({});
    res.status(StatusCodes.OK).json({data,count : data.length});
}
const getSingleProduct = async(req,res)=>{
    const {id:productId }= req.params;
    const product = await ProductSchema.findOne({_id:productId}).populate('reviews');
    if(!product){
        throw new NotFoundError(`no product found with the ${productId}`)
    }
    res.status(StatusCodes.OK).json(product);
    
}
const updateProduct = async(req,res)=>{
    const {id:productId }= req.params;
    const data = req.body;
    const product = await ProductSchema.findOneAndUpdate({_id:productId},data,{new:true,runValidators:true});
    if(!product){
        throw new NotFoundError('no product is found')
    }
    res.status(StatusCodes.OK).json({product});
}
const deletProduct = async(req,res)=>{
    const {id:productId }= req.params;
    const product = await ProductSchema.findOne({_id:productId});
    // await product.remove(); 
    res.status(StatusCodes.OK).json(product);

}
const uploadImage = async(req,res)=>{
    
    if(!req.files){
        throw new BadRequestError('image is not present');
    }
    const productimg = req.files.image;
    if(!productimg.mimetype.startsWith('image')){
        throw new BadRequestError('not correct format');
    }
    const maxsize = 1024*1024;
    if(productimg.size>maxsize){
        throw new BadRequestError('image size shoule be less');
    }

    const imagepath = path.join(__dirname,'../public/uploads/'+`${productimg.name}`);
    await productimg.mv(imagepath);
    res.status(StatusCodes.OK).json({image:`/uploads/${imagepath}`});
}

module.exports = {
    createProduct,getAllProducts,getSingleProduct,updateProduct,uploadImage,deletProduct
}