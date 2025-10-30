import DraggableElement from '../DraggableElement'
import { ELEMENT_CONFIGS } from '../constants'

interface LineElementProps {
  onClick?: () => void
}

const LineElement = ({ onClick }: LineElementProps) => {
  const config = ELEMENT_CONFIGS.find(c => c.type === 'line')!
  return <DraggableElement config={config} onClick={onClick} />
}

export default LineElement