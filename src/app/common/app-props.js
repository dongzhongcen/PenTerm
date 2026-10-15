/**
 * app path
 * Portable (Windows): data lives next to the exe under a "penterm" folder
 * when installSrc is win-x64-portable.tar.gz or that folder already exists.
 * SSH keys still default to ~/.ssh (not bundled with the portable package).
 */
const { app } = require('electron')
const { resolve, dirname, join } = require('path')
const constants = require('./runtime-constants')
const installSrc = require('../lib/install-src')

function getDataPath () {
  const defaultValue = {
    appPath: app.getPath('appData'),
    isPortable: false
  }
  if (!constants.isWin) {
    return defaultValue
  }
  const exeFull = app.getPath('exe')
  const exePath = dirname(exeFull)
  // Data dir name matches package.json "name" (penterm)
  const p = join(exePath, 'penterm')
  if (
    installSrc === 'win-x64-portable.tar.gz' ||
    require('fs').existsSync(p)
  ) {
    return {
      appPath: exePath,
      exePath,
      isPortable: true
    }
  }
  return {
    ...defaultValue,
    exePath
  }
}

module.exports = {
  ...getDataPath(),
  sshKeysPath: resolve(
    app.getPath('home'),
    '.ssh'
  ),
  ...constants
}
