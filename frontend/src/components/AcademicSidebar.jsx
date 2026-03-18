<<<<<<< HEAD
import { NavLink, useNavigate } from 'react-router-dom'
import { getUserSession } from '../auth/sessionController'
import { destroyUserSession } from '../auth/sessionController'
import { roleMenuGroups } from '../data/roleConfig'

const iconMap = {
  Dashboard: 'dashboard',
  Students: 'group',
  Faculty: 'person',
  Department: 'domain',
  Exams: 'school',
  Timetable: 'calendar_today',
  Attendance: 'rule',
  Placement: 'work',
  Facility: 'apartment',
  Fees: 'payments',
  Reports: 'assessment',
  Admission: 'person_add',
  Payroll: 'receipt_long',
  Invoices: 'description',
  Analytics: 'query_stats',
  Notifications: 'notifications',
  Settings: 'settings',
  'My Courses': 'menu_book',
}

const routeMap = {
  Dashboard: '/dashboard',
  Students: '/students',
  Faculty: '/faculty',
  Department: '/departments',
=======
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { destroyUserSession, getUserSession } from '../auth/sessionController'
import { cmsRoles, roleMenuGroups } from '../data/roleConfig'

const getRouteMap = (role) => ({
  Dashboard: '/dashboard',
  Students: '/students',
  Faculty: '/faculty',
  Department: '/department',
>>>>>>> c10e7d5074fee957e11486f5f75b3bb8cdb2b414
  Exams: '/exams',
  Timetable: '/timetable',
  Attendance: '/attendance',
  Placement: '/placement',
  Facility: '/facility',
<<<<<<< HEAD
  Fees: '/fees',
  Reports: '/reports',
  Admission: '/admission',
  Payroll: '/payroll',
  Invoices: '/invoices',
=======
  Fees: role === 'admin' ? '/admin-fees' : '/fees',
  Reports: '/reports',
  Admission: '/admission',
  Payroll: '/payroll',
  Invoices: role === 'admin' ? '/admin-invoices' : '/invoices',
>>>>>>> c10e7d5074fee957e11486f5f75b3bb8cdb2b414
  Analytics: '/analytics',
  Notifications: '/notifications',
  Settings: '/settings',
  'My Courses': '/my-courses',
<<<<<<< HEAD
}

export default function AcademicSidebar({ onToggleSidebar }) {
  const navigate = useNavigate()
  const session = getUserSession()
  const role = session?.role || 'student'
  const menuGroups = roleMenuGroups[role] || []
=======
})

export default function AcademicSidebar({ isSidebarVisible = true, onToggleSidebar }) {
  const navigate = useNavigate()
  const location = useLocation()
  const session = getUserSession()
  const role = session?.role || 'student'
  const roleLabel = cmsRoles[role]?.label || 'Student'
  const routeMap = getRouteMap(role)
  const menuGroups = roleMenuGroups[role] || roleMenuGroups.student
>>>>>>> c10e7d5074fee957e11486f5f75b3bb8cdb2b414

  function handleLogout() {
    destroyUserSession()
    navigate('/', { replace: true })
  }

  return (
<<<<<<< HEAD
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col fixed h-full overflow-y-auto z-50">
      <div className="p-6 flex items-center gap-3 relative">
        <button
          onClick={onToggleSidebar}
          className="mr-3 p-2 rounded-full border border-slate-300 bg-white shadow hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          title="Toggle sidebar"
          style={{ zIndex: 2 }}
        >
          <span className="material-symbols-outlined text-3xl">menu</span>
        </button>
        <div className="bg-[#2563eb] w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
          <span className="material-symbols-outlined text-2xl font-bold">school</span>
        </div>
        <div>
          <h1 className="font-extrabold text-[#1e293b] text-xl tracking-tight leading-none">EduCore</h1>
          <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-[0.1em] mt-1">Admin Portal</p>
        </div>
=======
    <aside
      className={`w-64 border-r border-slate-200 bg-white flex flex-col fixed h-full overflow-y-auto z-20 transition-transform duration-300 ${isSidebarVisible ? 'translate-x-0' : '-translate-x-full'}`}
      id="sidebar"
    >
      <div className="p-5 flex items-start gap-2">
        <div className="bg-[#2563eb] w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-100 shrink-0">
          <span className="material-symbols-outlined text-xl font-bold">school</span>
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="font-black text-[#1e293b] text-xl tracking-tight leading-tight">MIT Connect</h1>
          <p className="text-[11px] font-semibold text-[#64748b] uppercase tracking-widest mt-0.5">{roleLabel} Portal</p>
        </div>
        <button
          type="button"
          onClick={onToggleSidebar}
          className="w-8 h-8 mt-0.5 shrink-0 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors"
          aria-label="Hide sidebar"
          title="Hide sidebar"
        >
          <span className="material-symbols-outlined text-[20px] leading-none">menu</span>
        </button>
>>>>>>> c10e7d5074fee957e11486f5f75b3bb8cdb2b414
      </div>

      <nav className="flex-1 px-4 space-y-6 overflow-y-auto">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
<<<<<<< HEAD
                const to = `${routeMap[item] || '#'}${role !== 'student' && item !== 'Settings' ? `?role=${encodeURIComponent(role)}` : ''}`
                const handleClick = (e) => {
                  console.log('Sidebar item clicked:', { item, to, role })
                  
                  // Use React Router navigation for all items
                  navigate(to)
                }
                return (
                  <button
                    key={item}
                    onClick={handleClick}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 relative z-10 w-full text-left"
                    style={{ pointerEvents: 'auto' }}
                  >
                    <span className="material-symbols-outlined text-[22px]">{iconMap[item] || 'circle'}</span>
                    <span>{item}</span>
                  </button>
=======
                const route = routeMap[item] || '/dashboard'
                const to = `${route}?role=${encodeURIComponent(role)}`
                const isActive =
                  location.pathname === route ||
                  (route !== '/dashboard' && location.pathname.startsWith(route))
                return (
                  <NavLink
                    key={item}
                    to={to}
                    className={() =>
                      `flex items-center h-11 px-3 rounded-lg text-[15px] transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-r from-[#2563eb] to-[#06b6d4] text-white font-medium shadow-[0_8px_18px_rgba(37,99,235,0.18)]'
                          : 'text-slate-500 hover:bg-slate-100 hover:text-[#1f2937] font-medium'
                      }`
                    }
                  >
                    <span>{item}</span>
                  </NavLink>
>>>>>>> c10e7d5074fee957e11486f5f75b3bb8cdb2b414
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 mt-auto">
        <button
          onClick={handleLogout}
<<<<<<< HEAD
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium transition-all duration-200"
        >
          <span className="material-symbols-outlined text-[22px]">logout</span>
=======
          className="w-full flex items-center px-4 py-3 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium transition-all duration-200"
        >
>>>>>>> c10e7d5074fee957e11486f5f75b3bb8cdb2b414
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}
