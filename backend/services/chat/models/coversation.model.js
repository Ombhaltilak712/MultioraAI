import mongoose from "mongoose";

const conversationSchema=new mongoose.Schema({
    title:{
        type:String,
        default:"New Chat"
    },
    userId:{
        type:String,
        required:true,
        index:true
    },
    isPinned:{
        type:Boolean,
        default:false
    },
    isShared:{
        type:Boolean,
        default:false
    },
    shareToken:{
        type:String,
        default:null,
        index:true
    }
},{
    timestamps:true
})

const Conversation=mongoose.model("Conversation",conversationSchema)
export default Conversation