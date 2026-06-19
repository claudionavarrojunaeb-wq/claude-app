import React from 'react'
import { useAuth } from '../context/AuthContext'
import styles from './DashboardHome.module.css'

const STATS = [
  { label: 'Usuarios activos',  value: '1,284', delta: '+12%',  color: 'blue',   icon: '👥' },
  { label: 'Proyectos abiertos',value: '38',    delta: '+4',    color: 'purple', icon: '📁' },
  { label: 'Tareas pendientes', value: '127',   delta: '-8%',   color: 'amber',  icon: '📋' },
  { label: 'Alertas del sistema',value: '3',    delta: 'Nuevo', color: 'red',    icon: '🔔' },
]

const ACTIVITY = [
  { user: 'martinez.juan',  action: 'Actualizó el proyecto "Alpha"',  time: 'hace 5 min',  type: 'edit' },
  { user: 'garcia.sofia',   action: 'Creó 3 nuevos usuarios LDAP',    time: 'hace 22 min', type: 'create' },
  { user: 'rodriguez.pablo',action: 'Exportó reporte mensual',        time: 'hace 1 h',    type: 'export' },
  { user: 'lopez.maria',    action: 'Cambió permisos de grupo "TI"',  time: 'hace 2 h',    type: 'perm' },
  { user: 'fernandez.luis', action: 'Archivó el proyecto "Omega"',    time: 'hace 3 h',    type: 'archive' },
]

const TYPE_COLOR = {
  edit:    '#3b82f6',
  create:  '#10b981',
  export:  '#8b5cf6',
  perm:    '#f59e0b',
  archive: '#64748b',
}

export default function DashboardHome() {
  const { user } = useAuth()
  const hour     = new Date().getHours()
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'

  return (
    <div className={styles.root}>
      {/* Welcome */}
      <div className={styles.welcome}>
        <div>
          <h1 className={styles.welcomeTitle}>
            {greeting}, {user?.displayName?.split(' ')[0] || user?.username} 👋
          </h1>
          <p className={styles.welcomeSub}>
            Aquí tenés un resumen de la actividad del sistema.
          </p>
        </div>
        <div className={styles.dateBadge}>
          {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
      </div>

      {/* Stats grid */}
      <div className={styles.statsGrid}>
        {STATS.map((s, i) => (
          <div key={i} className={`${styles.statCard} ${styles[s.color]}`} style={{ animationDelay: `${i * 0.08}s` }}>
            <div className={styles.statIcon}>{s.icon}</div>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
            <div className={styles.statDelta}>{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Bottom grid */}
      <div className={styles.bottomGrid}>
        {/* Activity feed */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Actividad reciente</span>
            <button className={styles.cardAction}>Ver todo</button>
          </div>
          <div className={styles.feed}>
            {ACTIVITY.map((a, i) => (
              <div key={i} className={styles.feedItem} style={{ animationDelay: `${0.3 + i * 0.06}s` }}>
                <div className={styles.feedDot} style={{ background: TYPE_COLOR[a.type] }} />
                <div className={styles.feedBody}>
                  <span className={styles.feedUser}>{a.user}</span>
                  <span className={styles.feedAction}>{a.action}</span>
                </div>
                <span className={styles.feedTime}>{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* LDAP info */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Info de sesión LDAP</span>
            <span className={styles.ldapBadge}>Activo</span>
          </div>
          <div className={styles.ldapInfo}>
            {[
              ['Usuario',       user?.username || '—'],
              ['Nombre',        user?.displayName || '—'],
              ['Departamento',  user?.department || '—'],
              ['Email',         user?.email || '—'],
              ['DN',            user?.dn || 'cn=' + user?.username + ',dc=corp,dc=local'],
            ].map(([k, v]) => (
              <div key={k} className={styles.ldapRow}>
                <span className={styles.ldapKey}>{k}</span>
                <span className={styles.ldapVal}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
