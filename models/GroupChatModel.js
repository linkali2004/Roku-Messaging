import mongoose from "mongoose";


const groupChatModels = new mongoose.Schema({
    creator:{
        type:String,
        required:true,
    },
    participants:[
        {
            type:String,
            required:true
        }
    ]
});

export const ChatModel = mongoose.models.groupchatmodels || mongoose.model("groupchatmodels",groupChatModels);
