import { PrismaClient } from '@prisma/client'

let prisma

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: [
        {
          emit: 'event',
          level: 'query'
        }
      ]
    })
  }
  prisma = global.prisma
}

/*
prisma.$on("query", async (e) => {
  console.log(`On Query -> ${e.query} ${e.params}`)
})
*/

export default prisma
