const {
  FILE_TYPES,
  PROPERTY_FIELDNAME,
  PROPERTY_FILEPREFIX,
  LIMIT_FILE_SIZE,
} = require("../configs/constant/upload")
const { upload } = require("../lib/uploader")
const multer = require("multer")

const fs = require("fs")

const validatePropertyUpload = (path) => {
  return async (req, res, next) => {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true })
    }

    upload({
      acceptedFileTypes: FILE_TYPES,
      filePrefix: PROPERTY_FILEPREFIX,
      maxSize: 2 * 1024 * 1024, //2MB
      dynamicDestination: path,
    }).array(PROPERTY_FIELDNAME)(req, res, function (err) {
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

      if (!req.files) {
        return res.status(400).json({
          message: "No file selected",
        })
      }

      const maxFileCount = 3
      if (req.files.length > maxFileCount) {
        req.files.map((file) => {
          fs.unlinkSync(file.path)
        })
        return res.status(400).json({
          message:
            "Too many files uploaded. Maximum allowed is " + maxFileCount,
        })
      }

      next()
    })
  }
}

module.exports = {
  validatePropertyUpload,
}
