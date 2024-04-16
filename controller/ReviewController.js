const mongoose = require('mongoose');
const custerror = require('../errors');
const {StatusCodes} = require('http-status-codes');
const ReviewSchema = require('../modal/Reviews');
const ProductSchema = require('../modal/Product');
const {permission } = require('../utils');

const CreateReviews = async(req,res)=>{
    const {product:productId} = req.body;
    const isrealProduct = await ProductSchema.findOne({_id:productId});
    if(!isrealProduct) throw new custerror.NotFoundError("no product was found with this id");
    const alreadyPresent = await ReviewSchema.findOne({product:productId,user:req.playload.id});
    if(alreadyPresent)throw new custerror.BadRequestError('already present ');
    req.body.user = req.playload.id;
    const data = await ReviewSchema.create(req.body);
    res.status(StatusCodes.OK).json(data);
}
const getAllReviews = async(req,res)=>{
    const data = await ReviewSchema.find({}).populate({
        path:'product',
        select:'name price'
    });
    res.status(StatusCodes.OK).json(data);
}
const getSingleReviews = async(req,res)=>{
    const data = await ReviewSchema.findOne({_id:req.params});
    if(!data)throw new custerror.BadRequestError('no product with this id');
    res.status(StatusCodes.OK).json(data);
}
const updateReviews = async(req,res)=>{
    const {id:reviewId} = req.params;
    const {title,rating,comment} = req.body;
    const data = await ReviewSchema.findOne({_id:reviewId});
    if(!data)throw new custerror.BadRequestError('no review found');
    // console.log(req.playload,data.user);
    permission(req.playload,data.user);
    data.title = title
    data.rating =rating
    data.comment =  comment
    await data.save();
 
    res.status(StatusCodes.OK).json(data);
}
const deleteReviews = async(req,res)=>{
    const {id:reviewId} = req.params;
    const data = await ReviewSchema.findOne({_id:reviewId});
    if(!data)throw new custerror.BadRequestError('no review found');
    permission(req.playload,data.user);
    await data.remove(); 
    res.status(StatusCodes.OK).send('deleted');
}

const getSingleProductReview = async(req,res)=>{
    const {id} = req.params;

    const review = await ReviewSchema.find({product:id});
    res.status(StatusCodes.OK).json({review,size:review.length});
}

module.exports = {CreateReviews,getAllReviews,getSingleReviews,updateReviews,deleteReviews,getSingleProductReview};