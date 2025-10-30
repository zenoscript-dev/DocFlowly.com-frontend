import { Copy, Lock, MessageSquarePlus, MoreVertical, Move, RotateCw, Sparkles, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import QRCode from 'react-qr-code'
import { A4_PAGE_HEIGHT_PX, A4_PAGE_WIDTH_PX } from './constants'
import TableElement from './TableElement'
import type { DragItem } from './types'

interface DroppedElementProps {
  element: DragItem
  isSelected?: boolean
  onSelect: () => void
  onDelete: () => void
  onDuplicate: () => void
  onRotate: () => void
  onEdit?: () => void
  onComment?: () => void
  onLock?: () => void
  onMore?: () => void
  onMove?: () => void
  onPositionChange?: (x: number, y: number) => void
  onSizeChange?: (width: number, height: number) => void
  onPositionAndSizeChange?: (x: number, y: number, width: number, height: number) => void
  onDataUpdate?: (data: Partial<DragItem>) => void
  pageRef?: React.RefObject<HTMLDivElement | null>
  isLocked?: boolean
  marginSize?: number
}

const DroppedElement = ({
  element,
  isSelected = false,
  onSelect,
  onDelete,
  onDuplicate,
  onRotate,
  onEdit,
  onComment,
  onLock,
  onMore,
  onMove,
  onPositionChange,
  onSizeChange,
  onPositionAndSizeChange,
  onDataUpdate,
  pageRef,
  isLocked = false,
  marginSize = 32
}: DroppedElementProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeDirection, setResizeDirection] = useState<string>('')
  // Local position during dragging (for visual updates only, not saved to store)
  const [dragPosition, setDragPosition] = useState<{ x: number; y: number } | null>(null)
  // Local position during resizing (for visual updates only, not saved to store)
  const [resizePosition, setResizePosition] = useState<{ x: number; y: number } | null>(null)
  // Local size during resizing (for visual updates only, not saved to store)
  const [resizeSize, setResizeSize] = useState<{ width: number; height: number } | null>(null)
  // Initialize textContent from element data if it exists, otherwise use default
  const [textContent, setTextContent] = useState(element.type === 'text' ? (element.textContent || 'Your paragraph text') : '')
  const dragStartPosRef = useRef({ x: 0, y: 0 })
  const mouseStartPosRef = useRef({ x: 0, y: 0 })
  const resizeStartRef = useRef({ width: 0, height: 0, x: 0, y: 0, mouseX: 0, mouseY: 0 })
  const finalPositionRef = useRef<{ x: number; y: number } | null>(null)
  const finalSizeRef = useRef<{ width: number; height: number; x?: number; y?: number } | null>(null)
  const elementRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Handle double-click to edit text
  const handleDoubleClick = (e: React.MouseEvent) => {
    if (element.type === 'text' && isSelected) {
      e.stopPropagation()
      setIsEditing(true)
      // Small delay to ensure the input is rendered
      setTimeout(() => {
        inputRef.current?.focus()
        inputRef.current?.select()
      }, 0)
    }
  }

  // Handle text editing completion
  const handleTextBlur = () => {
    setIsEditing(false)
    // Persist text content to element data when editing is complete
    if (onDataUpdate && element.type === 'text') {
      onDataUpdate({ textContent })
    }
  }

  // Handle text change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setTextContent(newContent)
    
    // Update the element data in real-time while typing
    if (onDataUpdate && element.type === 'text') {
      onDataUpdate({ textContent: newContent })
    }
  }

  // Handle Enter key to finish editing
  const handleTextKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      setIsEditing(false)
    }
    if (e.key === 'Escape') {
      setIsEditing(false)
    }
  }

  // Handle resize handle mouse down
  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation()
    if (isLocked) return
    
    setResizeDirection(direction)
    setIsResizing(true)
    
    // Store element position and size at resize start
    resizeStartRef.current = {
      width: element.size.width,
      height: element.size.height,
      x: element.position.x,
      y: element.position.y,
      mouseX: e.clientX,
      mouseY: e.clientY
    }
    e.preventDefault()
  }


  const handleMouseDown = (e: React.MouseEvent) => {
    if (isLocked) return
    
    // Don't start dragging if clicking on resize handles
    const target = e.target as HTMLElement
    if (target.classList.contains('resize-handle')) {
      return
    }
    
    if (!isSelected) {
      onSelect()
    }
    
    // Store the element's current position in page coordinates
    dragStartPosRef.current = { x: element.position.x, y: element.position.y }
    
    // Get the element's position in viewport coordinates
    const elementRect = elementRef.current?.getBoundingClientRect()
    if (elementRect && pageRef?.current) {
      const pageRect = pageRef.current.getBoundingClientRect()
      // Store mouse position relative to page, not viewport
      mouseStartPosRef.current = { 
        x: e.clientX - pageRect.left, 
        y: e.clientY - pageRect.top 
      }
    } else {
      mouseStartPosRef.current = { x: e.clientX, y: e.clientY }
    }
    
    setIsDragging(true)
    e.preventDefault()
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Handle resizing
      if (isResizing && onSizeChange) {
        // Calculate mouse delta in page coordinates
        const mouseX = e.clientX
        const mouseY = e.clientY
        const deltaX = mouseX - resizeStartRef.current.mouseX
        const deltaY = mouseY - resizeStartRef.current.mouseY
        
        let newWidth = resizeStartRef.current.width
        let newHeight = resizeStartRef.current.height
        
        switch (resizeDirection) {
          case 'nw':
            newWidth = resizeStartRef.current.width - deltaX
            newHeight = resizeStartRef.current.height - deltaY
            break
          case 'ne':
            newWidth = resizeStartRef.current.width + deltaX
            newHeight = resizeStartRef.current.height - deltaY
            break
          case 'sw':
            newWidth = resizeStartRef.current.width - deltaX
            newHeight = resizeStartRef.current.height + deltaY
            break
          case 'se':
            newWidth = resizeStartRef.current.width + deltaX
            newHeight = resizeStartRef.current.height + deltaY
            break
          case 'n':
            // Top edge - only change height
            newHeight = resizeStartRef.current.height - deltaY
            break
          case 's':
            // Bottom edge - only change height
            newHeight = resizeStartRef.current.height + deltaY
            break
          case 'e':
            // Right edge - only change width
            newWidth = resizeStartRef.current.width + deltaX
            break
          case 'w':
            // Left edge - only change width
            newWidth = resizeStartRef.current.width - deltaX
            break
        }
        
        // Minimum size constraints
        newWidth = Math.max(50, newWidth)
        newHeight = Math.max(50, newHeight)
        
        // Adjust position when resizing from left or top
        let newX = resizeStartRef.current.x
        let newY = resizeStartRef.current.y
        
        // Adjust X position when resizing from left
        if (resizeDirection === 'w' || resizeDirection === 'nw' || resizeDirection === 'sw') {
          newX = resizeStartRef.current.x + resizeStartRef.current.width - newWidth
        }
        // Adjust Y position when resizing from top
        if (resizeDirection === 'n' || resizeDirection === 'nw' || resizeDirection === 'ne') {
          newY = resizeStartRef.current.y + resizeStartRef.current.height - newHeight
        }
        
        // Store final size and position for later (only save to store on mouseUp)
        finalSizeRef.current = { width: newWidth, height: newHeight, x: newX, y: newY }
        setResizeSize({ width: newWidth, height: newHeight })
        
        // Update resize position visually if X or Y changed (for visual feedback during resize)
        setResizePosition({ x: newX, y: newY })
        
        return
      }
      
      // Handle dragging
      if (!isDragging || isLocked) return
      
      if (onPositionChange && pageRef?.current) {
        // Get page position relative to viewport
        const pageRect = pageRef.current.getBoundingClientRect()
        
        // Calculate current mouse position relative to page
        const currentMousePos = {
          x: e.clientX - pageRect.left,
          y: e.clientY - pageRect.top
        }
        
        // Calculate the difference from the mouse start position
        const deltaX = currentMousePos.x - mouseStartPosRef.current.x
        const deltaY = currentMousePos.y - mouseStartPosRef.current.y
        
        // Calculate new position by adding the mouse delta to the start position
        let newX = dragStartPosRef.current.x + deltaX
        let newY = dragStartPosRef.current.y + deltaY
        
        // Snap to margin lines and center lines
        const SNAP_THRESHOLD = 5 // pixels
        const pageWidth = A4_PAGE_WIDTH_PX
        const pageHeight = A4_PAGE_HEIGHT_PX
        
        // Clamp position to page boundaries
        // Keep element within page bounds (0 to page edge - element size)
        newX = Math.max(0, Math.min(newX, pageWidth - element.size.width))
        newY = Math.max(0, Math.min(newY, pageHeight - element.size.height))
        
        // Calculate margin positions using dynamic marginSize
        const leftMargin = marginSize
        const rightMargin = pageWidth - marginSize
        const topMargin = marginSize
        const bottomMargin = pageHeight - marginSize
        
        // Try snapping to horizontal positions
        const elementLeft = newX
        const elementRight = newX + element.size.width
        const elementCenterX = newX + element.size.width / 2
        
        // Snap left edge to left margin
        if (Math.abs(elementLeft - leftMargin) < SNAP_THRESHOLD) {
          newX = leftMargin
        }
        // Snap right edge to right margin
        else if (Math.abs(elementRight - rightMargin) < SNAP_THRESHOLD) {
          newX = rightMargin - element.size.width
        }
        // Snap to center vertical line
        else {
          const centerX = pageWidth / 2
          if (Math.abs(elementLeft - centerX) < SNAP_THRESHOLD) {
            newX = centerX
          } else if (Math.abs(elementRight - centerX) < SNAP_THRESHOLD) {
            newX = centerX - element.size.width
          } else if (Math.abs(elementCenterX - centerX) < SNAP_THRESHOLD) {
            newX = centerX - element.size.width / 2
          }
        }
        
        // Try snapping to vertical positions (using updated newX)
        const elementTop = newY
        const elementBottom = newY + element.size.height
        const elementCenterY = newY + element.size.height / 2
        
        // Snap top edge to top margin
        if (Math.abs(elementTop - topMargin) < SNAP_THRESHOLD) {
          newY = topMargin
        }
        // Snap bottom edge to bottom margin
        else if (Math.abs(elementBottom - bottomMargin) < SNAP_THRESHOLD) {
          newY = bottomMargin - element.size.height
        }
        // Snap to center horizontal line
        else {
          const centerY = pageHeight / 2
          if (Math.abs(elementTop - centerY) < SNAP_THRESHOLD) {
            newY = centerY
          } else if (Math.abs(elementBottom - centerY) < SNAP_THRESHOLD) {
            newY = centerY - element.size.height
          } else if (Math.abs(elementCenterY - centerY) < SNAP_THRESHOLD) {
            newY = centerY - element.size.height / 2
          }
        }
        
        // Update position with snapped values - only save to store on mouseUp
        finalPositionRef.current = { x: newX, y: newY }
        setDragPosition({ x: newX, y: newY })
      }
    }

    const handleMouseUp = () => {
      // Save final position to store only on mouseUp (if dragging, not resizing)
      if (finalPositionRef.current && !isResizing && onPositionChange) {
        onPositionChange(finalPositionRef.current.x, finalPositionRef.current.y)
      }
      
      // Save final size and position to store only on mouseUp (if resizing)
      // Use combined callback to avoid duplicate history saves
      if (finalSizeRef.current && onPositionAndSizeChange) {
        const { width, height, x, y } = finalSizeRef.current
        
        // Single combined update (one history save) - always pass current x, y even if unchanged
        const finalX = x ?? element.position.x
        const finalY = y ?? element.position.y
        console.log(`[DroppedElement] Resize complete: saving size(${width}x${height}) and position(${finalX},${finalY}) in one batch`)
        onPositionAndSizeChange(finalX, finalY, width, height)
      } else if (finalSizeRef.current && onSizeChange) {
        // Fallback if combined callback not available
        console.log(`[DroppedElement] Resize complete: saving size only (${finalSizeRef.current.width}x${finalSizeRef.current.height})`)
        onSizeChange(finalSizeRef.current.width, finalSizeRef.current.height)
      }
      
      setIsDragging(false)
      setIsResizing(false)
      setResizeDirection('')
      setDragPosition(null)
      setResizePosition(null)
      setResizeSize(null)
      finalPositionRef.current = null
      finalSizeRef.current = null
    }

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, isResizing, resizeDirection, isLocked, onPositionChange, onSizeChange, onPositionAndSizeChange, pageRef, element.id, element.type, element.position.x, element.position.y, element.size.width, element.size.height, marginSize])

  // Clear drag position and resize size when operations end
  useEffect(() => {
    if (!isDragging && dragPosition) {
      setDragPosition(null)
    }
    if (!isResizing && resizeSize) {
      setResizeSize(null)
    }
    if (!isResizing && resizePosition) {
      setResizePosition(null)
    }
  }, [isDragging, isResizing, dragPosition, resizeSize, resizePosition])
  
  // Sync textContent when element changes (for duplication, etc.)
  useEffect(() => {
    if (element.type === 'text' && element.textContent) {
      setTextContent(element.textContent)
    }
  }, [element.textContent, element.id, element.type])

  // Initialize textarea height when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current && element.type === 'text') {
      // Set height to auto first to get the correct scrollHeight
      inputRef.current.style.height = 'auto'
      const scrollHeight = inputRef.current.scrollHeight
      inputRef.current.style.height = `${scrollHeight}px`
    }
  }, [isEditing, element.type])


  return (
    <div
      ref={elementRef}
      className={`absolute dropped-element-container ${isLocked ? 'cursor-default' : 'cursor-move'}`}
      style={{
        left: `${dragPosition?.x ?? resizePosition?.x ?? element.position.x}px`,
        top: `${dragPosition?.y ?? resizePosition?.y ?? element.position.y}px`,
        width: `${resizeSize?.width ?? element.size.width}px`,
        // For lines, increase container height for easier selection
        height: element.type === 'line' ? '20px' : `${resizeSize?.height ?? element.size.height}px`,
        zIndex: element.zIndex,
        transform: `rotate(${element.rotation}deg)`,
        pointerEvents: 'auto',
        userSelect: 'none',
        boxSizing: 'border-box'
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onClick={(e) => {
        if (!isDragging) {
          e.stopPropagation()
          onSelect()
        }
      }}
    >
      {/* Element Content */}
      <div className={`w-full h-full transition-all ${
        isSelected && element.type !== 'line'
          ? 'border-2 border-purple-500' 
          : ''
      } ${
        isSelected && element.type === 'line'
          ? 'border border-purple-500 rounded'
          : ''
      } flex items-center justify-center cursor-pointer`}>
        {/* Render based on element type */}
        {element.type === 'text' ? (
          isEditing ? (
            <textarea
              ref={inputRef}
              value={textContent}
              onChange={handleTextChange}
              onBlur={handleTextBlur}
              onKeyDown={handleTextKeyDown}
              className="w-full h-full p-4 resize-none outline-none bg-transparent overflow-hidden"
              style={{ 
                fontFamily: element.textStyle?.fontFamily || 'Arial',
                fontSize: `${element.textStyle?.fontSize || 16}px`,
                fontWeight: element.textStyle?.bold ? 'bold' : 'normal',
                fontStyle: element.textStyle?.italic ? 'italic' : 'normal',
                textDecoration: element.textStyle?.underline ? 'underline' : 'none',
                textAlign: element.textStyle?.align || 'left',
                color: element.textStyle?.color || '#000000'
              }}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            />
          ) : (
            <div 
              className="w-full h-full p-4 overflow-auto"
              style={{
                fontFamily: element.textStyle?.fontFamily || 'Arial',
                fontSize: `${element.textStyle?.fontSize || 16}px`,
                fontWeight: element.textStyle?.bold ? 'bold' : 'normal',
                fontStyle: element.textStyle?.italic ? 'italic' : 'normal',
                textDecoration: element.textStyle?.underline ? 'underline' : 'none',
                textAlign: element.textStyle?.align || 'left',
                color: element.textStyle?.color || '#000000',
                wordWrap: 'break-word',
                overflowWrap: 'break-word'
              }}
            >
              <p className="whitespace-pre-wrap break-words">{textContent || 'Your paragraph text'}</p>
            </div>
          )
        ) : element.type === 'line' ? (
          <svg 
            className="w-full h-full"
            style={{ pointerEvents: 'none' }}
            viewBox={`0 0 ${element.size.width} 20`}
            preserveAspectRatio="none"
          >
            <defs>
              {/* Arrow marker definitions */}
              <marker
                id={`arrow-start-${element.id}`}
                markerWidth="10"
                markerHeight="10"
                refX="0"
                refY="5"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill={element.lineStyle?.color || element.color} />
              </marker>
              <marker
                id={`arrow-end-${element.id}`}
                markerWidth="10"
                markerHeight="10"
                refX="10"
                refY="5"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill={element.lineStyle?.color || element.color} />
              </marker>
              <marker
                id={`circle-start-${element.id}`}
                markerWidth="10"
                markerHeight="10"
                refX="5"
                refY="5"
              >
                <circle cx="5" cy="5" r="4" fill={element.lineStyle?.color || element.color} />
              </marker>
              <marker
                id={`circle-end-${element.id}`}
                markerWidth="10"
                markerHeight="10"
                refX="5"
                refY="5"
              >
                <circle cx="5" cy="5" r="4" fill={element.lineStyle?.color || element.color} />
              </marker>
            </defs>
            <line
              x1="0"
              y1="10"
              x2={element.size.width}
              y2="10"
              stroke={element.lineStyle?.color || element.color}
              strokeWidth={element.lineStyle?.lineWidth || 2}
              strokeDasharray={
                element.lineStyle?.strokeStyle === 'dashed' ? '8,4' :
                element.lineStyle?.strokeStyle === 'dotted' ? '2,4' : 'none'
              }
              markerStart={
                element.lineStyle?.startArrow === 'arrow' ? `url(#arrow-start-${element.id})` :
                element.lineStyle?.startArrow === 'circle' ? `url(#circle-start-${element.id})` : undefined
              }
              markerEnd={
                element.lineStyle?.endArrow === 'arrow' ? `url(#arrow-end-${element.id})` :
                element.lineStyle?.endArrow === 'circle' ? `url(#circle-end-${element.id})` : undefined
              }
            />
          </svg>
        ) : element.type === 'table' ? (
          <TableElement
            element={element}
            isSelected={isSelected}
            onUpdate={(data) => {
              if (onDataUpdate) {
                onDataUpdate({ tableData: data })
              }
            }}
            onSizeChange={onSizeChange}
          />
        ) : element.type === 'image' && element.imageUrl ? (
          <img
            src={element.imageUrl}
            alt="Uploaded image"
            className="w-full h-full object-contain"
          />
        ) : element.type === 'qrcode' ? (
          <div className="w-full h-full flex items-center justify-center">
            <QRCode
              value={element.qrCodeData?.url || ''}
              size={Math.min(element.size.width, element.size.height)}
              viewBox={element.qrCodeData?.viewBox}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        ) : (
          <div className={`w-full h-full border-2 border-dashed ${
            isSelected ? 'border-purple-500' : 'border-blue-500'
          } flex items-center justify-center text-xs text-gray-700`}>
            <span className="font-medium">{element.type}</span>
          </div>
        )}
      </div>

      {/* Resize Handles - shown when selected */}
      {isSelected && !isEditing && (
        <>
          {element.type === 'line' ? (
            <>
              {/* For lines, only show left and right handles */}
              {/* Left edge */}
              <div 
                className="resize-handle absolute top-1/2 -left-2 transform -translate-y-1/2 w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow-md cursor-w-resize z-10"
                onMouseDown={(e) => handleResizeStart(e, 'w')}
              />
              {/* Right edge */}
              <div 
                className="resize-handle absolute top-1/2 -right-2 transform -translate-y-1/2 w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow-md cursor-e-resize z-10"
                onMouseDown={(e) => handleResizeStart(e, 'e')}
              />
            </>
          ) : (
            <>
              {/* Corner handles */}
              {/* Top-left corner */}
              <div 
                className="resize-handle absolute -left-2 -top-2 w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow-md cursor-nw-resize z-10"
                onMouseDown={(e) => handleResizeStart(e, 'nw')}
              />
              {/* Top-right corner */}
              <div 
                className="resize-handle absolute -right-2 -top-2 w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow-md cursor-ne-resize z-10"
                onMouseDown={(e) => handleResizeStart(e, 'ne')}
              />
              {/* Bottom-left corner */}
              <div 
                className="resize-handle absolute -left-2 -bottom-2 w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow-md cursor-sw-resize z-10"
                onMouseDown={(e) => handleResizeStart(e, 'sw')}
              />
              {/* Bottom-right corner */}
              <div 
                className="resize-handle absolute -right-2 -bottom-2 w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow-md cursor-se-resize z-10"
                onMouseDown={(e) => handleResizeStart(e, 'se')}
              />
              
              {/* Side handles */}
              {/* Top edge */}
              <div 
                className="resize-handle absolute left-1/2 -top-2 transform -translate-x-1/2 w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow-md cursor-n-resize z-10"
                onMouseDown={(e) => handleResizeStart(e, 'n')}
              />
              {/* Bottom edge */}
              <div 
                className="resize-handle absolute left-1/2 -bottom-2 transform -translate-x-1/2 w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow-md cursor-s-resize z-10"
                onMouseDown={(e) => handleResizeStart(e, 's')}
              />
              {/* Left edge */}
              <div 
                className="resize-handle absolute top-1/2 -left-2 transform -translate-y-1/2 w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow-md cursor-w-resize z-10"
                onMouseDown={(e) => handleResizeStart(e, 'w')}
              />
              {/* Right edge */}
              <div 
                className="resize-handle absolute top-1/2 -right-2 transform -translate-y-1/2 w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow-md cursor-e-resize z-10"
                onMouseDown={(e) => handleResizeStart(e, 'e')}
              />
            </>
          )}
        </>
      )}

      {/* Action Buttons - Top Bar */}
      {isSelected && (
        <>
          <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 z-[9999] flex items-center justify-center gap-1.5 bg-white rounded-lg shadow-xl border border-gray-200 px-2 py-1.5 backdrop-blur-sm">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit?.()
              }}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title="AI Edit"
            >
              <Sparkles className="w-5 h-5 text-blue-600" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onComment?.()
              }}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title="Add comment"
            >
              <MessageSquarePlus className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onLock?.()
              }}
              className={`p-1.5 rounded transition-colors hover:bg-gray-100 ${
                isLocked ? 'text-yellow-600' : ''
              }`}
              title={isLocked ? 'Unlock' : 'Lock'}
            >
              <Lock className={`w-5 h-5 ${isLocked ? 'text-yellow-600' : 'text-gray-700'}`} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDuplicate()
              }}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title="Duplicate"
            >
              <Copy className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete()
              }}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title="Delete"
            >
              <Trash2 className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMore?.()
              }}
              className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              title="More options"
            >
              <MoreVertical className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          {/* Bottom Action Buttons */}
          <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onRotate()
              }}
              className="p-2 bg-white border border-gray-200 rounded-full shadow-md hover:bg-gray-50 transition-colors hover:shadow-lg"
              title="Rotate"
            >
              <RotateCw className="w-5 h-5 text-gray-700" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMove?.()
              }}
              className="p-2 bg-white border border-gray-200 rounded-full shadow-md hover:bg-gray-50 transition-colors hover:shadow-lg"
              title="Move"
            >
              <Move className="w-5 h-5 text-gray-700" />
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default DroppedElement
