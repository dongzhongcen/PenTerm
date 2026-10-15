/**
 * connection center pure helpers (src/client/components/connection-center/data.js)
 */

const { describe, it, before } = require('node:test')
const assert = require('node:assert/strict')
const path = require('path')
const { pathToFileURL } = require('url')

let m
before(async () => {
  m = await import(pathToFileURL(path.resolve(__dirname, '../../client/components/connection-center/data.js')).href)
})

const bookmarks = [
  { id: 'a', title: 'web-ubuntu', host: '192.0.2.10' },
  { id: 'b', title: 'db', host: '192.0.2.20' },
  { id: 'c', title: 'cache', host: '192.0.2.30' }
]
const groups = [
  { id: 'g1', title: 'prod', bookmarkIds: ['a', 'b'], bookmarkGroupIds: ['g2'] },
  { id: 'g2', title: 'child', bookmarkIds: ['c'] }
]
const history = [
  { tab: { srcId: 'b' }, time: 100, count: 5 },
  { tab: { srcId: 'c' }, time: 200, count: 1 },
  { tab: { host: '192.0.2.99' }, time: 300, count: 9 }
]

describe('connection center data', () => {
  it('filters by name and host', () => {
    assert.deepEqual(m.filterBySearch(bookmarks, 'UBU').map(b => b.id), ['a'])
    assert.deepEqual(m.filterBySearch(bookmarks, '192.0.2.2').map(b => b.id), ['b'])
    assert.equal(m.filterBySearch(bookmarks, '').length, 3)
  })
  it('selects groups, starred, recent, frequent', () => {
    const s = (groupKey, extra = {}) => m.selectBookmarks({ bookmarks, groups, history, groupKey, ...extra }).map(b => b.id)
    assert.deepEqual(s('all'), ['a', 'b', 'c'])
    assert.deepEqual(s('g1'), ['a', 'b'])
    assert.deepEqual(s('starred', { starred: ['c'] }), ['c'])
    assert.deepEqual(s('recent'), ['c', 'b'])
    assert.deepEqual(s('frequent'), ['b', 'c'])
    assert.deepEqual(s('g1', { keyword: 'db' }), ['b'])
  })
  it('orders groups as a tree', () => {
    assert.deepEqual(m.orderGroups(groups).map(d => [d.group.id, d.depth]), [['g1', 0], ['g2', 1]])
  })
})
