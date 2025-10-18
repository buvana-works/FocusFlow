import mongoose from "mongoose";
import dotenv from 'dotenv';                      

dotenv.config();

       
const connectDB = async () =>{ 

    const  MONGO_URI =process.env.MONGO_URI
     

   console.log("process.env.MONGO_URI;",MONGO_URI);
    try{
        const conn = await mongoose.connect(MONGO_URI);
        console.log("mongo db connected at", conn.connection.host); 

    }
    catch(err){
console.log("error at mongo db connection", err.message);
process.exit(1); // status code 1  

    }


}

export default connectDB;