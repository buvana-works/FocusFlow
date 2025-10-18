import express from  'express';
import {createTodo,getAllTodos,updateTodo, getTodoById,deleteTodo } from "../controllers/todo.controller.js"     
export const todoRouter = express.Router();


todoRouter.post("/createTodo",createTodo);  

todoRouter.get("/listTodo",getAllTodos);

todoRouter.put("/updateTodo/:id",updateTodo);

todoRouter.delete("/deleteTodo/:id",deleteTodo);

todoRouter.get("/getTodo/:id",getTodoById);





