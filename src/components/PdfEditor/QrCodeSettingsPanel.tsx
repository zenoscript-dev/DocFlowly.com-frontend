import { GripVertical, QrCode, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

interface QrCodeSettingsPanelProps {
  url: string
  viewBox?: string
  onUpdate: (updates: { url?: string; size?: number }) => void
  onClose?: () => void
}

// Improved URL validator: allow http(s) and optionally "www.", allow domain-only with TLD, block partials, block invalid chars
function isValidUrl(input: string): boolean {
  if (!input || typeof input !== 'string') return false
  const raw = input.trim()
  if (raw.length < 4) return false

  // Accept standard URLs (with http/https/etc.)
  try {
    const url = new URL(raw)
    // Accept only http/https schemes, optionally add support for others if needed
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return !!url.hostname && !!url.host.match(/\./)
    }
  } catch {
    // Empty on purpose: will try next regex
  }

  // Accept "www.example.com[/...]" (no protocol, but looks like a real domain)
  // Must have at least one dot (.) in the domain part, not start/end with dot, and only allow a reasonable set of chars.
  const wwwDomainRe = /^(www\.)?[a-zA-Z0-9][a-zA-Z0-9\-\u0100-\uffff]*(\.[a-zA-Z0-9\-\u0100-\uffff]+)+([:/?#][^\s]*)?$/
  if (wwwDomainRe.test(raw)) return true

  return false
}

function normalizeUrlStr(input: string): string | null {
  if (!input || typeof input !== 'string') return null
  const raw = input.trim()
  if (!isValidUrl(raw)) return null
  try {
    // If already has http/https, normalize as full URL
    return new URL(raw).href
  } catch {
    // Otherwise, treat as www.foo.com or example.com: add https:// prefix and try again
    try {
      return new URL('https://' + raw).href
    } catch {
      return null
    }
  }
}

const QrCodeSettingsPanel = ({ url, onUpdate, onClose }: QrCodeSettingsPanelProps) => {
  const [localUrl, setLocalUrl] = useState(url)
  const [urlError, setUrlError] = useState<string>('')
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStartPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    setLocalUrl(url)
  }, [url])

  // Drag to move (same pattern as PageSettingsPanel)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    setPosition({
      x: e.clientX - dragStartPos.current.x,
      y: e.clientY - dragStartPos.current.y
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging])

  return (
    <div
      className="fixed h-fit w-96 right-4 top-20 bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col text-black"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b cursor-grab active:cursor-grabbing" onMouseDown={handleMouseDown}>
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-gray-400" />
          <QrCode className="w-5 h-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-black">QR Code</h2>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      <form
        className="flex-1 flex flex-col h-full"
        onSubmit={e => {
          e.preventDefault()
          const normalized = normalizeUrlStr(localUrl)
          if (!normalized) {
            setUrlError('Please enter a valid URL (e.g., https://example.com or www.example.com)')
            return
          }
          setLocalUrl(normalized)
          onUpdate({ url: normalized })
          if (onClose) onClose()
        }}
      >
        {/* Body */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {/* URL */}
          <div className="space-y-2">
            <Label className="text-sm text-black">URL <span className="text-xs text-gray-500">(ensure it is a valid URL)</span></Label>
            <Input
              type="text"
              placeholder="https://example.com"
              value={localUrl}
              className={`text-black placeholder:text-gray-400 ${urlError ? 'border-red-500 focus-visible:ring-red-500' : 'border-gray-300'}`}
              onChange={(e) => {
                const v = e.target.value
                setLocalUrl(v)
                if (urlError) setUrlError('')
              }}
              onFocus={e => e.target.select()}
            />
            {urlError && (
              <p className="text-xs text-red-600">{urlError}</p>
            )}
          </div>
          <Button
            type="submit"
            className="px-4 py-2 w-full rounded bg-purple-600 text-white text-sm hover:bg-purple-700"
          >
            Apply
          </Button>
        </div>
      </form>
    </div>
  )
}

export default QrCodeSettingsPanel
