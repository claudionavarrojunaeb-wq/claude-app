import React from 'react'

const placeholder = (title, emoji) => function Page() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 16, animation: 'fadeUp 0.4s ease' }}>
      <span style={{ fontSize: '3rem' }}>{emoji}</span>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Esta sección está en construcción.</p>
    </div>
  )
}

export const Analytics = placeholder('Analítica', '📊')
export const Users     = placeholder('Usuarios LDAP', '👥')
export const Projects  = placeholder('Proyectos', '📁')
export const Reports   = placeholder('Reportes', '📋')
export const Settings  = placeholder('Configuración', '⚙️')
