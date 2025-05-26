import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
const passwordBaris = bcrypt.hashSync('baris123', 10);
const passwordAhmet = bcrypt.hashSync('ahmet123', 10);
async function main() {
  const company = await prisma.company.create({
    data: {
      name: 'Tech Innovations Inc.',
      emailOfRepresentative: 'barisakin.35@hotmail.com',
      phoneOfRepresentative: '+90 555 123 4567',
    },
  });

  console.log('Company created:', company);

  const users = await prisma.user.createMany({
    data: [
      {
        email: 'barisakin.35@hotmail.com',
        firstName: 'Barış',
        lastName: 'Akın',
        password: passwordBaris,
        companyId: company.id,
        role: 'ROOT',
      },
      {
        email: 'ahmet.yilmaz@example.com',
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        password: passwordAhmet,
        companyId: company.id,
        role: 'USER',
      },
    ],
  });

  console.log('Users created:', users);
}

main()
  .then(() => {
    console.log('🌱 Seed tamamlandı.');
    return prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Hata:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
