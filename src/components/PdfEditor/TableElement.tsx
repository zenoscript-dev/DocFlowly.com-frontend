import { Plus } from 'lucide-react'
import { useState } from 'react'
import type { DragItem, TableData } from './types'

interface TableElementProps {
  element: DragItem
  isSelected?: boolean
  onUpdate?: (data: TableData) => void
  onSizeChange?: (width: number, height: number) => void
}

const TableElement = ({ element, isSelected, onUpdate, onSizeChange }: TableElementProps) => {
  const [editingCell, setEditingCell] = useState<string | null>(null)
  const [currentCell, setCurrentCell] = useState<{row: number, col: number} | null>(null)
  
  // Get tableData directly from element to ensure reactivity
  const tableData: TableData = element.tableData || {
    rows: 3,
    columns: 3,
    cellData: {},
    headerColor: '#F3F4F6'
  }

  const handleCellClick = (rowIndex: number, colIndex: number) => {
    const cellKey = `${rowIndex}-${colIndex}`
    setEditingCell(cellKey)
    setCurrentCell({ row: rowIndex, col: colIndex })
  }

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    if (!onUpdate) return
    
    const newCellData = { ...tableData.cellData }
    const cellKey = `${rowIndex}-${colIndex}`
    newCellData[cellKey] = value

    onUpdate({
      ...tableData,
      cellData: newCellData
    })
  }

  const handleCellBlur = () => {
    setEditingCell(null)
  }

  const moveToNextCell = (rowIndex: number, colIndex: number, shift: boolean = false) => {
    if (!currentCell) return

    let nextRow = rowIndex
    let nextCol = colIndex

    if (shift) {
      // Shift+Tab: move backwards
      if (colIndex > 0) {
        nextCol = colIndex - 1
      } else if (rowIndex > 0) {
        nextRow = rowIndex - 1
        nextCol = tableData.columns - 1
      } else {
        // Already at first cell
        return
      }
    } else {
      // Tab: move forwards
      if (colIndex < tableData.columns - 1) {
        nextCol = colIndex + 1
      } else if (rowIndex < tableData.rows - 1) {
        nextRow = rowIndex + 1
        nextCol = 0
      } else {
        // At last cell, wrap to first
        nextRow = 0
        nextCol = 0
      }
    }

    // Move to next cell
    const nextCellKey = `${nextRow}-${nextCol}`
    setEditingCell(nextCellKey)
    setCurrentCell({ row: nextRow, col: nextCol })
  }

  const handleAddRow = () => {
    if (!onUpdate) return
    
    const newRows = tableData.rows + 1
    onUpdate({
      ...tableData,
      rows: newRows
    })
    
    // Grow the element to accommodate the new row
    if (onSizeChange) {
      // Calculate height without button strip (subtract 30px), divide by current rows
      const dataHeight = element.size.height - 30
      const cellHeight = dataHeight / tableData.rows
      const newHeight = element.size.height + cellHeight
      onSizeChange(element.size.width, newHeight)
    }
  }

  const handleAddColumn = () => {
    if (!onUpdate) return
    
    const newColumns = tableData.columns + 1
    onUpdate({
      ...tableData,
      columns: newColumns
    })
    
    // Grow the element to accommodate the new column
    if (onSizeChange) {
      const cellWidth = element.size.width / tableData.columns
      const newWidth = element.size.width + cellWidth
      // Add extra width for the add button if not selected, otherwise it's already accounted for
      onSizeChange(newWidth, element.size.height)
    }
  }

  // Get font size for a cell based on priority: cell > row > column > header > base
  const getCellFontSize = (rowIndex: number, colIndex: number) => {
    const cellKey = `${rowIndex}-${colIndex}`
    const isHeader = rowIndex === 0
    
    // Priority order: cell > row > column > header > base
    if (tableData.cellFontSizes?.[cellKey]) {
      return `${tableData.cellFontSizes[cellKey]}px`
    }
    if (tableData.rowFontSizes?.[rowIndex]) {
      return `${tableData.rowFontSizes[rowIndex]}px`
    }
    if (tableData.columnFontSizes?.[colIndex]) {
      return `${tableData.columnFontSizes[colIndex]}px`
    }
    if (isHeader && tableData.headerFontSize) {
      return `${tableData.headerFontSize}px`
    }
    if (tableData.baseFontSize) {
      return `${tableData.baseFontSize}px`
    }
    return '14px' // Default
  }

  const shouldShowBorder = (rowIndex: number) => {
    const isHeader = rowIndex === 0
    if (isHeader) {
      return tableData.showHeaderBorder !== false
    }
    return tableData.showBodyBorder !== false
  }

  return (
    <div className="w-full h-full bg-white rounded-sm shadow-inner relative" style={{ overflow: 'visible' }}>
      <table className="border-collapse w-full h-full" style={{ tableLayout: 'fixed' }}>
        <tbody>
          {Array.from({ length: tableData.rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: tableData.columns }).map((_, colIndex) => {
                const cellKey = `${rowIndex}-${colIndex}`
                const isEditing = editingCell === cellKey
                const cellContent = tableData.cellData[cellKey] || ''
                const isHeader = rowIndex === 0

                const cellFontSize = getCellFontSize(rowIndex, colIndex)
                const showBorder = shouldShowBorder(rowIndex)
                
                return (
                  <td
                    key={colIndex}
                    className={`p-2 transition-all ${
                      showBorder ? 'border border-gray-300' : ''
                    } ${
                      isHeader ? 'font-semibold text-gray-900' : 'text-gray-700'
                    } ${isSelected && !isEditing ? 'hover:bg-gray-50' : ''} ${isEditing ? 'bg-white' : ''}`}
                    style={{
                      width: `${(1 / tableData.columns) * 100}%`,
                      height: isSelected 
                        ? `calc((100% - 30px) / ${tableData.rows})` 
                        : `${(1 / tableData.rows) * 100}%`,
                      backgroundColor: isHeader && tableData.headerColor ? tableData.headerColor : 'white',
                      verticalAlign: 'middle',
                      cursor: isEditing ? 'text' : 'pointer',
                      fontSize: cellFontSize
                    }}
                    onClick={() => !isEditing && handleCellClick(rowIndex, colIndex)}
                  >
                    {isEditing ? (
                      <input
                        type="text"
                        value={cellContent}
                        onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                        onBlur={handleCellBlur}
                        onKeyDown={(e) => {
                          if (e.key === 'Tab') {
                            e.preventDefault()
                            moveToNextCell(rowIndex, colIndex, e.shiftKey)
                          }
                        }}
                        autoFocus
                        className="w-full h-full bg-transparent border-none outline-none"
                        style={{
                          fontFamily: 'inherit',
                          fontSize: cellFontSize,
                          fontWeight: isHeader ? '600' : 'normal'
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <div className="min-h-[20px] text-gray-800 whitespace-pre-wrap break-words" style={{ fontSize: cellFontSize }}>
                        {cellContent || '\u00A0'}
                      </div>
                    )}
                  </td>
                )
              })}
              {/* Add Column Button cell - only ONE button, spans full height */}
              {isSelected && rowIndex === 0 && (
                <td
                  rowSpan={tableData.rows}
                  className="border border-gray-300 p-0 hover:bg-gray-100 transition-colors cursor-pointer"
                  style={{
                    width: '30px',
                    verticalAlign: 'middle',
                    textAlign: 'center',
                    backgroundColor: '#F9FAFB'
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAddColumn()
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    <Plus className="w-4 h-4 text-gray-700" />
                  </div>
                </td>
              )}
            </tr>
          ))}
          {/* Add Row Button row - only ONE row with ONE button spanning all columns */}
          {isSelected && (
            <tr>
              <td
                colSpan={tableData.columns}
                className="border border-gray-300 p-0 hover:bg-gray-100 transition-colors cursor-pointer"
                style={{
                  width: 'calc(100% - 30px)',
                  height: '30px',
                  verticalAlign: 'middle',
                  textAlign: 'center',
                  backgroundColor: '#F9FAFB'
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddRow()
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <Plus className="w-4 h-4 text-gray-700" />
                </div>
              </td>
              {/* Empty cell for alignment */}
              <td 
                className="border border-gray-300 p-0 bg-white" 
                style={{ 
                  width: '30px', 
                  height: '30px',
                  verticalAlign: 'middle' 
                }} 
              />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default TableElement
