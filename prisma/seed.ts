import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const stateNew = await prisma.eventState.upsert({
    where: { slug: 'new' },
    create: {
      name: 'New',
      slug: 'new'
    },
    update: {
      name: 'New',
      slug: 'new'
    }
  })
  const stateResolved = await prisma.eventState.upsert({
    where: { slug: 'resolved' },
    create: {
      name: 'Resolved',
      slug: 'resolved'
    },
    update: {
      name: 'Resolved',
      slug: 'resolved'
    }
  })
  console.log({ stateNew, stateResolved })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
