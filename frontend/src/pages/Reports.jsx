import React, { useState } from 'react'
import styles from './Reports.module.css'

const REPORTS = [
  { id:1,  name:'Reporte mensual de accesos LDAP',     cat:'Seguridad',  date:'01 May 2026', size:'2.4 MB', format:'PDF',  status:'ready',      author:'Sistema' },
  { id:2,  name:'Nómina activa por departamento',      cat:'RRHH',       date:'30 Abr 2026', size:'1.1 MB', format:'XLSX', status:'ready',      author:'rodriguez.pablo' },
  { id:3,  name:'Presupuesto ejecutado Q1 2026',       cat:'Finanzas',   date:'28 Abr 2026', size:'3.7 MB', format:'PDF',  status:'ready',      author:'martinez.juan' },
  { id:4,  name:'Inventario de equipos IT',            cat:'IT',         date:'25 Abr 2026', size:'890 KB', format:'XLSX', status:'ready',      author:'garcia.sofia' },
  { id:5,  name:'Incidentes de seguridad — Abr 2026',  cat:'Seguridad',  date:'20 Abr 2026', size:'560 KB', format:'PDF',  status:'ready',      author:'perez.carlos' },
  { id:6,  name:'KPIs de proyectos activos',           cat:'Gerencia',   date:'15 Abr 2026', size:'1.8 MB', format:'PDF',  status:'ready',      author:'garcia.sofia' },
  { id:7,  name:'Reporte de auditoría de permisos',    cat:'Seguridad',  date:'10 Abr 2026', size:'4.2 MB', format:'PDF',  status:'ready',      author:'Sistema' },
  { id:8,  name:'Análisis de rendimiento de servidores',cat:'IT',        date:'05 Abr 2026', size:'2.0 MB', format:'PDF',  status:'ready',      author:'perez.carlos' },
  { id:9,  name:'Reporte de nómina Mayo 2026',         cat:'RRHH',       date:'—',           size:'—',      format:'XLSX', status:'generating', author:'Sistema' },
  { id:10, name:'Forecast financiero Q2 2026',         cat:'Finanzas',   date:'—',           size:'—',      format:'PDF',  status:'scheduled',  author:'martinez.juan' },
]

const CATS = ['Todas','Seguridad','RRHH','Finanzas','IT','Gerencia']
const FMT_COLOR = { PDF:'#ef4444', XLSX:'#10b981', CSV:'#3b82f6' }

export default function Reports() {
  const [cat,    setCat]    = useState('Todas')
  const [search, setSearch] = useState('')
  const [generating, setGenerating] = useState(false)
  const [toast, setToast]   = useState(null)

  const filtered = REPORTS.filter(r =>
    (cat === 'Todas' || r.cat === cat) &&
    (!search || r.name.toLowerCase().includes(search.toLowerCase()))
  )

  const handleDownload = (r) => {
    if (r.status !== 'ready') return
    setToast(`Descargando "${r.name}"…`)
    setTimeout(() => setToast(null), 2800)
  }

  const handleGenerate = () => {
    setGenerating(true)
    setToast('Generando reporte personalizado…')
    setTimeout(() => { setGenerating(false); setToast('✅ Reporte generado y listo para descargar.') }, 2200)
    setTimeout(() => setToast(null), 5000)
  }

  return (
    <div className={styles.root}>
      {toast && <div className={styles.toast}>{toast}</div>}

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Reportes</h1>
          <p className={styles.sub}>Generá y descargá reportes del sistema</p>
        </div>
        <button className={styles.btnPrimary} onClick={handleGenerate} disabled={generating}>
          {generating
            ? <span className={styles.spinner}/>
            : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          }
          Generar reporte
        </button>
      </div>

      {/* Summary chips */}
      <div className={styles.summaryRow}>
        {[
          { label:'Disponibles', val: REPORTS.filter(r=>r.status==='ready').length,      color:'#10b981' },
          { label:'Generando',   val: REPORTS.filter(r=>r.status==='generating').length, color:'#f59e0b' },
          { label:'Programados', val: REPORTS.filter(r=>r.status==='scheduled').length,  color:'#3b82f6' },
          { label:'Total',       val: REPORTS.length,                                    color:'#8b5cf6' },
        ].map((s,i) => (
          <div key={i} className={styles.chip}>
            <span className={styles.chipDot} style={{background:s.color}}/>
            <span className={styles.chipVal}>{s.val}</span>
            <span className={styles.chipLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input placeholder="Buscar reportes…" value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <div className={styles.catFilters}>
          {CATS.map(c => (
            <button key={c} className={`${styles.catBtn} ${cat===c?styles.catActive:''}`} onClick={()=>setCat(c)}>{c}</button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className={styles.reportList}>
        {filtered.map((r,i) => (
          <div key={r.id} className={styles.reportRow} style={{animationDelay:`${i*.04}s`}}>
            <div className={styles.fmtBadge} style={{background:`${FMT_COLOR[r.format]}20`,color:FMT_COLOR[r.format],border:`1px solid ${FMT_COLOR[r.format]}40`}}>
              {r.format}
            </div>
            <div className={styles.reportInfo}>
              <span className={styles.reportName}>{r.name}</span>
              <span className={styles.reportMeta}>{r.cat} · {r.author} · {r.date}</span>
            </div>
            {r.size !== '—' && <span className={styles.reportSize}>{r.size}</span>}
            <span className={`${styles.reportStatus} ${styles['rs_'+r.status]}`}>
              {r.status === 'ready' ? 'Listo' : r.status === 'generating' ? 'Generando…' : 'Programado'}
            </span>
            <button
              className={`${styles.dlBtn} ${r.status!=='ready'?styles.dlDisabled:''}`}
              onClick={() => handleDownload(r)}
              disabled={r.status !== 'ready'}
              title={r.status==='ready' ? 'Descargar' : ''}
            >
              {r.status === 'generating'
                ? <span className={styles.miniSpinner}/>
                : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              }
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
