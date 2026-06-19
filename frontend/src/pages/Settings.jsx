import React, { useState } from 'react'
import styles from './Settings.module.css'

const SECTIONS = ['LDAP', 'Apariencia', 'Seguridad', 'Notificaciones', 'Cuenta']

export default function Settings() {
  const [activeSection, setActiveSection] = useState('LDAP')
  const [saved, setSaved] = useState(false)
  const [ldap, setLdap] = useState({
    url: 'ldap://corp-ldap.local:389',
    baseDN: 'dc=corp,dc=local',
    bindDN: 'cn=ldap-reader,dc=corp,dc=local',
    bindPass: '••••••••••••',
    searchAttr: 'sAMAccountName',
    tlsEnabled: true,
    timeout: '10',
  })
  const [appearance, setAppearance] = useState({
    theme: 'dark',
    accentColor: '#3b82f6',
    compactMode: false,
    animations: true,
  })
  const [security, setSecurity] = useState({
    jwtExpiry: '8h',
    maxSessions: '3',
    mfaEnabled: false,
    auditLog: true,
    ipWhitelist: '',
  })
  const [notif, setNotif] = useState({
    loginAlerts: true,
    failedLogins: true,
    systemAlerts: true,
    email: 'admin@corp.local',
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Configuración</h1>
          <p className={styles.sub}>Ajustes del sistema y del portal corporativo</p>
        </div>
        <button className={styles.btnSave} onClick={handleSave}>
          {saved
            ? <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Guardado</>
            : <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Guardar cambios</>
          }
        </button>
      </div>

      <div className={styles.layout}>
        {/* Sidebar nav */}
        <nav className={styles.settingsNav}>
          {SECTIONS.map(s => (
            <button
              key={s}
              className={`${styles.navItem} ${activeSection===s?styles.navActive:''}`}
              onClick={() => setActiveSection(s)}
            >
              {s}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className={styles.settingsContent}>

          {activeSection === 'LDAP' && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Conexión LDAP</h2>
              <p className={styles.sectionDesc}>Configurá la conexión al directorio corporativo.</p>
              <div className={styles.formGrid}>
                <Field label="URL del servidor" value={ldap.url} onChange={v=>setLdap({...ldap,url:v})} mono/>
                <Field label="Base DN" value={ldap.baseDN} onChange={v=>setLdap({...ldap,baseDN:v})} mono/>
                <Field label="Bind DN (cuenta lectora)" value={ldap.bindDN} onChange={v=>setLdap({...ldap,bindDN:v})} mono/>
                <Field label="Contraseña de bind" value={ldap.bindPass} onChange={v=>setLdap({...ldap,bindPass:v})} type="password" mono/>
                <Field label="Atributo de búsqueda" value={ldap.searchAttr} onChange={v=>setLdap({...ldap,searchAttr:v})} hint="sAMAccountName para AD, uid para OpenLDAP" mono/>
                <Field label="Timeout (segundos)" value={ldap.timeout} onChange={v=>setLdap({...ldap,timeout:v})} type="number"/>
                <Toggle label="TLS / LDAPS habilitado" desc="Usa ldaps:// o STARTTLS para cifrar la conexión." value={ldap.tlsEnabled} onChange={v=>setLdap({...ldap,tlsEnabled:v})}/>
              </div>
              <div className={styles.testRow}>
                <button className={styles.btnSecondary}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                  Probar conexión LDAP
                </button>
                <span className={styles.testHint}>Verificá que el servidor sea accesible antes de guardar.</span>
              </div>
            </div>
          )}

          {activeSection === 'Apariencia' && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Apariencia</h2>
              <p className={styles.sectionDesc}>Personalizá la interfaz del portal.</p>
              <div className={styles.formGrid}>
                <div className={styles.fieldWrap}>
                  <label className={styles.fieldLabel}>Tema</label>
                  <div className={styles.themeOptions}>
                    {['dark','light','system'].map(t => (
                      <button key={t} className={`${styles.themeBtn} ${appearance.theme===t?styles.themeActive:''}`} onClick={()=>setAppearance({...appearance,theme:t})}>
                        {t==='dark'?'🌙 Oscuro':t==='light'?'☀️ Claro':'💻 Sistema'}
                      </button>
                    ))}
                  </div>
                </div>
                <div className={styles.fieldWrap}>
                  <label className={styles.fieldLabel}>Color de acento</label>
                  <div className={styles.colorPicker}>
                    {['#3b82f6','#8b5cf6','#10b981','#f59e0b','#ef4444','#06b6d4'].map(c=>(
                      <button key={c} className={`${styles.colorSwatch} ${appearance.accentColor===c?styles.colorActive:''}`} style={{background:c}} onClick={()=>setAppearance({...appearance,accentColor:c})}/>
                    ))}
                  </div>
                </div>
                <Toggle label="Modo compacto" desc="Reduce el espacio entre elementos." value={appearance.compactMode} onChange={v=>setAppearance({...appearance,compactMode:v})}/>
                <Toggle label="Animaciones" desc="Transiciones y efectos visuales." value={appearance.animations} onChange={v=>setAppearance({...appearance,animations:v})}/>
              </div>
            </div>
          )}

          {activeSection === 'Seguridad' && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Seguridad</h2>
              <p className={styles.sectionDesc}>Configurá políticas de autenticación y acceso.</p>
              <div className={styles.formGrid}>
                <div className={styles.fieldWrap}>
                  <label className={styles.fieldLabel}>Expiración del JWT</label>
                  <select className={styles.select} value={security.jwtExpiry} onChange={e=>setSecurity({...security,jwtExpiry:e.target.value})}>
                    <option value="1h">1 hora</option>
                    <option value="4h">4 horas</option>
                    <option value="8h">8 horas</option>
                    <option value="24h">24 horas</option>
                  </select>
                </div>
                <Field label="Máximo de sesiones simultáneas" value={security.maxSessions} onChange={v=>setSecurity({...security,maxSessions:v})} type="number"/>
                <Field label="IP Whitelist (separadas por coma)" value={security.ipWhitelist} onChange={v=>setSecurity({...security,ipWhitelist:v})} hint="Dejá vacío para permitir cualquier IP" mono/>
                <Toggle label="MFA habilitado" desc="Requiere un segundo factor de autenticación." value={security.mfaEnabled} onChange={v=>setSecurity({...security,mfaEnabled:v})}/>
                <Toggle label="Log de auditoría" desc="Registra todos los accesos y acciones críticas." value={security.auditLog} onChange={v=>setSecurity({...security,auditLog:v})}/>
              </div>
            </div>
          )}

          {activeSection === 'Notificaciones' && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Notificaciones</h2>
              <p className={styles.sectionDesc}>Configurá alertas y notificaciones del sistema.</p>
              <div className={styles.formGrid}>
                <Field label="Email de notificaciones" value={notif.email} onChange={v=>setNotif({...notif,email:v})} type="email"/>
                <Toggle label="Alertas de inicio de sesión" desc="Notificá cada acceso exitoso." value={notif.loginAlerts} onChange={v=>setNotif({...notif,loginAlerts:v})}/>
                <Toggle label="Intentos fallidos" desc="Alerta tras 3 intentos fallidos consecutivos." value={notif.failedLogins} onChange={v=>setNotif({...notif,failedLogins:v})}/>
                <Toggle label="Alertas del sistema" desc="Notificaciones de errores críticos." value={notif.systemAlerts} onChange={v=>setNotif({...notif,systemAlerts:v})}/>
              </div>
            </div>
          )}

          {activeSection === 'Cuenta' && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Mi cuenta</h2>
              <p className={styles.sectionDesc}>Información de tu usuario LDAP actual.</p>
              <div className={styles.accountCard}>
                <div className={styles.accountAvatar}>S</div>
                <div>
                  <div className={styles.accountName}>Sofía García</div>
                  <div className={styles.accountUser}>garcia.sofia · IT</div>
                  <div className={styles.accountDn}>cn=garcia.sofia,dc=corp,dc=local</div>
                </div>
              </div>
              <div className={styles.formGrid} style={{marginTop:20}}>
                <div className={styles.infoRow}><span className={styles.infoKey}>Email</span><span className={styles.infoVal}>sofia@corp.local</span></div>
                <div className={styles.infoRow}><span className={styles.infoKey}>Grupos</span><span className={styles.infoVal}>Admins, IT-Team</span></div>
                <div className={styles.infoRow}><span className={styles.infoKey}>Último acceso</span><span className={styles.infoVal}>hoy, 09:14 hs</span></div>
                <div className={styles.infoRow}><span className={styles.infoKey}>Sesiones activas</span><span className={styles.infoVal}>1 de 3 permitidas</span></div>
              </div>
              <button className={styles.btnDanger}>Cerrar todas las sesiones</button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type='text', hint, mono }) {
  return (
    <div className={styles.fieldWrap}>
      <label className={styles.fieldLabel}>{label}</label>
      <input
        className={`${styles.input} ${mono?styles.mono:''}`}
        type={type}
        value={value}
        onChange={e=>onChange(e.target.value)}
      />
      {hint && <span className={styles.fieldHint}>{hint}</span>}
    </div>
  )
}

function Toggle({ label, desc, value, onChange }) {
  return (
    <div className={styles.toggleRow}>
      <div className={styles.toggleInfo}>
        <span className={styles.toggleLabel}>{label}</span>
        <span className={styles.toggleDesc}>{desc}</span>
      </div>
      <button
        className={`${styles.toggle} ${value?styles.toggleOn:''}`}
        onClick={()=>onChange(!value)}
        role="switch"
        aria-checked={value}
      >
        <span className={styles.toggleThumb}/>
      </button>
    </div>
  )
}
