import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { db } from './db/index.js';
import { judges, contestants, categories, scores } from './db/schema.js';
import { eq, and, sql } from 'drizzle-orm';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ============================================
// ROUTES
// ============================================

// Login route - Judge authentication
app.post('/api/login', async (req, res) => {
  try {
    const { pin } = req.body;
    
    const judge = await db.select().from(judges).where(eq(judges.pin, pin)).limit(1);
    
    if (judge.length === 0) {
      return res.status(401).json({ error: 'Invalid PIN' });
    }
    
    res.json(judge[0]);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Initialize data for a judge
app.get('/api/init/:judgeId', async (req, res) => {
  try {
    const { judgeId } = req.params;
    
    // Get all categories
    const allCategories = await db.select().from(categories).orderBy(categories.order);
    
    // Get all contestants
    const allContestants = await db.select().from(contestants).orderBy(contestants.number);
    
    // Get scores for this judge (only if judgeId is a valid number)
    let judgeScores = [];
    const judgeIdNum = parseInt(judgeId);
    if (!isNaN(judgeIdNum)) {
      judgeScores = await db.select().from(scores).where(eq(scores.judgeId, judgeIdNum));
    }
    
    res.json({
      categories: allCategories,
      contestants: allContestants,
      scores: judgeScores
    });
  } catch (error) {
    console.error('Init error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Initialize data for admin (no judge filter)
app.get('/api/init/admin', async (req, res) => {
  try {
    const allCategories = await db.select().from(categories).orderBy(categories.order);
    const allContestants = await db.select().from(contestants).orderBy(contestants.number);
    
    res.json({
      categories: allCategories,
      contestants: allContestants
    });
  } catch (error) {
    console.error('Admin init error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit score
app.post('/api/score', async (req, res) => {
  try {
    const { judgeId, contestantId, categoryId, criteriaScores, totalScore } = req.body;
    
    // Check if score already exists
    const existing = await db.select()
      .from(scores)
      .where(
        and(
          eq(scores.judgeId, judgeId),
          eq(scores.contestantId, contestantId),
          eq(scores.categoryId, categoryId)
        )
      )
      .limit(1);
    
    if (existing.length > 0) {
      // Update existing score
      await db.update(scores)
        .set({
          criteriaScores,
          totalScore
        })
        .where(eq(scores.id, existing[0].id));
      
      res.json({ message: 'Score updated successfully' });
    } else {
      // Insert new score
      await db.insert(scores).values({
        judgeId,
        contestantId,
        categoryId,
        criteriaScores,
        totalScore
      });
      
      res.json({ message: 'Score submitted successfully' });
    }
  } catch (error) {
    console.error('Score submission error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get results/tabulation
app.get('/api/results', async (req, res) => {
  try {
    // Get all judges first
    const allJudges = await db.select().from(judges);
    const judgeMap = {};
    allJudges.forEach(j => {
      judgeMap[j.id] = j.name;
    });
    
    // Get all scores with contestant and category details
    const allScores = await db
      .select({
        scoreId: scores.id,
        judgeId: scores.judgeId,
        totalScore: scores.totalScore,
        criteriaScores: scores.criteriaScores,
        contestantId: contestants.id,
        contestantNumber: contestants.number,
        contestantName: contestants.name,
        contestantGender: contestants.gender,
        categoryId: categories.id,
        categoryName: categories.name,
        categoryGender: categories.gender,
      })
      .from(scores)
      .innerJoin(contestants, eq(scores.contestantId, contestants.id))
      .innerJoin(categories, eq(scores.categoryId, categories.id));
    
    // Group scores by contestant
    const groupedResults = {};
    
    allScores.forEach(score => {
      const key = `${score.contestantId}-${score.categoryId}`;
      
      if (!groupedResults[key]) {
        groupedResults[key] = {
          _id: key,
          contestant: {
            id: score.contestantId,
            _id: score.contestantId, // Keep for backwards compatibility
            number: score.contestantNumber,
            name: score.contestantName,
            gender: score.contestantGender
          },
          category: {
            id: score.categoryId,
            _id: score.categoryId, // Keep for backwards compatibility
            name: score.categoryName,
            gender: score.categoryGender
          },
          breakdown: [],
          totalAccumulated: 0
        };
      }
      
      groupedResults[key].breakdown.push({
        judgeId: score.judgeId,
        judgeName: judgeMap[score.judgeId] || `Judge ${score.judgeId}`,
        score: score.totalScore,
        criteriaScores: score.criteriaScores
      });
      
      groupedResults[key].totalAccumulated += score.totalScore;
    });
    
    // Convert to array and sort by total score (descending)
    const results = Object.values(groupedResults).sort((a, b) => b.totalAccumulated - a.totalAccumulated);
    
    res.json(results);
  } catch (error) {
    console.error('Results error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', database: 'Supabase PostgreSQL', orm: 'Drizzle' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📊 Database: Supabase PostgreSQL`);
  console.log(`🔧 ORM: Drizzle`);
});
