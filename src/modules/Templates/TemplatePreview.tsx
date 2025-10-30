import { A4_PAGE_HEIGHT_PX, A4_PAGE_WIDTH_PX } from '@/components/PdfEditor/constants'
import type { DragItem } from '@/components/PdfEditor/types'
import React from 'react'

interface TemplatePreviewProps {
  elements: DragItem[]
  width?: number
}

const TemplatePreview: React.FC<TemplatePreviewProps> = ({ elements, width = 260 }) => {
  const scale = width / A4_PAGE_WIDTH_PX
  const height = Math.round(A4_PAGE_HEIGHT_PX * scale)

  return (
    <div
      className="relative overflow-hidden rounded-lg bg-white"
      style={{ width, height }}
    >
      <div
        className="relative bg-white"
        style={{
          width: `${A4_PAGE_WIDTH_PX}px`,
          height: `${A4_PAGE_HEIGHT_PX}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {elements.map((el) => {
          const commonStyle: React.CSSProperties = {
            position: 'absolute',
            left: `${el.position.x}px`,
            top: `${el.position.y}px`,
            width: `${el.size.width}px`,
            height: `${el.size.height}px`,
            overflow: 'hidden',
          }

          if (el.type === 'text' && el.textContent) {
            const s = el.textStyle || {}
            return (
              <div key={el.id} style={commonStyle}>
                <div
                  style={{
                    color: s.color || '#111827',
                    fontWeight: s.bold ? 700 : 400,
                    fontStyle: s.italic ? 'italic' : 'normal',
                    textDecoration: s.underline ? 'underline' : 'none',
                    textAlign: s.align || 'left',
                    fontSize: (typeof s.fontSize === 'number' ? s.fontSize : 12),
                    lineHeight: 1.2,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {el.textContent}
                </div>
              </div>
            )
          }

          if (el.type === 'line') {
            const lineHeight = Math.max(1, el.size.height)
            return (
              <div key={el.id} style={commonStyle}>
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: `${(el.size.height - lineHeight) / 2}px`,
                    height: `${lineHeight}px`,
                    backgroundColor: el.lineStyle?.color || el.color || '#000',
                  }}
                />
              </div>
            )
          }

          if (el.type === 'table' && el.tableData) {
            const rows = el.tableData.rows
            const cols = el.tableData.columns
            const headerColor = el.tableData.headerColor || '#f3f4f6'
            const showHeaderBorder = el.tableData.showHeaderBorder !== false
            const showBodyBorder = el.tableData.showBodyBorder !== false
            const baseFont = el.tableData.baseFontSize || 11

            return (
              <div key={el.id} style={commonStyle}>
                <table
                  style={{
                    width: '100%',
                    height: '100%',
                    tableLayout: 'fixed',
                    borderCollapse: 'collapse',
                    fontSize: baseFont,
                    color: '#111827',
                  }}
                >
                  <tbody>
                    {Array.from({ length: rows }).map((_, r) => (
                      <tr key={r}>
                        {Array.from({ length: cols }).map((__, c) => {
                          const key = `${r}-${c}`
                          const isHeader = r === 0
                          return (
                            <td
                              key={c}
                              style={{
                                padding: '4px 6px',
                                backgroundColor: isHeader ? headerColor : 'transparent',
                                border: (isHeader && showHeaderBorder) || (!isHeader && showBodyBorder)
                                  ? '1px solid rgba(0,0,0,0.1)'
                                  : 'none',
                                fontWeight: isHeader ? 700 : 400,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {el.tableData?.cellData?.[key] || ''}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          }

          // Fallback for unhandled types
          return <div key={el.id} style={commonStyle} />
        })}
      </div>
    </div>
  )
}

export default TemplatePreview


