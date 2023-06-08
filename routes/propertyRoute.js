const express = require("express")
const propertyController = require("../controllers/propertyController")
const {
  verifyToken,
  verifyRoleTenant,
} = require("../middlewares/authMiddleware")
const {
  validatePropertyUpload,
  verifyTenantOwnership,
} = require("../middlewares/propertyMiddleware")
const { TENANT_PROPERTY_PATH } = require("../configs/constant/uploadFilePath")

const route = express.Router()

route.post(
  "/",
  verifyToken,
  verifyRoleTenant,
  validatePropertyUpload(TENANT_PROPERTY_PATH),
  propertyController.createProperty
)

route.patch(
  "/:id",
  verifyToken,
  verifyRoleTenant,
  verifyTenantOwnership,
  propertyController.updateProperty
)

route.patch(
  "/delete/:id",
  verifyToken,
  verifyRoleTenant,
  verifyTenantOwnership,
  propertyController.softDeleteProperty
)

route.delete(
  "/delete/:id",
  verifyToken,
  verifyRoleTenant,
  verifyTenantOwnership,
  propertyController.deleteProperty
)

route.get(
  "/",
  verifyToken,
  verifyRoleTenant,
  propertyController.fetchAllTenantProperty
)

route.get(
  "/:id",
  verifyToken,
  verifyRoleTenant,
  verifyTenantOwnership,
  propertyController.fetchSpecificProperty
)

module.exports = route
