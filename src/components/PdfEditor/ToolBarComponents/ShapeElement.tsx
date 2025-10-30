import { Circle, Square, Triangle } from 'lucide-react'
import { useRef, useState } from 'react'
import DraggableElement from '../DraggableElement'
import { ELEMENT_CONFIGS } from '../constants'

interface ShapeElementProps {
  onClick?: () => void
}

const ShapeElement = ({ onClick }: ShapeElementProps) => {
  const [showShapeToolbar, setShowShapeToolbar] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const shapeConfig = ELEMENT_CONFIGS.find((config) => config.type === 'shape')!

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setShowShapeToolbar(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setShowShapeToolbar(false)
    }, 100)
  }

  const shapes = [
    { icon: Triangle, label: 'Triangle' },
    { icon: Square, label: 'Square' },
    { icon: Circle, label: 'Circle' }, 
  ]

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <DraggableElement config={shapeConfig} onClick={onClick}>
        {showShapeToolbar && (
          <div 
            className="absolute left-full top-0 bg-white border border-gray-200 rounded-md shadow-lg p-2 z-10 min-w-[120px]"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="flex flex-col gap-1">
              {shapes.map((shape) => (
                <div 
                  key={shape.label}
                  className="flex flex-col items-center text-black gap-1 p-2 hover:bg-gray-100 rounded cursor-pointer"
                >
                  <shape.icon className="w-4 h-4" />
                  <span className="text-xs">{shape.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </DraggableElement>
    </div>
  )
}

export default ShapeElement