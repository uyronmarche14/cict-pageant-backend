import dotenv from 'dotenv';
import { db } from './db/index.js';
import { contestants, categories, judges, scores } from './db/schema.js';
import { eq } from 'drizzle-orm';

dotenv.config();

console.log('🌱 Seeding Supabase database...');

async function seed() {
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await db.delete(scores);
    await db.delete(contestants);
    await db.delete(categories);
    await db.delete(judges);

    // Seed Judges
    console.log('Seeding judges...');
    const judgeData = [
      { name: 'Judge 1', pin: '1111' },
      { name: 'Judge 2', pin: '2222' },
      { name: 'Judge 3', pin: '3333' },
      { name: 'Judge 4', pin: '4444' },
      { name: 'Judge 5', pin: '5555' },
    ];
    await db.insert(judges).values(judgeData);
    console.log('✅ Judges seeded');

    // Seed Categories
    console.log('Seeding categories...');
    const categoryData = [
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
    ];
    await db.insert(categories).values(categoryData);
    console.log('✅ Categories seeded');

    // Seed Contestants
    console.log('Seeding contestants...');
    const males = [
      { number: 1, name: 'Gayapa, Eco', gender: 'Male', partnerNumber: 1 },
      { number: 2, name: 'Obanil, Mark Justine', gender: 'Male', partnerNumber: 2 },
      { number: 3, name: 'Gonzales, Lean', gender: 'Male', partnerNumber: 3 },
      { number: 4, name: 'Mendoza, Kurt Cedric A.', gender: 'Male', partnerNumber: 4 },
      { number: 5, name: 'Gracia, Richbon Divina', gender: 'Male', partnerNumber: 5 },
      { number: 6, name: 'Santuele, Redray Neil Anthony S.', gender: 'Male', partnerNumber: 6 },
      { number: 7, name: '---', gender: 'Male', partnerNumber: 7 },
      { number: 8, name: 'Gavine, John Argo', gender: 'Male', partnerNumber: 8 },
      { number: 9, name: 'Gamueda, Zymier James A.', gender: 'Male', partnerNumber: 9 },
      { number: 10, name: 'Gonzales, Jedrick', gender: 'Male', partnerNumber: 10 },
      { number: 11, name: 'Rayos Del Sol, Marck Dredge', gender: 'Male', partnerNumber: 11 },
      { number: 12, name: 'Espelita, Joshua Roy', gender: 'Male', partnerNumber: 12 }
    ];

    const females = [
      { number: 1, name: 'Magadja, Aesha', gender: 'Female', partnerNumber: 1 },
      { number: 2, name: 'Libay, Sheilla Mae', gender: 'Female', partnerNumber: 2 },
      { number: 3, name: 'Jaromay, Princess Janna', gender: 'Female', partnerNumber: 3 },
      { number: 4, name: 'Fajardo, Alyza Angela C.', gender: 'Female', partnerNumber: 4 },
      { number: 5, name: 'Cadangan, Reychelle Ann', gender: 'Female', partnerNumber: 5 },
      { number: 6, name: 'Reyes, Jade Anne H.', gender: 'Female', partnerNumber: 6 },
      { number: 7, name: 'Recto, Ellouise Anya Joy', gender: 'Female', partnerNumber: 7 },
      { number: 8, name: 'Baleña, Daniella Antonnette', gender: 'Female', partnerNumber: 8 },
      { number: 9, name: 'Guliban, Lindsay Marie F.', gender: 'Female', partnerNumber: 9 },
      { number: 10, name: '---', gender: 'Female', partnerNumber: 10 },
      { number: 11, name: 'Futol, Rojan Nathalie E.', gender: 'Female', partnerNumber: 11 },
      { number: 12, name: 'Mabunga, Danielei', gender: 'Female', partnerNumber: 12 }
    ];

    await db.insert(contestants).values([...males, ...females]);
    console.log('✅ Contestants seeded');

    console.log('\n✅ Database seeded successfully!');
    console.log('📊 Summary:');
    console.log('  - 5 Judges');
    console.log('  - 6 Categories');
    console.log('  - 24 Contestants (12 male, 12 female)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
