require('dotenv').config();
require('express-async-errors');
const express = require('express');
const app = express();

// package of middleware
const morgan = require('morgan');

// database 
const connectDB = require('./db/connect');

const notFound = require('./middleware/not-found');
const errorHandler = require('./middleware/error-handler')
const router = require('./routes/Authroutes');
const userrouter = require('./routes/UserRoute');
const productRouter = require('./routes/ProductsRoute')
const cookiesparser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const reviewRouter = require('./routes/ReviewRoutes')
const orderrouter = require('./routes/OrderRouter');
// middleware 
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookiesparser(process.env.JWT_STRING));
app.use(express.static('./public'));
app.use(fileUpload());


app.get('/',(req,res)=>{
    res.send(req.signedCookies)
})
app.use('/api/v1/auth',router);
app.use('/api/v1/user',userrouter);
app.use('/api/v1/products',productRouter);
app.use('/api/v1/review',reviewRouter);
app.use('/api/v1/order',orderrouter);


app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;
const start = async()=>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port,()=>{
            console.log(`listing to port : ${port}..`);
        })
    }catch (error) {
        console.log(error);
    }
}
start();