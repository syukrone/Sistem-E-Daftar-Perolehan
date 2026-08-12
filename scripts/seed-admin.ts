import 'dotenv/config';
import { db } from '../src/lib/db';
import bcrypt from 'bcryptjs';

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await db.user.upsert({
    where: { email: 'admin@jpan.sabah.gov.my' },
    update: {
      password: hashedPassword,
    },
    create: {
      name: 'System Administrator',
      email: 'admin@jpan.sabah.gov.my',
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log(`Created admin user: ${admin.email} with password: admin123`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
