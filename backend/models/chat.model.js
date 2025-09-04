import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    messages: [
      {
        sender: { type: String, enum: ["user", "bot"], required: true },
        text: { type: String, required: true },
        type: { type: String, default: "text" }, // text or code
        lang: { type: String, default: "plaintext" }
      }
    ]
  },
  { timestamps: true }
);

export const Chat = mongoose.model("Chat", chatSchema);
