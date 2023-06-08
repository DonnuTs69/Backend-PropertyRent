const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

async function main() {
  const DIY = await prisma.Provincies.upsert({
    where: {
      provincy: "DKI Jakarta",
    },
    update: {},
    create: {
      provincy: "DKI Jakarta",
      city: {
        create: [
          {
            city: "Kota Jakarta Timur",
          },
          {
            city: "Kota Jakarta Selatan",
          },
          {
            city: "Kota Jakarta Barat",
          },
          {
            city: "Kota Jakarta Utara",
          },
          {
            city: "Kota Jakarta Pusat",
          },
          {
            city: "Kab. Kepulauan Seribu",
          },
        ],
      },
    },
  })
  console.log(DIY)
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.log(e)
    await prisma.$disconnect()
    process.exit(1)
  })
