import {
  connectDBForTesting,
  disconnectDBForTesting,
} from "../../helpers/connectDBForTesting"
import UserModel, { UserDocument, UserInput } from "../../../src/model/user.model"
import { faker } from "@faker-js/faker"
import app from "../../../src/index"
import { Express } from "express"
import dotenv from "dotenv"
import { db } from "../../../src/config/connect"
import routes from "../../../src/routes"
import cors from "cors"
import { Server, IncomingMessage, ServerResponse } from "http"
const request = require("supertest")
const { StatusCodes } = require("http-status-codes")
import Util from 'util'

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

const express = require("express")
const application = express()
application.use(express.json())
application.use(express.urlencoded({ extended: true }))
application.use(
  cors({
    origin: "*",
  })
)

describe("Integration testing for user", () => {
  
  let server: Server | null = null

  beforeAll(async () => {
    await connectDBForTesting()
    // Clear Test Data
    await UserModel.deleteMany({})
    db.then(() => {
      server = application.listen(3003, () => {
        // eslint-disable-next-line no-console
        console.log("Server is listening on port 3002")
      })
    })
  })

  afterAll(async () => {
    // Clear Test Data
    await UserModel.deleteMany({})
    await disconnectDBForTesting()

    // Close server
    if (server) {
      Util.promisify(server.close).bind(server)
    }
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
})
