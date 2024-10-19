import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import UserModel from './model/user.js';  // Removed session-related imports
import userRoutes from './routes/user.js';
import resultRoutes from './routes/result.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const PORT = 3001;

app.use(cors({
    origin: `http://localhost:5173`, // Replace with your frontend's URL
    // No credentials required
}));


app.use(`/user`, userRoutes);
app.use(`/result`, resultRoutes);

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



// Remove session-based user check and logout
