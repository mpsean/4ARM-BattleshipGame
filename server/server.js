import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import UserModel from './model/user.js';  // Removed session-related imports

dotenv.config();
const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend's URL
    // No credentials required
}));

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

// Register endpoint
app.post("/register", async (req, res) => {
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
});

// Login endpoint
app.post("/login", async (req, res) => {
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
      return res.status(200).json({ message: 'Login successful' });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove session-based user check and logout
