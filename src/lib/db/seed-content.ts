import { db } from './index'
import { pageContent } from './schema'

async function seedContent() {
  console.log('Seeding page content...')

  // Seed About page content
  await db.insert(pageContent).values([
    {
      page: 'about',
      section: 'history',
      title: 'Our History',
      content: {
        paragraphs: [
          'The New National Party (NNP) was founded in 1984 through the merger of the Grenada National Party and the National Democratic Party. Since its inception, the NNP has been committed to fostering economic growth, social development, and good governance in Grenada.',
          'Over the years, the NNP has played a significant role in shaping Grenada\'s political landscape, forming government multiple times and implementing policies aimed at improving the lives of Grenadians.',
        ],
      },
      order: 0,
      active: true,
    },
    {
      page: 'about',
      section: 'leadership',
      title: 'Our Leadership',
      content: {
        leaders: [
          {
            name: 'Emmalin Pierre',
            role: 'Party Leader',
            image: '/placeholder.svg?height=100&width=100',
          },
          {
            name: 'Norland Cox',
            role: 'Deputy Leader',
            image: '/placeholder.svg?height=100&width=100',
          },
        ],
      },
      order: 1,
      active: true,
    },
    {
      page: 'about',
      section: 'policies',
      title: 'Our Key Policies',
      content: {
        policies: [
          {
            title: 'Economic Growth',
            description: 'Promoting sustainable economic development through diversification, investment in key sectors, and support for small businesses.',
          },
          {
            title: 'Education',
            description: 'Investing in quality education at all levels, focusing on skills development and preparing our youth for the global job market.',
          },
          {
            title: 'Healthcare',
            description: 'Improving healthcare infrastructure, expanding access to medical services, and promoting preventive care and healthy lifestyles.',
          },
          {
            title: 'Environmental Protection',
            description: 'Implementing policies to protect Grenada\'s natural resources, promote renewable energy, and build resilience against climate change.',
          },
          {
            title: 'Tourism',
            description: 'Enhancing Grenada\'s tourism product through sustainable development, marketing, and improving infrastructure to attract more visitors.',
          },
          {
            title: 'Youth Empowerment',
            description: 'Creating opportunities for young Grenadians through education, skills training, entrepreneurship support, and job creation initiatives.',
          },
        ],
      },
      order: 2,
      active: true,
    },
    {
      page: 'about',
      section: 'commitment',
      title: 'Our Commitment',
      content: {
        paragraphs: [
          'The New National Party is dedicated to serving the people of Grenada, Carriacou, and Petite Martinique. We believe in transparent governance, inclusive development, and policies that benefit all Grenadians.',
          'As we move forward, we remain committed to our core values of integrity, accountability, and progress. We invite all Grenadians to join us in building a brighter future for our nation.',
        ],
      },
      order: 3,
      active: true,
    },
    {
      page: 'home',
      section: 'mission',
      title: 'Our Mission',
      content: {
        text: 'To serve the people of Grenada with integrity, transparency, and dedication to building a prosperous and inclusive nation.',
      },
      order: 0,
      active: true,
    },
    {
      page: 'home',
      section: 'vision',
      title: 'Our Vision',
      content: {
        text: 'A united, progressive Grenada where every citizen has the opportunity to thrive and contribute to our nation\'s success.',
      },
      order: 1,
      active: true,
    },
  ])

  console.log('✓ Page content seeded successfully')
}

seedContent()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error seeding content:', err)
    process.exit(1)
  })

