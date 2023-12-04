import { Request, Response } from "express";
import commentService from "../service/comment.service";

class CommentController {
  

  async create(req: Request, res: Response) {
    try {
      const comment = await commentService.create(req.body);
      return res.status(201).json(comment);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async findByPostId(req: Request, res: Response) {
    try {
      const comments = await commentService.findByPostId(req.params.postId);
      return res.status(200).json(comments);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const comments = await commentService.findAll();
      return res.status(200).json(comments);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const comment = await commentService.delete(req.params.id);
      return res.status(200).json(comment);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async edit(req: Request, res: Response) {
    try {
      const comment = await commentService.edit(req.params.id, req.body);
      return res.status(200).json(comment);
    } catch (error) {
      return res.status(500).json(error);
    }
  }
}

export default CommentController;