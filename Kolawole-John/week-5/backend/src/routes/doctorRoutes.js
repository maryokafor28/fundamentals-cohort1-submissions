const express = require('express');
const router = express.Router();
const {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor
} = require('../controllers/doctorController');

// Route: /api/doctors
router.route('/')
  .get(getAllDoctors)
  .post(createDoctor);

// Route: /api/doctors/:id
router.route('/:id')
  .get(getDoctorById)
  .put(updateDoctor)
  .delete(deleteDoctor);

module.exports = router;