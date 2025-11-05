import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useForm, useFieldArray } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ArrowLeft, Save, Plus, Trash2, MapPin, Clock, DollarSign } from 'lucide-react'
import { doctorApi } from '../lib/api'
import LoadingSpinner from '../components/LoadingSpinner'

export default function CreateDoctor() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    defaultValues: {
      consultationFee: { currency: 'USD' },
      rating: { average: 0, totalReviews: 0 },
      isActive: true,
      isVerified: false,
      acceptsInsurance: true,
      availability: []
    }
  })

  const { fields: availabilityFields, append: appendAvailability, remove: removeAvailability } = useFieldArray({
    control,
    name: 'availability'
  })

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control,
    name: 'education'
  })

  const { data: specializations } = useQuery('doctor-specializations', doctorApi.getSpecializations)

  const createDoctorMutation = useMutation(doctorApi.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('doctors')
      toast.success('Doctor added successfully!')
      navigate('/doctors')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create doctor')
    }
  })

  const onSubmit = (data) => {
    const doctorData = {
      ...data,
      yearsOfExperience: parseInt(data.yearsOfExperience),
      consultationFee: {
        amount: parseFloat(data.consultationFee.amount),
        currency: data.consultationFee.currency
      },
      education: data.education?.map(edu => ({
        ...edu,
        year: parseInt(edu.year)
      })) || [],
      languages: data.languages ? data.languages.split(',').map(lang => lang.trim().toLowerCase()) : [],
      insuranceNetworks: data.insuranceNetworks ? data.insuranceNetworks.split(',').map(network => network.trim()) : []
    }

    createDoctorMutation.mutate(doctorData)
  }

  const specializationOptions = [
    'general_practitioner', 'cardiologist', 'dermatologist', 'endocrinologist',
    'gastroenterologist', 'neurologist', 'oncologist', 'orthopedic',
    'pediatrician', 'psychiatrist', 'pulmonologist', 'radiologist',
    'surgeon', 'urologist', 'gynecologist', 'ophthalmologist',
    'ent', 'rheumatologist', 'nephrologist', 'hematologist',
    'infectious_disease', 'emergency_medicine', 'family_medicine',
    'internal_medicine', 'physical_medicine', 'pathology', 'other'
  ]

  const daysOfWeek = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
  ]

  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR']

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/doctors')}
          className="btn-ghost p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Add New Doctor</h1>
          <p className="text-neutral-600 mt-1">
            Register a new healthcare provider in the system
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                placeholder="Dr. John Smith"
                {...register('name', { 
                  required: 'Name is required',
                  maxLength: { value: 100, message: 'Name must be less than 100 characters' }
                })}
                className={`input ${errors.name ? 'input-error' : ''}`}
              />
              {errors.name && <p className="form-error">{errors.name.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                placeholder="doctor@hospital.com"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Please enter a valid email'
                  }
                })}
                className={`input ${errors.email ? 'input-error' : ''}`}
              />
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Phone *</label>
              <input
                type="tel"
                placeholder="+1234567890"
                {...register('phone', { 
                  required: 'Phone is required',
                  pattern: {
                    value: /^\+?[1-9]\d{1,14}$/,
                    message: 'Please enter a valid phone number'
                  }
                })}
                className={`input ${errors.phone ? 'input-error' : ''}`}
              />
              {errors.phone && <p className="form-error">{errors.phone.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Specialization *</label>
              <select 
                {...register('specialization', { required: 'Specialization is required' })}
                className={`select ${errors.specialization ? 'input-error' : ''}`}
              >
                <option value="">Select specialization</option>
                {specializationOptions.map((spec) => (
                  <option key={spec} value={spec}>
                    {spec.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
              {errors.specialization && <p className="form-error">{errors.specialization.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">License Number *</label>
              <input
                type="text"
                placeholder="MD123456"
                {...register('licenseNumber', { 
                  required: 'License number is required'
                })}
                className={`input ${errors.licenseNumber ? 'input-error' : ''}`}
              />
              {errors.licenseNumber && <p className="form-error">{errors.licenseNumber.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Years of Experience *</label>
              <input
                type="number"
                min="0"
                max="70"
                placeholder="10"
                {...register('yearsOfExperience', { 
                  required: 'Years of experience is required',
                  min: { value: 0, message: 'Years cannot be negative' },
                  max: { value: 70, message: 'Years cannot exceed 70' }
                })}
                className={`input ${errors.yearsOfExperience ? 'input-error' : ''}`}
              />
              {errors.yearsOfExperience && <p className="form-error">{errors.yearsOfExperience.message}</p>}
            </div>
          </div>
        </div>

        {/* Clinic Information */}
        <div className="card">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">
            <MapPin className="w-5 h-5 inline mr-2" />
            Clinic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group md:col-span-2">
              <label className="form-label">Clinic Name *</label>
              <input
                type="text"
                placeholder="City Medical Center"
                {...register('clinic.name', { 
                  required: 'Clinic name is required'
                })}
                className={`input ${errors.clinic?.name ? 'input-error' : ''}`}
              />
              {errors.clinic?.name && <p className="form-error">{errors.clinic.name.message}</p>}
            </div>

            <div className="form-group md:col-span-2">
              <label className="form-label">Street Address *</label>
              <input
                type="text"
                placeholder="123 Medical Drive"
                {...register('clinic.address.street', { 
                  required: 'Street address is required'
                })}
                className={`input ${errors.clinic?.address?.street ? 'input-error' : ''}`}
              />
              {errors.clinic?.address?.street && <p className="form-error">{errors.clinic.address.street.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">City *</label>
              <input
                type="text"
                placeholder="New York"
                {...register('clinic.address.city', { 
                  required: 'City is required'
                })}
                className={`input ${errors.clinic?.address?.city ? 'input-error' : ''}`}
              />
              {errors.clinic?.address?.city && <p className="form-error">{errors.clinic.address.city.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">State *</label>
              <input
                type="text"
                placeholder="NY"
                {...register('clinic.address.state', { 
                  required: 'State is required'
                })}
                className={`input ${errors.clinic?.address?.state ? 'input-error' : ''}`}
              />
              {errors.clinic?.address?.state && <p className="form-error">{errors.clinic.address.state.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Zip Code *</label>
              <input
                type="text"
                placeholder="10001"
                {...register('clinic.address.zipCode', { 
                  required: 'Zip code is required'
                })}
                className={`input ${errors.clinic?.address?.zipCode ? 'input-error' : ''}`}
              />
              {errors.clinic?.address?.zipCode && <p className="form-error">{errors.clinic.address.zipCode.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Country *</label>
              <input
                type="text"
                placeholder="United States"
                {...register('clinic.address.country', { 
                  required: 'Country is required'
                })}
                className={`input ${errors.clinic?.address?.country ? 'input-error' : ''}`}
              />
              {errors.clinic?.address?.country && <p className="form-error">{errors.clinic.address.country.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Clinic Phone</label>
              <input
                type="tel"
                placeholder="+1234567890"
                {...register('clinic.phone')}
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Clinic Email</label>
              <input
                type="email"
                placeholder="info@clinic.com"
                {...register('clinic.email')}
                className="input"
              />
            </div>
          </div>
        </div>

        {/* Consultation Fee */}
        <div className="card">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">
            <DollarSign className="w-5 h-5 inline mr-2" />
            Consultation Fee
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Amount *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="150.00"
                {...register('consultationFee.amount', { 
                  required: 'Consultation fee is required',
                  min: { value: 0, message: 'Fee cannot be negative' }
                })}
                className={`input ${errors.consultationFee?.amount ? 'input-error' : ''}`}
              />
              {errors.consultationFee?.amount && <p className="form-error">{errors.consultationFee.amount.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Currency</label>
              <select 
                {...register('consultationFee.currency')}
                className="select"
              >
                {currencies.map(currency => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-neutral-900">Education</h2>
            <button
              type="button"
              onClick={() => appendEducation({ degree: '', institution: '', year: '' })}
              className="btn-outline btn-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Education
            </button>
          </div>

          <div className="space-y-4">
            {educationFields.map((field, index) => (
              <div key={field.id} className="p-4 border border-neutral-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-neutral-900">Education {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="btn-ghost btn-sm p-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="form-group">
                    <label className="form-label">Degree</label>
                    <input
                      type="text"
                      placeholder="MD"
                      {...register(`education.${index}.degree`)}
                      className="input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Institution</label>
                    <input
                      type="text"
                      placeholder="Harvard Medical School"
                      {...register(`education.${index}.institution`)}
                      className="input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Year</label>
                    <input
                      type="number"
                      min="1950"
                      max={new Date().getFullYear()}
                      placeholder="2010"
                      {...register(`education.${index}.year`)}
                      className="input"
                    />
                  </div>
                </div>
              </div>
            ))}

            {educationFields.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-neutral-200 rounded-lg">
                <p className="text-neutral-500">No education added yet</p>
                <button
                  type="button"
                  onClick={() => appendEducation({ degree: '', institution: '', year: '' })}
                  className="btn-ghost btn-sm mt-2"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add First Education
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="card">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Additional Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Languages (comma-separated)</label>
              <input
                type="text"
                placeholder="english, spanish, french"
                {...register('languages')}
                className="input"
              />
              <p className="form-help">Enter languages separated by commas</p>
            </div>

            <div className="form-group">
              <label className="form-label">Insurance Networks (comma-separated)</label>
              <input
                type="text"
                placeholder="Blue Cross, Aetna, Cigna"
                {...register('insuranceNetworks')}
                className="input"
              />
            </div>

            <div className="form-group md:col-span-2">
              <label className="form-label">Bio</label>
              <textarea
                rows={3}
                placeholder="Brief description of the doctor's background and approach to patient care..."
                {...register('bio', {
                  maxLength: { value: 1000, message: 'Bio must be less than 1000 characters' }
                })}
                className={`textarea ${errors.bio ? 'input-error' : ''}`}
              />
              {errors.bio && <p className="form-error">{errors.bio.message}</p>}
            </div>

            <div className="form-group">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('acceptsInsurance')}
                  className="rounded"
                />
                <label className="form-label mb-0">Accepts Insurance</label>
              </div>
            </div>

            <div className="form-group">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register('isVerified')}
                  className="rounded"
                />
                <label className="form-label mb-0">Verified Doctor</label>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/doctors')}
            className="btn-outline"
            disabled={createDoctorMutation.isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createDoctorMutation.isLoading}
            className="btn-primary"
          >
            {createDoctorMutation.isLoading ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Add Doctor
          </button>
        </div>
      </form>
    </div>
  )
}
