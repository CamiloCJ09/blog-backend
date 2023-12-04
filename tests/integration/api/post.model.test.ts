import {
  connectDBForTesting,
  disconnectDBForTesting,
} from "../../helpers/connectDBForTesting"
import PostModel, { PostInput } from "../../../src/model/post.model"
import UserModel, { UserInput } from "../../../src/model/user.model"
import authServices from "../../../src/middleware/auth"
import app from "../../../src/index"
import { faker } from "@faker-js/faker"
import { Express } from "express"
import dotenv from "dotenv"
import { db } from "../../../src/config/connect"
import routes from "../../../src/routes"
import cors from "cors"
import { Server, IncomingMessage, ServerResponse } from "http"
const request = require("supertest")
const { StatusCodes } = require("http-status-codes")
import Util from 'util'


describe("postModel Testing", () => {
  beforeAll(async () => {
    await connectDBForTesting()
  })

  afterAll(async () => {
    await PostModel.collection.drop()
    await UserModel.collection.drop()
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

const express = require("express")
const application = express()
application.use(express.json())
application.use(express.urlencoded({ extended: true }))
application.use(
  cors({
    origin: "*",
  })
)


describe("post API Testing", () => {
  
  let server: Server | null = null
  beforeAll(async () => {
    await connectDBForTesting()
    await UserModel.deleteMany({})
    await PostModel.deleteMany({})

    db.then(() => {
      server = application.listen(3001, () => {
        // eslint-disable-next-line no-console
        console.log("Server is listening on port 3002")
      })
    })
  })

  afterAll(async () => {
    await UserModel.deleteMany({})
    await PostModel.deleteMany({})
    await UserModel.collection.drop()

    // Close server
    await disconnectDBForTesting()
    if (server) {
      Util.promisify(server.close).bind(server)
    }
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
