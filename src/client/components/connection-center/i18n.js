/**
 * connection center labels (zh + en), kept local so no locale package change is needed
 */

const zh = {
  title: '连接中心',
  all: '全部',
  starred: '收藏',
  recent: '最近',
  frequent: '常用',
  groups: '分组',
  search: '搜索名称或主机',
  name: '名称',
  host: '主机地址',
  tags: '信息',
  actions: '操作',
  connect: '连接',
  edit: '编辑',
  more: '更多',
  duplicate: '复制一份',
  del: '删除',
  delConfirm: '确定删除该书签？',
  copied: '已复制',
  star: '收藏/取消收藏',
  empty: '暂无书签',
  latency: '延迟',
  glass: '青岚主题毛玻璃效果',
  wallpaper: '应用背景图片（整个界面）',
  chooseImage: '选择图片',
  clear: '清除',
  wallpaperNone: '未设置（使用青岚渐变）',
  wallpaperBlur: '背景模糊',
  wallpaperDim: '背景变暗'
}

const en = {
  title: 'Connection Center',
  all: 'All',
  starred: 'Starred',
  recent: 'Recent',
  frequent: 'Frequent',
  groups: 'Groups',
  search: 'Search name or host',
  name: 'Name',
  host: 'Host',
  tags: 'Info',
  actions: 'Actions',
  connect: 'Connect',
  edit: 'Edit',
  more: 'More',
  duplicate: 'Duplicate',
  del: 'Delete',
  delConfirm: 'Delete this bookmark?',
  copied: 'Copied',
  star: 'Star / unstar',
  empty: 'No bookmarks',
  latency: 'Latency',
  glass: 'Glass effect for Qinglan theme',
  wallpaper: 'App wallpaper (whole UI)',
  chooseImage: 'Choose image',
  clear: 'Clear',
  wallpaperNone: 'Not set (Qinglan gradient)',
  wallpaperBlur: 'Wallpaper blur',
  wallpaperDim: 'Wallpaper dim'
}

export function isZh () {
  const lang = window.store?.config?.language || window.initLanguage || ''
  return /^zh/i.test(lang)
}

export default function t (key) {
  const map = isZh() ? zh : en
  return map[key] || en[key] || key
}
