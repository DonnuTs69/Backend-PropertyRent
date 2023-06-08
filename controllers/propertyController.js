const { PrismaClient } = require("@prisma/client")
const { PROPERTY_IMAGES_PATH } = require("../configs/constant/unlinkFilePath")
const fs = require("fs")

const prisma = new PrismaClient()

const propertyController = {
  createProperty: async (req, res) => {
    const { name, description, rules, facilities } = req.body
    const categoryId = parseInt(req.body.categoryId)
    const provinceId = parseInt(req.body.provinceId)
    const cityId = parseInt(req.body.cityId)

    const files = req.files
    let imagesPath = []

    try {
      const foundUserById = await prisma.user.findFirst({
        where: {
          id: req.user.id,
        },
      })

      if (
        !name ||
        !description ||
        !rules ||
        !facilities ||
        !categoryId ||
        !provinceId ||
        !cityId
      ) {
        files.map((file) => {
          fs.unlinkSync(file.path)
        })
        return res.status(400).json({
          message: "input must be filled!",
        })
      }

      const foundCategoryById = await prisma.categories.findFirst({
        where: {
          id: categoryId,
        },
      })

      const foundProvinceById = await prisma.provincies.findFirst({
        where: {
          id: provinceId,
        },
      })

      const foundCityById = await prisma.cities.findFirst({
        where: {
          id: cityId,
        },
      })

      if (!foundCategoryById) {
        return res.status(400).json({
          message: "Category not found",
        })
      }

      if (!foundProvinceById) {
        return res.status(400).json({
          message: "Province not found",
        })
      }

      if (!foundCityById) {
        return res.status(400).json({
          message: "City not found",
        })
      }

      const propertyDataInput = await prisma.properties.create({
        data: {
          name,
          description,
          rules,
          facilities,
          categoryId: foundCategoryById.id,
          provinceId: foundProvinceById.id,
          cityId: foundCityById.id,
          userId: foundUserById.id,
        },
      })

      imagesPath = files.map((file) => file.filename)
      const propertyDataImages = imagesPath.map((item) => {
        return {
          propertyPicUrl: item,
          propertyId: propertyDataInput.id,
        }
      })

      await prisma.propertyImages.createMany({
        data: propertyDataImages,
      })

      const propertyDataResult = await prisma.properties.findUnique({
        where: {
          id: propertyDataInput.id,
        },
        include: { propertyImages: true, user: true },
      })

      return res.status(200).json({
        message: "Successfull create property",
        data: propertyDataResult,
      })
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      })
    }
  },
  updateProperty: async (req, res) => {
    try {
      const updateProperty = await prisma.properties.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          ...req.body,
        },
      })

      return res.status(200).json({
        message: "Success update property",
        data: updateProperty,
      })
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      })
    }
  },
  softDeleteProperty: async (req, res) => {
    try {
      await prisma.properties.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: {
          deleted: true,
        },
      })
      return res.status(200).json({
        message: "Success delete property",
      })
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      })
    }
  },
  deleteProperty: async (req, res) => {
    try {
      const propertyImages = await prisma.propertyImages.findMany({
        where: {
          propertyId: parseInt(req.params.id),
        },
      })

      await prisma.properties.delete({
        where: {
          id: parseInt(req.params.id),
        },
      })
      propertyImages.map((item) => {
        fs.unlinkSync(PROPERTY_IMAGES_PATH + item.propertyPicUrl)
      })

      return res.status(200).json({
        message: "Success delete property",
      })
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      })
    }
  },
  fetchAllTenantProperty: async (req, res) => {
    try {
      const allPropertyData = await prisma.properties.findMany()

      return res.status(200).json({
        message: "success fetch all property",
        data: allPropertyData,
      })
    } catch (err) {
      return res.status(500).json({
        message: err.message,
      })
    }
  },
}

module.exports = propertyController
