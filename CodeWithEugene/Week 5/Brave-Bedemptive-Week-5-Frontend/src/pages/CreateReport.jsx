import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useForm, useFieldArray } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ArrowLeft, Save, Plus, Trash2, FileText, Flask, Activity } from 'lucide-react'
import { reportApi, userApi, doctorApi, appointmentApi } from '../lib/api'
import LoadingSpinner from '../components/LoadingSpinner'

export default function CreateReport() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
    defaultValues: {
      reportDate: new Date().toISOString().split('T')[0],
      type: 'medical_report',
      priority: 'normal',
      status: 'draft',
      confidentiality: 'confidential',
      results: [],
      findings: []
    }
  })

  const { fields: resultsFields, append: appendResult, remove: removeResult } = useFieldArray({
    control,
    name: 'results'
  })

  const { fields: findingsFields, append: appendFinding, remove: removeFinding } = useFieldArray({
    control,
    name: 'findings'
  })

  const selectedType = watch('type')

  // Fetch data for dropdowns
  const { data: users } = useQuery('users-select', () => 
    userApi.getAll({ limit: 100 })
  )

  const { data: doctors } = useQuery('doctors-select', () => 
    doctorApi.getAll({ limit: 100, isActive: true })
  )

  const { data: reportTypes } = useQuery('report-types', reportApi.getTypes)

  const createReportMutation = useMutation(reportApi.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('reports')
      toast.success('Report created successfully!')
      navigate('/reports')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create report')
    }
  })

  const onSubmit = (data) => {
    const reportData = {
      ...data,
      results: data.results?.map(result => ({
        ...result,
        value: isNaN(parseFloat(result.value)) ? result.value : parseFloat(result.value),
        referenceRange: result.referenceRange ? {
          min: result.referenceRange.min ? parseFloat(result.referenceRange.min) : undefined,
          max: result.referenceRange.max ? parseFloat(result.referenceRange.max) : undefined,
          normal: result.referenceRange.normal
        } : undefined
      })) || [],
      findings: data.findings || []
    }

    createReportMutation.mutate(reportData)
  }

  const typeOptions = [
    { value: 'medical_report', label: 'Medical Report', icon: '📋' },
    { value: 'lab_result', label: 'Lab Result', icon: '🧪' },
    { value: 'imaging_report', label: 'Imaging Report', icon: '🩻' },
    { value: 'pathology_report', label: 'Pathology Report', icon: '🔬' },
    { value: 'fitness_report', label: 'Fitness Report', icon: '💪' },
    { value: 'nutrition_report', label: 'Nutrition Report', icon: '🥗' },
    { value: 'mental_health_report', label: 'Mental Health Report', icon: '🧠' },
    { value: 'prescription', label: 'Prescription', icon: '💊' },
    { value: 'discharge_summary', label: 'Discharge Summary', icon: '🏥' },
    { value: 'other', label: 'Other', icon: '📄' }
  ]

  const statusOptions = [
    { value: 'draft', label: 'Draft' },
    { value: 'pending_review', label: 'Pending Review' },
    { value: 'reviewed', label: 'Reviewed' },
    { value: 'final', label: 'Final' }
  ]

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ]

  const confidentialityOptions = [
    { value: 'public', label: 'Public' },
    { value: 'restricted', label: 'Restricted' },
    { value: 'confidential', label: 'Confidential' },
    { value: 'highly_confidential', label: 'Highly Confidential' }
  ]

  const resultStatuses = ['normal', 'abnormal', 'low', 'high', 'critical', 'pending']
  const severityLevels = ['normal', 'mild', 'moderate', 'severe', 'critical']

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/reports')}
          className="btn-ghost p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Create New Report</h1>
          <p className="text-neutral-600 mt-1">
            Generate a medical or health report with detailed findings
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="card">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Patient *</label>
              <select 
                {...register('user', { required: 'Patient is required' })}
                className={`select ${errors.user ? 'input-error' : ''}`}
              >
                <option value="">Select patient</option>
                {users?.data?.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              {errors.user && <p className="form-error">{errors.user.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Doctor (Optional)</label>
              <select {...register('doctor')} className="select">
                <option value="">Select doctor</option>
                {doctors?.data?.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    Dr. {doctor.name} - {doctor.specialization?.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group md:col-span-2">
              <label className="form-label">Report Title *</label>
              <input
                type="text"
                placeholder="e.g., Complete Blood Count Results"
                {...register('title', { 
                  required: 'Title is required',
                  maxLength: { value: 200, message: 'Title must be less than 200 characters' }
                })}
                className={`input ${errors.title ? 'input-error' : ''}`}
              />
              {errors.title && <p className="form-error">{errors.title.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Report Type *</label>
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
              <label className="form-label">Category (Optional)</label>
              <select {...register('category')} className="select">
                <option value="">Select category</option>
                <option value="blood_work">Blood Work</option>
                <option value="urine_analysis">Urine Analysis</option>
                <option value="x_ray">X-Ray</option>
                <option value="mri">MRI</option>
                <option value="ct_scan">CT Scan</option>
                <option value="ultrasound">Ultrasound</option>
                <option value="ecg">ECG</option>
                <option value="biopsy">Biopsy</option>
                <option value="fitness_test">Fitness Test</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Report Date *</label>
              <input
                type="date"
                {...register('reportDate', { required: 'Date is required' })}
                className={`input ${errors.reportDate ? 'input-error' : ''}`}
              />
              {errors.reportDate && <p className="form-error">{errors.reportDate.message}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Test Date (Optional)</label>
              <input
                type="date"
                {...register('testDate')}
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select {...register('status')} className="select">
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Priority</label>
              <select {...register('priority')} className="select">
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Confidentiality</label>
              <select {...register('confidentiality')} className="select">
                {confidentialityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Laboratory Information */}
        {(selectedType === 'lab_result' || selectedType === 'pathology_report') && (
          <div className="card">
            <h2 className="text-lg font-medium text-neutral-900 mb-4">
              <Flask className="w-5 h-5 inline mr-2" />
              Laboratory Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Laboratory Name</label>
                <input
                  type="text"
                  placeholder="Central Medical Laboratory"
                  {...register('laboratory.name')}
                  className="input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Lab License Number</label>
                <input
                  type="text"
                  placeholder="LAB123456"
                  {...register('laboratory.licenseNumber')}
                  className="input"
                />
              </div>

              <div className="form-group md:col-span-2">
                <label className="form-label">Lab Address</label>
                <input
                  type="text"
                  placeholder="123 Medical Center Dr, City, State"
                  {...register('laboratory.address')}
                  className="input"
                />
              </div>
            </div>
          </div>
        )}

        {/* Test Results */}
        {(selectedType === 'lab_result' || selectedType === 'pathology_report' || selectedType === 'fitness_report') && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-neutral-900">
                <Activity className="w-5 h-5 inline mr-2" />
                Test Results
              </h2>
              <button
                type="button"
                onClick={() => appendResult({
                  parameter: '',
                  value: '',
                  unit: '',
                  status: 'normal',
                  referenceRange: { normal: '' }
                })}
                className="btn-outline btn-sm"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Result
              </button>
            </div>

            <div className="space-y-4">
              {resultsFields.map((field, index) => (
                <div key={field.id} className="p-4 border border-neutral-200 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-neutral-900">Result {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeResult(index)}
                      className="btn-ghost btn-sm p-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="form-group">
                      <label className="form-label">Parameter *</label>
                      <input
                        type="text"
                        placeholder="e.g., Hemoglobin"
                        {...register(`results.${index}.parameter`, { 
                          required: 'Parameter is required' 
                        })}
                        className="input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Value *</label>
                      <input
                        type="text"
                        placeholder="e.g., 14.2"
                        {...register(`results.${index}.value`, { 
                          required: 'Value is required' 
                        })}
                        className="input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Unit</label>
                      <input
                        type="text"
                        placeholder="e.g., g/dL"
                        {...register(`results.${index}.unit`)}
                        className="input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Status</label>
                      <select 
                        {...register(`results.${index}.status`)}
                        className="select"
                      >
                        {resultStatuses.map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Reference Min</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="12.0"
                        {...register(`results.${index}.referenceRange.min`)}
                        className="input"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Reference Max</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="16.0"
                        {...register(`results.${index}.referenceRange.max`)}
                        className="input"
                      />
                    </div>

                    <div className="form-group md:col-span-2">
                      <label className="form-label">Reference Range</label>
                      <input
                        type="text"
                        placeholder="12.0 - 16.0 g/dL"
                        {...register(`results.${index}.referenceRange.normal`)}
                        className="input"
                      />
                    </div>

                    <div className="form-group md:col-span-4">
                      <label className="form-label">Notes</label>
                      <input
                        type="text"
                        placeholder="Additional notes about this result..."
                        {...register(`results.${index}.notes`)}
                        className="input"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {resultsFields.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-neutral-200 rounded-lg">
                  <Activity className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                  <p className="text-neutral-500">No results added yet</p>
                  <button
                    type="button"
                    onClick={() => appendResult({
                      parameter: '',
                      value: '',
                      unit: '',
                      status: 'normal',
                      referenceRange: { normal: '' }
                    })}
                    className="btn-ghost btn-sm mt-2"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add First Result
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Clinical Findings */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-neutral-900">Clinical Findings</h2>
            <button
              type="button"
              onClick={() => appendFinding({
                finding: '',
                severity: 'normal',
                description: ''
              })}
              className="btn-outline btn-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Finding
            </button>
          </div>

          <div className="space-y-4">
            {findingsFields.map((field, index) => (
              <div key={field.id} className="p-4 border border-neutral-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-neutral-900">Finding {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeFinding(index)}
                    className="btn-ghost btn-sm p-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="form-label">Finding *</label>
                    <input
                      type="text"
                      placeholder="e.g., Elevated blood pressure"
                      {...register(`findings.${index}.finding`, { 
                        required: 'Finding is required' 
                      })}
                      className="input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Severity</label>
                    <select 
                      {...register(`findings.${index}.severity`)}
                      className="select"
                    >
                      {severityLevels.map(severity => (
                        <option key={severity} value={severity}>
                          {severity.charAt(0).toUpperCase() + severity.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group md:col-span-2">
                    <label className="form-label">Description</label>
                    <textarea
                      rows={2}
                      placeholder="Detailed description of the finding..."
                      {...register(`findings.${index}.description`)}
                      className="textarea"
                    />
                  </div>
                </div>
              </div>
            ))}

            {findingsFields.length === 0 && (
              <div className="text-center py-6 border-2 border-dashed border-neutral-200 rounded-lg">
                <p className="text-neutral-500">No findings added yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Report Content */}
        <div className="card">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">
            <FileText className="w-5 h-5 inline mr-2" />
            Report Content
          </h2>
          
          <div className="space-y-4">
            <div className="form-group">
              <label className="form-label">Summary</label>
              <textarea
                rows={4}
                placeholder="Brief summary of the report findings and conclusions..."
                {...register('summary')}
                className="textarea"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Interpretation</label>
              <textarea
                rows={4}
                placeholder="Clinical interpretation of the results and findings..."
                {...register('interpretation')}
                className="textarea"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                rows={3}
                placeholder="Additional notes or comments..."
                {...register('notes')}
                className="textarea"
              />
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/reports')}
            className="btn-outline"
            disabled={createReportMutation.isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createReportMutation.isLoading}
            className="btn-primary"
          >
            {createReportMutation.isLoading ? (
              <LoadingSpinner size="sm" className="mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Create Report
          </button>
        </div>
      </form>
    </div>
  )
}
