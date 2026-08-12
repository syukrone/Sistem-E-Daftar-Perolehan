import 'dotenv/config';
import { db } from '../src/lib/db';

async function main() {
  console.log('Starting document seed...');

  // 1. Get or create a category
  let category = await db.category.findFirst();
  if (!category) {
    category = await db.category.create({
      data: { categoryName: 'Perkhidmatan (Services)' }
    });
  }

  // 2. Get users to use as creator and assignee
  let staff = await db.user.findFirst({ where: { role: 'staff' } });
  if (!staff) {
    console.error('No staff user found. Please run seed-users.ts first.');
    process.exit(1);
  }

  let ppkp = await db.user.findFirst({ where: { role: 'ppkp' } });

  // 3. Generate 50 documents (15 in_progress, 35 closed)
  const totalDocuments = 50;
  const inProgressCount = 15;
  const closedCount = 35;

  let createdCount = 0;

  for (let i = 1; i <= totalDocuments; i++) {
    const isInProgress = i <= inProgressCount;
    const status = isInProgress ? 'in_progress' : 'closed';
    
    // Generate dates spread over the last 30 days
    const receivedDate = new Date();
    receivedDate.setDate(receivedDate.getDate() - Math.floor(Math.random() * 30));

    await db.document.create({
      data: {
        tajuk: `Dummy Document ${i}: Perolehan ${isInProgress ? 'Dalam Proses' : 'Selesai'}`,
        bahagianMemohon: `Bahagian ${Math.floor(Math.random() * 5) + 1}`,
        noRujukanFail: `JPAN/S/${Math.floor(Math.random() * 1000)}/2026`,
        tarikhTerima: receivedDate,
        tarikhRujukanFail: new Date(receivedDate.getTime() + 86400000), // 1 day after receive
        categoryId: category.id,
        status: status,
        reviewPpkp: true,
        reviewPpkpAt: new Date(receivedDate.getTime() + 86400000 * 2),
        reviewPptk: true,
        reviewPptkAt: new Date(receivedDate.getTime() + 86400000 * 3),
        createdByUserId: staff.id,
        assignedToUserId: ppkp?.id || staff.id,
      }
    });

    createdCount++;
    if (createdCount % 10 === 0) {
      console.log(`Created ${createdCount} documents...`);
    }
  }

  console.log(`\nSuccessfully created 50 dummy documents:`);
  console.log(`- 15 'in_progress' (In Process)`);
  console.log(`- 35 'closed' (Completed)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
