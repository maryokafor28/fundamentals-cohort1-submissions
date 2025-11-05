import { useState } from 'react'
import { useQuery } from 'react-query'
import { Link } from 'react-router-dom'
import { 
  Plus,
  Search,
  Filter,
  Users as UsersIcon,
  Calendar,
  Mail,
  Phone,
  MoreHorizontal
} from 'lucide-react'
import { userApi } from '../lib/api'
import { formatDate, calculateAge, getBMICategory, debounce } from '../lib/utils'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'

export default function Users() {
  const [search, setSearch] = useState('')
  const [gender, setGender] = useState('')
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')

  const { data, isLoading, error, refetch } = useQuery(
    ['users', { search, gender, page, sortBy, sortOrder }],
    () => userApi.getAll({ 
      search, 
      gender: gender || undefined, 
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Users</h1>
          <p className="text-neutral-600 mt-1">
            Manage user profiles and health information
          </p>
        </div>
        <Link to="/users/new" className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add User
        </Link>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users..."
                className="input pl-10"
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <select
              className="select"
              value={gender}
              onChange={(e) => {
                setGender(e.target.value)
                setPage(1)
              }}
            >
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
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
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users List */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="card">
          {data?.data?.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Age & Gender</th>
                      <th>BMI Status</th>
                      <th>Contact</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.data.map((user) => {
                      const age = calculateAge(user.dateOfBirth)
                      const bmiCategory = getBMICategory(user.bmi)
                      
                      return (
                        <tr key={user._id} className="hover:bg-neutral-50">
                          <td>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-medium">
                                {user.name?.[0] || 'U'}
                              </div>
                              <div>
                                <div className="font-medium text-neutral-900">
                                  {user.name}
                                </div>
                                <div className="text-sm text-neutral-500">
                                  ID: {user._id.slice(-8)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="text-sm">
                              <div className="text-neutral-900">
                                {age} years old
                              </div>
                              <div className="text-neutral-500 capitalize">
                                {user.gender}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="text-sm">
                              <div className="text-neutral-900">
                                BMI: {user.bmi || 'N/A'}
                              </div>
                              <span className={`badge ${
                                bmiCategory === 'Normal weight' ? 'badge-success' :
                                bmiCategory === 'Overweight' ? 'badge-warning' :
                                bmiCategory === 'Obese' ? 'badge-accent' :
                                'badge-info'
                              }`}>
                                {bmiCategory}
                              </span>
                            </div>
                          </td>
                          <td>
                            <div className="text-sm space-y-1">
                              <div className="flex items-center text-neutral-900">
                                <Mail className="w-3 h-3 mr-1" />
                                {user.email}
                              </div>
                              <div className="flex items-center text-neutral-500">
                                <Phone className="w-3 h-3 mr-1" />
                                {user.phone}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="text-sm text-neutral-900">
                              {formatDate(user.createdAt)}
                            </div>
                          </td>
                          <td>
                            <div className="flex items-center space-x-2">
                              <Link
                                to={`/users/${user._id}`}
                                className="btn-ghost btn-sm"
                              >
                                View
                              </Link>
                              <button className="btn-ghost btn-sm p-1">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {data.pagination && (
                <div className="flex items-center justify-between pt-6 border-t border-neutral-200">
                  <div className="text-sm text-neutral-600">
                    Showing {((data.pagination.currentPage - 1) * 10) + 1} to{' '}
                    {Math.min(data.pagination.currentPage * 10, data.pagination.totalUsers)} of{' '}
                    {data.pagination.totalUsers} users
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
            <div className="text-center py-12">
              <UsersIcon className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No users found</h3>
              <p className="text-neutral-500 mb-4">
                {search || gender ? 'Try adjusting your search filters.' : 'Get started by adding your first user.'}
              </p>
              <Link to="/users/new" className="btn-primary">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
