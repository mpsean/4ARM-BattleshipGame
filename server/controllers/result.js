import express from 'express';
import {UserModel, SimpleUserModel} from '../model/user.js'; 

const router = express.Router();


export const updateScore = async (req, res) => {
    try {
        const { nickname } = req.params; 

        const updatedPlayer = await SimpleUserModel.findOneAndUpdate(
            { nickname : nickname },             
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
        const { nickname } = req.params; 
        const updatedPlayer = await SimpleUserModel.findOneAndUpdate(
            { nickname : nickname } ,             
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

export const getScore = async (req, res) => {
    try {
        const { nickname } = req.params; 
        const player = await SimpleUserModel.findOne(
            { nickname : nickname } ,             
        );
        return res.status(200).json({score : player.score});
    } catch (error) {
        res.status(500).json({ message: 'Failed to get player score', error });
    }
}

export const updateScoreAdv = async (req, res) => {
    try {
        const { nickname } = req.params; 

        const updatedPlayer = await SimpleUserModel.findOneAndUpdate(
            { nickname : nickname },             
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

export const resetScoreAdv = async (req, res) => {
    
    try {
        const { nickname } = req.params; 
        const updatedPlayer = await SimpleUserModel.findOneAndUpdate(
            { nickname : nickname } ,             
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

export const getScoreAdv = async (req, res) => {
    try {
        const { nickname } = req.params; 
        const player = await SimpleUserModel.findOne(
            { nickname : nickname } ,             
        );
        return res.status(200).json({score : player.score});
    } catch (error) {
        res.status(500).json({ message: 'Failed to get player score', error });
    }
}

export const updateMatchPlayed = async (req, res) => {
    try {
        const { nickname } = req.params; 

        const updatedPlayer = await UserModel.findOneAndUpdate(
            { nickname : nickname },             
            { $inc: { matchPlayed: 1 } }, 
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

export const updateMatchWon = async (req, res) => {
    try {
        const { nickname } = req.params; 

        const updatedPlayer = await UserModel.findOneAndUpdate(
            { nickname : nickname },             
            { $inc: { matchWon: 1 } }, 
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
}

export const updateMatchLose = async (req, res) => {
    try {
        const { nickname } = req.params; 

        const updatedPlayer = await UserModel.findOneAndUpdate(
            { nickname : nickname },             
            { $inc: { matchLose: 1 } }, 
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
}

export const updateMatchDraw = async (req, res) => {
    try {
        const { nickname } = req.params; 

        const updatedPlayer = await UserModel.findOneAndUpdate(
            { nickname : nickname },             
            { $inc: { matchDraw: 1 } }, 
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
}

export default router;