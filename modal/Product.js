const mongoose =  require('mongoose');

const ProductSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true,"provide product name"],
        maxlength:[100,"should be less then 100"],
    },
    price:{
        type:String,
        required:[true,"provide product price"],
        default:0,
    },
    description:{
        type:String,
        required:[true,"provide product description"],
        maxlength:[1000,"should be less then 1000"],
    },
    image:{
        type:String,
        default:'/uploads/example.PNG'
    },
    category:{
        type:String,
        required:[true,"provide the product category"],
        enum:['office','kitchen','bedroom'],
    },
    company:{
        type:String,
        required:[true,"provide the company name"],
        enum:{
            values:['ikea','liddy','marcos'],
            message:"{VALUE} is not supported",
    },
    },
    colors:{
        type:[String],
        required:true,
    },
    featured:{
        type: Boolean,
        default: false,
    },
    freeshipping:{
        type:Boolean,
        default:false,
    },
    inventory:{
        type:Number,
        required:true,
        default:15,
    },
    averageRating:{
        type:Number,
        default:0,
    },
    noOfRating:{
        type:Number,
        default:0
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true,
    }
},{timestamps:true,toJSON:{virtuals:true},toObject:{virtuals:true}});

ProductSchema.virtual('reviews',{
    ref:'Review',
    localField:'_id',
    foreignField:'product',
})

ProductSchema.pre('remove',async function(next){
    await this.model('Review').deleteMany({product:this._id})
})

module.exports = mongoose.model("Products", ProductSchema);