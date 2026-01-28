import prisma from '../src/db/config.js';
import { Argon2id } from 'oslo/password';

async function seed() {
  try {
    const email = 'user@gmail.com';
    const plainPassword = 'password';

    const hashed = await new Argon2id().hash(plainPassword);

    // Ensure we have a department
    let department = await prisma.department.findFirst();
    if (!department) {
      department = await prisma.department.create({
        data: { name: 'Default Dept', code: 'DEF' },
      });
      console.log('Created department', department.id);
    }

    // Ensure we have a group
    let group = await prisma.group.findFirst();
    if (!group) {
      group = await prisma.group.create({
        data: {
          name: 'Default Group',
          section: 'A',
          batch: '2025',
          departmentId: department.id,
        },
      });
      console.log('Created group', group.id);
    }

    // Upsert user
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        password: hashed,
        emailVerified: true,
        name: 'Demo User',
        role: 'STUDENT',
      },
      create: {
        email,
        password: hashed,
        emailVerified: true,
        name: 'Demo User',
        role: 'STUDENT',
      },
    });

    console.log('Upserted user:', { id: user.id, email: user.email });

    // Create or update student record
    const regNo = 'REG_USER_001';
    const existingStudent = await prisma.student.findUnique({ where: { regNo } });
    if (existingStudent) {
      console.log('Student already exists:', existingStudent.id);
    } else {
      const student = await prisma.student.create({
        data: {
          rollNo: 'ROLL_USER_001',
          regNo,
          attendancePercentage: 100,
          userId: user.id,
          groupId: group.id,
          departmentId: department.id,
        },
      });
      console.log('Created student:', student.id);
    }

    console.log('Seed user complete. Login with:', email, '/', plainPassword);
  } catch (err) {
    console.error('Failed to seed user:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

seed();
