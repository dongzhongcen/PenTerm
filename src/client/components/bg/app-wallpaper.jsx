/**
 * app-wide wallpaper behind the whole UI (config.appWallpaperPath)
 */

import { useEffect, useState } from 'react'

export default function AppWallpaper ({ path, blur = 0, dim = 0 }) {
  const [src, setSrc] = useState('')
  useEffect(() => {
    let alive = true
    if (!path) {
      setSrc('')
      return
    }
    if (/^https?:\/\//.test(path)) {
      setSrc(path)
      return
    }
    window.fs.readFileAsBase64(path)
      .then(c => alive && setSrc(c ? `data:image;base64,${c}` : ''))
      .catch(() => alive && setSrc(''))
    return () => { alive = false }
  }, [path])
  if (!src) {
    return null
  }
  return (
    <div className='app-wallpaper'>
      <div
        className='app-wallpaper-img'
        style={{
          backgroundImage: `url("${src}")`,
          filter: blur ? `blur(${blur}px)` : 'none',
          transform: blur ? 'scale(1.05)' : 'none'
        }}
      />
      <div
        className='app-wallpaper-dim'
        style={{ background: `rgba(0, 0, 0, ${dim})` }}
      />
    </div>
  )
}
