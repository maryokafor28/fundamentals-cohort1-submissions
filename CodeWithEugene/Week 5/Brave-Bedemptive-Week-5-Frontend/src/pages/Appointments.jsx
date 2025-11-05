import { useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { 
  Plus,
  Search,
  Calendar,
  Clock,
  User,
  UserCheck,
  Phone,
  MapPin,
  MoreHorizontal,
  Filter
} from 'lucide-react'
import { appointmentApi } from '../lib/api'
import { formatDate, formatDateTime, getStatusColor, getStatusBadgeClass, debounce } from '../lib/utils'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

export default function Appointments() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [type, setType] = useState('')
  const [priority, setPriority] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('appointmentDate')
  const [sortOrder, setSortOrder] = useState('asc')

  const { data, isLoading, error, refetch } = useQuery(
    ['appointments', { status, type, priority, dateFrom, dateTo, page, sortBy, sortOrder }],
    () => appointmentApi.getAll({ 
      status: status || undefined,
      type: type || undefined,
      priority: priority || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      page, 
      sortBy, 
      sortOrder,
      limit: 10
    }),
    {
      keepPreviousData: true,
    }
  )

  const handleSearchChange = debounce((value) => {
    setSearch(value)
    setPage(1)
  }, 300)

  if (error) {
    return <ErrorMessage error={error} onRetry={refetch} />
  }

  const statusOptions = [
    { value: 'scheduled', label: 'Scheduled' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'no_show', label: 'No Show' },
    { value: 'rescheduled', label: 'Rescheduled' }
  ]

  const typeOptions = [
    { value: 'consultation', label: 'Consultation' },
    { value: 'follow_up', label: 'Follow-up' },
    { value: 'check_up', label: 'Check-up' },
    { value: 'emergency', label: 'Emergency' },
    { value: 'surgery', label: 'Surgery' },
    { value: 'diagnostic', label: 'Diagnostic' },
    { value: 'preventive', label: 'Preventive' },
    { value: 'vaccination', label: 'Vaccination' },
    { value: 'therapy', label: 'Therapy' },
    { value: 'telemedicine', label: 'Telemedicine' }
  ]

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ]

  const getAppointmentIcon = (appointmentType) => {
    const icons = {
      consultation: '👨‍⚕️',
      follow_up: '🔄',
      check_up: '🩺',
      emergency: '🚨',
      surgery: '🔪',
      diagnostic: '🔬',
      preventive: '🛡️',
      vaccination: '💉',
      therapy: '🧘',
      telemedicine: '💻'
    }
    return icons[appointmentType] || '📅'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Appointments</h1>
          <p className="text-neutral-600 mt-1">
            Manage medical appointments and schedules
          </p>
        </div>
        <Link to="/appointments/new" className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Book Appointment
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <select
              className="select"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value)
                setPage(1)
              }}
            >
              <option value="">All Status</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              className="select"
              value={type}
              onChange={(e) => {
                setType(e.target.value)
                setPage(1)
              }}
            >
              <option value="">All Types</option>
              {typeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {getAppointmentIcon(option.value)} {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              className="select"
              value={priority}
              onChange={(e) => {
                setPriority(e.target.value)
                setPage(1)
              }}
            >
              <option value="">All Priorities</option>
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <input
              type="date"
              className="input"
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value)
                setPage(1)
              }}
              placeholder="From date"
            />
          </div>

          <div>
            <input
              type="date"
              className="input"
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value)
                setPage(1)
              }}
              placeholder="To date"
            />
          </div>

          <div>
            <select
              className="select"
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-')
                setSortBy(field)
                setSortOrder(order)
                setPage(1)
              }}
            >
              <option value="appointmentDate-asc">Date (Earliest)</option>
              <option value="appointmentDate-desc">Date (Latest)</option>
              <option value="createdAt-desc">Recently Added</option>
              <option value="priority-desc">Priority (High)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-4">
          {data?.data?.length > 0 ? (
            <>
              {data.data.map((appointment) => {
                const appointmentDateTime = new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}`)
                const isUpcoming = appointmentDateTime > new Date()
                const isPast = appointmentDateTime < new Date()

                return (
                  <div key={appointment._id} className="card-hover">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-3xl ${
                          appointment.priority === 'urgent' ? 'bg-red-100' :
                          appointment.priority === 'high' ? 'bg-orange-100' :
                          'bg-blue-100'
                        }`}>
                          {getAppointmentIcon(appointment.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className={`badge ${getStatusBadgeClass(appointment.status)}`}>
                              {appointment.status.replace('_', ' ')}
                            </span>
                            <span className={`badge badge-${getStatusColor(appointment.priority)}`}>
                              {appointment.priority}
                            </span>
                            <span className="badge badge-info">
                              {appointment.type.replace('_', ' ')}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Patient Info */}
                            <div>
                              <div className="flex items-center space-x-2 mb-2">
                                <User className="w-4 h-4 text-neutral-400" />
                                <span className="font-medium text-neutral-900">Patient</span>
                              </div>
                              <div className="ml-6">
                                <p className="font-medium text-neutral-900">{appointment.patient?.name}</p>
                                <p className="text-sm text-neutral-600">{appointment.patient?.email}</p>
                                <p className="text-sm text-neutral-600">{appointment.patient?.phone}</p>
                              </div>
                            </div>

                            {/* Doctor Info */}
                            <div>
                              <div className="flex items-center space-x-2 mb-2">
                                <UserCheck className="w-4 h-4 text-neutral-400" />
                                <span className="font-medium text-neutral-900">Doctor</span>
                              </div>
                              <div className="ml-6">
                                <p className="font-medium text-neutral-900">Dr. {appointment.doctor?.name}</p>
                                <p className="text-sm text-neutral-600 capitalize">
                                  {appointment.doctor?.specialization?.replace('_', ' ')}
                                </p>
                                <p className="text-sm text-neutral-600">{appointment.doctor?.phone}</p>
                              </div>
                            </div>
                          </div>

                          {/* Appointment Details */}
                          <div className="mt-4 pt-4 border-t border-neutral-200">
                            <div className="flex items-center space-x-6 text-sm text-neutral-600">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {formatDate(appointment.appointmentDate)}
                              </div>
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {appointment.appointmentTime} ({appointment.duration} min)
                              </div>
                              {appointment.doctor?.clinic?.name && (
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {appointment.doctor.clinic.name}
                                </div>
                              )}
                            </div>

                            {appointment.reason && (
                              <div className="mt-2">
                                <span className="text-sm font-medium text-neutral-900">Reason: </span>
                                <span className="text-sm text-neutral-600">{appointment.reason}</span>
                              </div>
                            )}

                            {appointment.symptoms && appointment.symptoms.length > 0 && (
                              <div className="mt-2">
                                <span className="text-sm font-medium text-neutral-900">Symptoms: </span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {appointment.symptoms.slice(0, 3).map((symptom, index) => (
                                    <span key={index} className="badge badge-warning text-xs">
                                      {symptom.name}
                                    </span>
                                  ))}
                                  {appointment.symptoms.length > 3 && (
                                    <span className="text-xs text-neutral-500">
                                      +{appointment.symptoms.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-2">
                        <div className="text-right">
                          <div className="text-lg font-semibold text-neutral-900">
                            {appointment.cost?.totalAmount ? 
                              `$${appointment.cost.totalAmount}` : 
                              'No cost info'
                            }
                          </div>
                          <div className={`text-sm ${
                            isUpcoming ? 'text-blue-600' :
                            isPast ? 'text-neutral-500' :
                            'text-green-600'
                          }`}>
                            {isUpcoming ? 'Upcoming' : isPast ? 'Past' : 'Today'}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/appointments/${appointment._id}`}
                            className="btn-ghost btn-sm"
                          >
                            View Details
                          </Link>
                          {appointment.status === 'scheduled' && (
                            <button className="btn-primary btn-sm">
                              Confirm
                            </button>
                          )}
                          <button className="btn-ghost btn-sm p-1">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Pagination */}
              {data.pagination && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-neutral-600">
                    Showing {((data.pagination.currentPage - 1) * 10) + 1} to{' '}
                    {Math.min(data.pagination.currentPage * 10, data.pagination.totalAppointments)} of{' '}
                    {data.pagination.totalAppointments} appointments
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={!data.pagination.hasPrevPage}
                      className="btn-outline btn-sm disabled:opacity-50"
                    >
                      Previous
                    </button>
                    
                    <span className="text-sm text-neutral-600">
                      Page {data.pagination.currentPage} of {data.pagination.totalPages}
                    </span>
                    
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={!data.pagination.hasNextPage}
                      className="btn-outline btn-sm disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="card text-center py-12">
              <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No appointments found</h3>
              <p className="text-neutral-500 mb-4">
                {status || type || priority || dateFrom || dateTo ? 
                  'Try adjusting your filters.' : 
                  'Get started by booking your first appointment.'
                }
              </p>
              <Link to="/appointments/new" className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Book Appointment
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
