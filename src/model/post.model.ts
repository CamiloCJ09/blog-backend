import mongoose from "mongoose"

export interface PostInput {
  title: string
  content: string
  comments?: string[]
}

export interface PostDocument extends PostInput, mongoose.Document {
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],

    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    collection: "posts",
  }
)

const Post = mongoose.model<PostDocument>("Post", postSchema)

export default Post