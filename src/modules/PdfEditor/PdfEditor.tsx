import DropZone from '@/components/PdfEditor/DropZone'
import JSONDataLibrary from '@/components/PdfEditor/JSONDataLibrary'
import MediaLibrary from '@/components/PdfEditor/MediaLibrary'
import PageSettingsPanel from '@/components/PdfEditor/PageSettingsPanel'
import PageTabs from '@/components/PdfEditor/PageTabs'

import PdfEditorToolBar from '@/components/PdfEditor/PdfEditorToolBar'
import QrCodeSettingsPanel from '@/components/PdfEditor/QrCodeSettingsPanel'
import SignatureModal from '@/components/PdfEditor/SignatureModal'
import TableSettingsPanel from '@/components/PdfEditor/TableSettingsPanel'
import TextFormattingToolbar from '@/components/PdfEditor/TextFormattingToolbar'
import { useEditorStore } from '@/components/PdfEditor/store'
import type { DragItem, TableData } from '@/components/PdfEditor/types'
import { ArrowLeft, Download, Eye, RotateCcw, Share2, SlidersHorizontal } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

// Wrapper to fetch margins from store
const PageSettingsPanelWithStore = ({ selectedPageId, onMarginChange, onShowMarginsChange, onShowGridChange, onClose }: { selectedPageId: string, onMarginChange: (top: number, right: number, bottom: number, left: number) => void, onShowMarginsChange: (show: boolean) => void, onShowGridChange: (show: boolean) => void, onClose?: () => void }) => {
  const sheets = useEditorStore(state => state.sheets)
  const sheet = sheets.find(s => s.id === selectedPageId)
  
  const margins = sheet?.margins || { top: 20, right: 20, bottom: 20, left: 20 }
  const showMargins = sheet?.showMargins ?? false
  const showGrid = sheet?.showGrid ?? false
  
  return (
    <PageSettingsPanel
      selectedPageId={selectedPageId}
      onClose={onClose}
      initialMargins={margins}
      initialShowMargins={showMargins}
      initialShowGrid={showGrid}
      onMarginChange={onMarginChange}
      onShowMarginsChange={onShowMarginsChange}
      onShowGridChange={onShowGridChange}
    />
  )
}

const PdfEditor = () => {
  const dropZoneRef = useRef<{ 
    exportToPDF: () => void
    previewPDF: () => Promise<string | null>
    handleToolbarElementClick: (elementType: string) => void
    getSelectedElement: () => { id: string | null; type: string | null }
    getSelectedElementData: () => DragItem | null
    updateElementStyle: (elementId: string | null, style: Record<string, unknown>) => void
    getSelectedPageId: () => string | null
    updatePageSettings: (pageId: string, settings: Record<string, unknown>) => void
    addImageElement: (imageData: { name: string; dataUrl: string }) => void
  } | null>(null)
  
  const updateSheet = useEditorStore(state => state.updateSheet)
  const resetApp = useEditorStore(state => state.resetApp)
  
  const [selectedElement, setSelectedElement] = useState<{ id: string | null; type: string | null }>({
    id: null,
    type: null
  })
  const [selectedElementData, setSelectedElementData] = useState<DragItem | null>(null)
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null)
  const [showMediaLibrary, setShowMediaLibrary] = useState(false)
  const [showDataLibrary, setShowDataLibrary] = useState(false)
  const [showSignatureModal, setShowSignatureModal] = useState(false)
  const [showPageSettings, setShowPageSettings] = useState(true)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null)

  // Export and preview handlers - reserved for future use
  const handleExportPDF = () => {
    if (dropZoneRef.current) {
      dropZoneRef.current.exportToPDF()
    }
  }

  const handleTogglePreview = async () => {
    if (isPreviewMode) {
      // Exit preview mode - cleanup blob URL to prevent memory leaks
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl)
      }
      setIsPreviewMode(false)
      setPdfPreviewUrl(null)
    } else {
      // Enter preview mode
      if (dropZoneRef.current) {
        console.log('Generating PDF preview...')
        const url = await dropZoneRef.current.previewPDF()
        console.log('Got preview URL:', url)
        if (url) {
          setPdfPreviewUrl(url)
          setIsPreviewMode(true)
        }
      }
    }
  }
  
  // Suppress unused warning - these are used in commented out header
  void handleExportPDF
  void handleTogglePreview

  // Cleanup blob URL on unmount
  useEffect(() => {
    return () => {
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl)
      }
    }
  }, [pdfPreviewUrl])

  const handleStyleChange = (style: Record<string, unknown>) => {
    if (dropZoneRef.current && selectedElement.id) {
      // Only include defined properties to preserve existing values
      const textStyle: Record<string, unknown> = {}
      
      if (style.bold !== undefined) textStyle.bold = style.bold
      if (style.italic !== undefined) textStyle.italic = style.italic
      if (style.underline !== undefined) textStyle.underline = style.underline
      if (style.align !== undefined) textStyle.align = style.align
      if (style.fontSize !== undefined) textStyle.fontSize = style.fontSize
      if (style.fontFamily !== undefined) textStyle.fontFamily = style.fontFamily
      if (style.color !== undefined) textStyle.color = style.color
      
      dropZoneRef.current.updateElementStyle(selectedElement.id, { textStyle })
    }
  }

  // Update selected element state from DropZone
  const updateSelectedElement = () => {
    if (dropZoneRef.current) {
      const element = dropZoneRef.current.getSelectedElement()
      setSelectedElement(element)
      
      // Also get the full element data for the toolbar
      const elementData = dropZoneRef.current.getSelectedElementData()
      setSelectedElementData(elementData)
    }
  }

  const handleTableSettingsUpdate = (updates: Partial<TableData>) => {
    if (dropZoneRef.current && selectedElement.id && selectedElementData?.type === 'table' && selectedElementData.tableData) {
      // Deep merge the updates to ensure all properties are preserved
      const updatedTableData = {
        ...selectedElementData.tableData,
        ...updates,
        // Preserve nested objects only if they exist in updates
        ...(updates.columnFontSizes && {
          columnFontSizes: { ...(selectedElementData.tableData.columnFontSizes || {}), ...updates.columnFontSizes }
        }),
        ...(updates.rowFontSizes && {
          rowFontSizes: { ...(selectedElementData.tableData.rowFontSizes || {}), ...updates.rowFontSizes }
        }),
        ...(updates.cellFontSizes && {
          cellFontSizes: { ...(selectedElementData.tableData.cellFontSizes || {}), ...updates.cellFontSizes }
        })
      }
      dropZoneRef.current.updateElementStyle(selectedElement.id, { tableData: updatedTableData })
    }
  }

  // Check for selection changes periodically
  useEffect(() => {
    const interval = setInterval(updateSelectedElement, 100)
    return () => clearInterval(interval)
  }, [])

  // Check for page selection changes
  useEffect(() => {
    const interval = setInterval(() => {
      if (dropZoneRef.current) {
        const pageId = dropZoneRef.current.getSelectedPageId()
        if (pageId !== selectedPageId) {
          setSelectedPageId(pageId)
        }
      }
    }, 100)
    return () => clearInterval(interval)
  }, [selectedPageId])

  const handleMarginChange = (top: number, right: number, bottom: number, left: number) => {
    if (selectedPageId) {
      updateSheet(selectedPageId, {
        margins: { top, right, bottom, left }
      })
    }
  }

  const handleShowMarginsChange = (show: boolean) => {
    if (selectedPageId) {
      updateSheet(selectedPageId, { showMargins: show })
    }
  }

  const handleShowGridChange = (show: boolean) => {
    if (selectedPageId) {
      updateSheet(selectedPageId, { showGrid: show })
    }
  }

  const handleToolbarClick = (elementType: string) => {
    if (elementType === 'media') {
      setShowPageSettings(false) // Close page settings
      setShowMediaLibrary(true)
    } else if (elementType === 'data') {
      setShowPageSettings(false) // Close page settings
      setShowDataLibrary(true)
    } else if (elementType === 'signature') {
      setShowPageSettings(false) // Close page settings
      setShowSignatureModal(true)
    } else if (dropZoneRef.current) {
      dropZoneRef.current.handleToolbarElementClick(elementType)
    }
  }

  const handleImageSelect = (imageData: { name: string; dataUrl: string }) => {
    setShowMediaLibrary(false)
    if (dropZoneRef.current) {
      dropZoneRef.current.addImageElement(imageData)
    }
  }

  const handleJSONSelect = (jsonData: { name: string; data: Record<string, unknown> }) => {
    setShowDataLibrary(false)
    console.log('JSON Data Selected:', jsonData)
    // TODO: Implement adding JSON data to the page
    // This could be used to create dynamic content or templates
  }

  const handleSignatureSave = (signatureDataUrl: string) => {
    setShowSignatureModal(false)
    if (dropZoneRef.current) {
      // Add the signature as an image element
      dropZoneRef.current.addImageElement({ name: 'signature', dataUrl: signatureDataUrl })
    }
  }

  // Get selection from store
  const selectedPageIdStore = useEditorStore(state => state.selectedSheetId)
  const setSelectedPageIdStore = useEditorStore(state => state.setSelectedSheet)

  return (
      <div className="h-screen w-screen flex flex-col relative">
        {/* Header with action buttons */}
        {/* <div className="bg-white border-b border-gray-200 p-4 shadow-sm flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4"> */}
              {/* <h1 className="text-xl font-bold text-gray-800">PDF Editor</h1> */}
              
              {/* Page Navigation */}
              {/* {!isPreviewMode && sheets.length > 0 && (
                <div className="flex gap-2">
                  {sheets.map((sheet, index) => (
                    <button
                      key={sheet.id}
                      onClick={() => setSelectedPageIdStore(sheet.id)}
                      className={`px-4 py-2 rounded transition-colors ${
                        selectedPageIdStore === sheet.id 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      Page {index + 1}
                    </button>
                  ))}
                </div>
              )} */}
            {/* </div> */}
            
            {/* <PdfHeader 
              onExportPDF={handleExportPDF} 
              onTogglePreview={handleTogglePreview}
              isPreviewMode={isPreviewMode}
            /> */}
        {/* //   </div> */}
        {/* // </div> */}

        {/* Main content area */}
        <div className="flex flex-1 overflow-hidden">
          {!isPreviewMode && (
            <>
              {/* Floating Toolbar - Left center */}
              <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50">
                <PdfEditorToolBar onElementClick={handleToolbarClick} />
              </div>
              
            </>
          )}
          
          <div className="flex-1 bg-gray-300 flex flex-col">
            {/* Page Tabs - VSCode style */}
            {!isPreviewMode && selectedPageIdStore && (
              <div className="bg-gray-100 flex items-center justify-between border-b p-4 border-gray-200 px-4">
                <PageTabs 
                  selectedPageId={selectedPageIdStore as string}
                  onPageSelect={(pageId: string) => setSelectedPageIdStore(pageId as string)}
                />
                 <div className="flex items-center gap-3">
                {/* Share Button */}
                <button
                  onClick={() => {
                    // TODO: Implement share functionality
                    console.log('Share clicked')
                  }}
                  className="p-2 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-all hover:scale-105 flex items-center gap-2"
                  title="Share"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">Share</span>
                </button>

                {/* Preview Button */}
                <button
                  onClick={handleTogglePreview}
                  className="p-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all hover:scale-105 flex items-center gap-2"
                  title="Preview"
                >
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">Preview</span>
                </button>

                {/* Download Button */}
                <button
                  onClick={handleExportPDF}
                  className="p-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all hover:scale-105 flex items-center gap-2"
                  title="Download PDF"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Download</span>
                </button>

                {/* Reset Button */}
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to reset the entire application? This will clear all pages and elements. This action cannot be undone.')) {
                      resetApp()
                    }
                  }}
                  className="p-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 transition-all hover:scale-105 flex items-center gap-2"
                  title="Reset Application"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="text-sm">Reset</span>
                </button>
              </div>
              </div>
            )}
            
            {isPreviewMode && pdfPreviewUrl ? (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 overflow-auto relative">
                {/* Back to Editor Button */}
                <button
                  onClick={handleTogglePreview}
                  className="fixed top-4 left-4 z-[1001] px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  title="Back to Editor"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Editor
                </button>
                
                <embed
                  src={pdfPreviewUrl}
                  type="application/pdf"
                  className="w-full h-full"
                  style={{ minHeight: '100vh' }}
                />
              </div>
            ) : (
              <div className="flex-1 overflow-auto">
                <DropZone ref={dropZoneRef} />
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar Settings */}
        {!isPreviewMode && selectedPageId && (
          <>
            {/* Text Formatting Toolbar - Show when text element is selected */}
            {selectedElement.type === 'text' && selectedElementData && (
              <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-96 bg-white border-l border-gray-200 shadow-xl z-50 overflow-y-auto">
                <div className="p-6">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Text Formatting</h2>
                    <TextFormattingToolbar 
                      selectedElementId={selectedElement.id}
                      selectedElementType={selectedElement.type}
                      selectedElementData={selectedElementData}
                      onStyleChange={handleStyleChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Page Settings Toggle Button */}
            {!selectedElement.id && selectedPageId && !showPageSettings && (
              <button
                onClick={() => setShowPageSettings(true)}
                className="fixed right-4 top-24 p-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors z-50"
                title="Show Page Settings"
              >
                <SlidersHorizontal className="w-5 h-5" />
              </button>
            )}

            {/* Page Settings - Show when no element is selected and no other panels are open */}
            {!selectedElement.id && selectedPageId && showPageSettings && !showMediaLibrary && !showDataLibrary && !showSignatureModal && (
              <PageSettingsPanelWithStore
                selectedPageId={selectedPageId}
                onMarginChange={handleMarginChange}
                onShowMarginsChange={handleShowMarginsChange}
                onShowGridChange={handleShowGridChange}
                onClose={() => setShowPageSettings(false)}
              />
            )}

            {/* Table Settings - Show when table element is selected */}
            {selectedElement.type === 'table' && selectedElementData?.tableData && (
              <TableSettingsPanel
                tableData={selectedElementData.tableData}
                onUpdate={handleTableSettingsUpdate}
              />
            )}

          {/* QR Code Settings - Show when qrcode element is selected */}
          {selectedElement.type === 'qrcode' && selectedElementData?.qrCodeData && (
            <QrCodeSettingsPanel
              url={selectedElementData.qrCodeData.url}
              size={selectedElementData.qrCodeData.size}
              viewBox={selectedElementData.qrCodeData.viewBox}
              onUpdate={(updates) => {
                if (!dropZoneRef.current || !selectedElement.id || !selectedElementData?.qrCodeData) return
                const merged = { ...selectedElementData.qrCodeData, ...updates }
                dropZoneRef.current.updateElementStyle(selectedElement.id, { qrCodeData: merged })
              }}
              onClose={() => setShowPageSettings(true)}
            />
          )}

            {/* Media Library - Show when media is clicked */}
            {showMediaLibrary && (
              <MediaLibrary
                onClose={() => {
                  setShowMediaLibrary(false)
                  setShowPageSettings(true)
                }}
                onImageSelect={handleImageSelect}
              />
            )}

            {/* JSON Data Library - Show when data is clicked */}
            {showDataLibrary && (
              <JSONDataLibrary
                onClose={() => {
                  setShowDataLibrary(false)
                  setShowPageSettings(true)
                }}
                onJSONSelect={handleJSONSelect}
              />
            )}

            {/* Signature Modal - Show when signature is clicked */}
            {showSignatureModal && (
              <SignatureModal
                isOpen={showSignatureModal}
                onClose={() => {
                  setShowSignatureModal(false)
                  setShowPageSettings(true)
                }}
                onSave={handleSignatureSave}
              />
            )}
          </>
        )}

    </div>
  )
}

export default PdfEditor