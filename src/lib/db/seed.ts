import { db } from './index'
import { users, accounts, heroImages } from './schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'
import { nanoid } from 'nanoid'

async function seed() {
  console.log('Seeding database...')

  // Check if admin user exists
  const existingAdmin = await db.query.users.findFirst({
    where: eq(users.email, 'admin@votenpp.com'),
  })

  if (!existingAdmin) {
    const userId = nanoid()
    const hashedPassword = await bcrypt.hash('admin123', 10)

    // Create user
    await db.insert(users).values({
      id: userId,
      email: 'admin@votenpp.com',
      name: 'Admin User',
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Create account with password
    await db.insert(accounts).values({
      id: nanoid(),
      userId: userId,
      accountId: 'admin@votenpp.com',
      providerId: 'credential',
      password: hashedPassword,
    })

    console.log('✓ Admin user created (email: admin@votenpp.com, password: admin123)')
  } else {
    console.log('✓ Admin user already exists')
  }

  // Check if hero images exist
  const existingHeroImages = await db.query.heroImages.findMany()
  
  if (existingHeroImages.length === 0) {
    await db.insert(heroImages).values([
      {
        title: 'Empowering Communities',
        imageUrl: '/carenage.jpg',
        caption: 'Working together for a stronger Grenada.',
        link: '/about',
        order: 0,
        active: true,
      },
      {
        title: 'Sustainable Development',
        imageUrl: '/placeholder.jpg',
        caption: 'Building a resilient future for all.',
        link: '/about',
        order: 1,
        active: true,
      },
    ])
    console.log('✓ Sample hero images created')
  } else {
    console.log('✓ Hero images already exist')
  }

  console.log('\nDatabase seeded successfully!')
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error seeding database:', err)
    process.exit(1)
  })
