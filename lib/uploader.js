const multer = require("multer")

const upload = ({
  filePrefix = "FILE",
  fileName = Date.now(),
  acceptedFileTypes = [],
  maxSize,
  dynamicDestination,
}) => {
  const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      const dynamicPath = dynamicDestination
      cb(null, dynamicPath)
    },
    filename: (req, file, cb) => {
      const { originalname } = file
      fileName = originalname + Date.now()
      cb(null, `${filePrefix}-${fileName}.${file.mimetype.split("/")[1]}`)
    },
  })

  const fileFilter = (req, file, cb) => {
    const extension = file.mimetype.split("/")[1]

    if (acceptedFileTypes.includes(extension)) {
      cb(null, true)
    } else {
      cb(new Error("Invalid file type"))
    }
  }

  return multer({
    storage: diskStorage,
    fileFilter,
    limits: { fileSize: maxSize },
  })
}

module.exports = {
  upload,
}
