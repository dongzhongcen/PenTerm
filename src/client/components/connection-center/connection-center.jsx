/**
 * connection center: group tree + bookmark table over existing bookmark data
 */

import { useState } from 'react'
import { auto } from 'manate/react'
import { Modal, Table, Input, Dropdown, Button, Space, Tag, Tooltip } from 'antd'
import {
  StarFilled,
  StarOutlined,
  CopyOutlined,
  MoreOutlined,
  SearchOutlined
} from '@ant-design/icons'
import deepCopy from 'json-deep-copy'
import uid from '../../common/uid'
import { settingMap } from '../../common/constants'
import { getItemJSON, setItemJSON } from '../../common/safe-local-storage'
import findBookmarkGroupId from '../../common/find-bookmark-group-id'
import { copy as copyText } from '../../common/clipboard'
import OsIcon from './os-icon'
import t from './i18n'
import { STAR_KEY, selectBookmarks, orderGroups, historyStats } from './data'
import './connection-center.styl'

export default auto(function ConnectionCenter ({ open, onClose }) {
  const { store } = window
  const [groupKey, setGroupKey] = useState('all')
  const [keyword, setKeyword] = useState('')
  const [starred, setStarred] = useState(() => getItemJSON(STAR_KEY, []) || [])
  if (!open) {
    return null
  }
  const bookmarks = store.bookmarks || []
  const groups = store.bookmarkGroups || []
  const history = store.config.disableConnectionHistory ? [] : (store.history || [])

  const toggleStar = (id) => {
    const next = starred.includes(id)
      ? starred.filter(d => d !== id)
      : [...starred, id]
    setStarred(next)
    setItemJSON(STAR_KEY, next)
  }

  const connect = (item) => {
    store.onSelectBookmark(item.id)
    onClose()
  }

  const edit = (item) => {
    onClose()
    store.openBookmarkEdit(item)
  }

  const duplicate = (item) => {
    const nb = deepCopy(item)
    nb.id = uid()
    nb.title = (item.title || item.host || '') + '(1)'
    const gid = findBookmarkGroupId(groups, item.id)
    store.addItem(nb, settingMap.bookmarks)
    const g = groups.find(g => g.id === gid)
    if (g) {
      store.editItem(g.id, {
        bookmarkIds: [...(g.bookmarkIds || []), nb.id]
      }, settingMap.bookmarkGroups)
    }
  }

  const del = (item) => {
    Modal.confirm({
      title: t('delConfirm'),
      content: item.title || item.host,
      onOk: () => {
        store.onDelItem(item, settingMap.bookmarks)
        store.delItem(item, settingMap.bookmarks)
      }
    })
  }

  const stats = historyStats(history)
  const builtin = [
    { key: 'all', title: t('all'), count: bookmarks.length },
    { key: 'starred', title: t('starred'), count: bookmarks.filter(b => starred.includes(b.id)).length },
    { key: 'recent', title: t('recent'), count: bookmarks.filter(b => stats[b.id]).length },
    { key: 'frequent', title: t('frequent'), count: bookmarks.filter(b => stats[b.id]).length }
  ]

  const list = selectBookmarks({ bookmarks, groups, groupKey, starred, history, keyword })

  const columns = [
    {
      title: '',
      key: 'star',
      width: 36,
      render: (_, r) => {
        const on = starred.includes(r.id)
        const Icon = on ? StarFilled : StarOutlined
        return (
          <Tooltip title={t('star')}>
            <Icon
              className={'pointer cc-star' + (on ? ' on' : '')}
              onClick={() => toggleStar(r.id)}
            />
          </Tooltip>
        )
      }
    },
    {
      title: '',
      key: 'os',
      width: 36,
      render: (_, r) => <OsIcon item={r} />
    },
    {
      title: t('name'),
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
      render: (v, r) => (
        <span className='pointer cc-name' onDoubleClick={() => connect(r)}>
          {v || r.host || r.url || r.id}
        </span>
      )
    },
    {
      title: t('host'),
      key: 'host',
      ellipsis: true,
      render: (_, r) => {
        const h = r.host || r.url || ''
        if (!h) {
          return '-'
        }
        const text = r.port ? `${h}:${r.port}` : h
        return (
          <span className='cc-host'>
            <span>{text}</span>
            <CopyOutlined
              className='pointer mg1l cc-copy'
              onClick={() => copyText(h)}
            />
          </span>
        )
      }
    },
    {
      title: t('tags'),
      key: 'tags',
      ellipsis: true,
      render: (_, r) => (
        <span>
          {r.type ? <Tag>{r.type}</Tag> : null}
          {r.username ? <Tag>{r.username}</Tag> : null}
          {r.description ? <span className='cc-desc'>{r.description}</span> : null}
        </span>
      )
    },
    {
      title: t('actions'),
      key: 'actions',
      width: 210,
      render: (_, r) => {
        const items = [
          { key: 'dup', label: t('duplicate'), onClick: () => duplicate(r) },
          { key: 'del', label: t('del'), danger: true, onClick: () => del(r) }
        ]
        return (
          <Space size={4}>
            <Button size='small' type='primary' onClick={() => connect(r)}>{t('connect')}</Button>
            <Button size='small' onClick={() => edit(r)}>{t('edit')}</Button>
            <Dropdown menu={{ items }} trigger={['click']}>
              <Button size='small' icon={<MoreOutlined />}>{t('more')}</Button>
            </Dropdown>
          </Space>
        )
      }
    }
  ]

  const renderGroupItem = (key, title, count, depth = 0) => (
    <div
      key={key}
      className={'cc-group pointer' + (groupKey === key ? ' active' : '')}
      style={{ paddingLeft: 12 + depth * 14 }}
      onClick={() => setGroupKey(key)}
    >
      <span className='cc-group-title'>{title}</span>
      <span className='cc-count'>{count}</span>
    </div>
  )

  return (
    <Modal
      open
      title={t('title')}
      onCancel={onClose}
      footer={null}
      width='88%'
      className='connection-center-modal'
      destroyOnHidden
    >
      <div className='connection-center'>
        <div className='cc-left'>
          {builtin.map(b => renderGroupItem(b.key, b.title, b.count))}
          <div className='cc-sep'>{t('groups')}</div>
          {orderGroups(groups).map(({ group, depth }) =>
            renderGroupItem(group.id, group.title, (group.bookmarkIds || []).length, depth)
          )}
        </div>
        <div className='cc-right'>
          <Input
            allowClear
            prefix={<SearchOutlined />}
            placeholder={t('search')}
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            className='mg1b'
          />
          <Table
            size='small'
            rowKey='id'
            columns={columns}
            dataSource={list}
            pagination={list.length > 50 ? { pageSize: 50 } : false}
            locale={{ emptyText: t('empty') }}
            scroll={{ y: 'calc(70vh - 120px)' }}
          />
        </div>
      </div>
    </Modal>
  )
})
