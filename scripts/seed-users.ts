import 'dotenv/config';
import { db } from '../src/lib/db';
import bcrypt from 'bcryptjs';

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const usersToSeed = [
    { email: 'admin@jpan.sabah.gov.my', name: 'System Administrator', role: 'admin' },
    { email: 'Christine.Lim@sabah.gov.my', name: 'Christine Lim (PPKP)', role: 'ppkp' },
    { email: 'KhairulAzwin.Misrah@sabah.gov.my', name: 'Khairul Azwin Bin Misrah (PPTK)', role: 'pptk' },
    { email: 'Maurus.Goliong@sabah.gov.my', name: 'Maurus Goliong (SebutHarga/Tender)', role: 'staff' },
    { email: 'Noryati.Bulang@sabah.gov.my', name: 'Noryati Bulang (Pakej, Latihan & Waran)', role: 'staff' },
    { email: 'Nurul.AbdMalik@sabah.gov.my', name: 'Nurul Ezzatul Binti Abdul Malik (WPUA & Penginapan)', role: 'staff' },
    { email: 'Izman.Rayman@sabah.gov.my', name: 'Mohd Nur Izman Bin Rayman (Pembelian, Sewaan & Penyelenggaraan)', role: 'staff' },
  ] as const;

  console.log('Starting user seed...');

  for (const user of usersToSeed) {
    const existing = await db.user.findUnique({ where: { email: user.email } });
    if (existing) {
      const updated = await db.user.update({
        where: { email: user.email },
        data: { name: user.name, password: hashedPassword, role: user.role },
      });
      console.log(`Updated user: ${updated.email} (${updated.name} - Role: ${updated.role})`);
    } else {
      const created = await db.user.create({
        data: {
          name: user.name,
          email: user.email,
          password: hashedPassword,
          role: user.role,
        },
      });
      console.log(`Created user: ${created.email} (${created.name} - Role: ${created.role})`);
    }
  }

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
