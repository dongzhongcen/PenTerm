/**
 * settings: app-wide wallpaper image, blur and dim
 */

import { Button, Slider, Space } from 'antd'
import Upload from '../common/upload'
import t from '../connection-center/i18n'

export default function AppWallpaperSetting ({ config, onChangeValue }) {
  const path = config.appWallpaperPath || ''
  return (
    <div className='pd2b app-wallpaper-setting'>
      <div className='pd1b'>{t('wallpaper')}</div>
      <Space wrap>
        <Upload
          beforeUpload={(file) => {
            if (file.fileContent !== undefined) {
              return
            }
            const old = path
            window.fs.importWallpaper(file.filePath)
              .then(name => {
                if (!name) return
                onChangeValue(name, 'appWallpaperPath')
                if (old && old !== name) {
                  window.fs.removeWallpaper(old).catch(() => null)
                }
              })
              .catch(err => window.store.onError(err))
          }}
        >
          <Button size='small'>{t('chooseImage')}</Button>
        </Upload>
        <Button
          size='small'
          disabled={!path}
          onClick={() => {
            onChangeValue('', 'appWallpaperPath')
            window.fs.removeWallpaper(path).catch(() => null)
          }}
        >
          {t('clear')}
        </Button>
        <span className='app-wallpaper-path'>{path || t('wallpaperNone')}</span>
      </Space>
      <div className='pd1t'>{t('wallpaperBlur')}</div>
      <Slider
        min={0}
        max={40}
        value={config.appWallpaperBlur || 0}
        onChange={v => onChangeValue(v, 'appWallpaperBlur')}
      />
      <div>{t('wallpaperDim')}</div>
      <Slider
        min={0}
        max={0.9}
        step={0.05}
        value={config.appWallpaperDim ?? 0.3}
        onChange={v => onChangeValue(v, 'appWallpaperDim')}
      />
    </div>
  )
}
