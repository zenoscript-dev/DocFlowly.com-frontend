import { ChevronDown, ChevronUp, Eye, EyeOff, GripVertical, SlidersHorizontal } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

interface PageSettingsPanelProps {
  selectedPageId: string | null
  onClose?: () => void
  initialMargins?: { top: number; right: number; bottom: number; left: number }
  initialShowMargins?: boolean
  initialShowGrid?: boolean
  onMarginChange: (top: number, right: number, bottom: number, left: number) => void
  onShowMarginsChange: (show: boolean) => void
  onShowGridChange: (show: boolean) => void
}

const PageSettingsPanel = ({
  selectedPageId,
  onClose,
  initialMargins,
  initialShowMargins,
  initialShowGrid,
  onMarginChange,
  onShowMarginsChange,
  onShowGridChange
}: PageSettingsPanelProps) => {
  const [topMargin, setTopMargin] = useState(initialMargins?.top ?? 20)
  const [rightMargin, setRightMargin] = useState(initialMargins?.right ?? 20)
  const [bottomMargin, setBottomMargin] = useState(initialMargins?.bottom ?? 20)
  const [leftMargin, setLeftMargin] = useState(initialMargins?.left ?? 20)
  const [showMargins, setShowMargins] = useState(initialShowMargins ?? false)
  const [showGrid, setShowGrid] = useState(initialShowGrid ?? false)
  const [isMarginsExpanded, setIsMarginsExpanded] = useState(true)
  const [isDisplayOptionsExpanded, setIsDisplayOptionsExpanded] = useState(true)
  
  // Dragging state
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const dragStartPos = useRef({ x: 0, y: 0 })

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    }
  }, [position])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setPosition({
      x: e.clientX - dragStartPos.current.x,
      y: e.clientY - dragStartPos.current.y
    })
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      return () => {
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging, handleMouseMove, handleMouseUp])

  const handleMarginApply = () => {
    onMarginChange(topMargin, rightMargin, bottomMargin, leftMargin)
  }

  const handleToggleMargins = () => {
    const newValue = !showMargins
    setShowMargins(newValue)
    onShowMarginsChange(newValue)
  }

  const handleToggleGrid = () => {
    const newValue = !showGrid
    setShowGrid(newValue)
    onShowGridChange(newValue)
  }

  if (!selectedPageId) {
    return null
  }

  return (
    <div 
      className="fixed right-4 top-20 h-fit w-96 bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl rounded-2xl z-50 overflow-y-auto select-none"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      <div className="p-6">
        {/* Header */}
        <div 
          className="flex items-center justify-between mb-6 cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
        >
          <div className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-gray-400" />
            <SlidersHorizontal className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Page Settings</h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="hover:text-gray-600 transition-colors text-3xl text-black"
              title="Close settings"
            >
              ×
            </button>
          )}
        </div>

        {/* Margin Settings */}
        <div className="mb-6 border-b border-gray-200 pb-6">
          <button
            onClick={() => setIsMarginsExpanded(!isMarginsExpanded)}
            className="flex items-center justify-between w-full mb-4"
          >
            <h3 className="text-sm font-medium text-gray-900">Margins</h3>
            {isMarginsExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          
          {isMarginsExpanded && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
              <label className="block text-xs text-gray-600 mb-2">Top (mm)</label>
              <input
                type="number"
                value={topMargin}
                onChange={(e) => setTopMargin(Number(e.target.value))}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-2">Right (mm)</label>
              <input
                type="number"
                value={rightMargin}
                onChange={(e) => setRightMargin(Number(e.target.value))}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-2">Bottom (mm)</label>
              <input
                type="number"
                value={bottomMargin}
                onChange={(e) => setBottomMargin(Number(e.target.value))}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="100"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-2">Left (mm)</label>
              <input
                type="number"
                value={leftMargin}
                onChange={(e) => setLeftMargin(Number(e.target.value))}
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="0"
                max="100"
              />
            </div>
          </div>

              <button
                onClick={handleMarginApply}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Apply Margins
              </button>
            </>
          )}
        </div>

        {/* Display Options */}
        <div>
          <button
            onClick={() => setIsDisplayOptionsExpanded(!isDisplayOptionsExpanded)}
            className="flex items-center justify-between w-full mb-4"
          >
            <h3 className="text-sm font-medium text-gray-900">Display Options</h3>
            {isDisplayOptionsExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          
          {isDisplayOptionsExpanded && (
            <div className="space-y-3">
              {/* Show/Hide Margins */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div className="flex items-center gap-2">
                {showMargins ? (
                  <Eye className="w-4 h-4 text-gray-700" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-sm text-gray-700">Show Margins</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showMargins}
                  onChange={handleToggleMargins}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Show/Hide Grid */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
              <div className="flex items-center gap-2">
                {showGrid ? (
                  <SlidersHorizontal className="w-4 h-4 text-gray-700" />
                ) : (
                  <SlidersHorizontal className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-sm text-gray-700">Show Grid</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={handleToggleGrid}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PageSettingsPanel

