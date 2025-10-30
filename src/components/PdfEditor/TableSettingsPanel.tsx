import { Minus, Plus } from 'lucide-react'
import type { TableData } from './types'

interface TableSettingsPanelProps {
  tableData: TableData
  onUpdate: (updates: Partial<TableData>) => void
  onClose?: () => void
}

const TableSettingsPanel = ({ tableData, onUpdate }: TableSettingsPanelProps) => {
  const defaultHeaderColor = tableData.headerColor || '#F3F4F6'
  
  const handleHeaderColorChange = (color: string) => {
    onUpdate({ headerColor: color })
  }

  const toggleHeaderBorder = () => {
    onUpdate({ showHeaderBorder: !tableData.showHeaderBorder })
  }

  const toggleBodyBorder = () => {
    onUpdate({ showBodyBorder: !tableData.showBodyBorder })
  }

  const adjustFontSize = (type: 'base' | 'header' | 'column' | 'row' | 'cell', value: number, index?: number) => {
    const newSize = Math.max(8, Math.min(72, value))
    
    switch (type) {
      case 'base':
        onUpdate({ baseFontSize: newSize })
        break
      case 'header':
        onUpdate({ headerFontSize: newSize })
        break
      case 'column':
        if (index !== undefined) {
          const columnFontSizes = { ...tableData.columnFontSizes, [index]: newSize }
          onUpdate({ columnFontSizes })
        }
        break
      case 'row':
        if (index !== undefined) {
          const rowFontSizes = { ...tableData.rowFontSizes, [index]: newSize }
          onUpdate({ rowFontSizes })
        }
        break
      case 'cell':
        if (index !== undefined && typeof index === 'string') {
          const cellFontSizes = { ...tableData.cellFontSizes, [index]: newSize }
          onUpdate({ cellFontSizes })
        }
        break
    }
  }

  const adjustFontSizeBy = (type: 'base' | 'header' | 'column' | 'row' | 'cell', delta: number, index?: number) => {
    const currentBase = tableData.baseFontSize || 14
    const currentHeader = tableData.headerFontSize
    const columnSizes = tableData.columnFontSizes || {}
    const rowSizes = tableData.rowFontSizes || {}
    const cellSizes = tableData.cellFontSizes || {}

    switch (type) {
      case 'base':
        adjustFontSize('base', currentBase + delta)
        break
      case 'header':
        adjustFontSize('header', (currentHeader || currentBase) + delta)
        break
      case 'column':
        if (index !== undefined) {
          adjustFontSize('column', (columnSizes[index] || currentBase) + delta, index)
        }
        break
      case 'row':
        if (index !== undefined) {
          adjustFontSize('row', (rowSizes[index] || currentBase) + delta, index)
        }
        break
      case 'cell':
        if (index !== undefined && typeof index === 'string') {
          adjustFontSize('cell', (cellSizes[index] || currentBase) + delta, index)
        }
        break
    }
  }

  return (
    <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-96 bg-white border-l border-gray-200 shadow-xl z-50 overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold text-gray-800">Table Settings</h3>
        </div>

      <div className="space-y-4">
        {/* Header Color */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700 w-32">Header Color:</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={defaultHeaderColor}
              onChange={(e) => handleHeaderColorChange(e.target.value)}
              className="w-10 h-10  rounded cursor-pointer border border-gray-300"
            />
            <input
              type="text"
              value={defaultHeaderColor}
              onChange={(e) => handleHeaderColorChange(e.target.value)}
              className="px-2 py-1 text-black border border-gray-300 rounded text-sm w-24"
            />
          </div>
        </div>

        {/* Border Toggles */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700 w-32">Borders:</label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={tableData.showHeaderBorder !== false}
                onChange={toggleHeaderBorder}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Header</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={tableData.showBodyBorder !== false}
                onChange={toggleBodyBorder}
                className="rounded"
              />
              <span className="text-sm text-gray-700">Body</span>
            </label>
          </div>
        </div>

        {/* Font Sizes */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Font Size Controls</h4>
          
          {/* Base Font Size */}
          <div className="flex items-center gap-3 mb-3">
            <label className="text-sm font-medium text-gray-700 w-32">Entire Table:</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => adjustFontSizeBy('base', -1)}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                value={tableData.baseFontSize || 14}
                onChange={(e) => adjustFontSize('base', parseInt(e.target.value) || 14)}
                className="text-sm text-gray-700 w-16 text-center px-2 py-1 border border-gray-300 rounded"
                min="8"
                max="72"
              />
              <span className="text-xs text-gray-500">px</span>
              <button
                onClick={() => adjustFontSizeBy('base', 1)}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Header Font Size */}
          <div className="flex items-center gap-3 mb-3">
            <label className="text-sm font-medium text-gray-700 w-32">Header Row:</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => adjustFontSizeBy('header', -1)}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <input
                type="number"
                value={tableData.headerFontSize || tableData.baseFontSize || 14}
                onChange={(e) => adjustFontSize('header', parseInt(e.target.value) || 14)}
                className="text-sm text-gray-700 w-16 text-center px-2 py-1 border border-gray-300 rounded"
                min="8"
                max="72"
              />
              <span className="text-xs text-gray-500">px</span>
              <button
                onClick={() => adjustFontSizeBy('header', 1)}
                className="p-1 rounded hover:bg-gray-100 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Column Font Sizes */}
          <div className="mb-3">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Columns:</label>
            <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto">
              {Array.from({ length: tableData.columns }).map((_, idx) => {
                const colSize = tableData.columnFontSizes?.[idx] || tableData.baseFontSize || 14
                return (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <span className="text-xs text-gray-500">Col {idx + 1}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => adjustFontSizeBy('column', -1, idx)}
                        className="p-0.5 rounded hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="number"
                        value={colSize}
                        onChange={(e) => adjustFontSize('column', parseInt(e.target.value) || 14, idx)}
                        className="text-xs text-gray-700 w-12 text-center px-1 py-0.5 border border-gray-300 rounded"
                        min="8"
                        max="72"
                      />
                      <button
                        onClick={() => adjustFontSizeBy('column', 1, idx)}
                        className="p-0.5 rounded hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Row Font Sizes */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Rows:</label>
            <div className="grid grid-cols-5 gap-2 max-h-32 overflow-y-auto">
              {Array.from({ length: tableData.rows }).map((_, idx) => {
                const rowSize = tableData.rowFontSizes?.[idx] || tableData.baseFontSize || 14
                return (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <span className="text-xs text-gray-500">Row {idx + 1}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => adjustFontSizeBy('row', -1, idx)}
                        className="p-0.5 rounded hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <input
                        type="number"
                        value={rowSize}
                        onChange={(e) => adjustFontSize('row', parseInt(e.target.value) || 14, idx)}
                        className="text-xs text-gray-700 w-12 text-center px-1 py-0.5 border border-gray-300 rounded"
                        min="8"
                        max="72"
                      />
                      <button
                        onClick={() => adjustFontSizeBy('row', 1, idx)}
                        className="p-0.5 rounded hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default TableSettingsPanel

