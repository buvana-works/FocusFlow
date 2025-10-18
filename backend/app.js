import express from  'express';                              
import cors from 'cors';
const app = express();     
import dotenv from 'dotenv';
import {todoRouter} from './router/Todos.js';
import  errorHandler  from "./middleware/errorhandlerMiddleware.js";
import authRouter from "./router/Auth.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import morgan from "morgan";

    
  
dotenv.config();  
app.use(express.json());
app.use(cors());
app.use(morgan("dev")); 
                  
   //     TodoModel.find();                         
//     res.send("server is ready");                           
// })             



// app.use("/users", usersRouter);

                       
// app.post("/createTodo", async (req, res) =>{       
//     const input = req.body;            
//     const newTodo = new TodoModel(input);
      
//     try{
//         await newTodo.save();
//         res.status(201).json({message: "Todo created successfully", data: newTodo});
//     }
//     catch(err){
//         console.error("Error creating todo:", err);
//         res.status(500).json({message: "Internal server error"});     
//     }
// })

// app.delete("/deleteTodo/:id", async (req, res) =>{
//       const {id} = req.params;

//       try{
//       await TodoModel.findByIdAndDelete(id);
//       res.status(201).json({message:"Todo deleted successfully"})
//       }
//       catch(err){
//         console.log("Internal server error", err);  

//       }
// })

// app.get("/listTodo", async (req, res) =>{
//     try{
//       const data =  await TodoModel.find({});
//       console.log("fetched data", data);
//         res.send(data);
//     }
//     catch(err){
//     console.log("Internal server error", err)
// }
// }
// )


// app.put("/updateTodo/:id", async (req, res) =>{

//       try{
//       await TodoModel.findByIdAndUpdate(req.params.id, req.body);
//       res.status(201).json({message:"Todo updated successfully"});
//       }
//       catch(err){
//         console.log("Internal server error", err);

//       }
// })

// app.get("/getTodo/:id",async (req, res)=>{
//     const id = req.params.id;
//     const fetchedata = await TodoModel.findById(id);
//     console.log("fetched data", fetchedata);
//     res.send(fetchedata)
// })


app.use("/auth", authRouter);
app.use("/todo", authMiddleware, todoRouter);  // protect todos

app.use(errorHandler);

export default app;