import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/User.js";
import nodemailer from "nodemailer";
import crypto from "crypto";

export const register = async (req, res) =>{
      try {
        const { username, email, password } = req.body;
        console.log("username, email, password in req.body", username, email, password); 
    
        const hashedPassword = await bcrypt.hash(password, 10);                              
    
        const user = new UserModel({ username, email, password: hashedPassword });
        await user.save();
    
         const token = new TokenModel({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        });         
        await token.save();
    
           const transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
        });
    
          const verifyUrl = `http://localhost:5000/auth/verify/${user._id}/${token.token}`;
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: "Verify your email",
          html: `<p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`
        });
    
        res.status(201).json({ message: "User registered successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: `Error registering user ${err.message}` });
      }
}

export const login = async (req, res) =>{
  try {
    const { email, password } = req.body;

    console.log("Login email", email);
    if(!email){
      return res.status(400).json({message:"email not given"})
    }

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ message: `User not found ${email}`,  });

      if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email before logging in" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
     const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });
    res.json({ accessToken, refreshToken, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging in" });
  }
}

export const refresh = async (req, res) =>{
      const { token } = req.body;
      if (!token) return res.status(401).json({ message: "No refresh token provided" });
    
      try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    
        // Optional: verify user still exists
        const user = await UserModel.findById(decoded.id);
        if (!user) return res.status(404).json({ message: "User not found" });
    
        // Issue new access token
        const newAccessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    
        res.json({ accessToken: newAccessToken });
      } catch (err) {
        return res.status(403).json({ message: "Invalid or expired refresh token" });
      }
};

export const verify = async (req, res) =>{
     try {
       const { userId, token } = req.params;
       const verifyToken = await TokenModel.findOne({ userId, token });
       if (!verifyToken) return res.status(400).json({ message: "Invalid or expired token" });
   
       await UserModel.findByIdAndUpdate(userId, { isVerified: true });
       await verifyToken.deleteOne();
   
       res.status(200).json({ message: "Email verified successfully. You can now log in." });
     } catch (err) {
       console.error(err);
       res.status(500).json({ message: "Error verifying email" });
     } 
};