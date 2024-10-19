import express from 'express';
import UserModel from '../model/user.js'; 

const router = express.Router();


export const updateScore = async (req, res) => {
    try {
        const { playerId } = req.params; 

        const updatedPlayer = await UserModel.findOneAndUpdate(
            playerId,             
            { $inc: { score: 1 } }, 
            { new: true }          
        );
    
        if (!updatedPlayer) {
            return res.status(404).json({ message: 'Player not found' });
        }
    
            // Send back the updated player details
        res.status(200).json(updatedPlayer);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update player score', error });
    }
};

export const resetScore = async (req, res) => {
    try {
        const { playerId } = req.params; 

        const updatedPlayer = await UserModel.findOneAndUpdate(
            playerId,             
            { $set: { score: 0 } }, 
            { new: true }          
        );
    
        if (!updatedPlayer) {
            return res.status(404).json({ message: 'Player not found' });
        }
    
            // Send back the updated player details
        res.status(200).json(updatedPlayer);
    } catch (error) {
        res.status(500).json({ message: 'Failed to reset player score', error });
    }
}