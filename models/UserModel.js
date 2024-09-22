import mongoose from "mongoose";


const userModel = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        minLength:[3,"Username must be greater than 3 characters , provided {value} characters"],
        unique:true
    },
    email:{
        type:String,
        required:true,
        validate:{
            validator:function(v)
            {
                return  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
            },
            message:props => `${props.value} mail is not correct`
        }
    },
    password:{
        type:String,
        required:true,
        min:[3,"Password must be greater 3 characters"]
    },
    previousChats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    avatar:{
        type:String,
        required:false
    }
});


const User = mongoose.models.users || mongoose.model("users",userModel);

export default User;