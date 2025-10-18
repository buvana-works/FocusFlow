import mongoose  from "mongoose";

const todoSchema = new mongoose.Schema({
    date:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },    
    status:{
        type:Boolean,
        reqired:true
    },
    dueDate:{
        type:String,
        required:false
    },
    priority: {
        type:String,
        required:false
    },
    category:{
        type:String,
        reqired:false
    }
})


const TodoModel = mongoose.model("todos",todoSchema);

export default TodoModel;

