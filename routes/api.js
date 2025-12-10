
const express = require('express');
const router = express.Router();
const Judge = require('../models/Judge');
const Contestant = require('../models/Contestant');
const Category = require('../models/Category');
const Score = require('../models/Score');

// Login
router.post('/login', async (req, res) => {
    const { pin } = req.body;
    try {
        const judge = await Judge.findOne({ pin });
        if (!judge) return res.status(401).json({ error: 'Invalid PIN' });
        res.json(judge);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Init Data (Categories, Contestants, Existing Scores for Judge)
router.get('/init/:judgeId', async (req, res) => {
    try {
        const categories = await Category.find().sort({ order: 1 });
        const contestants = await Contestant.find().sort({ number: 1 });
        // Optional: Get existing scores for this judge to show "Done" status
        const scores = await Score.find({ judgeId: req.params.judgeId });
        
        res.json({ categories, contestants, scores });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Submit Score
router.post('/score', async (req, res) => {
    const { judgeId, contestantId, categoryId, criteriaScores } = req.body;
    
    // Calculate Total
    let totalScore = 0;
    for (let key in criteriaScores) {
        totalScore += criteriaScores[key];
    }

    try {
        const score = await Score.findOneAndUpdate(
            { judgeId, contestantId, categoryId },
            { criteriaScores, totalScore },
            { upsert: true, new: true }
        );
        res.json(score);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Results (Admin)
router.get('/results', async (req, res) => {
    // Aggregation pipeline to sum scores per contestant per category, or total total.
    // Group by Contestant
    try {
        const results = await Score.aggregate([
            {
                $group: {
                    _id: "$contestantId",
                    totalAccumulated: { $sum: "$totalScore" },
                    breakdown: { $push: { category: "$categoryId", score: "$totalScore", judge: "$judgeId" } }
                }
            },
            {
                $lookup: {
                    from: "contestants",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contestant"
                }
            },
            { $unwind: "$contestant" },
            { $sort: { totalAccumulated: -1 } }
        ]);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
