const { validToken } = require("../lib/jwt")
const { PrismaClient } = require("@prisma/client")
const { roleEnum } = require("../configs/constant.js")
const { upload } = require("../lib/uploader")
const multer = require("multer")
const fs = require("fs")
const {
  LIMIT_FILE_SIZE,
  PROFILE_FIELDNAME,
  PROFILE_FILEPREFIX,
  FILE_TYPES,
} = require("../configs/constant/upload")

const prisma = new PrismaClient()

const verifyToken = (req, res, next) => {
  let token = req.headers.authorization

  if (!token) {
    return res.status(401).json({
      message: "User unauthorized",
    })
  }

  try {
    token = token.split(" ")[1]

    const verifiedUser = validToken(token)

    if (!verifiedUser) {
      return res.status(401).json({
        message: "Unauthorized request",
      })
    }

    req.user = verifiedUser
    next()
  } catch (err) {
    return res.status(401).json({
      message: "Invalid Token",
    })
  }
}

const verifyRoleUser = async (req, res, next) => {
  try {
    const findUser = await prisma.user.findFirst({
      where: {
        id: req.user.id,
        AND: {
          role: roleEnum.USER,
        },
      },
    })

    if (!findUser) {
      return res.status(400).json({
        message: "User unauthorized",
      })
    }
    next()
  } catch (err) {
    return res.status(500).json({
      message: "Server Error",
    })
  }
}

const verifyRoleTenant = async (req, res, next) => {
  try {
    const findTenant = await prisma.user.findFirst({
      where: {
        id: req.user.id,
        AND: {
          role: roleEnum.TENANT,
        },
      },
    })

    if (!findTenant) {
      return res.status(400).json({
        message: "Tenant unauthorized",
      })
    }
    next()
  } catch (err) {
    return res.status(500).json({
      message: "Server Error",
    })
  }
}

const validateProfileUpload = (path) => {
  return async (req, res, next) => {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true })
    }

    upload({
      acceptedFileTypes: FILE_TYPES,
      filePrefix: PROFILE_FILEPREFIX,
      maxSize: 2 * 1024 * 1024, //2MB
      dynamicDestination: path,
    }).single(PROFILE_FIELDNAME)(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === LIMIT_FILE_SIZE) {
          return res.status(400).json({
            message: "File too large",
          })
        } else {
          return res.status(400).json({
            message: "File upload error: " + err.message,
          })
        }
      } else if (err) {
        return res.status(400).json({
          message: "File upload error: " + err.message,
        })
      }

      if (!req.file) {
        return res.status(400).json({
          message: "No file selected",
        })
      }

      next()
    })
  }
}

module.exports = {
  verifyToken,
  verifyRoleUser,
  verifyRoleTenant,
  validateProfileUpload,
}
