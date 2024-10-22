import express from 'express';
import bcrypt from 'bcrypt';
import UserModel from '../model/user.js'; 

const router = express.Router();

export const createUser = async (req, res) => {
    try {
        const { nickname, password } = req.body;
        const existingUser = await UserModel.findOne({ nickname });
        if (existingUser) {
            return res.status(400).json({ error: "Nickname already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new UserModel({ nickname, password: hashedPassword });
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const loginUser = async (req, res) => {
    const { nickname, password } = req.body;

    try {
        const user = await UserModel.findOne({ nickname });
        if(!user){
          return res.status(200).json({ message: 'User doesnt exist' });
        }
        
        if (!(await bcrypt.compare(password, user.password))) {
          return res.status(200).json({ message: 'Invalid credentials' });
      }
      // Respond with success
      return res.status(200).json({ message: 'Login successful', user });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


export default router;
