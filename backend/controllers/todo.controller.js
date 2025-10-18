import TodoModel from "../models/Todo.js"

export const createTodo = async (req, res)=>{
      const inputData = req.body;
        const todo = new TodoModel(inputData);
        try{     
            await todo.save();
            res.send("new todo saved successfully");
            console.log("new todo saved successfully");
        }
        catch(err){
            res.send("Error at create todo");
            console.log("Error at create todo");
        }
};

export const getAllTodos = async (req, res)=>{
        try{
            const todos = await TodoModel.find({});
            res.send(todos);
        }
        catch(err){
            console.log("err at create todo")
        }
    };

export const updateTodo = async(req, res)=>{
        try{
          await TodoModel.findByIdAndUpdate(req.params.id, req.body);
            res.send("Todo update successfully");
        }
        catch(err){
            res.send("error at update todo");
        }
    };

 export const getTodoById = async(req, res)=>{
        const id = req.params.id;
        try{
            const data = await TodoModel.findById(id)
            res.send(data)
        }
        catch(err){
            res.send("Error at get todo")
        }
    };

export const deleteTodo = async(req, res)=>{
        try{
        await TodoModel.findByIdAndDelete(req.params.id);
        res.send("Todo deleted successfully");
        }
        catch(err){
            res.send("Error at delete todo");
        }
    
    }






