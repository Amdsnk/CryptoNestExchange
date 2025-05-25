import { enhanceMockData } from './enhanceMockData';
import { initializeDatabase } from '../server/db';

async function main() {
  try {
    console.log('Initializing database...');
    
    // Initialize database first
    const dbInitialized = await initializeDatabase();
    if (!dbInitialized) {
      console.error('Failed to initialize database. Cannot seed mock data.');
      process.exit(1);
    }
    
    // Run enhanced mock data seeding
    console.log('Starting enhanced mock data seeding...');
    const result = await enhanceMockData();
    
    if (result) {
      console.log('Enhanced mock data seeded successfully!');
    } else {
      console.error('Failed to seed enhanced mock data.');
      process.exit(1);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error running mock data enhancement:', error);
    process.exit(1);
  }
}

main();