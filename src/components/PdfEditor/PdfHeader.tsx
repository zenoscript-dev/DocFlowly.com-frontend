import { useState } from 'react'
import { useEditorStore } from './store'

interface PdfHeaderProps {
  onExportPDF: () => void
  onTogglePreview: () => void
  isPreviewMode: boolean
}

const PdfHeader = ({ onExportPDF, onTogglePreview, isPreviewMode }: PdfHeaderProps) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  
  // Get current state values for reactive updates
  const historyIndex = useEditorStore(state => state.historyIndex)
  const history = useEditorStore(state => state.history)
  
  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1
  
  const undo = useEditorStore(state => state.undo)
  const redo = useEditorStore(state => state.redo)
  const resetApp = useEditorStore(state => state.resetApp)
  
  const handleReset = () => {
    setShowResetConfirm(true)
  }
  
  const confirmReset = () => {
    resetApp()
    setShowResetConfirm(false)
  }
  
  const cancelReset = () => {
    setShowResetConfirm(false)
  }
  return (
    <>
      <div className="flex items-center space-x-2">
        {!isPreviewMode && (
          <>
            <button 
              onClick={undo}
              disabled={!canUndo}
              className={`px-4 py-2 rounded-md transition-colors ${
                canUndo
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
            >
              Undo
            </button>
            <button 
              onClick={redo}
              disabled={!canRedo}
              className={`px-4 py-2 rounded-md transition-colors ${
                canRedo
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
            >
              Redo
            </button>
            <button 
              onClick={handleReset}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Reset
            </button>
          </>
        )}
        <button 
          onClick={onTogglePreview}
          className={`px-4 py-2 rounded-md transition-colors ${
            isPreviewMode 
              ? 'bg-purple-600 text-white hover:bg-purple-700' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {isPreviewMode ? 'Edit' : 'Preview'}
        </button>
        {isPreviewMode && (
          <button 
            onClick={onExportPDF}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Export PDF
          </button>
        )}
      </div>
      
      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Reset All Pages?</h2>
            <p className="text-gray-600 mb-6">
              This will permanently delete all pages, elements, and content. This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelReset}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReset}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PdfHeader