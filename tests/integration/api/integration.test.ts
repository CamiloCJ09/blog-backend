import {
  connectDBForTesting,
  disconnectDBForTesting,
} from "../../helpers/connectDBForTesting"
import PostModel, { PostInput } from "../../../src/model/post.model"
import UserModel, { UserInput } from "../../../src/model/user.model"
import Comment, { CommentInput } from "../../../src/model/comment.model"
import authServices from "../../../src/middleware/auth"
import { faker } from "@faker-js/faker"
import app from "../../../src/index"
import { Server } from "http"
const request = require("supertest")
const { StatusCodes } = require("http-status-codes")
import Util from 'util'



let server: Server | null = null
server = app.listen(3001)

describe("personModel Testing", () => {
  beforeAll(async () => {
    await connectDBForTesting()
  })

  afterAll(async () => {
    await UserModel.collection.drop()

    await disconnectDBForTesting()
  })

  test("create user", async () => {
    const mockUser: UserInput = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user",
    }

    const user = await UserModel.create(mockUser)
    expect(user.name).toBe(mockUser.name)
    expect(user.email).toBe(mockUser.email)
    //expect(user.password).toBe(mockUser.password);
  })

  test("find user by email", async () => {
    const mockUser: UserInput = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user",
    }

    const user = await UserModel.create(mockUser)
    const userFound = await UserModel.findOne({ email: user.email })
    expect(userFound?.email).toBe(mockUser.email)
  })

  test("find user by id", async () => {
    const mockUser: UserInput = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user",
    }

    const user = await UserModel.create(mockUser)
    const userFound = await UserModel.findById(user._id)
    expect(userFound?.email).toBe(mockUser.email)
  })

  test("update user by id", async () => {
    const mockUser: UserInput = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user",
    }

    const user = await UserModel.create(mockUser)
    const userFound = await UserModel.findByIdAndUpdate(
      user._id,
      { name: "new name" },
      { new: true }
    )
    expect(userFound?.name).toBe("new name")
  })

  test("delete user by id", async () => {
    const mockUser: UserInput = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user",
    }

    const user = await UserModel.create(mockUser)
    await UserModel.findByIdAndDelete(user._id)
    const userFound = await UserModel.findById(user._id)
    expect(userFound).toBeNull()
  })

  test("delete user by email", async () => {
    const mockUser: UserInput = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user",
    }

    const user = await UserModel.create(mockUser)
    await UserModel.findOneAndDelete({ email: user.email })
    const userFound = await UserModel.findById(user._id)
    expect(userFound).toBeNull()
  })

  test("delete user by name", async () => {
    const mockUser: UserInput = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user",
    }

    const user = await UserModel.create(mockUser)
    await UserModel.findOneAndDelete({ name: user.name })
    const userFound = await UserModel.findById(user._id)
    expect(userFound).toBeNull()
  })
})



describe("Integration testing for user", () => {
  
  

  beforeAll(async () => {
    await connectDBForTesting()
    // Clear Test Data
    await UserModel.deleteMany({})
    
  })

  afterAll(async () => {
    // Clear Test Data
    await UserModel.deleteMany({})
    await disconnectDBForTesting()
  })

  it("should create user", async () => {
    const userCreateBody = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user",
    }
    const response = await request(app).post("/users").send(userCreateBody).set("Accept", "application/json").set("Content-Type", "application/json").expect(201)
  })

  it("should get user", async () => {
    const userCreateBody = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user",
    }
    const response = await request(app).post("/users").send(userCreateBody).set("Accept", "application/json").set("Content-Type", "application/json").expect(201)
    const responseGet = await request(app).get(`/users/${response.body._id}`).set("Accept", "application/json").set("Content-Type", "application/json").expect(200)
  })

  it("should get all users", async () => {
    const userCreateBody = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user",
    }
    const response = await request(app).post("/users").send(userCreateBody).set("Accept", "application/json").set("Content-Type", "application/json").expect(201)
    const responseGet = await request(app).get(`/users`).set("Accept", "application/json").set("Content-Type", "application/json").expect(200)
  })
})
describe("commentModel Testing", () => {
  beforeAll(async () => {
    await connectDBForTesting()
  })

  afterAll(async () => {
    await PostModel.collection.drop()
    await UserModel.collection.drop()
    await Comment.collection.drop()
  })

  beforeEach(async () => {
    await Comment.collection.drop()
  })

  test("create comment", async () => {
    const mockUser: UserInput = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user",
    }
    const user = await UserModel.create(mockUser)
    const mockPost: PostInput = {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      userId: user._id,
    }
    const post = await PostModel.create(mockPost)
    const mockComment: CommentInput = {
      content: faker.lorem.paragraph(),
      userId: user._id,
      postId: post._id,
    }

    const comment = await Comment.create(mockComment)
    expect(comment.content).toBe(mockComment.content)
    expect(comment.userId).toBe(mockComment.userId)
    expect(comment.postId).toBe(mockComment.postId)
  })

  test("find comment by content", async () => {
    const mockUser: UserInput = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user",
    }
    const user = await UserModel.create(mockUser)
    const mockPost: PostInput = {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      userId: user._id,
    }
    const post = await PostModel.create(mockPost)
    const mockComment: CommentInput = {
      content: faker.lorem.paragraph(),
      userId: user._id,
      postId: post._id,
    }

    const comment = await Comment.create(mockComment)
    const commentFound = await Comment.findOne({ content: comment.content })
    expect(commentFound?.content).toBe(mockComment.content)
  })

  test("find comment by id", async () => {
    const mockUser: UserInput = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user",
    }
    const user = await UserModel.create(mockUser)
    const mockPost: PostInput = {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      userId: user._id,
    }
    const post = await PostModel.create(mockPost)
    const mockComment: CommentInput = {
      content: faker.lorem.paragraph(),
      userId: user._id,
      postId: post._id,
    }
    const comment = await Comment.create(mockComment)
    expect(comment.content).toBe(mockComment.content)
  })

  test("update comment by id", async () => {
    const mockUser: UserInput = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user",
    }
    const user = await UserModel.create(mockUser)
    const mockPost: PostInput = {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      userId: user._id,
    }
    const post = await PostModel.create(mockPost)
    const mockComment: CommentInput = {
      content: faker.lorem.paragraph(),
      userId: user._id,
      postId: post._id,
    }
    const comment = await Comment.create(mockComment)
    const commentFound = await Comment.findByIdAndUpdate(
      comment._id,
      { content: "new content" },
      { new: true }
    )
    expect(commentFound?.content).toBe("new content")
  })
})


describe("comment API Testing", () => {

  afterAll(async () => {
    await PostModel.collection.drop()
    await UserModel.collection.drop()
    await Comment.collection.drop()
  })

    // Close server

  beforeEach(async () => {
    await Comment.collection.drop()
  })

  test("create comment", async () => {
    const mockUser: UserInput = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user",
    }
    const user = await UserModel.create(mockUser)
    const mockPost: PostInput = {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      userId: user._id,
    }
    const post = await PostModel.create(mockPost)
    const mockComment: CommentInput = {
      content: faker.lorem.paragraph(),
      userId: user._id,
      postId: post._id,
    }
    const token = authServices.generateToken(user)
    const res = await request(app)
      .post("/comments")
      .set("Authorization", `Bearer ${token}`)
      .send(mockComment)
      .expect(StatusCodes.CREATED)
    expect(res.body.content).toBe(mockComment.content)
    expect(res.body.userId).toBe(mockComment.userId.toString())
    expect(res.body.postId).toBe(mockComment.postId.toString())
  })

  test("find comment by id", async () => {
    const mockUser: UserInput = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user",
    }
    const user = await UserModel.create(mockUser)
    const mockPost: PostInput = {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      userId: user._id,
    }
    const post = await PostModel.create(mockPost)
    const mockComment: CommentInput = {
      content: faker.lorem.paragraph(),
      userId: user._id,
      postId: post._id,
    }
    const token = authServices.generateToken(user)

    const comment = await Comment.create(mockComment)
    const res = await request(app)
      .get(`/comments/${comment._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(StatusCodes.OK)
  })

  test("update comment by id", async () => {
    const mockUser: UserInput = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user",
    }
    const user = await UserModel.create(mockUser)
    const mockPost: PostInput = {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      userId: user._id,
    }
    const post = await PostModel.create(mockPost)
    const mockComment: CommentInput = {
      content: faker.lorem.paragraph(),
      userId: user._id,
      postId: post._id,
    }
    const comment = await Comment.create(mockComment)
    const token = authServices.generateToken(user)
    const res = await request(app)
      .put(`/comments/${comment._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ content: "new content" })
      .expect(StatusCodes.OK)
    expect(res.body.content).toBe("new content")
  })
})


describe("postModel Testing", () => {
  beforeAll(async () => {
    await connectDBForTesting()
  })

  afterAll(async () => {
    await PostModel.collection.drop()
    await UserModel.collection.drop()
  })

  beforeEach(async () => {
    await PostModel.collection.drop()
  })

  test("create post", async () => {
    const mockUser: UserInput = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user",
    }
    const user = await UserModel.create(mockUser)
    const mockPost: PostInput = {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      userId: user._id,
    }

    const post = await PostModel.create(mockPost)
    expect(post.title).toBe(mockPost.title)
    expect(post.content).toBe(mockPost.content)
    expect(post.userId).toBe(mockPost.userId)
  })

  test("find post by title", async () => {
    const mockUser: UserInput = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user",
    }
    const user = await UserModel.create(mockUser)
    const mockPost: PostInput = {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      userId: user._id,
    }

    const post = await PostModel.create(mockPost)
    const postFound = await PostModel.findOne({ title: post.title })
    expect(postFound?.title).toBe(mockPost.title)
  })

  test("find post by id", async () => {
    const mockUser: UserInput = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user",
    }
    const user = await UserModel.create(mockUser)
    const mockPost: PostInput = {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      userId: user._id,
    }

    const post = await PostModel.create(mockPost)
    const postFound = await PostModel.findById(post._id)
    expect(postFound?.title).toBe(mockPost.title)
  })

  test("update post by id", async () => {
    const mockUser: UserInput = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user",
    }
    const user = await UserModel.create(mockUser)
    const mockPost: PostInput = {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      userId: user._id,
    }

    const post = await PostModel.create(mockPost)
    const postFound = await PostModel.findByIdAndUpdate(
      post._id,
      { title: "new title" },
      { new: true }
    )
    expect(postFound?.title).toBe("new title")
  })

  test("get all posts", async () => {
    const mockUser1: UserInput = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user",
    }
    const user1 = await UserModel.create(mockUser1)
    const mockPost1: PostInput = {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      userId: user1._id,
    }

    const mockUser2: UserInput = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user",
    }
    const user2 = await UserModel.create(mockUser2)
    const mockPost2: PostInput = {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      userId: user2._id,
    }

    const post1 = await PostModel.create(mockPost1)
    const post2 = await PostModel.create(mockPost2)
    const posts = await PostModel.find()
    expect(posts.length).toBe(2)
  })
})

describe("post API Testing", () => {
  
  beforeAll(async () => {
    await connectDBForTesting()
    await UserModel.deleteMany({})
    await PostModel.deleteMany({})

  })

  afterAll(async () => {
    await UserModel.deleteMany({})
    await PostModel.deleteMany({})
    await UserModel.collection.drop()

    // Close server
    await disconnectDBForTesting()
    
  })

  beforeEach(async () => {
    await PostModel.collection.drop()
  })

  test("create post", async () => {
    const mockUser: UserInput = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user",
    }
    const user = await UserModel.create(mockUser)
    const mockPost: PostInput = {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      userId: user._id,
    }
    const token = authServices.generateToken(user)
    const response = await request(server)
      .post("/posts")
      .send(mockPost)
      .set("Accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect(201)
    expect(response.body.title).toBe(mockPost.title)
    expect(response.body.content).toBe(mockPost.content)
    expect(response.body.userId).toBe(mockPost.userId.toString())
  })
  
  test("find post by id", async () => {
    const mockUser: UserInput = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user",
    }
    const user = await UserModel.create(mockUser)
    const mockPost: PostInput = {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      userId: user._id,
    }
    const post = await PostModel.create(mockPost)
    const token = authServices.generateToken(user._id)

    const response = await request(server)
      .get(`/posts/${post._id}`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
    expect(response.body.title).toBe(mockPost.title)
  })
  test("update post by id", async () => {
    const mockUser: UserInput = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user",
    }
    const user = await UserModel.create(mockUser)
    
    const mockPost: PostInput = {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      userId: user._id,
    }
    const post = await PostModel.create(mockPost)
    const token = authServices.generateToken(user)

    const response = await request(server)
      .put(`/posts/${post._id}`)
      .send({ title: "new title" })
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
    expect(response.body.title).toBe("new title")
  })
  test("delete post by id", async () => {
    const mockUser: UserInput = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user",
    }
    const user = await UserModel.create(mockUser)
    const mockPost: PostInput = {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      userId: user._id,
    }
    const token = authServices.generateToken(user)

    const post = await PostModel.create(mockPost)
    const response = await request(server)
      .delete(`/posts/${post._id}`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
    expect(response.body.title).toStrictEqual(mockPost.title)
  })
  test("get all posts", async () => {
    const mockUser1: UserInput = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user",
    }
    const user1 = await UserModel.create(mockUser1)
    const mockPost1: PostInput = {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      userId: user1._id,
    }
    const mockUser2: UserInput = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      role: "user",
    }
    const user2 = await UserModel.create(mockUser2)
    const mockPost2: PostInput = {
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      userId: user2._id,
    }
    const token = authServices.generateToken(user1)

    const post1 = await PostModel.create(mockPost1)
    const post2 = await PostModel.create(mockPost2)
    const response = await request(server)
      .get(`/posts`)
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
    expect(response.body.length).toBe(2)
  })
})


server.close()