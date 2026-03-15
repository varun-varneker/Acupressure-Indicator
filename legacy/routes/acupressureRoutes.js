const express = require("express");
const router = express.Router();
const controller = require("../controllers/acupressureController");

router.get("/symptoms", controller.getSymptoms);
router.get("/symptom/:symptom", controller.getPointsBySymptom);
router.get("/body/:area", controller.getPointsByBodyArea);
router.post("/point", controller.createPoint);

module.exports = router;