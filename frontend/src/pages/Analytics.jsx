import React, { useState } from 'react'
import styles from './Analytics.module.css'

const MONTHLY = [
  { mes: 'Dic', visitas: 3200, sesiones: 2100, conversiones: 180 },
  { mes: 'Ene', visitas: 4100, sesiones: 2800, conversiones: 240 },
  { mes: 'Feb', visitas: 3700, sesiones: 2400, conversiones: 210 },
  { mes: 'Mar', visitas: 5200, sesiones: 3500, conversiones: 310 },
  { mes: 'Abr', visitas: 4800, sesiones: 3200, conversiones: 290 },
  { mes: 'May', visitas: 6100, sesiones: 4100, conversiones: 380 },
]

const SOURCES = [
  { label: 'Directorio LDAP', pct: 54, color: '#3b82f6' },
  { label: 'VPN Corporativa',  pct: 24, color: '#8b5cf6' },
  { label: 'Acceso directo',   pct: 14, color: '#10b981' },
  { label: 'Otros',            pct:  8, color: '#f59e0b' },
]

const MAX_VAL = Math.max(...MONTHLY.map(d => d.visitas))

export default function Analytics() {
  const [active, setActive] = useState(null)

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Analítica</h1>
          <p className={styles.sub}>Métricas de acceso y uso del portal — últimos 6 meses</p>
        </div>
        <select className={styles.rangeSelect}>
          <option>Últimos 6 meses</option>
          <option>Último mes</option>
          <option>Último año</option>
        </select>
      </div>

      {/* KPIs */}
      <div className={styles.kpiGrid}>
        {[
          { label:'Visitas totales',  value:'27,100', delta:'+18%', icon:'👁️',  color:'blue' },
          { label:'Sesiones únicas',  value:'18,100', delta:'+14%', icon:'🔗',  color:'purple' },
          { label:'Conversiones',     value:'1,610',  delta:'+22%', icon:'✅',  color:'green' },
          { label:'Tasa rebote',      value:'31.4%',  delta:'-5%',  icon:'↩️',  color:'amber' },
        ].map((k,i) => (
          <div key={i} className={`${styles.kpi} ${styles[k.color]}`} style={{animationDelay:`${i*.07}s`}}>
            <div className={styles.kpiIcon}>{k.icon}</div>
            <div className={styles.kpiVal}>{k.value}</div>
            <div className={styles.kpiLabel}>{k.label}</div>
            <span className={styles.kpiDelta}>{k.delta}</span>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className={styles.chartsRow}>
        {/* Bar chart */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Visitas mensuales</span>
            <div className={styles.legend}>
              <span className={styles.legendDot} style={{background:'#3b82f6'}}/>Visitas
              <span className={styles.legendDot} style={{background:'#8b5cf6',marginLeft:12}}/>Sesiones
            </div>
          </div>
          <div className={styles.barChart}>
            {MONTHLY.map((d, i) => (
              <div
                key={i}
                className={`${styles.barGroup} ${active===i ? styles.barActive : ''}`}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
              >
                {active === i && (
                  <div className={styles.tooltip}>
                    <strong>{d.mes}</strong>
                    <span>Visitas: {d.visitas.toLocaleString('es-AR')}</span>
                    <span>Sesiones: {d.sesiones.toLocaleString('es-AR')}</span>
                    <span>Conv.: {d.conversiones}</span>
                  </div>
                )}
                <div className={styles.bars}>
                  <div className={styles.bar} style={{height:`${(d.visitas/MAX_VAL)*100}%`, background:'#3b82f6'}}/>
                  <div className={styles.bar} style={{height:`${(d.sesiones/MAX_VAL)*100}%`, background:'#8b5cf6'}}/>
                </div>
                <span className={styles.barLabel}>{d.mes}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Donut */}
        <div className={styles.card} style={{maxWidth:300}}>
          <div className={styles.cardHeader}>
            <span className={styles.cardTitle}>Origen de acceso</span>
          </div>
          <div className={styles.donutWrap}>
            <svg viewBox="0 0 120 120" className={styles.donut}>
              {(() => {
                let offset = 0
                return SOURCES.map((s, i) => {
                  const circ = 2 * Math.PI * 45
                  const dash = (s.pct / 100) * circ
                  const gap  = circ - dash
                  const el = (
                    <circle
                      key={i}
                      cx="60" cy="60" r="45"
                      fill="none"
                      stroke={s.color}
                      strokeWidth="18"
                      strokeDasharray={`${dash} ${gap}`}
                      strokeDashoffset={-offset}
                      transform="rotate(-90 60 60)"
                      className={styles.donutSlice}
                    />
                  )
                  offset += dash
                  return el
                })
              })()}
              <text x="60" y="55" textAnchor="middle" className={styles.donutCenter1}>Total</text>
              <text x="60" y="70" textAnchor="middle" className={styles.donutCenter2}>accesos</text>
            </svg>
          </div>
          <div className={styles.sourceList}>
            {SOURCES.map((s, i) => (
              <div key={i} className={styles.sourceRow}>
                <span className={styles.sourceDot} style={{background: s.color}}/>
                <span className={styles.sourceLabel}>{s.label}</span>
                <span className={styles.sourcePct}>{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Line trend */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>Tendencia de conversiones</span>
          <span className={styles.trendBadge}>↑ 22% vs período anterior</span>
        </div>
        <div className={styles.lineChart}>
          <svg viewBox="0 0 600 120" preserveAspectRatio="none" className={styles.lineSvg}>
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
              </linearGradient>
            </defs>
            {(() => {
              const vals = MONTHLY.map(d => d.conversiones)
              const maxV = Math.max(...vals)
              const minV = Math.min(...vals)
              const pts  = vals.map((v, i) => {
                const x = (i / (vals.length - 1)) * 580 + 10
                const y = 100 - ((v - minV) / (maxV - minV)) * 80 + 10
                return `${x},${y}`
              })
              const path = 'M' + pts.join(' L')
              const area = path + ` L${pts[pts.length-1].split(',')[0]},120 L10,120 Z`
              return (
                <>
                  <path d={area} fill="url(#lineGrad)"/>
                  <path d={path} fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  {pts.map((p, i) => (
                    <circle key={i} cx={p.split(',')[0]} cy={p.split(',')[1]} r="4" fill="#3b82f6" stroke="var(--bg-card)" strokeWidth="2"/>
                  ))}
                </>
              )
            })()}
          </svg>
          <div className={styles.lineLabels}>
            {MONTHLY.map((d, i) => <span key={i}>{d.mes}</span>)}
          </div>
        </div>
      </div>
    </div>
  )
}
