const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const mongoose = require('mongoose');
const app = express();

connectDB();
const rankSchema = new mongoose.Schema({
    name: String,
    score: Number,
});

const Rank = mongoose.model('Rank', rankSchema, 'ranks');

app.use(cors());
app.use(express.json());

app.post('/',async (req,res)=>{
    try{
        const {userName} = req.body;
        const exist = await Rank.findOne({ name: userName });
        if(exist){
            res.status(200).json({exist:true,highScore: exist.score});
        }else{
            res.json({exist:false})
        }
    }catch{
        res.status(500).json({message:"Server is on Maintanance"});
    }
})

app.get('/ranks', async (req, res) => {
    try {
        const ranks = await Rank.find();
        res.json(ranks);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving ranks", error: err });
    }
});

app.post('/addPlayer', async (req, res) => {
    try {
        const { playerName, playerScore,adminPassword } = req.body;
        if(adminPassword == "3222"){
            const newPlayer = new Rank({
                name: playerName,
                score: playerScore,
            });
            await newPlayer.save();
            res.status(201).json({ message: 'Player added successfully'  });
        }
        else{
            res.json({message: "chal be"});
        }
    } catch (err) {
        res.status(500).json({ message: "Error adding player", error: err });
    }
});

app.post('/subscore',async (req,res)=>{
    try{
        let {playerName,cur_score} = req.body;
        const player = await Rank.findOne({ name: playerName });
        if(player){
            if(cur_score>player.score){
                player.score = cur_score;
                await player.save();
                res.status(200).json({ message: "You Cracked Your HighScore",cracked: true});
            }else{
                res.status(200).json({ message: "Score is not higher, no update made",cracked:false});
            }
        }else{
            return res.json({ message: "Player not found", cracked:false});
        }
    }catch(error){
        res.status(500).json({message: "Server is On Maintanace"});
    }
})

app.listen(3000);
