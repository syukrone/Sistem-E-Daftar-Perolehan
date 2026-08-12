import 'dotenv/config';
import { db } from '../src/lib/db';

async function clearEntries() {
  console.log("Clearing procurement updates...");
  await db.procurementUpdate.deleteMany({});
  
  console.log("Clearing documents...");
  await db.document.deleteMany({});
  
  console.log("All document entries cleared successfully.");
}

clearEntries()
  .catch(console.error)
  .finally(async () => {
    await db.$disconnect();
  });
