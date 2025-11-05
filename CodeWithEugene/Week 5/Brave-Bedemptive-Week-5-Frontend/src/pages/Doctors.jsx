import { useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { 
  Plus,
  Search,
  MapPin,
  Star,
  Phone,
  Mail,
  Clock,
  UserCheck,
  MoreHorizontal
} from 'lucide-react'
import { doctorApi } from '../lib/api'
import { formatCurrency, debounce } from '../lib/utils'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

export default function Doctors() {
  const [search, setSearch] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [city, setCity] = useState('')
  const [isVerified, setIsVerified] = useState('')
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')

  const { data: specializations } = useQuery('doctor-specializations', doctorApi.getSpecializations)

  const { data, isLoading, error, refetch } = useQuery(
    ['doctors', { search, specialization, city, isVerified, page, sortBy, sortOrder }],
    () => doctorApi.getAll({ 
      search: search || undefined,
      specialization: specialization || undefined,
      city: city || undefined,
      isVerified: isVerified || undefined,
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

  const getSpecializationIcon = (spec) => {
    const icons = {
      general_practitioner: '👨‍⚕️',
      cardiologist: '❤️',
      dermatologist: '🧴',
      endocrinologist: '🦴',
      gastroenterologist: '🫁',
      neurologist: '🧠',
      oncologist: '🎗️',
      orthopedic: '🦴',
      pediatrician: '👶',
      psychiatrist: '🧘',
      pulmonologist: '🫁',
      radiologist: '🩻',
      surgeon: '🔪',
      urologist: '💧',
      gynecologist: '👩',
      ophthalmologist: '👁️'
    }
    return icons[spec] || '👨‍⚕️'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Doctors</h1>
          <p className="text-neutral-600 mt-1">
            Manage healthcare providers and medical professionals
          </p>
        </div>
        <Link to="/doctors/new" className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Doctor
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search doctors..."
                className="input pl-10"
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <select
              className="select"
              value={specialization}
              onChange={(e) => {
                setSpecialization(e.target.value)
                setPage(1)
              }}
            >
              <option value="">All Specializations</option>
              {specializations?.data?.map((spec) => (
                <option key={spec} value={spec}>
                  {getSpecializationIcon(spec)} {spec.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <input
              type="text"
              placeholder="City"
              className="input"
              value={city}
              onChange={(e) => {
                setCity(e.target.value)
                setPage(1)
              }}
            />
          </div>

          <div>
            <select
              className="select"
              value={isVerified}
              onChange={(e) => {
                setIsVerified(e.target.value)
                setPage(1)
              }}
            >
              <option value="">All Status</option>
              <option value="true">Verified</option>
              <option value="false">Not Verified</option>
            </select>
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
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="rating.average-desc">Highest Rated</option>
              <option value="yearsOfExperience-desc">Most Experience</option>
            </select>
          </div>
        </div>
      </div>

      {/* Doctors List */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-4">
          {data?.data?.length > 0 ? (
            <>
              {data.data.map((doctor) => (
                <div key={doctor._id} className="card-hover">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-3xl">
                        {getSpecializationIcon(doctor.specialization)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-xl font-semibold text-neutral-900">
                            Dr. {doctor.name}
                          </h3>
                          {doctor.isVerified && (
                            <span className="badge badge-success">Verified</span>
                          )}
                          {doctor.rating.average > 0 && (
                            <div className="flex items-center">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium ml-1">
                                {doctor.rating.average} ({doctor.rating.totalReviews})
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-lg text-primary-600 capitalize mt-1">
                          {doctor.specialization.replace('_', ' ')}
                        </p>
                        
                        <div className="flex items-center space-x-4 mt-2 text-sm text-neutral-600">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {doctor.yearsOfExperience} years experience
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {doctor.clinic?.address?.city}, {doctor.clinic?.address?.state}
                          </div>
                        </div>

                        <div className="mt-3">
                          <p className="text-neutral-700 font-medium">{doctor.clinic?.name}</p>
                          <p className="text-sm text-neutral-500">
                            {doctor.clinic?.address?.street}
                          </p>
                        </div>

                        <div className="flex items-center space-x-4 mt-3 text-sm">
                          <div className="flex items-center text-neutral-600">
                            <Phone className="w-4 h-4 mr-1" />
                            {doctor.phone}
                          </div>
                          <div className="flex items-center text-neutral-600">
                            <Mail className="w-4 h-4 mr-1" />
                            {doctor.email}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <div className="text-right">
                        <div className="text-lg font-semibold text-neutral-900">
                          {formatCurrency(doctor.consultationFee?.amount, doctor.consultationFee?.currency)}
                        </div>
                        <div className="text-sm text-neutral-500">Consultation Fee</div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/doctors/${doctor._id}`}
                          className="btn-ghost btn-sm"
                        >
                          View Profile
                        </Link>
                        <Link
                          to={`/appointments/new?doctor=${doctor._id}`}
                          className="btn-primary btn-sm"
                        >
                          Book Appointment
                        </Link>
                        <button className="btn-ghost btn-sm p-1">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Availability Preview */}
                  {doctor.availability && doctor.availability.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-neutral-200">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-neutral-400" />
                        <span className="text-sm text-neutral-600">Available:</span>
                        <div className="flex space-x-2">
                          {doctor.availability.slice(0, 3).map((schedule, index) => (
                            <span key={index} className="badge badge-info text-xs">
                              {schedule.dayOfWeek}: {schedule.startTime}-{schedule.endTime}
                            </span>
                          ))}
                          {doctor.availability.length > 3 && (
                            <span className="text-xs text-neutral-500">
                              +{doctor.availability.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Languages & Insurance */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm">
                      {doctor.languages && doctor.languages.length > 0 && (
                        <div>
                          <span className="text-neutral-500">Languages:</span>
                          <span className="text-neutral-900 ml-1">
                            {doctor.languages.slice(0, 3).join(', ')}
                          </span>
                        </div>
                      )}
                      {doctor.acceptsInsurance && (
                        <span className="badge badge-secondary">Insurance Accepted</span>
                      )}
                    </div>
                    
                    <div className="text-sm text-neutral-500">
                      License: {doctor.licenseNumber}
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {data.pagination && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-neutral-600">
                    Showing {((data.pagination.currentPage - 1) * 10) + 1} to{' '}
                    {Math.min(data.pagination.currentPage * 10, data.pagination.totalDoctors)} of{' '}
                    {data.pagination.totalDoctors} doctors
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
              <UserCheck className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No doctors found</h3>
              <p className="text-neutral-500 mb-4">
                {search || specialization || city ? 'Try adjusting your search filters.' : 'Get started by adding your first doctor.'}
              </p>
              <Link to="/doctors/new" className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add Doctor
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
