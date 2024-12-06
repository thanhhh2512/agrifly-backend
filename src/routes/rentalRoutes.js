// routes/rentalRoutes.js
const express = require("express");
const router = express.Router();
const rentalController = require("../controllers/rentalController");

// Định nghĩa các route cho thông tin thuê
router.get("/", rentalController.getAllRentals);
router.post("/", rentalController.createRental);

router.get("/:userId", rentalController.getRentals);

router.get("/:id", rentalController.getRentalById);
router.put("/update/:id", rentalController.updateRental);
router.put("/evaluate/:id", rentalController.updateEvaluation);
router.put("/review/:id", rentalController.updateIsReviewed);
router.put("/:id", rentalController.updateRental);

router.delete("/:id", rentalController.deleteRental);

module.exports = router;
