// תפריט נגישות — פאנל נשלף מהצד, בהתאם לתקנות נגישות תשע"ג-2013 / ת"י 5568.
// עוצב בהתאם לווידג'ט הנגישות ב-course.porsimkanaf.com (אותו מבנה, מותאם לפלטת הצבעים של מנכ"לים).
'use client'

import { useState, useEffect, useCallback } from 'react'
import type { SVGProps } from 'react'

const COLORS = {
  bg: '#1e293b',
  line: 'rgba(255,255,255,0.14)',
  hover: 'rgba(255,255,255,0.06)',
  accent: '#38bdf8',
  accentSoft: 'rgba(56,189,248,0.18)',
  text: '#f8fafc',
  textSecondary: '#94a3b8',
  textTertiary: 'rgba(148,163,184,0.8)',
  err: '#fb7185',
  errSoft: 'rgba(251,113,133,0.14)',
  shadow: '0 8px 32px rgba(0,0,0,0.4)',
}

function Icon({ children, size = 18, ...props }: SVGProps<SVGSVGElement> & { size?: number; children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      {children}
    </svg>
  )
}
const AccessibilityIcon = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <Icon {...p}><circle cx="12" cy="4" r="1.8" /><path d="M4 8c5.2 1.3 10.8 1.3 16 0M12 10v5m0 0-3 6m3-6 3 6" /></Icon>
)
const CloseIcon = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <Icon {...p}><path d="M18 6 6 18M6 6l12 12" /></Icon>
)
const SunIcon = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <Icon {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></Icon>
)
const MoonIcon = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <Icon {...p}><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" /></Icon>
)
const ContrastIcon = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor" stroke="none" /></Icon>
)
const EyeIcon = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <Icon {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></Icon>
)
const EyeOffIcon = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <Icon {...p}><path d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.2 4.2M6.6 6.7C4 8.3 2 12 2 12s3.5 7 10 7c1.6 0 3-.3 4.2-.9M9.5 5.2A11 11 0 0 1 12 5c6.5 0 10 7 10 7a14 14 0 0 1-2.2 3" /></Icon>
)
const TypeIcon = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <Icon {...p}><path d="M4 7V4h16v3M12 4v16M9 20h6" /></Icon>
)
const LinkIcon = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <Icon {...p}><path d="M9 15l6-6M8 8l-1 1a4 4 0 0 0 5.7 5.7l1-1M16 16l1-1a4 4 0 0 0-5.7-5.7l-1 1" /></Icon>
)
const CursorIcon = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <Icon {...p}><path d="M5 3l14 9-7 2-3 7z" /></Icon>
)
const BookIcon = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <Icon {...p}><path d="M4 5c3-1.5 6-1.5 8 0v14c-2-1.5-5-1.5-8 0V5ZM20 5c-3-1.5-6-1.5-8 0v14c2-1.5 5-1.5 8 0V5Z" /></Icon>
)
const ResetIcon = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <Icon {...p}><path d="M3 12a9 9 0 1 0 3-6.7M3 4v5h5" /></Icon>
)
const VolumeIcon = (p: SVGProps<SVGSVGElement> & { size?: number }) => (
  <Icon {...p}><path d="M4 9v6h4l5 5V4l-5 5H4ZM16 8a5 5 0 0 1 0 8M19 5a9 9 0 0 1 0 14" /></Icon>
)

interface AccessibilitySettings {
  fontSize: number
  letterSpacing: number
  wordSpacing: number
  lineHeight: number
  highContrast: boolean
  invertedContrast: boolean
  grayscale: boolean
  blackAndWhite: boolean
  highlightLinks: boolean
  highlightHeadings: boolean
  readableFont: boolean
  hideImages: boolean
  stopAnimations: boolean
  largeCursor: boolean
  brightCursor: boolean
  readingGuide: boolean
  screenReaderMode: boolean
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  letterSpacing: 0,
  wordSpacing: 0,
  lineHeight: 100,
  highContrast: false,
  invertedContrast: false,
  grayscale: false,
  blackAndWhite: false,
  highlightLinks: false,
  highlightHeadings: false,
  readableFont: false,
  hideImages: false,
  stopAnimations: false,
  largeCursor: false,
  brightCursor: false,
  readingGuide: false,
  screenReaderMode: false,
}

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings)
  const [readingGuideY, setReadingGuideY] = useState(0)

  useEffect(() => {
    const saved = localStorage.getItem('mankal-accessibility-settings')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setSettings({ ...defaultSettings, ...parsed })
      } catch {
        // Invalid JSON, use defaults
      }
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const body = document.body

    const mainContent = document.getElementById('main-content')
    if (mainContent) {
      mainContent.style.zoom = settings.fontSize !== 100 ? `${settings.fontSize / 100}` : ''
    }
    body.style.letterSpacing = settings.letterSpacing ? `${settings.letterSpacing}px` : ''
    body.style.wordSpacing = settings.wordSpacing ? `${settings.wordSpacing}px` : ''
    body.style.lineHeight = settings.lineHeight !== 100 ? `${(settings.lineHeight * 1.5) / 100}` : ''

    root.classList.toggle('a11y-high-contrast', settings.highContrast)
    root.classList.toggle('a11y-inverted', settings.invertedContrast)
    root.classList.toggle('a11y-grayscale', settings.grayscale)
    root.classList.toggle('a11y-black-white', settings.blackAndWhite)
    body.classList.toggle('a11y-highlight-links', settings.highlightLinks)
    body.classList.toggle('a11y-highlight-headings', settings.highlightHeadings)
    body.classList.toggle('a11y-readable-font', settings.readableFont)
    body.classList.toggle('a11y-hide-images', settings.hideImages)
    body.classList.toggle('a11y-stop-animations', settings.stopAnimations)
    body.classList.toggle('a11y-large-cursor', settings.largeCursor)
    body.classList.toggle('a11y-bright-cursor', settings.brightCursor)
    body.classList.toggle('a11y-screen-reader', settings.screenReaderMode)

    localStorage.setItem('mankal-accessibility-settings', JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    if (!settings.readingGuide) return
    const handleMouseMove = (e: MouseEvent) => setReadingGuideY(e.clientY)
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [settings.readingGuide])

  const updateSetting = useCallback(
    <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }))
    },
    []
  )

  const resetAll = useCallback(() => {
    setSettings(defaultSettings)
    localStorage.removeItem('mankal-accessibility-settings')
    const mainContent = document.getElementById('main-content')
    if (mainContent) mainContent.style.zoom = ''
  }, [])

  const toggleContrast = (mode: 'high' | 'inverted' | 'grayscale' | 'blackWhite') => {
    setSettings((prev) => ({
      ...prev,
      highContrast: mode === 'high' ? !prev.highContrast : false,
      invertedContrast: mode === 'inverted' ? !prev.invertedContrast : false,
      grayscale: mode === 'grayscale' ? !prev.grayscale : false,
      blackAndWhite: mode === 'blackWhite' ? !prev.blackAndWhite : false,
    }))
  }

  const toggleCursor = (mode: 'large' | 'bright') => {
    setSettings((prev) => ({
      ...prev,
      largeCursor: mode === 'large' ? !prev.largeCursor : false,
      brightCursor: mode === 'bright' ? !prev.brightCursor : false,
    }))
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="פתח תפריט נגישות"
        style={{
          position: 'fixed',
          bottom: '92px',
          left: '12px',
          zIndex: 998,
          width: '42px',
          height: '42px',
          background: COLORS.bg,
          border: `1px solid ${COLORS.line}`,
          borderRadius: '50%',
          color: COLORS.accent,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: COLORS.shadow,
        }}
      >
        <AccessibilityIcon size={22} />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden"
          style={{ zIndex: 9998 }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '280px',
            maxWidth: '85vw',
            height: '100vh',
            background: COLORS.bg,
            borderLeft: `1px solid ${COLORS.line}`,
            zIndex: 9999,
            overflowY: 'auto',
            boxShadow: COLORS.shadow,
          }}
        >
          <div
            style={{
              padding: '16px 20px',
              borderBottom: `1px solid ${COLORS.line}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'sticky',
              top: 0,
              background: COLORS.bg,
              zIndex: 1,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AccessibilityIcon size={22} style={{ color: COLORS.accent }} />
              <span style={{ fontWeight: 600, fontSize: '1.1rem', color: COLORS.text }}>הגדרות נגישות</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="סגור תפריט נגישות"
              style={{
                background: COLORS.line,
                border: 'none',
                borderRadius: '8px',
                width: '36px',
                height: '36px',
                color: COLORS.text,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CloseIcon size={20} />
            </button>
          </div>

          <div style={{ padding: '16px 20px' }}>
            <button
              onClick={resetAll}
              style={{
                width: '100%',
                padding: '12px',
                background: COLORS.errSoft,
                border: `1px solid ${COLORS.errSoft}`,
                borderRadius: '10px',
                color: COLORS.err,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '0.9rem',
                fontWeight: 500,
                marginBottom: '20px',
              }}
            >
              <ResetIcon size={16} />
              איפוס הגדרות
            </button>

            <SectionTitle icon={<ContrastIcon size={18} />} title="תצוגה וניגודיות" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
              <ToggleButton active={settings.highContrast} onClick={() => toggleContrast('high')} icon={<SunIcon size={18} />} label="ניגודיות גבוהה" />
              <ToggleButton active={settings.invertedContrast} onClick={() => toggleContrast('inverted')} icon={<MoonIcon size={18} />} label="ניגודיות הפוכה" />
              <ToggleButton active={settings.grayscale} onClick={() => toggleContrast('grayscale')} icon={<EyeIcon size={18} />} label="גווני אפור" />
              <ToggleButton active={settings.blackAndWhite} onClick={() => toggleContrast('blackWhite')} icon={<ContrastIcon size={18} />} label="שחור לבן" />
            </div>

            <SectionTitle icon={<TypeIcon size={18} />} title="טקסט וקריאות" />
            <SliderControl label="גודל טקסט" value={settings.fontSize} min={80} max={150} step={5} unit="%" onChange={(v) => updateSetting('fontSize', v)} />
            <SliderControl label="ריווח בין אותיות" value={settings.letterSpacing} min={0} max={10} step={1} unit="px" onChange={(v) => updateSetting('letterSpacing', v)} />
            <SliderControl label="ריווח בין מילים" value={settings.wordSpacing} min={0} max={20} step={2} unit="px" onChange={(v) => updateSetting('wordSpacing', v)} />
            <SliderControl label="גובה שורה" value={settings.lineHeight} min={100} max={200} step={10} unit="%" onChange={(v) => updateSetting('lineHeight', v)} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
              <ToggleButton active={settings.readableFont} onClick={() => updateSetting('readableFont', !settings.readableFont)} icon={<TypeIcon size={18} />} label="גופן קריא" />
              <ToggleButton active={settings.highlightLinks} onClick={() => updateSetting('highlightLinks', !settings.highlightLinks)} icon={<LinkIcon size={18} />} label="הדגשת קישורים" />
              <ToggleButton active={settings.highlightHeadings} onClick={() => updateSetting('highlightHeadings', !settings.highlightHeadings)} icon={<TypeIcon size={18} />} label="הדגשת כותרות" />
              <ToggleButton active={settings.stopAnimations} onClick={() => updateSetting('stopAnimations', !settings.stopAnimations)} icon={<EyeOffIcon size={18} />} label="ביטול אנימציות" />
            </div>

            <SectionTitle icon={<CursorIcon size={18} />} title="ניווט וסמן" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '20px' }}>
              <ToggleButton active={settings.largeCursor} onClick={() => toggleCursor('large')} icon={<CursorIcon size={18} />} label="סמן גדול" />
              <ToggleButton active={settings.brightCursor} onClick={() => toggleCursor('bright')} icon={<CursorIcon size={18} />} label="סמן גדול בהיר" />
              <ToggleButton active={settings.readingGuide} onClick={() => updateSetting('readingGuide', !settings.readingGuide)} icon={<BookIcon size={18} />} label="מדריך קריאה" />
              <ToggleButton active={settings.hideImages} onClick={() => updateSetting('hideImages', !settings.hideImages)} icon={<EyeOffIcon size={18} />} label="הסתרת תמונות" />
            </div>

            <SectionTitle icon={<VolumeIcon size={18} />} title="קוראי מסך" />
            <ToggleButton active={settings.screenReaderMode} onClick={() => updateSetting('screenReaderMode', !settings.screenReaderMode)} icon={<VolumeIcon size={18} />} label="התאמה לקוראי מסך" fullWidth />

            <div
              style={{
                marginTop: '24px',
                padding: '16px',
                background: COLORS.hover,
                borderRadius: '10px',
                textAlign: 'center',
                fontSize: '0.75rem',
                color: COLORS.textTertiary,
              }}
            >
              <span>מנכ&quot;לים © {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      )}

      {settings.readingGuide && (
        <div
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            top: readingGuideY - 4,
            height: '8px',
            background: COLORS.accentSoft,
            boxShadow: `0 0 0 2px ${COLORS.accentSoft}`,
            pointerEvents: 'none',
            zIndex: 9997,
          }}
        />
      )}
    </>
  )
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', color: COLORS.accent, fontSize: '0.85rem', fontWeight: 600 }}>
      {icon}
      {title}
    </div>
  )
}

function ToggleButton({
  active,
  onClick,
  icon,
  label,
  fullWidth,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
  fullWidth?: boolean
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{
        padding: '12px 10px',
        background: active ? COLORS.accentSoft : COLORS.hover,
        border: `1px solid ${active ? COLORS.accent : COLORS.line}`,
        borderRadius: '10px',
        color: active ? COLORS.accent : COLORS.textSecondary,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        fontSize: '0.75rem',
        fontWeight: 500,
        transition: 'all 0.2s',
        gridColumn: fullWidth ? '1 / -1' : undefined,
      }}
    >
      {icon}
      {label}
    </button>
  )
}

function SliderControl({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  onChange: (value: number) => void
}) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.85rem' }}>
        <span style={{ color: COLORS.textSecondary }}>{label}</span>
        <span style={{ color: COLORS.accent, fontWeight: 600 }}>
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        style={{
          width: '100%',
          height: '6px',
          borderRadius: '3px',
          background: `linear-gradient(to left, ${COLORS.accent} ${((value - min) / (max - min)) * 100}%, ${COLORS.line} 0%)`,
          appearance: 'none',
          cursor: 'pointer',
        }}
      />
    </div>
  )
}
