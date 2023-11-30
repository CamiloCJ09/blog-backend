import { Request, Response } from "express";
import { PostDocument } from "../model/post.model";
import postService from "../service/post.service";

class PostController{
  

  async create(req: Request, res: Response) {
    try {
      const post = await postService.create(req.body);
      return res.status(201).json(post);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const posts = await postService.findAll();
      return res.status(200).json(posts);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async findOne(req: Request, res: Response) {
    try {
      const post = await postService.findOne(req.params.id);
      return res.status(200).json(post);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const post = await postService.update(req.params.id, req.body);
      return res.status(200).json(post);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const post = await postService.delete(req.params.id);
      return res.status(200).json(post);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}

export default PostController;