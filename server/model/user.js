import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    nickname:String,
    password:String
})

const UserModel = mongoose.model("users", UserSchema);

//module.exports = UserModel;
export default UserModel;