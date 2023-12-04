import UserModel, { UserInput } from "../model/user.model"
import bcrypt from "bcrypt"
import authServices from "../middleware/auth"

class UserService {
  login = async (email: string, password: string) => {
    try {
      console.log("user service")
      const user = await this.validateUser(email, password)
      const token = authServices.generateToken(user._id)
      
      const response = {
        token: token,
        userId: user._id,
      }
      return response
    } catch (error) {
      throw error
    }
  }

  validateUser = async (email: string, password: string) => {
    try {
      console.log("validate user")
      const user = await UserModel.findOne({ email: email })
      if (!user) {
        console.log("user not found")
        throw new Error("Email does not exist")
      }

      const validPassword = await bcrypt.compare(password, user.password)
      if (!validPassword) {
        console.log("password not correct")
        throw new Error("Password is not correct")
      }

      return user
    } catch (error) {
      throw error
    }
  }

  async create(user: UserInput) {
    try {
      console.log("user service")
      console.log(user)
      if (await UserModel.findOne({ email: user.email })) {
        throw new Error("Email already exists")
      }
      user.password = await bcrypt.hash(user.password, 10)
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

export default new UserService()
