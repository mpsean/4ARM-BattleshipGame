import express from 'express';
import bcrypt from 'bcrypt';
import {UserModel, SimpleUserModel} from '../model/user.js'; 

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

export const loginUserSimple = async (req, res) => {
    const { nickname } = req.body;

    try {
        const user = await SimpleUserModel.findOne({ nickname });
        if(user){
          return res.status(200).json({ message: 'Username already exist' });
        }
        const newUser = new SimpleUserModel({ nickname });
        const savedUser = await newUser.save();
      // Respond with success
      return res.status(200).json({ message: 'Login successful', savedUser });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const deleteUserSimple = async (req, res) => {
    console.log(req.params);
    try {
        const { nickname } = req.params;
        const user = await SimpleUserModel.findOneAndDelete({ nickname : nickname });
        if (!nickname) {
            return res.status(404).json({ message: 'Username not found' });
          }
          return res
            .status(200)
            .json({ message: 'User deleted successfully', user: nickname });
        } catch (error) {
          console.error(error);
          return res.status(500).json({ message: 'Error deleting user' });
        }
    };
    
export const getUserData = async (req, res) => {
    try {
        const { nickname } = req.params; 
        const player = await UserModel.findOne(
            { nickname : nickname } ,             
        );
        res.status(200).json({nickname : player.nickname, matchPlayed : player.matchPlayed, matchWon : player.matchWon, matchLose : player.matchLose, matchDraw : player.matchDraw});
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
}

export default router;
