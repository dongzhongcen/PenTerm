const { describe, it, before, after } = require('node:test')
const assert = require('node:assert/strict')
const path = require('node:path')
const Module = require('node:module')

const wallpaperPath = require.resolve('../../../src/app/lib/wallpaper')
const electronPath = 'electron'

describe('wallpaper (no electron in server child)', () => {
  let savedDataPath
  let wallpaper
  let electronRequired

  before(() => {
    savedDataPath = process.env.DATA_PATH
    // Clear any prior load so we can observe a fresh require.
    delete require.cache[wallpaperPath]
    electronRequired = false
    const orig = Module._load
    Module._load = function (request, parent, isMain) {
      if (request === electronPath) {
        electronRequired = true
        throw new Error('electron must not be required from wallpaper')
      }
      return orig.apply(this, arguments)
    }
    try {
      wallpaper = require(wallpaperPath)
    } finally {
      Module._load = orig
    }
  })

  after(() => {
    if (savedDataPath === undefined) {
      delete process.env.DATA_PATH
    } else {
      process.env.DATA_PATH = savedDataPath
    }
    delete require.cache[wallpaperPath]
  })

  it('requiring wallpaper does not load electron', () => {
    assert.equal(electronRequired, false)
    assert.equal(typeof wallpaper.wallpaperDir, 'function')
  })

  it('wallpaperDir uses DATA_PATH when set', () => {
    const base = path.join(path.sep, 'tmp', 'wallpaper-data-test')
    process.env.DATA_PATH = base
    assert.equal(
      wallpaper.wallpaperDir(),
      path.resolve(base, 'wallpaper')
    )
  })

  it('resolveDataPath returns DATA_PATH when set', () => {
    const base = path.join(path.sep, 'tmp', 'wallpaper-data-test-2')
    process.env.DATA_PATH = base
    assert.equal(wallpaper.resolveDataPath(), base)
  })

  it('safeName accepts hash.ext names only', () => {
    assert.equal(
      wallpaper.safeName('abcdef0123456789abcdef0123456789.png'),
      'abcdef0123456789abcdef0123456789.png'
    )
    assert.equal(wallpaper.safeName('../etc/passwd'), '')
    assert.equal(wallpaper.safeName(''), '')
  })
})
