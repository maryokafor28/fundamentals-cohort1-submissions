const express = require('express');
const router = express.Router();
const {
  getAllAppointments,
  getAppointmentsByUser,
  createAppointment,
  updateAppointment,
  deleteAppointment
} = require('../controllers/appointmentController');

router.route('/')
  .get(getAllAppointments)
  .post(createAppointment);

router.route('/:id')
  .put(updateAppointment)
  .delete(deleteAppointment);

router.get('/user/:userId', getAppointmentsByUser);

module.exports = router;