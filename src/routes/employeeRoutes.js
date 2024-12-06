const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const uploadCloud = require("../middlewares/upload");

router.get("/", employeeController.getAllEmployees);

router.get("/:id", employeeController.getEmployeeById);

router.post(
  "/",
  uploadCloud.single("image"),
  employeeController.createEmployee
);

router.put("/:id", employeeController.updateEmployee);

router.delete("/:id", employeeController.deleteEmployee);

router.put("/update/:id", employeeController.updateStatusEmployee);

module.exports = router;
