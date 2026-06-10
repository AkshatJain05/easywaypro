import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllUsers } from '../../../redux/adminSlice.js'
import { HiOutlineSearch } from 'react-icons/hi'
import Loading from '../../../component/Loading.jsx'

export default function AdminUsers() {
  const dispatch = useDispatch()
  const { users, loading } = useSelector(s => s.admin)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  useEffect(() => { dispatch(fetchAllUsers()) }, [])
  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  if (loading && users.length === 0) return <Loading />

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Users</h1>
        <p className="text-slate-400 text-sm mt-1">{users.length} registered users</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <HiOutlineSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search users..." className="input pl-10" />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="input w-auto px-4">
          <option value="all">All Roles</option>
          <option value="student">Students</option>
          <option value="teacher">Teachers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                {['User','Contact','College','Role','Joined'].map(h => (
                  <th key={h} className="text-left p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(u => (
                <tr key={u._id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500/30 to-amber-500/20 flex items-center justify-center text-orange-300 font-bold text-sm flex-shrink-0">
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm text-white font-medium">{u.name}</p>
                        <p className="text-xs text-slate-500">{u.Course || '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-slate-300">{u.email}</p>
                    {u.phoneNo && <p className="text-xs text-slate-500">{u.phoneNo}</p>}
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-slate-400 max-w-[160px] truncate">{u.CollegeName || '—'}</p>
                    {u.BranchName && <p className="text-xs text-slate-500">{u.BranchName}</p>}
                  </td>
                  <td className="p-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                      u.role === 'admin' ? 'bg-purple-500/20 text-purple-400'
                      : u.role === 'teacher' ? 'bg-blue-500/15 text-blue-400'
                      : 'bg-slate-700 text-slate-400'
                    }`}>{u.role}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'2-digit' })}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-16 text-slate-500">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
