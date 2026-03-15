const AcupressurePoint = require("../models/AcupressurePoint");

exports.getSymptoms = async (req, res) => {
  try {
    const points = await AcupressurePoint.find();
    const symptoms = [...new Set(points.flatMap(p => p.symptoms))];
    res.json(symptoms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPointsBySymptom = async (req, res) => {
  try {
    const points = await AcupressurePoint.find({
      symptoms: req.params.symptom
    });

    res.json(points);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPointsByBodyArea = async (req, res) => {
  try {
    const points = await AcupressurePoint.find({
      bodyArea: req.params.area
    });

    res.json(points);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPoint = async (req, res) => {
  try {
    const point = new AcupressurePoint(req.body);
    await point.save();
    res.json(point);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};