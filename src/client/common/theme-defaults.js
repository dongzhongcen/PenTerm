/**
 * database default should init
 */

function parsor (themeTxt) {
  return themeTxt.split('\n').reduce((prev, line) => {
    let [key = '', value = ''] = line.split('=')
    key = key.trim()
    value = value.trim()
    if (!key || !value) {
      return prev
    }
    prev[key] = value
    return prev
  }, {})
}

const defaultThemeDark = () => {
  return parsor(`
main-dark=#000
main-light=#2E3338
text=#ddd
text-light=#fff
text-dark=#888
text-disabled=#777
primary=#08c
info=#FFD166
success=#06D6A0
error=#EF476F
warn=#E55934
main=#121214
  `)
}
const defaultThemeLightFunc = () => {
  return parsor(`
      main=#ededed
      main-dark=#cccccc
      main-light=#fefefe
      text=#555
      text-light=#777
      text-dark=#444
      text-disabled=#888
      primary=#08c
      info=#FFD166
      success=#06D6A0
      error=#EF476F
      warn=#E55934
    `)
}

const defaultThemeLightTerminal = () => {
  return parsor(`
background=#121214
foreground=#af9a91
cursor=#af9a91
selectionBackground=#575256
cursorAccent=#121214
black=#572100
red=#ba3934
green=#91773f
yellow=#b55600
blue=#5f63b4
magenta=#a17c7b
cyan=#8faea9
white=#af9a91
brightBlack=#4e4b61
brightRed=#d9443f
brightGreen=#d6b04e
brightYellow=#f66813
brightBlue=#8086ef
brightMagenta=#e2c2bb
brightCyan=#a4dce7
brightWhite=#d2c7a9
    `
  )
}

const defaultThemeDarkTerminal = () => {
  return {
    foreground: '#bbbbbb',
    background: '#20111b',
    cursor: '#b5bd68',
    cursorAccent: '#1d1f21',
    selectionBackground: 'rgba(200, 200, 200, 0.6)',
    black: '#575757',
    red: '#FF2C6D',
    green: '#19f9d8',
    yellow: '#FFB86C',
    blue: '#45A9F9',
    magenta: '#FF75B5',
    cyan: '#B084EB',
    white: '#CDCDCD',
    brightBlack: '#757575',
    brightRed: '#FF2C6D',
    brightGreen: '#19f9d8',
    brightYellow: '#FFCC95',
    brightBlue: '#6FC1FF',
    brightMagenta: '#FF9AC1',
    brightCyan: '#BCAAFE',
    brightWhite: '#E6E6E6'
  }
}


const qinglanUi = () => {
  return parsor(`
main=#0a1e28
main-dark=#06141c
main-light=#143642
text=#c8e6e8
text-light=#e8f7f8
text-dark=#7aa8b0
text-disabled=#5a7a82
primary=#2ec4d6
info=#5eead4
success=#34d399
error=#f87171
warn=#fbbf24
  `)
}

const qinglanTerminal = () => {
  return {
    foreground: '#d2eef0',
    background: '#0a1e28',
    cursor: '#5eead4',
    cursorAccent: '#0a1e28',
    selectionBackground: 'rgba(46, 196, 214, 0.35)',
    black: '#0d2a34',
    red: '#f87171',
    green: '#34d399',
    yellow: '#fbbf24',
    blue: '#38bdf8',
    magenta: '#a78bfa',
    cyan: '#2ec4d6',
    white: '#c8e6e8',
    brightBlack: '#4a7080',
    brightRed: '#fca5a5',
    brightGreen: '#6ee7b7',
    brightYellow: '#fcd34d',
    brightBlue: '#7dd3fc',
    brightMagenta: '#c4b5fd',
    brightCyan: '#67e8f9',
    brightWhite: '#f0fdfa'
  }
}

export const defaultThemeId = 'default'
export const defaultThemeLightId = 'defaultLight'

export function defaultTheme () {
  return {
    id: defaultThemeId,
    name: 'default',
    themeConfig: defaultThemeDarkTerminal(),
    uiThemeConfig: defaultThemeDark()
  }
}

export function defaultThemeLight () {
  return {
    id: defaultThemeLightId,
    name: 'default light',
    themeConfig: defaultThemeLightTerminal(),
    uiThemeConfig: defaultThemeLightFunc()
  }
}


export const qinglanThemeId = 'qinglan'

/** Built-in cyan–teal theme (青岚). Soft navy UI + cyan accents. */
export function qinglanTheme () {
  return {
    id: qinglanThemeId,
    name: '青岚 Qinglan',
    themeConfig: qinglanTerminal(),
    uiThemeConfig: qinglanUi()
  }
}
