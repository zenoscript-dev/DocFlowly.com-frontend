import type { ElementConfig } from './types'

interface DraggableElementProps {
  config: ElementConfig
  children?: React.ReactNode
  onClick?: () => void
}

const DraggableElement = ({ config, children, onClick }: DraggableElementProps) => {
  const IconComponent = config.icon

  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center justify-center w-24 h-24 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
    >
      <div className={`w-full h-full px-2 py-2 mb-2 flex items-center justify-center ${config.bgColor} ${config.textColor} rounded-md`}>
        <IconComponent className="w-4 h-4 inline-block" />
      </div>
      <p className="text-sm font-medium text-gray-600">{config.label}</p>
      {children}
    </div>
  )
}

export default DraggableElement
