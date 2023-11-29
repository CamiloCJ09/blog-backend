import CommentModel, {CommentInput} from "../model/comment.model";

class CommentService{

  async create(comment : CommentInput){
    try{
      const newComment = await CommentModel.create(comment);
      return newComment;
    }catch(error){
      throw error;
    }
  }

  async findAll(){
    try{
      const comments = await CommentModel.find();
      return comments;
    }catch(error){
      throw error;
    }
  }

  async findByPostId(postId: string){
    try{
      const comments = await CommentModel.find({postId: postId});
      return comments;
    }catch(error){
      throw error;
    }
  }

}