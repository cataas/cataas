import { PrismaClient } from '@prisma/client'

export default () => {
  const prisma = new PrismaClient()

  return (context, next) => {
    context.set('store', prisma)

    next()
  }
}
