import mongoose from "mongoose";

export interface CommentInput {
  userId: string;
  content: string;
}

export interface CommentDocument extends CommentInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const commentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, required: true },

    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    collection: "comments",
  }
);

const Comment = mongoose.model<CommentDocument>("Comment", commentSchema);

export default Comment;
