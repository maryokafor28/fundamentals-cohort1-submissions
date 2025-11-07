import {Schema} from "mongoose";


const UserSchema = new Schema({
    email: {type:String, unique:true,required:true},
    password: {type:String,required:true},
    name: {type:String,required:true},
    isAdmin: {type:Boolean,default:false},
    cart: {type:Schema.Types.ObjectId,ref:"Cart",default:null}
})

export default UserSchema