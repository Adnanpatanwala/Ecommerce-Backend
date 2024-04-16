const { StatusCodes } = require("http-status-codes");
const custError = require('../errors');
const ProductSchema = require('../modal/Product');
 
const getAllOrders = async(req,res)=>{
    res.status(StatusCodes.OK).json('getallorders')
}
const getSingleOrder = async(req,res)=>{
    res.status(StatusCodes.OK).json('getSingleOrder')
}
const getCurrentUserOrders = async(req,res)=>{
    res.status(StatusCodes.OK).json('getCurrentUserOrders')
 
}
const createOrder = async(req,res)=>{
    const {items:cartItems,tax,shippingFee} = req.body;
    if(!cartItems || cartItems.length<1){
        throw new custError.BadRequestError('no items in the cart');
    }
    if(!tax || !shippingFee){
        throw new custError.BadRequestError('plz privide shipping fees and tax');
    }

    let orderItems=[];
    let subTotal=0;


    for(const item of cartItems){
        const dbProduct = await ProductSchema.findOne({_id:item.product});
        if(!dbProduct)throw new custError.BadRequestError('no items with id');

        const { name, price, image, _id } = dbProduct;
        const singleOrderItem = {
            amount:item.amount,
            name,price,image,product:_id,
        }
        orderItems = [...orderItems,singleOrderItem];
        subTotal += price*item.amount;



    }
    res.status(StatusCodes.OK).json({orderItems,subTotal})
    
}
const updateOrder = async(req,res)=>{
    res.status(StatusCodes.OK).json('updateOrder')
}

module.exports = {getAllOrders, getSingleOrder, getCurrentUserOrders,
    createOrder, updateOrder}