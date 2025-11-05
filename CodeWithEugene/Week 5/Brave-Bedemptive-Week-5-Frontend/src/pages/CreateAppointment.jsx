import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ArrowLeft, Save, Calendar, Clock, User, UserCheck, AlertCircle } from 'lucide-react'
import { appointmentApi, userApi, doctorApi } from '../lib/api'
import LoadingSpinner from '../components/LoadingSpinner'

export default function CreateAppointment() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      appointmentDate: new Date().toISOString().split('T')[0],
      appointmentTime: '09:00',
      duration: 30,
      type: 'consultation',
      priority: 'normal'
    }
  })

  const selectedPatient = watch('patient')
  const selectedDoctor = watch('doctor')
  const appointmentDate = watch('appointmentDate')

  // Fetch patients (users)
  const { data: users } = useQuery('users-select', () => 
    userApi.getAll({ limit: 100 })
  )

  // Fetch doctors
  const { data: doctors } = useQuery('doctors-select', () => 
    doctorApi.getAll({ limit: 100, isActive: true })
  )

  // Fetch doctor availability if doctor is selected
  const { data: doctorAvailability } = useQuery(
    ['doctor-availability', selectedDoctor],
    () => doctorApi.getAvailability(selectedDoctor),
    { enabled: !!selectedDoctor }
  )

  // Fetch doctor schedule for selected date
  const { data: doctorSchedule } = useQuery(
    ['doctor-schedule', selectedDoctor, appointmentDate],
    () => appointmentApi.getDoctorSchedule(selectedDoctor, { date: appointmentDate }),
    { enabled: !!selectedDoctor && !!appointmentDate }
  )

  const createAppointmentMutation = useMutation(appointmentApi.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('appointments')
      toast.success('Appointment booked successfully!')
      navigate('/appointments')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to book appointment')
    }
  })

  const onSubmit = (data) => {
    const appointmentData = {
      ...data,
      duration: parseInt(data.duration)
    }

    createAppointmentMutation.mutate(appointmentData)
  }

  const typeOptions = [
    { value: 'consultation', label: 'Consultation', icon: '👨‍⚕️' },
    { value: 'follow_up', label: 'Follow-up', icon: '🔄' },
    { value: 'check_up', label: 'Check-up', icon: '🩺' },
    { value: 'emergency', label: 'Emergency', icon: '🚨' },
    { value: 'surgery', label: 'Surgery', icon: '🔪' },
    { value: 'diagnostic', label: 'Diagnostic', icon: '🔬' },
    { value: 'preventive', label: 'Preventive', icon: '🛡️' },
    { value: 'vaccination', label: 'Vaccination', icon: '💉' },
    { value: 'therapy', label: 'Therapy', icon: '🧘' },
    { value: 'telemedicine', label: 'Telemedicine', icon: '💻' }
  ]

  const priorityOptions = [
    { value: 'low', label: 'Low', description: 'Routine, non-urgent' },
    { value: 'normal', label: 'Normal', description: 'Standard priority' },
    { value: 'high', label: 'High', description: 'Needs attention soon' },
    { value: 'urgent', label: 'Urgent', description: 'Requires immediate attention' }
  ]

  const getAvailableTimeSlots = () => {
    if (!doctorAvailability?.data?.availability || !appointmentDate) return []

    const selectedDate = new Date(appointmentDate)
    const dayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
    
    const daySchedule = doctorAvailability.data.availability.find(
      schedule => schedule.dayOfWeek === dayName && schedule.isAvailable
    )

    if (!daySchedule) return []

    // Generate time slots (30-minute intervals)
    const slots = []
    const [startHour, startMin] = daySchedule.startTime.split(':').map(Number)
    const [endHour, endMin] = daySchedule.endTime.split(':').map(Number)
    
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    
    for (let minutes = startMinutes; minutes < endMinutes; minutes += 30) {
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60
      const timeString = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
      
      // Check if this time slot is available (not booked)
      const isBooked = doctorSchedule?.data?.appointments?.some(
        apt => apt.appointmentTime === timeString && !['cancelled', 'no_show'].includes(apt.status)
      )
      
      if (!isBooked) {
        slots.push({
          value: timeString,
          label: timeString,
          available: true
        })
      }
    }

    return slots
  }

  const availableTimeSlots = getAvailableTimeSlots()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/appointments')}
          className="btn-ghost p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Book New Appointment</h1>
          <p className="text-neutral-600 mt-1">
            Schedule a medical appointment between patient and doctor
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Patient & Doctor Selection */}
        <div className="card">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Patient & Doctor</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">
                <User className="w-4 h-4 inline mr-1" />
                Patient *
              </label>
              <select 
                {...register('patient', { required: 'Patient is required' })}
                className={`select ${errors.patient ? 'input-error' : ''}`}
              >
                <option value="">Select patient</option>
                {users?.data?.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              {errors.patient && <p className="form-error">{errors.patient.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <UserCheck className="w-4 h-4 inline mr-1" />
                Doctor *
              </label>
              <select 
                {...register('doctor', { required: 'Doctor is required' })}
                className={`select ${errors.doctor ? 'input-error' : ''}`}
              >
                <option value="">Select doctor</option>
                {doctors?.data?.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    Dr. {doctor.name} - {doctor.specialization?.replace('_', ' ')}
                  </option>
                ))}
              </select>
              {errors.doctor && <p className="form-error">{errors.doctor.message}</p>}
            </div>
          </div>

          {/* Selected Doctor Info */}
          {selectedDoctor && doctors?.data && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              {(() => {
                const doctor = doctors.data.find(d => d._id === selectedDoctor)
                return doctor ? (
                  <div>
                    <h3 className="font-medium text-blue-900">Dr. {doctor.name}</h3>
                    <p className="text-sm text-blue-700 capitalize">
                      {doctor.specialization?.replace('_', ' ')} • {doctor.yearsOfExperience} years experience
                    </p>
                    <p className="text-sm text-blue-600">
                      {doctor.clinic?.name} - {doctor.clinic?.address?.city}
                    </p>
                    <p className="text-sm font-medium text-blue-800 mt-1">
                      Consultation Fee: ${doctor.consultationFee?.amount}
                    </p>
                  </div>
                ) : null
              })()}
            </div>
          )}
        </div>

        {/* Date & Time */}
        <div className="card">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">
            <Calendar className="w-5 h-5 inline mr-2" />
            Date & Time
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Appointment Date *</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                {...register('appointmentDate', { required: 'Date is required' })}
                className={`input ${errors.appointmentDate ? 'input-error' : ''}`}
              />
              {errors.appointmentDate && <p className="form-error">{errors.appointmentDate.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">
                <Clock className="w-4 h-4 inline mr-1" />
                Time *
              </label>
              {selectedDoctor && appointmentDate ? (
                availableTimeSlots.length > 0 ? (
                  <select 
                    {...register('appointmentTime', { required: 'Time is required' })}
                    className={`select ${errors.appointmentTime ? 'input-error' : ''}`}
                  >
                    <option value="">Select time</option>
                    {availableTimeSlots.map((slot) => (
                      <option key={slot.value} value={slot.value}>
                        {slot.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div>
                    <input type="text" disabled className="input" placeholder="No available slots" />
                    <p className="form-error mt-1">No available time slots for selected date</p>
                  </div>
                )
              ) : (
                <input
                  type="time"
                  {...register('appointmentTime', { required: 'Time is required' })}
                  className={`input ${errors.appointmentTime ? 'input-error' : ''}`}
                />
              )}
              {errors.appointmentTime && <p className="form-error">{errors.appointmentTime.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Duration (minutes) *</label>
              <select 
                {...register('duration', { required: 'Duration is required' })}
                className={`select ${errors.duration ? 'input-error' : ''}`}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
              {errors.duration && <p className="form-error">{errors.duration.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select 
                {...register('priority')}
                className="select"
              >
                {priorityOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} - {option.description}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Appointment Details */}
        <div className="card">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Appointment Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Appointment Type *</label>
              <select 
                {...register('type', { required: 'Type is required' })}
                className={`select ${errors.type ? 'input-error' : ''}`}
              >
                {typeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.icon} {option.label}
                  </option>
                ))}
              </select>
              {errors.type && <p className="form-error">{errors.type.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select {...register('status')} className="select">
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
              </select>
            </div>

            <div className="form-group md:col-span-2">
              <label className="form-label">Reason for Visit *</label>
              <textarea
                rows={3}
                placeholder="Describe the reason for this appointment..."
                {...register('reason', { 
                  required: 'Reason is required',
                  maxLength: { value: 500, message: 'Reason must be less than 500 characters' }
                })}
                className={`textarea ${errors.reason ? 'input-error' : ''}`}
              />
              {errors.reason && <p className="form-error">{errors.reason.message}</p>}
            </div>
          </div>
        </div>

        {/* Additional Notes */}
        <div className="card">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Additional Information</h2>
          
          <div className="form-group">
            <label className="form-label">Patient Notes</label>
            <textarea
              rows={3}
              placeholder="Any additional notes from the patient..."
              {...register('notes.patientNotes')}
              className="textarea"
            />
            <p className="form-help">These notes will be visible to the doctor</p>
          </div>
        </div>

        {/* Booking Confirmation */}
        {selectedPatient && selectedDoctor && (
          <div className="card bg-green-50 border-green-200">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-green-900">Booking Summary</h3>
                <p className="text-sm text-green-700 mt-1">
                  Please review the appointment details before confirming the booking.
                </p>
                <div className="mt-2 text-sm text-green-800">
                  <p>• Patient and doctor selected</p>
                  <p>• Date and time specified</p>
                  <p>• Appointment type and reason provided</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/appointments')}
            className="btn-outline"
            disabled={createAppointmentMutation.isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createAppointmentMutation.isLoading}
            className="btn-primary"
          >
            {createAppointmentMutation.isLoading ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Book Appointment
          </button>
        </div>
      </form>
    </div>
  )
}
