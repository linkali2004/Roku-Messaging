import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  sender: {
    type:String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  }
});

const conversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,  
      ref: 'User',
      required: true,
    }
  ],
  messages: [messageSchema]  
}, { timestamps: true });


conversationSchema.index({ participants: 1 });

export const StoredChats = mongoose.models.Conversation || mongoose.model('Conversation', conversationSchema);
