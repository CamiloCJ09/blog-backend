import UserModel, { UserInput } from "../model/user.model"

class UserService {
  async create(user: UserInput) {
    try {
      const newUser = await UserModel.create(user)
      return newUser
    } catch (error) {
      throw error
    }
  }

  async findAll() {
    try {
      const users = await UserModel.find()
      return users
    } catch (error) {
      throw error
    }
  }

  async findOne(id: string) {
    try {
      const user = await UserModel.findById(id)
      return user
    } catch (error) {
      throw error
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await UserModel.findOne({ email: email })
      return user
    } catch (error) {
      throw error
    }
  }
}
