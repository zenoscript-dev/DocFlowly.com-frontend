import { GripHorizontal } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import DataElement from './ToolBarComponents/DataElement'
import LineElement from './ToolBarComponents/LineElement'
import MediaElement from './ToolBarComponents/MediaElement'
import ShapeElement from './ToolBarComponents/ShapeElement'
import SignatureElement from './ToolBarComponents/SignatureElement'
import TableElement from './ToolBarComponents/TableElement'
import TextElement from './ToolBarComponents/TextElement'

interface PdfEditorToolBarProps {
  onElementClick: (elementType: string) => void
}

const PdfEditorToolBar = ({ onElementClick }: PdfEditorToolBarProps) => {
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

  return (
    <div 
      className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl rounded-2xl p-3 relative select-none"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
    >
      {/* Drag handle - Top */}
      <div 
        className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 bg-gray-200 hover:bg-gray-300 rounded-t-lg flex items-center justify-center cursor-grab active:cursor-grabbing transition-colors"
        onMouseDown={handleMouseDown}
      >
        <GripHorizontal className="w-4 h-4 text-gray-600" />
      </div>

      <div className="flex flex-col space-y-1">
        {/* Draggable Elements */}
        <TextElement onClick={() => onElementClick('text')} />
        <MediaElement onClick={() => onElementClick('media')} />
        <ShapeElement onClick={() => onElementClick('shape')} />
        <TableElement onClick={() => onElementClick('table')} />
        <LineElement onClick={() => onElementClick('line')} />
        <SignatureElement onClick={() => onElementClick('signature')} />
        <DataElement onClick={() => onElementClick('data')} />
      </div>
    </div>
  )
}

export default PdfEditorToolBar