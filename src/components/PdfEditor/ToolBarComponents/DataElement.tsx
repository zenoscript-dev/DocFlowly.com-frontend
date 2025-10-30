import { Database } from 'lucide-react'

interface DataElementProps {
  onClick: () => void
}

const DataElement = ({ onClick }: DataElementProps) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center w-full py-3 px-2 hover:bg-gray-50 rounded-lg transition-colors"
      title="JSON Data"
    >
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
        <Database className="w-6 h-6 text-blue-600" />
      </div>
      <span className="text-xs font-medium text-gray-700">Data</span>
    </button>
  )
}

export default DataElement

