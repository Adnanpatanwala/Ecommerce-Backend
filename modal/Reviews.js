const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    rating:{
        type:Number,
        min:1,
        max:5,
        required:[true,'plz provide rating']
    },
    title:{
        type:String,
        trim:true,
        required:[true,"plz provide title"],
        maxlength:100,
    },
    comment:{
        type:String,
        required:[true,'plz provide text']
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true,
    },
    product:{
        type:mongoose.Types.ObjectId,
        ref:'Products',
        required:true,
    }
},{timestamps:true });

ReviewSchema.index({product:1,user:1},{unique:1});

ReviewSchema.statics.calculateAverageRating = async function(productId){
    const review = await this.aggregate([
        {
            $match:{
                product:productId
            }
        },{
            $group:{
                _id:null,
                avegareRating:{$avg:'$rating'},
                numOfReviews:{$sum:1}
            }
        }
    ])
    console.log(review);
    try{
        await this.model('Products').findOneAndUpdate({_id:productId},{
            averageRating:Math.ceil(review[0]?.avegareRating||0),
            noOfRating:(review[0]?.numOfReviews||0)
        })

    }catch(err){
        console.log(err);
    }
}

ReviewSchema.post('save',async function(){
    await this.constructor.calculateAverageRating(this.product);
})
ReviewSchema.post('remove',async function(){
    await this.constructor.calculateAverageRating(this.product);
})

module.exports = mongoose.model('Review',ReviewSchema);


 