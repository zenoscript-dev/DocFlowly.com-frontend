import DraggableElement from '../DraggableElement'
import { ELEMENT_CONFIGS } from '../constants'

interface TableElementProps {
  onClick?: () => void
}

const TableElement = ({ onClick }: TableElementProps) => {
  const config = ELEMENT_CONFIGS.find(c => c.type === 'table')!
  return <DraggableElement config={config} onClick={onClick} />
}

export default TableElement