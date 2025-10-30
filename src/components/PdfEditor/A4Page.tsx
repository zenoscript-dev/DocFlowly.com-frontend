import { Copy, Plus, Trash2 } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { A4_PAGE_HEIGHT_PX, A4_PAGE_WIDTH_PX } from './constants'
import DroppedElement from './DroppedElement'
import type { DragItem } from './types'

interface A4PageProps {
  children?: React.ReactNode
  className?: string
  showGrid?: boolean
  showMargins?: boolean
  margins?: {
    top: number
    right: number
    bottom: number
    left: number
  }
  pageNumber?: number
  pageTitle?: string
  onPageTitleChange?: (title: string) => void
  onMoveUp?: () => void
  onMoveDown?: () => void
  onHide?: () => void
  onDuplicate?: () => void
  onDelete?: () => void
  onAddPage?: (pageIndex?: number) => void
  pageIndex?: number
  isSelected?: boolean
  onSelect?: () => void
  elements?: DragItem[]
  sheetId?: string
  onDeleteElement?: (sheetId: string, elementIndex: number) => void
  onDuplicateElement?: (sheetId: string, elementIndex: number) => void
  onUpdateElement?: (sheetId: string, elementIndex: number, updates: Partial<DragItem>) => void
  onElementSelect?: (elementId: string | null, elementType: string | null) => void
  newlyAddedElementId?: string
  pageRef?: React.RefObject<HTMLDivElement> | ((ref: HTMLDivElement | null) => void)
}


// Helper to convert mm to px (1mm ≈ 3.7795px at 96dpi)
const mmToPx = (mm: number) => mm * 3.7795

const A4Page = ({ 
  children, 
  className = '',
  showGrid = false,
  showMargins = false,
  margins = { top: 20, right: 20, bottom: 20, left: 20 },
  pageNumber = 1,
  pageTitle = '',
  onPageTitleChange,
  onMoveUp,
  onMoveDown,
  onHide,
  onDuplicate,
  onDelete,
  onAddPage,
  pageIndex,
  isSelected = false,
  onSelect,
  elements = [],
  sheetId = '',
  onDeleteElement,
  onDuplicateElement,
  onUpdateElement,
  onElementSelect,
  newlyAddedElementId,
  pageRef: externalPageRef
}: A4PageProps) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [title, setTitle] = useState(pageTitle || '')
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null)
  const [isLocked, setIsLocked] = useState(false)
  const internalPageRef = useRef<HTMLDivElement>(null)
  
  // Update title when pageTitle prop changes
  useEffect(() => {
    setTitle(pageTitle || '')
  }, [pageTitle])
  
  // Handle ref (could be callback or ref object)
  const setPageRef = (ref: HTMLDivElement | null) => {
    if (typeof externalPageRef === 'function') {
      externalPageRef(ref)
    } else if (externalPageRef && 'current' in externalPageRef) {
      (externalPageRef as React.MutableRefObject<HTMLDivElement | null>).current = ref
    }
    if (internalPageRef) {
      internalPageRef.current = ref
    }
  }
  
  const pageRef = internalPageRef
  
  // Validate and clamp element positions to page boundaries
  // Use useMemo to avoid recalculating on every render
  const validatedElements = useMemo(() => {
    return elements.map(element => {
      const clampedX = Math.max(0, Math.min(element.position.x, A4_PAGE_WIDTH_PX - element.size.width))
      const clampedY = Math.max(0, Math.min(element.position.y, A4_PAGE_HEIGHT_PX - element.size.height))
      
      // Return element with clamped position if needed
      if (clampedX !== element.position.x || clampedY !== element.position.y) {
        return { ...element, position: { x: clampedX, y: clampedY } }
      }
      
      return element
    })
  }, [elements])
  
  // Update invalid positions in a separate effect to avoid render loops
  useEffect(() => {
    validatedElements.forEach((validatedElement) => {
      const originalElement = elements.find(el => el.id === validatedElement.id)
      if (originalElement && (validatedElement.position.x !== originalElement.position.x || 
          validatedElement.position.y !== originalElement.position.y)) {
        if (onUpdateElement && sheetId) {
          const elementIndex = elements.findIndex(el => el.id === validatedElement.id)
          if (elementIndex !== -1) {
            console.log(`[A4Page] Clamping element ${validatedElement.id} from (${originalElement.position.x}, ${originalElement.position.y}) to (${validatedElement.position.x}, ${validatedElement.position.y})`)
            onUpdateElement(sheetId, elementIndex, { 
              position: validatedElement.position 
            })
          }
        }
      }
    })
  }, [validatedElements, elements, onUpdateElement, sheetId])
  

  // Update parent when element selection changes
  useEffect(() => {
    const element = elements.find(el => el.id === selectedElementId)
    onElementSelect?.(selectedElementId, element?.type || null)
  }, [selectedElementId, elements, onElementSelect])

  // Auto-select newly added element
  useEffect(() => {
    if (newlyAddedElementId && elements.length > 0) {
      const element = elements.find(el => el.id === newlyAddedElementId)
      if (element) {
        setSelectedElementId(element.id)
      }
    }
  }, [newlyAddedElementId, elements])

  const handleTitleSubmit = () => {
    setIsEditingTitle(false)
    onPageTitleChange?.(title)
  }

  const handleTitleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTitleSubmit()
    }
    if (e.key === 'Escape') {
      setTitle(pageTitle || `Page ${pageNumber}`)
      setIsEditingTitle(false)
    }
  }

  const handleDeleteElement = (elementId: string) => {
    if (onDeleteElement && sheetId) {
      const index = elements.findIndex(el => el.id === elementId)
      if (index !== -1) {
        onDeleteElement(sheetId, index)
        setSelectedElementId(null)
      }
    }
  }

  const handleDuplicateElement = (elementId: string) => {
    if (onDuplicateElement && sheetId) {
      const index = elements.findIndex(el => el.id === elementId)
      if (index !== -1) {
        onDuplicateElement(sheetId, index)
      }
    }
  }

  const handleRotateElement = (elementId: string) => {
    if (onUpdateElement && sheetId) {
      const index = elements.findIndex(el => el.id === elementId)
      if (index !== -1) {
        const element = elements[index]
        if (element) {
          const newRotation = (element.rotation + 90) % 360
          onUpdateElement(sheetId, index, { rotation: newRotation })
        }
      }
    }
  }

  const handleEditElement = (elementId: string) => {
    console.log('Editing element:', elementId)
    // TODO: Open edit modal for the element
  }

  const handleLockElement = () => {
    setIsLocked(!isLocked)
  }

  return (
    <div 
      className="relative flex flex-col gap-0" 
      ref={externalPageRef ? setPageRef : pageRef}
    >
      {/* Page Controls Header - Always show for all pages */}
      <div 
        className="mx-auto flex items-center gap-2 px-4 py-2 bg-white border-x border-t border-gray-200 rounded-t-lg shadow-sm relative z-50 cursor-pointer"
        style={{ width: `${A4_PAGE_WIDTH_PX}px` }}
        onClick={(e) => {
          e.stopPropagation()
          onSelect?.()
        }}
      >
          {/* Page Title Section */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {isEditingTitle ? (
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleSubmit}
                onKeyDown={handleTitleKeyPress}
                className="text-sm font-semibold text-gray-900 bg-transparent border-none outline-none focus:outline-none flex-1 min-w-0"
                autoFocus
                placeholder="Add page title"
              />
            ) : (
              <div 
                className="flex items-center gap-1 cursor-pointer min-w-0 truncate px-2 py-1 rounded hover:bg-gray-50"
                onClick={() => setIsEditingTitle(true)}
              >
                <span className="text-sm font-semibold text-gray-900 truncate">
                  {title ? `${title}` : 'Click to add page title'}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 ml-auto flex-shrink-0">
          {/* Navigation Controls */}
          {/* <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMoveUp?.()
              }}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Move page up"
            >
              <ChevronUp className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMoveDown?.()
              }}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Move page down"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div> */}

          {/* Action Controls */}
          <div className="flex items-center gap-1">
            {/* <button
              onClick={(e) => {
                e.stopPropagation()
                onHide?.()
              }}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Hide page"
            >
              <EyeOff className="w-4 h-4" />
            </button> */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDuplicate?.()
              }}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Duplicate page"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete?.()
              }}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Delete page"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onAddPage?.(pageIndex)
              }}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              title="Add new page"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          </div>
        </div>


      {/* A4 Page */}
      <div 
        className={`relative mx-auto bg-white shadow-lg transition-all duration-200 ${className} ${isSelected ? 'border-4 border-purple-500' : 'border-4 border-transparent'}`}
        style={{ 
          pointerEvents: 'auto', 
          cursor: 'pointer',
          width: `${A4_PAGE_WIDTH_PX}px`,
          height: `${A4_PAGE_HEIGHT_PX}px`,
          minWidth: `${A4_PAGE_WIDTH_PX}px`,
          minHeight: `${A4_PAGE_HEIGHT_PX}px`,
          maxWidth: `${A4_PAGE_WIDTH_PX}px`,
          maxHeight: `${A4_PAGE_HEIGHT_PX}px`,
          boxSizing: 'border-box'
        }}
        onClick={(e) => {
          // Select page when clicking on page body, but not on elements
          const target = e.target as HTMLElement
          const isElement = target.closest('.dropped-element-container')
          const isAbsolute = target.hasAttribute('data-is-element')
          
          if (!isElement && !isAbsolute) {
            onSelect?.()
          }
        }}
      >
        
        {/* Grid overlay */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(to right, #999 1px, transparent 1px),
                linear-gradient(to bottom, #999 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
              opacity: 0.4
            }} />
          </div>
        )}
        
        {/* Margins visual guide */}
        {showMargins && (
          <div 
            className="absolute border-2 border-dashed border-purple-500 pointer-events-none z-0" 
            style={{
              top: `${mmToPx(margins.top)}px`,
              left: `${mmToPx(margins.left)}px`,
              width: `calc(100% - ${mmToPx(margins.left + margins.right)}px)`,
              height: `calc(100% - ${mmToPx(margins.top + margins.bottom)}px)`
            }}
          />
        )}
        
        {/* Page content */}
        <div 
          className="relative w-full h-full z-10"
          style={{ 
            position: 'relative',
            width: '100%',
            height: '100%',
            overflow: 'visible',
            boxSizing: 'border-box'
          }}
          onClick={(e) => {
            const target = e.target as HTMLElement
            // Deselect elements when clicking on background, not on elements
            if (!target.closest('.dropped-element-container')) {
              setSelectedElementId(null)
            }
          }}
        >
          {/* Render validated elements - zIndex CSS handles stacking, DOM order doesn't matter */}
          {validatedElements.map((element) => (
            <DroppedElement
              key={element.id}
              element={element}
              isSelected={selectedElementId === element.id}
              onSelect={() => {
                setSelectedElementId(element.id)
              }}
              onEdit={() => handleEditElement(element.id)}
              onComment={() => console.log('Add comment to element:', element.id)}
              onLock={handleLockElement}
              onMore={() => console.log('More options for element:', element.id)}
              onMove={() => console.log('Move element:', element.id)}
              onDelete={() => handleDeleteElement(element.id)}
              onDuplicate={() => handleDuplicateElement(element.id)}
              onRotate={() => handleRotateElement(element.id)}
              onPositionChange={(x, y) => {
                if (onUpdateElement && sheetId) {
                  const elementIndex = elements.findIndex(el => el.id === element.id)
                  if (elementIndex !== -1) {
                    onUpdateElement(sheetId, elementIndex, { 
                      position: { x, y } 
                    })
                  }
                }
              }}
              onSizeChange={(width, height) => {
                if (onUpdateElement && sheetId) {
                  const elementIndex = elements.findIndex(el => el.id === element.id)
                  if (elementIndex !== -1) {
                    onUpdateElement(sheetId, elementIndex, { 
                      size: { width, height } 
                    })
                  }
                }
              }}
              onPositionAndSizeChange={(x, y, width, height) => {
                if (onUpdateElement && sheetId) {
                  const elementIndex = elements.findIndex(el => el.id === element.id)
                  if (elementIndex !== -1) {
                    // Batch update: size and position together (single history save)
                    onUpdateElement(sheetId, elementIndex, { 
                      position: { x, y },
                      size: { width, height }
                    })
                  }
                }
              }}
              onDataUpdate={(data) => {
                if (onUpdateElement && sheetId) {
                  const elementIndex = elements.findIndex(el => el.id === element.id)
                  if (elementIndex !== -1) {
                    onUpdateElement(sheetId, elementIndex, data)
                  }
                }
              }}
              pageRef={pageRef}
              isLocked={isLocked}
            />
          ))}
          {children}
        </div>
      </div>

     
    </div>
  )
}

export default A4Page
