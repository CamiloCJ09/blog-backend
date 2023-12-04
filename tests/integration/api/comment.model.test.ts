import {
  connectDBForTesting,
  disconnectDBForTesting,
} from "../../helpers/connectDBForTesting"
import PostModel, { PostInput } from "../../../src/model/post.model"
import UserModel, { UserInput } from "../../../src/model/user.model"
import Comment, { CommentInput } from "../../../src/model/comment.model"
import authServices from "../../../src/middleware/auth"
import app from "../../../src/index"
import { Express } from "express"
import dotenv from "dotenv"
import { db } from "../../../src/config/connect"
import routes from "../../../src/routes"
import cors from "cors"
import { faker } from "@faker-js/faker"
import { Server, IncomingMessage, ServerResponse } from "http"
const request = require("supertest")
const { StatusCodes } = require("http-status-codes")
import Util from "util"

describe("commentModel Testing", () => {
  beforeAll(async () => {
    await connectDBForTesting()
  })

  afterAll(async () => {
    await PostModel.collection.drop()
    await UserModel.collection.drop()
    await Comment.collection.drop()
    await disconnectDBForTesting()
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

const express = require("express")
const application = express()
application.use(express.json())
application.use(express.urlencoded({ extended: true }))
application.use(
  cors({
    origin: "*",
  })
)

describe("comment API Testing", () => {
  let server: Server | null = null

  beforeAll(async () => {
    await connectDBForTesting()
    db.then(() => {
      server = application.listen(3002, () => {
        // eslint-disable-next-line no-console
        console.log("Server is listening on port 3002")
      })
    })
  })

  afterAll(async () => {
    await PostModel.collection.drop()
    await UserModel.collection.drop()
    await Comment.collection.drop()
    await disconnectDBForTesting()

    // Close server
    if (server) {
      Util.promisify(server.close).bind(server)
    }
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
    expect(res.body.content).toBe(mockComment.content)
    expect(res.body.userId).toBe(mockComment.userId.toString())
    expect(res.body.postId).toBe(mockComment.postId.toString())
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
