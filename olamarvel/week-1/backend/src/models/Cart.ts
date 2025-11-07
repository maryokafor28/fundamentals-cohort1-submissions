import {model, Schema,Types} from "mongoose";

const cartSchema = new Schema({
    userId: {type:Types.ObjectId,ref:"User",required:true,unique:true},
    products: {type:[Types.ObjectId],ref:"Product",default:[]},
    orderConfirmed: {type: Boolean, default: false}
})
const Cart = model("Cart", cartSchema);


export default Cart