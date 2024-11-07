import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    nickname:String,
    password:String,
    score:{
        type : Number,
        default : 0
    },
    matchPlayed:{
        type : Number,
        default : 0
    },
    matchWon:{
        type : Number,
        default : 0
    },
    matchLose:{
        type : Number,
        default : 0
    },
    matchDraw:{
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

export const UserModel = mongoose.model("users", UserSchema);
export const SimpleUserModel = mongoose.model("simpleUsers", SimpleUserSchema);

//module.exports = UserModel;
export default {UserModel, SimpleUserModel};