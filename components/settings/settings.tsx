// components/settings/Settings.tsx
import React, { useState, useEffect, useCallback } from 'react'
import styles from './settings.module.css'
import {
  DeviceConfig,
  WindowsConfig,
  AndroidConfig,
} from '@/types/types/settings.type'
import { getDeviceConfig , saveDeviceConfig  } from '@/apis/client-side/device-settigns'

const PASSWORD = '10052'

const Settings: React.FC = () => {
  const deviceId = '1'
  const [group, setGroup] = useState<'windows' | 'android'>('windows')
  const [config, setConfig] = useState<DeviceConfig | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditable, setIsEditable] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [isSaving, setSaving] = useState(false)

  /* ─────── טעינה מחדש בכל שינוי group ─────── */
  useEffect(() => {
    setLoading(true)
    setError(null)
    getDeviceConfig(deviceId, group)
      .then(cfg => {
        setConfig(cfg)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setError('Failed to load config')
        setLoading(false)
      })
  }, [deviceId, group])

  /* ─────── פתיחה / נעילה ─────── */
  const toggleEdit = useCallback(() => {
    if (isEditable) {
      setIsEditable(false)
      setPasswordInput('')
    } else if (passwordInput === PASSWORD) {
      setIsEditable(true)
      setPasswordInput('')
    } else {
      alert('סיסמה שגויה')
    }
  }, [isEditable, passwordInput])

  /* ─────── שינוי שדה כללי ─────── */
  const handleFieldChange = <K extends keyof DeviceConfig>(
    key: K,
    value: DeviceConfig[K],
  ) => {
    if (!config) return
    setConfig({ ...config, [key]: value })
  }

  /* ─────── Windows - layers ─────── */
  const handleLayerChange = (idx: number, newName: string) => {
    if (!config || config.group !== 'windows') return
    const layers = [...config.layers]
    layers[idx] = { layerName: newName }
    setConfig({ ...config, layers })
  }
  const addLayer = () => {
    if (!config || config.group !== 'windows') return
    setConfig({ ...config, layers: [...config.layers, { layerName: '' }] })
  }

  /* ─────── שמירה ─────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!config) return
    setSaving(true)
    try {
      await saveDeviceConfig({ ...config, group } as DeviceConfig)
      setIsEditable(false)
    } catch (err) {
      console.error(err)
      setError('Failed to save')
    } finally {
      setSaving(false)
    }
  }

  /* ─────── UI טעינה/שגיאה ─────── */
  if (loading) return <div>Loading settings…</div>
  if (error) return <div style={{ color: 'red' }}>{error}</div>
  if (!config) return null

  /* ─────── רשימות שדות ─────── */
  const baseNumeric = [
    'deliveryTimeoutMins',
    'downloadRetryTime',
    'downloadTimeoutMins',
    'MaxMapAreaSqKm',
    'maxMapSizeInMB',
    'maxParallelDownloads',
    'minAvailableSpaceMB',
    'periodicInventoryIntervalMins',
    'periodicConfIntervalMins',
    'periodicMatomoIntervalMins',
    'mapMinInclusionInPercentages',
  ] as const

  const windowsNumeric = [
    'queryStatusIntervalSec',
    'networkStatusIntervalMins',
    'tcpStreamTimeoutSec',
  ] as const

  const androidNumeric = [
    'sdInventoryMaxSizeMB',
    'flashInventoryMaxSizeMB',
  ] as const

  const baseText = ['matomoUrl', 'matomoDimensionId', 'matomoSiteId'] as const

  const windowsText = ['technicianPassword'] as const

  const androidPaths = [
    'sdStoragePath',
    'flashStoragePath',
    'ortophotoMapPath',
    'controlMapPath',
  ] as const

  /* ─────── helper renderers ─────── */
  const renderNumber = (key: keyof DeviceConfig, label: string) => (
    <div className={styles['form-group']} key={key}>
      <label htmlFor={key}>{label}</label>
      <input
        id={key}
        type="number"
        value={(config as any)[key] ?? ''}
        disabled={!isEditable}
        onChange={e => handleFieldChange(key, Number(e.target.value) as any)}
      />
    </div>
  )

  const renderText = (key: keyof DeviceConfig, label: string, type = 'text') => (
    <div className={styles['form-group']} key={key}>
      <label htmlFor={key}>{label}</label>
      <input
        id={key}
        type={type}
        value={(config as any)[key] ?? ''}
        disabled={!isEditable}
        onChange={e => handleFieldChange(key, e.target.value as any)}
      />
    </div>
  )

  const renderDate = (key: keyof DeviceConfig, label: string) => (
    <div className={styles['form-group']} key={key}>
      <label htmlFor={key}>{label}</label>
      <input
        id={key}
        type="datetime-local"
        value={(config as any)[key].replace('Z', '')}
        disabled={!isEditable}
        onChange={e => handleFieldChange(key, e.target.value as any)}
      />
    </div>
  )

  /* ─────── JSX ─────── */
  return (
    <form className={styles['config-form']} onSubmit={handleSubmit}>
      <h2 className={styles['config-title']}>עריכת קונפיג ({group})</h2>

      {/* בחירת group */}
      <div className={styles['form-group']}>
        <label htmlFor="group-select">Group</label>
        <select
          id="group-select"
          value={group}
          onChange={e => setGroup(e.target.value as 'windows' | 'android')}
          disabled={isEditable}
        >
          <option value="windows">windows</option>
          <option value="android">android</option>
        </select>
      </div>

      {/* נעילה / פתיחה */}
      <div className={styles['unlock-row']}>
        {!isEditable && (
          <input
            type="password"
            placeholder="סיסמה לפתיחת עריכה"
            value={passwordInput}
            onChange={e => setPasswordInput(e.target.value)}
          />
        )}
        <button type="button" className={styles['unlock-btn']} onClick={toggleEdit}>
          {isEditable ? 'נעל עריכה' : 'פתח עריכה'}
        </button>
      </div>

      {/* ─────── שדות משותפים (מספריים) ─────── */}
      {baseNumeric.map(k =>
        renderNumber(k, k.replace(/([A-Z])/g, ' $1').trim()),
      )}

      {/* ─────── שדות משותפים (טקסט) ─────── */}
      {baseText.map(k => renderText(k, k))}

      {/* ─────── תאריכים ─────── */}
      {renderDate('lastConfigUpdateDate', 'Last Config Update')}
      {renderDate('lastCheckingMapUpdatesDate', 'Last Checking Map Updates')}

      {/* ─────── Windows ׀ שדות ייחודיים ─────── */}
      {config.group === 'windows' && (
        <>
          {/* layers */}
          <div className={styles['form-group']}>
            <label>Layers</label>
            {config.layers.map((l, i) => (
              <input
                key={i}
                type="text"
                value={l.layerName}
                disabled={!isEditable}
                onChange={e => handleLayerChange(i, e.target.value)}
                className={styles['layer-input']}
              />
            ))}
            {isEditable && (
              <button
                type="button"
                className={styles['add-layer-btn']}
                onClick={addLayer}
              >
                הוסף שכבה
              </button>
            )}
          </div>

          {/* getAppServerUrls */}
          <div className={styles['form-group']}>
            <label htmlFor="getAppServerUrls">GetApp Server URLs</label>
            <textarea
              id="getAppServerUrls"
              value={JSON.stringify(config.getAppServerUrls, null, 2)}
              disabled={!isEditable}
              onChange={e =>
            handleFieldChange(
              'getAppServerUrls' as keyof WindowsConfig as keyof DeviceConfig,
              JSON.parse(e.target.value)
            )              }
            />
          </div>

          {/* numeric */}
          {windowsNumeric.map(k =>
            renderNumber(k as keyof DeviceConfig, k.replace(/([A-Z])/g, ' $1').trim()),
          )}

          {/* technicianPassword
          {renderText('technicianPassword', 'Technician Password', 'password')} */}
        </>
      )}

      {/* ─────── Android ׀ שדות ייחודיים ─────── */}
      {config.group === 'android' && (
        <>
          {/* Storage policy */}
          <div className={styles['form-group']}>
            <label htmlFor="targetStoragePolicy">Target Storage Policy</label>
            <select
              id="targetStoragePolicy"
              value={config.targetStoragePolicy}
              disabled={!isEditable}
              onChange={e =>
                handleFieldChange(
                  'targetStoragePolicy' as keyof AndroidConfig as keyof DeviceConfig,
                  e.target.value as AndroidConfig['targetStoragePolicy'],
                )
              }
            >
              <option value="SDOnly">SDOnly</option>
              <option value="FlashOnly">FlashOnly</option>
              <option value="Both">Both</option>
            </select>
          </div>

          {/* paths */}
          {androidPaths.map(k => renderText(k as keyof DeviceConfig, k))}

          {/* numeric */}
          {androidNumeric.map(k =>
            renderNumber(k as keyof DeviceConfig, k.replace(/([A-Z])/g, ' $1').trim()),
          )}
        </>
      )}

      {/* ─────── כפתורים ─────── */}
      <div className={styles['form-buttons']}>
        <button className={styles['submit-btn']} disabled={!isEditable || isSaving}>
          {isSaving ? 'שומר…' : 'שמור'}
        </button>
        <button
          type="button"
          className={styles['reset-btn']}
          disabled={!isEditable}
          onClick={() => setGroup(prev => prev)} // רענון
        >
          ביטול שינויים
        </button>
      </div>
    </form>
  )
}

export default Settings
