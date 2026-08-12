import 'dotenv/config'
import { db } from '../src/lib/db'

async function main() {
  const categories = [
    { id: 1, categoryName: "Sebut Harga & Tender Jabatan" },
    { id: 2, categoryName: "Pakej, Latihan & Waran" },
    { id: 3, categoryName: "Katering & Sajian" },
    { id: 4, categoryName: "Pengangkutan & Penginapan" },
    { id: 5, categoryName: "Aset, Sewaan & Penyelenggaraan" },
    { id: 6, categoryName: "Pelbagai / Miscellaneous" },
  ];

  console.log('Start seeding categories...');
  
  for (const category of categories) {
    const createdCategory = await db.category.upsert({
      where: { id: category.id },
      update: {},
      create: category,
    });
    console.log(`Created category: ${createdCategory.categoryName}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Adapter handles its own closing, but Prisma requires it for clean exit
    // wait, for V7 with mariadb adapter do we need to close pool?
    // the db.$disconnect() works fine.
    await db.$disconnect();
  });
