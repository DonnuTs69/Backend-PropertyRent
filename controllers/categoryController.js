const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

const categoryController = {
  createCategory: async (req, res) => {
    const { category } = req.body
    try {
      await prisma.categories.create({
        data: {
          category,
        },
      })

      return res.status(200).json({
        message: "successfull create new category",
      })
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      })
    }
  },
}

module.exports = categoryController
