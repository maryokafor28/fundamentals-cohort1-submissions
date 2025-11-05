import { useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { 
  Plus,
  Search,
  Filter,
  FileText,
  Calendar,
  User,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Clock,
  MoreHorizontal
} from 'lucide-react'
import { reportApi } from '../lib/api'
import { formatDate, getStatusColor, getStatusBadgeClass, debounce } from '../lib/utils'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

export default function Reports() {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [status, setStatus] = useState('')
  const [priority, setPriority] = useState('')
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('reportDate')
  const [sortOrder, setSortOrder] = useState('desc')

  const { data: reportTypes } = useQuery('report-types', reportApi.getTypes)

  const { data, isLoading, error, refetch } = useQuery(
    ['reports', { search, type, status, priority, page, sortBy, sortOrder }],
    () => reportApi.getAll({ 
      search: search || undefined,
      type: type || undefined,
      status: status || undefined,
      priority: priority || undefined,
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
    { value: 'draft', label: 'Draft' },
    { value: 'pending_review', label: 'Pending Review' },
    { value: 'reviewed', label: 'Reviewed' },
    { value: 'final', label: 'Final' },
    { value: 'amended', label: 'Amended' },
    { value: 'cancelled', label: 'Cancelled' }
  ]

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'normal', label: 'Normal' },
    { value: 'high', label: 'High' },
    { value: 'urgent', label: 'Urgent' }
  ]

  const getReportIcon = (reportType) => {
    const icons = {
      medical_report: '📋',
      lab_result: '🧪',
      imaging_report: '🩻',
      pathology_report: '🔬',
      fitness_report: '💪',
      nutrition_report: '🥗',
      mental_health_report: '🧠',
      prescription: '💊',
      discharge_summary: '🏥',
      referral_letter: '📝',
      insurance_claim: '💳',
      fitness_assessment: '📊'
    }
    return icons[reportType] || '📄'
  }

  const getOverallStatusIcon = (overallStatus) => {
    switch (overallStatus) {
      case 'normal': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'abnormal': return <AlertCircle className="w-4 h-4 text-orange-500" />
      case 'critical': return <AlertCircle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Medical Reports</h1>
          <p className="text-neutral-600 mt-1">
            Manage medical reports, lab results, and health documents
          </p>
        </div>
        <Link to="/reports/new" className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Create Report
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
                placeholder="Search reports..."
                className="input pl-10"
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
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
              {reportTypes?.data?.types?.map((reportType) => (
                <option key={reportType} value={reportType}>
                  {getReportIcon(reportType)} {reportType.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

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
              <option value="reportDate-desc">Newest First</option>
              <option value="reportDate-asc">Oldest First</option>
              <option value="priority-desc">High Priority</option>
              <option value="title-asc">Title A-Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-4">
          {data?.data?.length > 0 ? (
            <>
              {data.data.map((report) => (
                <div key={report._id} className="card-hover">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                        {getReportIcon(report.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-neutral-900 truncate">
                            {report.title}
                          </h3>
                          <span className={`badge ${getStatusBadgeClass(report.status)}`}>
                            {report.status.replace('_', ' ')}
                          </span>
                          <span className={`badge badge-${getStatusColor(report.priority)}`}>
                            {report.priority}
                          </span>
                          {report.overallStatus && (
                            <div className="flex items-center space-x-1">
                              {getOverallStatusIcon(report.overallStatus)}
                              <span className="text-sm capitalize">{report.overallStatus}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Patient Info */}
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <User className="w-4 h-4 text-neutral-400" />
                              <span className="text-sm font-medium text-neutral-900">Patient</span>
                            </div>
                            <div className="ml-6">
                              <p className="text-sm text-neutral-900">{report.user?.name}</p>
                            </div>
                          </div>

                          {/* Doctor Info */}
                          {report.doctor && (
                            <div>
                              <div className="flex items-center space-x-2 mb-1">
                                <UserCheck className="w-4 h-4 text-neutral-400" />
                                <span className="text-sm font-medium text-neutral-900">Doctor</span>
                              </div>
                              <div className="ml-6">
                                <p className="text-sm text-neutral-900">Dr. {report.doctor.name}</p>
                                <p className="text-sm text-neutral-600 capitalize">
                                  {report.doctor.specialization?.replace('_', ' ')}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Report Details */}
                        <div className="mt-4 flex items-center space-x-6 text-sm text-neutral-600">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDate(report.reportDate)}
                          </div>
                          {report.testDate && (
                            <div>
                              Test: {formatDate(report.testDate)}
                            </div>
                          )}
                          <div className="capitalize">
                            {report.type.replace('_', ' ')}
                          </div>
                          {report.category && (
                            <div className="capitalize">
                              {report.category.replace('_', ' ')}
                            </div>
                          )}
                        </div>

                        {/* Summary */}
                        {report.summary && (
                          <div className="mt-3">
                            <p className="text-sm text-neutral-700 line-clamp-2">
                              {report.summary}
                            </p>
                          </div>
                        )}

                        {/* Results Summary */}
                        {report.results && report.results.length > 0 && (
                          <div className="mt-3">
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="text-neutral-600">Results:</span>
                              <div className="flex items-center space-x-2">
                                {report.abnormalResultsCount > 0 ? (
                                  <span className="badge badge-warning">
                                    {report.abnormalResultsCount} abnormal
                                  </span>
                                ) : (
                                  <span className="badge badge-success">All normal</span>
                                )}
                                {report.criticalFindingsCount > 0 && (
                                  <span className="badge badge-accent">
                                    {report.criticalFindingsCount} critical
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Laboratory Info */}
                        {report.laboratory && (
                          <div className="mt-2">
                            <span className="text-sm text-neutral-500">
                              Lab: {report.laboratory.name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <div className="text-right">
                        <div className="text-sm text-neutral-500">
                          {report.daysOld} days ago
                        </div>
                        {report.confidentiality && (
                          <div className={`text-xs px-2 py-1 rounded ${
                            report.confidentiality === 'highly_confidential' ? 'bg-red-100 text-red-700' :
                            report.confidentiality === 'confidential' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {report.confidentiality.replace('_', ' ')}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/reports/${report._id}`}
                          className="btn-ghost btn-sm"
                        >
                          View Report
                        </Link>
                        {report.status === 'pending_review' && (
                          <button className="btn-primary btn-sm">
                            Review
                          </button>
                        )}
                        <button className="btn-ghost btn-sm p-1">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Attachments */}
                  {report.attachments && report.attachments.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-neutral-200">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-neutral-400" />
                        <span className="text-sm text-neutral-600">
                          {report.attachments.length} attachment(s)
                        </span>
                        <div className="flex space-x-2">
                          {report.attachments.slice(0, 3).map((attachment, index) => (
                            <span key={index} className="badge badge-info text-xs">
                              {attachment.fileType?.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Pagination */}
              {data.pagination && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-neutral-600">
                    Showing {((data.pagination.currentPage - 1) * 10) + 1} to{' '}
                    {Math.min(data.pagination.currentPage * 10, data.pagination.totalReports)} of{' '}
                    {data.pagination.totalReports} reports
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
              <FileText className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No reports found</h3>
              <p className="text-neutral-500 mb-4">
                {search || type || status || priority ? 
                  'Try adjusting your search filters.' : 
                  'Get started by creating your first report.'
                }
              </p>
              <Link to="/reports/new" className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Create Report
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
