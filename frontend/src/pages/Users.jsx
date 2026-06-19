import React, { useState } from 'react'
import styles from './Users.module.css'

const USERS = [
  { id:1, username:'garcia.sofia',     displayName:'Sofía García',     dept:'IT',        email:'sofia@corp.local',    status:'active',   groups:['Admins','IT-Team'],     lastLogin:'hace 5 min' },
  { id:2, username:'martinez.juan',    displayName:'Juan Martínez',    dept:'Finanzas',  email:'jmartinez@corp.local', status:'active',  groups:['Finanzas','Reportes'],  lastLogin:'hace 1 h' },
  { id:3, username:'rodriguez.pablo',  displayName:'Pablo Rodríguez',  dept:'RRHH',      email:'prodriguez@corp.local',status:'active',  groups:['RRHH'],                 lastLogin:'hace 2 h' },
  { id:4, username:'lopez.maria',      displayName:'María López',      dept:'IT',        email:'mlopez@corp.local',   status:'inactive', groups:['IT-Team'],              lastLogin:'hace 3 días' },
  { id:5, username:'fernandez.luis',   displayName:'Luis Fernández',   dept:'Operaciones',email:'lfernandez@corp.local',status:'active', groups:['Operaciones'],          lastLogin:'hace 4 h' },
  { id:6, username:'gomez.ana',        displayName:'Ana Gómez',        dept:'Marketing', email:'agomez@corp.local',   status:'active',   groups:['Marketing','Reportes'], lastLogin:'ayer' },
  { id:7, username:'perez.carlos',     displayName:'Carlos Pérez',     dept:'IT',        email:'cperez@corp.local',   status:'locked',   groups:['IT-Team','Admins'],     lastLogin:'hace 7 días' },
  { id:8, username:'diaz.valentina',   displayName:'Valentina Díaz',   dept:'Finanzas',  email:'vdiaz@corp.local',    status:'active',   groups:['Finanzas'],             lastLogin:'hace 30 min' },
]

const STATUS_LABEL = { active:'Activo', inactive:'Inactivo', locked:'Bloqueado' }

export default function Users() {
  const [search, setSearch]   = useState('')
  const [filter, setFilter]   = useState('all')
  const [selected, setSelected] = useState(null)

  const filtered = USERS.filter(u => {
    const matchSearch = !search ||
      u.displayName.toLowerCase().includes(search.toLowerCase()) ||
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.dept.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || u.status === filter
    return matchSearch && matchFilter
  })

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Usuarios LDAP</h1>
          <p className={styles.sub}>{USERS.length} usuarios en el directorio corporativo</p>
        </div>
        <button className={styles.btnPrimary}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Nuevo usuario
        </button>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        {[
          { label:'Activos',    val: USERS.filter(u=>u.status==='active').length,   color:'#10b981' },
          { label:'Inactivos',  val: USERS.filter(u=>u.status==='inactive').length, color:'#f59e0b' },
          { label:'Bloqueados', val: USERS.filter(u=>u.status==='locked').length,   color:'#ef4444' },
          { label:'Total',      val: USERS.length,                                   color:'#3b82f6' },
        ].map((s,i) => (
          <div key={i} className={styles.statChip}>
            <span className={styles.statDot} style={{background:s.color}}/>
            <span className={styles.statVal}>{s.val}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            placeholder="Buscar por nombre, usuario o área…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filters}>
          {['all','active','inactive','locked'].map(f => (
            <button
              key={f}
              className={`${styles.filterBtn} ${filter===f ? styles.filterActive : ''}`}
              onClick={() => setFilter(f)}
            >
              {f==='all'?'Todos':STATUS_LABEL[f]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Área</th>
              <th>Email</th>
              <th>Grupos</th>
              <th>Estado</th>
              <th>Último acceso</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className={selected===u.id ? styles.rowSelected : ''} onClick={() => setSelected(selected===u.id ? null : u.id)}>
                <td>
                  <div className={styles.userCell}>
                    <div className={styles.avatar} style={{background: strToColor(u.username)}}>
                      {u.displayName[0]}
                    </div>
                    <div>
                      <span className={styles.uName}>{u.displayName}</span>
                      <span className={styles.uUser}>{u.username}</span>
                    </div>
                  </div>
                </td>
                <td><span className={styles.dept}>{u.dept}</span></td>
                <td><span className={styles.email}>{u.email}</span></td>
                <td>
                  <div className={styles.groups}>
                    {u.groups.map(g => <span key={g} className={styles.groupTag}>{g}</span>)}
                  </div>
                </td>
                <td><span className={`${styles.status} ${styles[u.status]}`}>{STATUS_LABEL[u.status]}</span></td>
                <td><span className={styles.lastLogin}>{u.lastLogin}</span></td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.actionBtn} title="Editar">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button className={`${styles.actionBtn} ${styles.actionDanger}`} title="Bloquear">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className={styles.empty}>
            <span>🔍</span>
            <p>No se encontraron usuarios con ese criterio.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function strToColor(str) {
  const colors = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#06b6d4','#ec4899']
  let h = 0
  for (let c of str) h = (h * 31 + c.charCodeAt(0)) % colors.length
  return colors[h]
}
