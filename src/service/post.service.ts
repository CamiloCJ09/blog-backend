import PostModel, { PostInput } from '../model/post.model';

class PostService{

    async create(post : PostInput){
        try{
            const newPost = await PostModel.create(post);
            return newPost;
        }catch(error){
            throw error;
        }
    }

    async findAll(){
        try{
            const posts = await PostModel.find();
            return posts;
        }catch(error){
            throw error;
        }
    }

    async findOne(id: String){
        try{
            const post = await PostModel.findById(id);
            return post;
        }catch(error){
            throw error;
        }
    }

    async update(id : string, post : PostInput){
        try{
            const updatedPost = await PostModel.findByIdAndUpdate(id, post, {new: true});
            return updatedPost;
        }catch(error){
            throw error;
        }
    }

    async delete(id : String){
        try{
            const deletedPost = await PostModel.findByIdAndDelete(id);
            return deletedPost;
        }catch(error){
            throw error;
        }
    }


}