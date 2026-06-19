import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from './Sidebar'
import styles from './DashboardLayout.module.css'

const TITLES = {
  '/dashboard':           'Dashboard',
  '/dashboard/analytics': 'Analítica',
  '/dashboard/users':     'Usuarios',
  '/dashboard/projects':  'Proyectos',
  '/dashboard/reports':   'Reportes',
  '/dashboard/settings':  'Configuración',
}

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const { user } = useAuth()
  const location = useLocation()
  const title    = TITLES[location.pathname] ?? 'Dashboard'

  return (
    <div className={styles.root}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />

      <div className={`${styles.main} ${collapsed ? styles.mainCollapsed : ''}`}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <h2 className={styles.pageTitle}>{title}</h2>
            <span className={styles.breadcrumb}>Portal / {title}</span>
          </div>
          <div className={styles.topbarRight}>
            <button className={styles.notifBtn} aria-label="Notificaciones">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className={styles.notifDot} />
            </button>
            <div className={styles.topbarUser}>
              <div className={styles.topbarAvatar}>
                {user?.username?.[0]?.toUpperCase() ?? 'U'}
              </div>
              <span className={styles.topbarName}>{user?.displayName || user?.username}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
