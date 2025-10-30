import { AlignCenter, AlignLeft, AlignRight, Bold, Italic, Minus, Plus, Type, Underline } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { DragItem } from './types'

interface TextStyle {
  bold: boolean
  italic: boolean
  underline: boolean
  align: 'left' | 'center' | 'right'
  fontSize: number
  fontFamily: string
  color: string
}

interface TextFormattingToolbarProps {
  selectedElementId: string | null
  selectedElementType: string | null
  selectedElementData?: DragItem | null
  onStyleChange: (style: Partial<TextStyle>) => void
}

const TextFormattingToolbar = ({ 
  selectedElementId, 
  selectedElementType,
  selectedElementData,
  onStyleChange 
}: TextFormattingToolbarProps) => {
  const [style, setStyle] = useState<TextStyle>({
    bold: false,
    italic: false,
    underline: false,
    align: 'left',
    fontSize: 16,
    fontFamily: 'Arial',
    color: '#000000'
  })

  // Sync toolbar state with selected element's style
  useEffect(() => {
    if (selectedElementData?.textStyle) {
      const textStyle = selectedElementData.textStyle
      setStyle(prev => ({
        bold: textStyle.bold ?? prev.bold,
        italic: textStyle.italic ?? prev.italic,
        underline: textStyle.underline ?? prev.underline,
        align: textStyle.align ?? prev.align,
        fontSize: textStyle.fontSize ?? prev.fontSize,
        fontFamily: textStyle.fontFamily ?? prev.fontFamily,
        color: textStyle.color ?? prev.color
      }))
    }
  }, [selectedElementData])

  // Only show for text elements
  if (!selectedElementId || selectedElementType !== 'text') {
    return null
  }

  const handleStyleChange = (newStyle: Partial<TextStyle>) => {
    setStyle(prev => ({ ...prev, ...newStyle }))
    onStyleChange(newStyle)
  }

  const handleFontSizeChange = (delta: number) => {
    const newSize = Math.max(8, Math.min(72, style.fontSize + delta))
    handleStyleChange({ fontSize: newSize })
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Font Family */}
      <div>
        <label className="block text-xs text-gray-600 mb-2">Font Family</label>
        <select
          value={style.fontFamily}
          onChange={(e) => handleStyleChange({ fontFamily: e.target.value })}
          className="w-full px-3 py-2 border text-black border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Helvetica">Helvetica</option>
          <option value="Georgia">Georgia</option>
          <option value="Courier New">Courier New</option>
        </select>
      </div>

      {/* Font Size */}
      <div>
        <label className="block text-xs text-gray-600 mb-2">Font Size</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleFontSizeChange(-1)}
            className="p-2 hover:bg-gray-100 rounded transition-colors border border-gray-300"
            title="Decrease Font Size"
          >
            <Minus className="w-4 h-4 text-gray-700" />
          </button>
          <input
            type="number"
            value={style.fontSize}
            onChange={(e) => handleStyleChange({ fontSize: parseInt(e.target.value) || 16 })}
            className="flex-1 px-3 py-2 border text-black border-gray-300 rounded-md text-sm text-center"
          />
          <button
            onClick={() => handleFontSizeChange(1)}
            className="p-2 hover:bg-gray-100 rounded transition-colors border border-gray-300"
            title="Increase Font Size"
          >
            <Plus className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      </div>

      <div className="border-t border-gray-200"></div>

      {/* Text Style */}
      <div>
        <label className="block text-xs text-gray-600 mb-2">Text Style</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleStyleChange({ bold: !style.bold })}
            className={`flex-1 p-2 rounded border transition-colors ${
              style.bold ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
            title="Bold"
          >
            <Bold className="w-5 h-5 mx-auto text-current" />
          </button>
          <button
            onClick={() => handleStyleChange({ italic: !style.italic })}
            className={`flex-1 p-2 rounded border transition-colors ${
              style.italic ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
            title="Italic"
          >
            <Italic className="w-5 h-5 mx-auto text-current" />
          </button>
          <button
            onClick={() => handleStyleChange({ underline: !style.underline })}
            className={`flex-1 p-2 rounded border transition-colors ${
              style.underline ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
            title="Underline"
          >
            <Underline className="w-5 h-5 mx-auto text-current" />
          </button>
        </div>
      </div>

      <div className="border-t border-gray-200"></div>

      {/* Text Alignment */}
      <div>
        <label className="block text-xs text-gray-600 mb-2">Text Alignment</label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleStyleChange({ align: 'left' })}
            className={`flex-1 p-2 rounded border transition-colors ${
              style.align === 'left' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
            title="Align Left"
          >
            <AlignLeft className="w-5 h-5 mx-auto text-current" />
          </button>
          <button
            onClick={() => handleStyleChange({ align: 'center' })}
            className={`flex-1 p-2 rounded border transition-colors ${
              style.align === 'center' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
            title="Align Center"
          >
            <AlignCenter className="w-5 h-5 mx-auto text-current" />
          </button>
          <button
            onClick={() => handleStyleChange({ align: 'right' })}
            className={`flex-1 p-2 rounded border transition-colors ${
              style.align === 'right' ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'
            }`}
            title="Align Right"
          >
            <AlignRight className="w-5 h-5 mx-auto text-current" />
          </button>
        </div>
      </div>

      <div className="border-t border-gray-200"></div>

      {/* Text Color */}
      <div>
        <label className="block text-xs text-gray-600 mb-2">Text Color</label>
        <div className="flex items-center gap-3">
          <Type className="w-5 h-5 text-gray-700" />
          <input
            type="color"
            value={style.color}
            onChange={(e) => handleStyleChange({ color: e.target.value })}
            className="w-16 h-10 border-2 border-gray-300 rounded cursor-pointer"
            title="Text Color"
          />
          <span className="text-sm text-gray-700">{style.color.toUpperCase()}</span>
        </div>
      </div>
    </div>
  )
}

export default TextFormattingToolbar

