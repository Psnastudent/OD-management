import prisma from '../src/db/config.js';
import { Argon2id } from 'oslo/password';

async function seed() {
  try {
    const email = 'admin@ex.com';
    const plainPassword = 'password';

    const hashed = await new Argon2id().hash(plainPassword);

    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashed,
        emailVerified: true,
        name: 'Admin',
      },
      create: {
        email,
        password: hashed,
        role: 'ADMIN',
        emailVerified: true,
        name: 'Admin',
      },
    });

    console.log('Seeded admin user:', { id: user.id, email: user.email, emailVerified: user.emailVerified });
  } catch (err) {
    console.error('Failed to seed admin user:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
