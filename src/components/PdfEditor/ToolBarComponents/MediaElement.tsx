import DraggableElement from '../DraggableElement'
import { ELEMENT_CONFIGS } from '../constants'

interface MediaElementProps {
  onClick?: () => void
}

const MediaElement = ({ onClick }: MediaElementProps) => {
  const config = ELEMENT_CONFIGS.find(c => c.type === 'image')!
  return <DraggableElement config={config} onClick={onClick} />
}

export default MediaElement