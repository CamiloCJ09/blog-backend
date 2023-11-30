import CommentModel, { CommentInput } from "../model/comment.model"
import UserModel from "../model/user.model"
import PostModel from "../model/post.model"

class CommentService {

  validateComment = async (content: string) => {
    try {
      if (!content) {
        throw new Error("Content is required")
      }
    } catch (error) {
      throw error
    }
  }

  async create(comment: CommentInput) {
    try {
      this.validateComment(comment.content)

      const user = await UserModel.findById(comment.userId)
      if (!user) {
        throw new Error("User not found")
      }
      const post = await PostModel.findById(comment.postId)
      if (!post) {
        throw new Error("Post not found")
      }

      const newComment = await CommentModel.create(comment)
      post.comments?.push(newComment._id)
      await post.save()
      
      return newComment
    } catch (error) {
      throw error
    }
  }

  async findAll() {
    try {
      const comments = await CommentModel.find()
      return comments
    } catch (error) {
      throw error
    }
  }

  async findByPostId(postId: string) {
    try {
      const comments = await CommentModel.find({ postId: postId })
      return comments
    } catch (error) {
      throw error
    }
  }

  async delete(id: String) {
    try {
      const deletedComment = await CommentModel.findByIdAndDelete(id)
      return deletedComment
    } catch (error) {
      throw error
    }
  }
}

export default new CommentService()
