import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.blog.updateMany({
    where: {
      isDefault: null, // 新しく追加したカラムがnullのもの
    },
    data: {
      isDefault: true,
    },
  })
}

main() 