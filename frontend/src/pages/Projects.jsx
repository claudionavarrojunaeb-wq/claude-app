import React, { useState } from 'react'
import styles from './Projects.module.css'

const PROJECTS = [
  { id:1, name:'Portal Corporativo',  desc:'Migración del portal interno a React + NestJS con autenticación LDAP.', status:'active',   progress:72, team:['SC','JM','PR'], dept:'IT',        due:'30 Jun 2026', priority:'high' },
  { id:2, name:'ERP Finanzas v2',     desc:'Actualización del módulo de facturación y conciliación bancaria.',       status:'active',   progress:45, team:['VD','JM'],     dept:'Finanzas',  due:'15 Jul 2026', priority:'high' },
  { id:3, name:'RRHH Digital',        desc:'Digitalización de legajos y flujos de aprobación de vacaciones.',        status:'paused',   progress:30, team:['PR','AG'],     dept:'RRHH',      due:'01 Ago 2026', priority:'medium' },
  { id:4, name:'Infra Cloud',         desc:'Migración de servidores on-premise a AWS con Terraform.',                status:'active',   progress:88, team:['CP','SC'],     dept:'IT',        due:'10 Jun 2026', priority:'high' },
  { id:5, name:'Dashboard BI',        desc:'Tableros de inteligencia de negocio para gerencia con Power BI.',        status:'done',     progress:100,team:['AG','VD','JM'],dept:'Marketing', due:'01 May 2026', priority:'low' },
  { id:6, name:'App Móvil Empleados', desc:'Aplicación React Native para consultas de recibos y novedades.',        status:'active',   progress:18, team:['SC','LF'],     dept:'IT',        due:'01 Sep 2026', priority:'medium' },
]

const STATUS_MAP = { active:'En curso', paused:'Pausado', done:'Finalizado' }
const PRI_MAP    = { high:'Alta', medium:'Media', low:'Baja' }

export default function Projects() {
  const [view,   setView]   = useState('grid')
  const [filter, setFilter] = useState('all')

  const list = PROJECTS.filter(p => filter === 'all' || p.status === filter)

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Proyectos</h1>
          <p className={styles.sub}>{PROJECTS.length} proyectos · {PROJECTS.filter(p=>p.status==='active').length} en curso</p>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.viewToggle}>
            <button className={view==='grid'?styles.viewActive:''} onClick={()=>setView('grid')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            </button>
            <button className={view==='list'?styles.viewActive:''} onClick={()=>setView('list')}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
            </button>
          </div>
          <button className={styles.btnPrimary}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Nuevo proyecto
          </button>
        </div>
      </div>

      <div className={styles.filters}>
        {[['all','Todos'],['active','En curso'],['paused','Pausados'],['done','Finalizados']].map(([val,lbl]) => (
          <button key={val} className={`${styles.filterBtn} ${filter===val?styles.filterActive:''}`} onClick={()=>setFilter(val)}>{lbl}</button>
        ))}
      </div>

      {view === 'grid' ? (
        <div className={styles.grid}>
          {list.map((p,i) => (
            <div key={p.id} className={styles.card} style={{animationDelay:`${i*.06}s`}}>
              <div className={styles.cardTop}>
                <div className={styles.cardMeta}>
                  <span className={`${styles.statusBadge} ${styles[p.status]}`}>{STATUS_MAP[p.status]}</span>
                  <span className={`${styles.priBadge} ${styles['pri_'+p.priority]}`}>{PRI_MAP[p.priority]}</span>
                </div>
                <button className={styles.menuBtn}>⋮</button>
              </div>
              <h3 className={styles.projName}>{p.name}</h3>
              <p className={styles.projDesc}>{p.desc}</p>
              <div className={styles.progressWrap}>
                <div className={styles.progressHeader}>
                  <span className={styles.progressLabel}>Progreso</span>
                  <span className={styles.progressPct}>{p.progress}%</span>
                </div>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{width:`${p.progress}%`, background: p.progress===100?'var(--success)':'var(--accent)'}}/>
                </div>
              </div>
              <div className={styles.cardFooter}>
                <div className={styles.teamAvatars}>
                  {p.team.map((t,ti) => (
                    <div key={ti} className={styles.teamAvatar} style={{zIndex:p.team.length-ti}}>{t[0]}</div>
                  ))}
                </div>
                <div className={styles.dueWrap}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  {p.due}
                </div>
              </div>
              <div className={styles.deptTag}>{p.dept}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.listWrap}>
          <table className={styles.table}>
            <thead><tr><th>Proyecto</th><th>Área</th><th>Prioridad</th><th>Progreso</th><th>Estado</th><th>Vencimiento</th><th>Equipo</th></tr></thead>
            <tbody>
              {list.map(p => (
                <tr key={p.id}>
                  <td><span className={styles.listName}>{p.name}</span></td>
                  <td><span className={styles.listDept}>{p.dept}</span></td>
                  <td><span className={`${styles.priBadge} ${styles['pri_'+p.priority]}`}>{PRI_MAP[p.priority]}</span></td>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div className={styles.progressBar} style={{width:100,flex:'unset'}}>
                        <div className={styles.progressFill} style={{width:`${p.progress}%`,background:p.progress===100?'var(--success)':'var(--accent)'}}/>
                      </div>
                      <span style={{fontSize:'.78rem',color:'var(--text-muted)'}}>{p.progress}%</span>
                    </div>
                  </td>
                  <td><span className={`${styles.statusBadge} ${styles[p.status]}`}>{STATUS_MAP[p.status]}</span></td>
                  <td><span style={{fontSize:'.8rem',color:'var(--text-muted)'}}>{p.due}</span></td>
                  <td>
                    <div className={styles.teamAvatars}>
                      {p.team.map((t,ti) => <div key={ti} className={styles.teamAvatar} style={{zIndex:p.team.length-ti}}>{t[0]}</div>)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
