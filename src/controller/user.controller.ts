import { Request, Response } from "express";
import { UserDocument } from "../model/user.model";
import userService from "../service/user.service";


class UserController {

  

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      //await userService.validateUser(email, password);
      const token = await userService.login(email, password);
      return res.status(200).json(token);
    } catch (error) {
      return res.status(500).json(error);
    }
  }


  async create(req: Request, res: Response) {
    try {

      const user = await userService.create(req.body);
      return res.status(201).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const users = await userService.findAll();
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async findOne(req: Request, res: Response) {
    try {
      const user = await userService.findOne(req.params.id);
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  
}

export default UserController;