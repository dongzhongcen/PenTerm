/**
 * simple self-drawn OS marks (generic shapes, no product artwork)
 */

const colors = {
  ubuntu: '#e95420',
  centos: '#9c5fb5',
  rocky: '#10b981',
  debian: '#d70a53',
  windows: '#38bdf8',
  mac: '#cbd5e1',
  linux: '#facc15',
  other: '#94a3b8'
}

export function detectOs (item = {}) {
  const s = [item.title, item.description, item.host, item.username]
    .filter(Boolean).join(' ').toLowerCase()
  if (/ubuntu/.test(s)) return 'ubuntu'
  if (/centos|rhel|redhat/.test(s)) return 'centos'
  if (/rocky|alma/.test(s)) return 'rocky'
  if (/debian/.test(s)) return 'debian'
  if (/win/.test(s) || item.type === 'rdp') return 'windows'
  if (/mac|darwin|osx/.test(s)) return 'mac'
  if (!item.type || item.type === 'ssh' || item.type === 'telnet') return 'linux'
  return 'other'
}

function Shape ({ os, c }) {
  switch (os) {
    case 'ubuntu':
      return (
        <g fill='none' stroke={c} strokeWidth='2'>
          <circle cx='12' cy='12' r='6' />
          <circle cx='12' cy='4' r='2' fill={c} />
          <circle cx='5' cy='16' r='2' fill={c} />
          <circle cx='19' cy='16' r='2' fill={c} />
        </g>
      )
    case 'centos':
      return (
        <g fill={c}>
          <rect x='4' y='4' width='7' height='7' rx='1' />
          <rect x='13' y='4' width='7' height='7' rx='1' opacity='0.7' />
          <rect x='4' y='13' width='7' height='7' rx='1' opacity='0.7' />
          <rect x='13' y='13' width='7' height='7' rx='1' />
        </g>
      )
    case 'rocky':
      return <path d='M3 19 L9 8 L13 14 L16 10 L21 19 Z' fill={c} />
    case 'debian':
      return <path d='M12 4a8 8 0 1 0 6 13a6 6 0 1 1-6-9' fill='none' stroke={c} strokeWidth='2.2' strokeLinecap='round' />
    case 'windows':
      return (
        <g fill={c}>
          <rect x='4' y='4' width='7.5' height='7.5' />
          <rect x='12.5' y='4' width='7.5' height='7.5' />
          <rect x='4' y='12.5' width='7.5' height='7.5' />
          <rect x='12.5' y='12.5' width='7.5' height='7.5' />
        </g>
      )
    case 'mac':
      return <rect x='4' y='5' width='16' height='12' rx='2' fill='none' stroke={c} strokeWidth='2' />
    case 'linux':
      return (
        <g fill='none' stroke={c} strokeWidth='2' strokeLinecap='round'>
          <rect x='3' y='4' width='18' height='16' rx='2' />
          <path d='M7 10 L10 12 L7 14' />
          <path d='M12 15 H16' />
        </g>
      )
    default:
      return <circle cx='12' cy='12' r='7' fill='none' stroke={c} strokeWidth='2' />
  }
}

export default function OsIcon ({ item }) {
  const os = detectOs(item)
  return (
    <svg className='cc-os-icon' width='20' height='20' viewBox='0 0 24 24' aria-label={os}>
      <title>{os}</title>
      <Shape os={os} c={colors[os]} />
    </svg>
  )
}
