
import express from  'express';    
export const usersRouter = express.Router();


usersRouter.get("/", (req, res) =>{
    res.send("users home route")
})

usersRouter.get("/all", (req, res) =>{
    res.send("All users")
}) 
    