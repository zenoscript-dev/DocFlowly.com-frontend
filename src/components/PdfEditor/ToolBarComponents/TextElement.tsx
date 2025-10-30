import DraggableElement from '../DraggableElement'
import { ELEMENT_CONFIGS } from '../constants'

interface TextElementProps {
  onClick?: () => void
}

const TextElement = ({ onClick }: TextElementProps) => {
  const config = ELEMENT_CONFIGS.find(c => c.type === 'text')!
  return <DraggableElement config={config} onClick={onClick} />
}

export default TextElement