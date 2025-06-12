import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
        companyId: company.id,
        role: 'ROOT',
      },
      {
        email: 'ahmet.yilmaz@example.com',
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
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
