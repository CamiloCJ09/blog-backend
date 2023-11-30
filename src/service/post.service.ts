import PostModel, { PostInput } from "../model/post.model"
import UserModel from "../model/user.model"

class PostService {
  validatePost = async (title: string, content: string) => {
    try {
      if (!title) {
        throw new Error("Title is required")
      }
      if (!content) {
        throw new Error("Content is required")
      }
    } catch (error) {
      throw error
    }
  }

  async create(post: PostInput) {
    try {
      this.validatePost(post.title, post.content)

      const user = await UserModel.findById(post.userId)
      if (!user) {
        throw new Error("User not found")
      }

      const newPost = await PostModel.create(post)

      user.posts?.push(newPost._id)
      await user.save()

      return newPost
    } catch (error) {
      throw error
    }
  }

  async findAll() {
    try {
      const posts = await PostModel.find()
      return posts
    } catch (error) {
      throw error
    }
  }

  async findOne(id: String) {
    try {
      const post = await PostModel.findById(id)
      return post
    } catch (error) {
      throw error
    }
  }

  async update(id: string, post: PostInput) {
    try {
      const updatedPost = await PostModel.findByIdAndUpdate(id, post, {
        new: true,
      })
      return updatedPost
    } catch (error) {
      throw error
    }
  }

  async delete(id: String) {
    try {
      const deletedPost = await PostModel.findByIdAndDelete(id)
      await UserModel.updateOne({ posts: id }, { $pull: { posts: id } })

      return deletedPost
    } catch (error) {
      throw error
    }
  }
}

export default new PostService()
