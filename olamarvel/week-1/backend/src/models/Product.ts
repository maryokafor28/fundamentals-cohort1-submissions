import {Schema,model} from "mongoose";


const productSchema = new Schema({
    name: {type:String, unique:true,required:true},
    image: {type:String,required:true},
    inStock: {type:Number,default:0},
})

const Product = model("Product", productSchema);

export default Product