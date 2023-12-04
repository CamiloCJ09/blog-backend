import { Express, Request, Response } from "express";

import UserController from "../controller/user.controller";
import PostController from "../controller/post.controller";
import CommentController from "../controller/comment.controller";
import authServices from "../middleware/auth";

const userController = new UserController();
const postController = new PostController();
const commentController = new CommentController();

const routes = (app: Express) => {

  app.post("/login", userController.login);

  app.post("/users", userController.create);
  app.get("/users", userController.findAll);
  app.get("/users/:id", userController.findOne);

  app.post("/posts", authServices.auth, postController.create);
  app.get("/posts", authServices.auth, postController.findAll);
  app.get("/posts/:id", authServices.auth, postController.findOne);
  app.put("/posts/:id", authServices.auth, postController.update);
  app.delete("/posts/:id", authServices.auth, postController.delete);

  app.post("/comments", authServices.auth, commentController.create);
  app.get("/comments/:postId", authServices.auth, commentController.findByPostId);
  app.put("/comments/:id", authServices.auth, commentController.edit);
  app.get("/comments", authServices.auth, commentController.findAll);
  app.delete("/comments/:id", authServices.auth, commentController.delete);
};

export default routes;
