/**
 * app wallpaper storage: images are copied into <data dir>/wallpaper/<hash>.<ext>
 * and referenced by file name only, so a portable folder can be moved freely.
 */
const fss = require('fs/promises')
const { resolve, extname, basename } = require('path')
const crypto = require('crypto')
const { appPath } = require('../common/app-props')

const allowedExt = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.avif']

function wallpaperDir () {
  const dataPath = process.env.DATA_PATH || resolve(appPath, 'electerm')
  return resolve(dataPath, 'wallpaper')
}

// only plain file names produced by importWallpaper are accepted
function safeName (name) {
  const n = basename(String(name || ''))
  return /^[a-f0-9]{16,64}\.[a-z0-9]{2,5}$/.test(n) ? n : ''
}

async function importWallpaper (srcPath) {
  let ext = extname(srcPath || '').toLowerCase()
  if (!allowedExt.includes(ext)) {
    ext = '.img'
  }
  const buf = await fss.readFile(srcPath)
  const hash = crypto.createHash('sha256').update(buf).digest('hex').slice(0, 32)
  const name = hash + ext
  const dir = wallpaperDir()
  await fss.mkdir(dir, { recursive: true })
  await fss.writeFile(resolve(dir, name), buf)
  return name
}

async function readWallpaperAsBase64 (name) {
  const n = safeName(name)
  if (!n) {
    return ''
  }
  const buf = await fss.readFile(resolve(wallpaperDir(), n))
  return buf.toString('base64')
}

async function removeWallpaper (name) {
  const n = safeName(name)
  if (!n) {
    return false
  }
  await fss.unlink(resolve(wallpaperDir(), n)).catch(() => null)
  return true
}

module.exports = {
  wallpaperDir,
  safeName,
  importWallpaper,
  readWallpaperAsBase64,
  removeWallpaper
}
