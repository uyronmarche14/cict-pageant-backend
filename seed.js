
const mongoose = require('mongoose');
const Contestant = require('./models/Contestant');
const Category = require('./models/Category');
const Judge = require('./models/Judge');
const Score = require('./models/Score');
require('dotenv').config();

console.log('Connecting to MongoDB...');
mongoose.connect(process.env.MONGODB_URI)
.then(async () => {
    console.log('Connected to DB for Seeding...');
    
    // Clear existing data
    await Contestant.deleteMany({});
    await Category.deleteMany({});
    await Judge.deleteMany({});
    await Score.deleteMany({}); // Clear scores too for a fresh start with new structure

    // 1. Seed Judges
    // Creating generic judges for now as no specific judge names were provided in the prompt, 
    // but the system is ready for them.
    await Judge.create([
        { name: 'Judge 1', pin: '1111' },
        { name: 'Judge 2', pin: '2222' },
        { name: 'Judge 3', pin: '3333' },
        { name: 'Judge 4', pin: '4444' },
        { name: 'Judge 5', pin: '5555' },
    ]);
    console.log('Judges seeded');

    // 2. Seed Categories
    // Extracted from images
    const categories = await Category.create([
        { 
            name: 'College Uniform - Male', 
            gender: 'Male', 
            order: 1,
            criteria: [
                { name: 'Runway', maxScore: 40 },
                { name: 'Attire Presentation', maxScore: 40 },
                { name: 'Introduction', maxScore: 10 },
                { name: 'Overall Impression', maxScore: 10 }
            ]
        },
        { 
            name: 'College Uniform - Female', 
            gender: 'Female', 
            order: 2,
            criteria: [
                { name: 'Runway', maxScore: 40 },
                { name: 'Attire Presentation', maxScore: 40 },
                { name: 'Introduction', maxScore: 10 },
                { name: 'Overall Impression', maxScore: 10 }
            ]
        },
        { 
            name: 'Sports Category - Male', 
            gender: 'Male',
            order: 3,
            criteria: [
                { name: 'Runway & Athletic Movement', maxScore: 40 },
                { name: 'Sportswear Presentation', maxScore: 40 },
                { name: 'Concept Execution', maxScore: 10 },
                { name: 'Expression & Energy', maxScore: 10 }
            ]
        },
        { 
            name: 'Sports Category - Female', 
            gender: 'Female',
            order: 4,
            criteria: [
                { name: 'Runway & Athletic Movement', maxScore: 40 },
                { name: 'Sportswear Presentation', maxScore: 40 },
                { name: 'Concept Execution', maxScore: 10 },
                { name: 'Expression & Energy', maxScore: 10 }
            ]
        },
        { 
            name: 'Glam & Suit Category - Male', 
            gender: 'Male',
            order: 5,
            criteria: [
                { name: 'Runway & Stage Performance', maxScore: 40 },
                { name: 'Attire Presentation', maxScore: 40 },
                { name: 'Advocacy', maxScore: 10 },
                { name: 'Overall impact', maxScore: 10 }
            ]
        },
        { 
            name: 'Glam & Suit Category - Female', 
            gender: 'Female',
            order: 6,
            criteria: [
                { name: 'Runway & Stage Performance', maxScore: 40 },
                { name: 'Attire Presentation', maxScore: 40 },
                { name: 'Advocacy', maxScore: 10 },
                { name: 'Overall impact', maxScore: 10 }
            ]
        }
    ]);
    console.log('Categories seeded (Hardcoded from Images)');

    // 3. Seed Contestants
    // Extracted from images
    const males = [
        { number: 1, name: 'Gayapa, Eco' },
        { number: 2, name: 'Obanil, Mark Justine' },
        { number: 3, name: 'Gonzales, Lean' },
        { number: 4, name: 'Mendoza, Kurt Cedric A.' },
        { number: 5, name: 'Gracia, Richbon Divina' },
        { number: 6, name: 'Santuele, Redray Neil Anthony S.' },
        { number: 7, name: '---' }, // Empty on sheet
        { number: 8, name: 'Gavine, John Argo' },
        { number: 9, name: 'Gamueda, Zymier James A.' },
        { number: 10, name: 'Gonzales, Jedrick' },
        { number: 11, name: 'Rayos Del Sol, Marck Dredge' },
        { number: 12, name: 'Espelita, Joshua Roy' },
    ];

    const females = [
        { number: 1, name: 'Magadja, Aesha' },
        { number: 2, name: 'Libay, Sheilla Mae' },
        { number: 3, name: 'Jaromay, Princess Janna' },
        { number: 4, name: 'Fajardo, Alyza Angela C.' },
        { number: 5, name: 'Cadangan, Reychelle Ann' },
        { number: 6, name: 'Reyes, Jade Anne H.' },
        { number: 7, name: 'Recto, Ellouise Anya Joy' },
        { number: 8, name: 'Baleña, Daniella Antonnette' },
        { number: 9, name: 'Guliban, Lindsay Marie F.' },
        { number: 10, name: '---' }, // Empty on sheet
        { number: 11, name: 'Futol, Rojan Nathalie E.' },
        { number: 12, name: 'Mabunga, Danielei' },
    ];

    const contestantsToSeed = [];

    // Push Males
    males.forEach(m => {
        contestantsToSeed.push({
            number: m.number,
            name: m.name,
            gender: 'Male',
            partnerNumber: m.number // Links to Female #N
        });
    });

    // Push Females
    females.forEach(f => {
        contestantsToSeed.push({
            number: f.number,
            name: f.name,
            gender: 'Female',
            partnerNumber: f.number // Links to Male #N
        });
    });

    await Contestant.create(contestantsToSeed);
    console.log('Contestants seeded (Hardcoded from Images)');

    mongoose.disconnect();
}).catch(err => {
    console.error(err);
    mongoose.disconnect();
});
