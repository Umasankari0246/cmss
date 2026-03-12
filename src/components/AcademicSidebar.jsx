import { NavLink, useNavigate } from 'react-router-dom'
import { destroyUserSession } from '../auth/sessionController'

const navGroups = [
  {
    label: 'Overview',
    items: [
      { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
      { to: '/students',  icon: 'group',    label: 'Students' },
      { to: '/faculty',   icon: 'person',   label: 'Faculty' },
      { to: '/departments', icon: 'domain', label: 'Departments' },
    ],
  },
  {
    label: 'Administration',
    items: [
      { to: '/fees',      icon: 'payments',      label: 'Fees' },
      { to: '/reports',   icon: 'assessment',    label: 'Reports' },
    ],
  },
]

export default function AcademicSidebar() {
  const navigate = useNavigate()

  function handleLogout() {
    destroyUserSession()
    navigate('/', { replace: true })
  }

  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col fixed h-full overflow-y-auto z-20">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-[#2563eb] w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
          <span className="material-symbols-outlined text-2xl font-bold">school</span>
        </div>
        <div>
          <h1 className="font-extrabold text-[#1e293b] text-xl tracking-tight leading-none">EduCore</h1>
          <p className="text-[10px] font-bold text-[#64748b] uppercase tracking-[0.1em] mt-1">
            {role.charAt(0).toUpperCase() + role.slice(1)} Portal
          </p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-6 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
                      isActive
                        ? 'bg-[#2563eb]/10 text-[#2563eb] font-semibold shadow-sm'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium transition-all duration-200"
        >
          <span className="material-symbols-outlined text-[22px]">logout</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  )
}


