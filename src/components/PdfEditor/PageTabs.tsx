import { X } from 'lucide-react'
import { useEditorStore } from './store'

interface PageTabsProps {
  selectedPageId: string | null
  onPageSelect: (pageId: string) => void
}

const PageTabs = ({ selectedPageId, onPageSelect }: PageTabsProps) => {
  const sheets = useEditorStore(state => state.sheets)
  const deleteSheet = useEditorStore(state => state.deleteSheet)
  
  const handleDeletePage = (e: React.MouseEvent, sheetId: string) => {
    e.stopPropagation()
    if (sheets.length > 1) {
      deleteSheet(sheetId)
    }
  }

  return (
    <div className="flex items-center gap-0 overflow-x-auto bg-gray-50">
      {sheets.map((sheet, index) => (
        <button
          key={sheet.id}
          onClick={() => onPageSelect(sheet.id)}
          className={`relative flex items-center gap-2 px-4 py-2 transition-all text-sm border-t border-l border-gray-200 first:border-l-0 ${
            selectedPageId === sheet.id 
              ? 'bg-blue-50 text-blue-700 font-medium shadow-sm border-b-0 border-blue-300' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-50 border-r border-gray-200'
          }`}
        >
          <span className="truncate max-w-[180px]">
            {sheet.title || `Page ${index + 1}`}
          </span>
          {sheets.length > 1 && (
            <button
              onClick={(e) => handleDeletePage(e, sheet.id)}
              className={`p-0.5 rounded transition-colors ml-1 ${
                selectedPageId === sheet.id
                  ? 'hover:bg-gray-200'
                  : 'hover:bg-gray-300'
              }`}
              title="Close page"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </button>
      ))}
    </div>
  )
}

export default PageTabs

