import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    nickname:String,
    password:String,
    score:{
        type : Number,
        default : 0
    }
})

const SimpleUserSchema = new mongoose.Schema({
    nickname:String,
    score:{
        type : Number,
        default : 0
    }
})

const UserModel = mongoose.model("users", UserSchema);

//module.exports = UserModel;
export default UserModel;