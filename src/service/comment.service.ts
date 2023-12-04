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

  validateUser = async (userId: string) => {
    try {
      const user = await UserModel.findById(userId)
      if (!user) {
        throw new Error("User not found")
      }
    } catch (error) {
      throw error
    }
  }

  validatePost = async (postId: string) => {
    try {
      const post = await PostModel.findById(postId)
      if (!post) {
        throw new Error("Post not found")
      }
      return post
    } catch (error) {
      throw error
    }
  }

  async create(comment: CommentInput) {
    try {
      await this.validateComment(comment.content)
      await this.validateUser(comment.userId)
      const post = await this.validatePost(comment.postId)

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
      await PostModel.updateOne(
        { comments: id },
        { $pull: { comments: id } }
      )

      return deletedComment
    } catch (error) {
      throw error
    }
  }

  async edit(id: string, comment: CommentInput) {
    try {
      const updatedComment = await CommentModel.findByIdAndUpdate(
        id,
        comment,
        {
          new: true,
        }
      )
      return updatedComment
    } catch (error) {
      throw error
    }
  }
}

export default new CommentService()
