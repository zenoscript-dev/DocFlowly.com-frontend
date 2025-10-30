import { CheckCircle, Upload, X } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-dark.css';
import { useEffect, useRef, useState } from 'react';
import { useEditorStore } from './store';

interface JSONDataLibraryProps {
  onClose: () => void
  onJSONSelect: (jsonData: { name: string; data: Record<string, unknown> }) => void
}

const JSONDataLibrary = ({ onClose, onJSONSelect }: JSONDataLibraryProps) => {
  // Get JSON data from Zustand store
  const jsonText = useEditorStore(state => state.jsonDataLibrary)
  const setJsonText = useEditorStore(state => state.setJsonDataLibrary)
  const clearJsonData = useEditorStore(state => state.clearJsonDataLibrary)
  
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [jsonObject, setJsonObject] = useState<Record<string, unknown> | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [localJsonText, setLocalJsonText] = useState<string>(jsonText)

  // Sync local state with store when jsonText changes
  useEffect(() => {
    setLocalJsonText(jsonText)
  }, [jsonText])

  // Validate JSON whenever localJsonText changes
  useEffect(() => {
    if (localJsonText.trim() === '') {
      setIsValid(null)
      setErrorMessage('')
      setJsonObject(null)
      return
    }

    try {
      const parsed = JSON.parse(localJsonText)
      setJsonObject(parsed)
      setIsValid(true)
      setErrorMessage('')
      
      // Update syntax highlighting
      Prism.highlightAll()
    } catch (error) {
      setIsValid(false)
      setErrorMessage(error instanceof Error ? error.message : 'Invalid JSON')
      setJsonObject(null)
    }
  }, [localJsonText])

  // Update store when localJsonText changes
  useEffect(() => {
    setJsonText(localJsonText)
  }, [localJsonText, setJsonText])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const file = files[0]
    const reader = new FileReader()
    
    reader.onload = (event) => {
      const content = event.target?.result as string
      setLocalJsonText(content)
    }
    
    reader.readAsText(file)
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleSaveJSON = () => {
    if (isValid && jsonObject) {
      const name = `JSON Data ${new Date().toLocaleString()}`
      onJSONSelect({ name, data: jsonObject })
    }
  }

  const handleClear = () => {
    setLocalJsonText('')
    setIsValid(null)
    setErrorMessage('')
    setJsonObject(null)
    clearJsonData()
  }

  return (
    <div className="fixed right-0 top-0 h-full w-[600px] bg-white border-l border-gray-200 shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-lg font-semibold">JSON Data</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Upload Button */}
      <div className="p-4 border-b bg-gray-50">
        <button
          onClick={handleUploadClick}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Upload className="w-5 h-5" />
          Upload JSON File
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Text Area */}
        <div className="flex-1 p-4 border-b">
          <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Paste or type JSON data</label>
              <div className="flex items-center gap-2">
                {isValid !== null && (
                  <div className={`flex items-center gap-1 text-xs ${
                    isValid ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isValid && <CheckCircle className="w-4 h-4" />}
                    {!isValid && <X className="w-4 h-4" />}
                    <span className="font-medium">
                      {isValid ? 'Valid JSON' : 'Invalid JSON'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <textarea
              value={localJsonText}
              onChange={(e) => setLocalJsonText(e.target.value)}
              placeholder='{"key": "value"}'
              className={`flex-1 w-full px-3 py-2 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 transition-colors resize-none bg-white text-gray-900 ${
                isValid === false 
                  ? 'border-red-300 focus:ring-red-500' 
                  : isValid === true
                  ? 'border-green-300 focus:ring-green-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            
            {errorMessage && (
              <p className="text-xs text-red-600 mt-2">{errorMessage}</p>
            )}

            <div className="mt-3">
              <button
                onClick={() => {
                  // Validate JSON
                  if (localJsonText.trim() === '') {
                    setIsValid(null)
                    setErrorMessage('')
                    setJsonObject(null)
                    return
                  }
                  
                  try {
                    const parsed = JSON.parse(localJsonText)
                    setJsonObject(parsed)
                    setIsValid(true)
                    setErrorMessage('')
                  } catch (error) {
                    setIsValid(false)
                    setErrorMessage(error instanceof Error ? error.message : 'Invalid JSON')
                    setJsonObject(null)
                  }
                }}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Validate JSON
              </button>
            </div>
          </div>
        </div>

        {/* JSON Preview */}
        {isValid && jsonObject && (
          <div className="flex-1 p-4 bg-gray-50 overflow-auto">
            <h3 className="text-sm font-medium text-gray-700 mb-2">JSON Highlighted</h3>
            <div className="bg-gray-900 rounded-lg overflow-hidden max-h-[400px] p-4">
              <pre className="language-json text-xs m-0">
                <code
                  className="language-json"
                  dangerouslySetInnerHTML={{
                    __html: Prism.highlight(JSON.stringify(jsonObject, null, 2), Prism.languages.json, 'json')
                  }}
                />
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t bg-white flex gap-2">
        <button
          onClick={handleClear}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Clear
        </button>
        <button
          onClick={handleSaveJSON}
          disabled={!isValid}
          className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium ${
            isValid 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Use JSON Data
        </button>
      </div>
    </div>
  )
}

export default JSONDataLibrary

