import { PDFDocument, rgb } from 'pdf-lib'
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import A4Page from './A4Page'
import { getPxToMmFactor } from './constants'
import { useEditorStore } from './store'
import { type DragItem } from './types'

interface DropZoneRef {
  exportToPDF: () => void
  previewPDF: () => Promise<string | null>
  handleToolbarElementClick: (elementType: string) => void
  getSelectedElement: () => { id: string | null; type: string | null }
  getSelectedElementData: () => DragItem | null
  updateElementStyle: (elementId: string | null, style: Record<string, unknown>) => void
  getSelectedPageId: () => string | null
  updatePageSettings: (pageId: string, settings: Record<string, unknown>) => void
  addImageElement: (imageData: { name: string; dataUrl: string }) => void
}

// Helper function to convert hex color to RGB (0-1 range for pdf-lib)
const hexToRgb = (hex: string) => {
  const cleanedHex = hex.replace('#', '')
  
  if (!/^[0-9A-Fa-f]{6}$/.test(cleanedHex)) {
    return null
  }
  
  const r = parseInt(cleanedHex.substring(0, 2), 16)
  const g = parseInt(cleanedHex.substring(2, 4), 16)
  const b = parseInt(cleanedHex.substring(4, 6), 16)
  
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return null
  }
  
  // Convert to 0-1 range for pdf-lib
  return rgb(r / 255, g / 255, b / 255)
}

// Helper to convert data URL to image bytes
const dataUrlToUint8Array = (dataUrl: string): Uint8Array => {
  try {
    const base64 = dataUrl.split(',')[1]
    if (!base64) {
      throw new Error('Invalid data URL format')
    }
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    console.log('[Helper] Converted data URL to Uint8Array, size:', bytes.length)
    return bytes
  } catch (error) {
    console.error('[Helper] Failed to convert data URL:', error)
    throw error
  }
}

// Helper to rotate image using canvas and return as PNG
const rotateImageDataUrl = async (dataUrl: string, rotation: number): Promise<string> => {
  if (rotation === 0) return dataUrl
  
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }
      
      const width = img.width
      const height = img.height
      
      // Calculate new dimensions after rotation
      const radians = (rotation * Math.PI) / 180
      const cosR = Math.abs(Math.cos(radians))
      const sinR = Math.abs(Math.sin(radians))
      const newWidth = Math.ceil(width * cosR + height * sinR)
      const newHeight = Math.ceil(width * sinR + height * cosR)
      
      canvas.width = newWidth
      canvas.height = newHeight
      
      // Apply rotation
      ctx.translate(newWidth / 2, newHeight / 2)
      ctx.rotate(radians)
      ctx.drawImage(img, -width / 2, -height / 2)
      
      resolve(canvas.toDataURL('image/png'))
    }
    img.onerror = reject
    img.src = dataUrl
  })
}

const DropZone = forwardRef<DropZoneRef>((_props, ref) => {
  // Get state and actions from Zustand store
  const sheets = useEditorStore(state => state.sheets)
  const selectedPageId = useEditorStore(state => state.selectedSheetId)
  const selectedElementId = useEditorStore(state => state.selectedElementId)
  const selectedElementType = useEditorStore(state => state.selectedElementType)
  const showMargins = useEditorStore(state => state.showMargins)
  const showGrid = useEditorStore(state => state.showGrid)
  const marginSize = useEditorStore(state => state.marginSize)
  
  const setSelectedPageId = useEditorStore(state => state.setSelectedSheet)
  const setSelectedElement = useEditorStore(state => state.setSelectedElement)
  const setShowMargins = useEditorStore(state => state.setShowMargins)
  const setShowGrid = useEditorStore(state => state.setShowGrid)
  const setMarginSize = useEditorStore(state => state.setMarginSize)
  const addElement = useEditorStore(state => state.addElement)
  const updateElement = useEditorStore(state => state.updateElement)
  const deleteElement = useEditorStore(state => state.deleteElement)
  const duplicateElement = useEditorStore(state => state.duplicateElement)
  const addSheet = useEditorStore(state => state.addSheet)
  const addSheetAtIndex = useEditorStore(state => state.addSheetAtIndex)
  const updateSheet = useEditorStore(state => state.updateSheet)
  const deleteSheet = useEditorStore(state => state.deleteSheet)
  const duplicateSheet = useEditorStore(state => state.duplicateSheet)
  const moveSheetUp = useEditorStore(state => state.moveSheetUp)
  const moveSheetDown = useEditorStore(state => state.moveSheetDown)
  
  const [newlyAddedElementId, setNewlyAddedElementId] = useState<string | null>(null)
  const [newlyAddedPageId, setNewlyAddedPageId] = useState<string | null>(null)
  const pageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const scrollContainerRef = useRef<HTMLDivElement | null>(null)
  
  // Initialize with first sheet if none exists
  useEffect(() => {
    if (sheets.length === 0) {
      addSheet()
    }
  }, [sheets.length, addSheet])

  // Ensure all sheets have margins and grid settings
  const processedSheets = useRef<Set<string>>(new Set())
  useEffect(() => {
    if (sheets.length === 0) return
    
    console.log('[DropZone] Checking sheets for migration:', sheets.length)
    
    // Migrate any sheets that need it (only once per sheet)
    sheets.forEach(sheet => {
      const needsMigration = !sheet.margins || sheet.showMargins === undefined || sheet.showGrid === undefined
      
      if (!processedSheets.current.has(sheet.id) && needsMigration) {
        console.log('[DropZone] Migrating sheet:', sheet.id, sheet.title)
        updateSheet(sheet.id, {
          margins: sheet.margins || {
            top: 20,
            right: 20,
            bottom: 20,
            left: 20
          },
          showMargins: sheet.showMargins ?? false,
          showGrid: sheet.showGrid ?? false
        })
        processedSheets.current.add(sheet.id)
      }
    })
    
    console.log('[DropZone] Migration complete. Processed:', Array.from(processedSheets.current))
  }, [sheets, updateSheet])

  // Scroll to newly added page
  useEffect(() => {
    if (newlyAddedPageId && pageRefs.current[newlyAddedPageId]) {
      const pageElement = pageRefs.current[newlyAddedPageId]
      if (pageElement) {
        pageElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [newlyAddedPageId])

  // Scroll to selected page when selection changes
  const previousSelectedPageId = useRef<string | null>(null)
  useEffect(() => {
    // Only scroll if the selected page actually changed
    if (selectedPageId && selectedPageId !== previousSelectedPageId.current) {
      previousSelectedPageId.current = selectedPageId
      
      if (pageRefs.current[selectedPageId]) {
        const pageElement = pageRefs.current[selectedPageId]
        if (pageElement) {
          // Small delay to ensure DOM is ready
          setTimeout(() => {
            pageElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }, 50)
        }
      }
    }
  }, [selectedPageId])
  
  const addElementToSheet = useCallback((sheetId: string, element: DragItem) => {
    addElement(sheetId, element)
    setNewlyAddedElementId(element.id)
    setTimeout(() => setNewlyAddedElementId(null), 100)
  }, [addElement])

  const handleToolbarElementClick = (elementType: string) => {
    if (!selectedPageId) return
    
    // Find the current page
    const currentSheet = sheets.find(sheet => sheet.id === selectedPageId)
    const existingElements = currentSheet?.elements || []
    
    // Find a position that doesn't overlap with existing elements
    let x = 50
    let y = 50
    const newElementWidth = elementType === 'table' ? 400 : elementType === 'line' ? 200 : 100
    const newElementHeight = elementType === 'table' ? 180 : elementType === 'line' ? 2 : 100
    
    // Try positions until we find one without overlap
    let attempts = 0
    const maxAttempts = 100
    let positionFound = false
    
    while (!positionFound && attempts < maxAttempts) {
      // Check if this position overlaps with any existing element
      const overlaps = existingElements.some(element => {
        const ex = element.position.x
        const ey = element.position.y
        const ew = element.size.width
        const eh = element.size.height
        
        // Check if rectangles overlap
        return !(x + newElementWidth < ex || 
                 ex + ew < x || 
                 y + newElementHeight < ey || 
                 ey + eh < y)
      })
      
      if (!overlaps) {
        positionFound = true
      } else {
        // Try moving down, then right
        y += 120
        if (y > 800) { // If too far down, start a new column
          y = 50
          x += 120
        }
      }
      attempts++
    }
    
    // Find the highest zIndex in the current sheet to place new element on top
    const sheetForZIndex = sheets.find(sheet => sheet.id === selectedPageId)
    const elementsInSheet = sheetForZIndex?.elements || []
    const maxZIndex = elementsInSheet.length > 0 
      ? elementsInSheet.reduce((max, el) => Math.max(max, el.zIndex), 0)
      : 0
    
    const baseElement: Partial<DragItem> = {
      type: elementType,
      id: `${selectedPageId}-${uuidv4()}`,
      position: { x, y },
      size: { width: newElementWidth, height: newElementHeight },
      rotation: 0,
      color: 'black',
      zIndex: maxZIndex + 1 // New elements appear on top (Canva-style)
    }

    // Add type-specific defaults
    if (elementType === 'text') {
      baseElement.textContent = 'Your paragraph text'
      baseElement.textStyle = {
        bold: false,
        italic: false,
        underline: false,
        align: 'left',
        fontSize: 16,
        fontFamily: 'Arial',
        color: '#000000'
      }
    } else if (elementType === 'table') {
      baseElement.tableData = {
        rows: 3,
        columns: 3,
        cellData: {},
        headerColor: '#E0E0E0' // Light gray default header color
      }
    } else if (elementType === 'line') {
      baseElement.lineStyle = {
        strokeStyle: 'solid',
        startArrow: 'none',
        endArrow: 'none',
        lineWidth: 2,
        color: 'black'
      }
    }
    
    addElementToSheet(selectedPageId, baseElement as DragItem)
  }


  const updateSheetTitle = (sheetId: string, title: string) => {
    updateSheet(sheetId, { title })
  }

  // Page control handlers
  const handleMovePageUp = useCallback((sheetId: string) => {
    moveSheetUp(sheetId)
  }, [moveSheetUp])

  const handleMovePageDown = useCallback((sheetId: string) => {
    moveSheetDown(sheetId)
  }, [moveSheetDown])

  const handleDuplicatePage = useCallback((sheetId: string) => {
    duplicateSheet(sheetId)
  }, [duplicateSheet])

  const handleDeletePage = useCallback((sheetId: string) => {
    deleteSheet(sheetId)
  }, [deleteSheet])

  const handleAddPageAtIndex = useCallback((index?: number) => {
    if (index === undefined || index < 0) {
      // If no index specified, add at the end
      const sheetCount = sheets.length
      addSheet()
      // Wait for the new sheet to be added and scroll to it
    setTimeout(() => {
        const newSheets = useEditorStore.getState().sheets
        if (newSheets.length > sheetCount) {
          const newSheetId = newSheets[newSheets.length - 1]?.id
          if (newSheetId) {
            setNewlyAddedPageId(newSheetId)
            setTimeout(() => setNewlyAddedPageId(null), 100)
          }
        }
      }, 50)
      return
    }
    
    // Insert the new sheet AFTER the current page (index + 1)
    // This is Canva-like behavior: clicking "add page" on page N adds a new page after it
    const insertIndex = index + 1
    
    // Set the sheet at this index as selected so margins/grid are inherited
    const targetSheet = sheets[index]
    if (targetSheet) {
      setSelectedPageId(targetSheet.id)
    }
    
    // Insert the new sheet after the current page
    addSheetAtIndex(insertIndex)
    
    // Wait for the new sheet to be added and scroll to it
    setTimeout(() => {
      const newSheets = useEditorStore.getState().sheets
      if (newSheets.length > 0 && newSheets[insertIndex]) {
        const newSheetId = newSheets[insertIndex]?.id
        if (newSheetId) {
          setNewlyAddedPageId(newSheetId)
          setTimeout(() => setNewlyAddedPageId(null), 100)
        }
      }
    }, 50)
  }, [addSheet, addSheetAtIndex, sheets, setSelectedPageId])

  const deleteElementFromSheet = (sheetId: string, elementIndex: number) => {
    const sheet = sheets.find(s => s.id === sheetId)
    if (!sheet || !sheet.elements) return
    const element = sheet.elements[elementIndex]
    if (!element) return
    deleteElement(sheetId, element.id)
  }

  const duplicateElementInSheet = (sheetId: string, elementIndex: number) => {
    const sheet = sheets.find(s => s.id === sheetId)
    if (!sheet || !sheet.elements) return
        const element = sheet.elements[elementIndex]
    if (!element) return
    duplicateElement(sheetId, element.id)
  }

  const updateElementInSheet = (sheetId: string, elementIndex: number, updates: Partial<DragItem>) => {
    const sheet = sheets.find(s => s.id === sheetId)
    if (!sheet || !sheet.elements) return
    const element = sheet.elements[elementIndex]
    if (!element) return
    updateElement(sheetId, element.id, updates)
  }

  const addImageElement = useCallback((imageData: { name: string; dataUrl: string }) => {
    if (!selectedPageId) return
    
    // Load the image to get its actual dimensions
    const img = new Image()
    img.onload = () => {
      console.log('[Signature] Actual image dimensions:', img.width, 'x', img.height)
      
      const aspectRatio = img.width / img.height
      const maxWidth = 300
      const maxHeight = 150
      
      let width = img.width
      let height = img.height
      
      // Scale down if too large
      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          width = maxWidth
          height = maxWidth / aspectRatio
        } else {
          height = maxHeight
          width = maxHeight * aspectRatio
        }
      }
      
      console.log('[Signature] Final element size:', width, 'x', height)
      
      // For signatures, always use the full canvas size without cropping
      const imageElement: DragItem = {
        type: 'image',
        id: `${selectedPageId}-${uuidv4()}`,
        position: { x: 50, y: 50 },
        size: { width: Math.round(width), height: Math.round(height) },
        rotation: 0,
        color: 'transparent',
        zIndex: 1,
        imageUrl: imageData.dataUrl
      }
      
      addElementToSheet(selectedPageId, imageElement)
    }
    img.onerror = () => {
      // Fallback if image fails to load
      const imageElement: DragItem = {
        type: 'image',
        id: `${selectedPageId}-${uuidv4()}`,
        position: { x: 50, y: 50 },
        size: { width: 300, height: 150 },
        rotation: 0,
        color: 'transparent',
        zIndex: 1,
        imageUrl: imageData.dataUrl
      }
      addElementToSheet(selectedPageId, imageElement)
    }
    img.src = imageData.dataUrl
  }, [selectedPageId, addElementToSheet])

  const exportToPDF = useCallback(async () => {
    try {
      // Create a new PDF document (pdf-lib)
      const pdfDoc = await PDFDocument.create()
      
      // A4 size in points (595.3 x 841.89 points)
      const pageWidth = 595.3
      const pageHeight = 841.89
      
      // Keep track of embedded images
      const embeddedImages: Record<string, unknown> = {}
      
      const pxToMmFactor = getPxToMmFactor()
      console.log(`[PDF Export] Using conversion factor: ${pxToMmFactor.toFixed(6)}`)
      
      // Helper to convert mm to points
      const mmToPt = (mm: number) => mm * 2.83465
      
      // Helper to convert pixels to points
      const pxToPt = (px: number) => mmToPt(px / pxToMmFactor)

            // Iterate through each sheet and add to PDF
      for (let sheetIndex = 0; sheetIndex < sheets.length; sheetIndex++) {
        const sheet = sheets[sheetIndex]
        
        // Create a new page
        const page = pdfDoc.addPage([pageWidth, pageHeight])

        // Add elements from the sheet
              if (sheet.elements && sheet.elements.length > 0) {
                // Sort elements by zIndex to maintain layering
                const sortedElements = [...sheet.elements].sort((a, b) => a.zIndex - b.zIndex)
                
          // Render each element on the page
          for (const element of sortedElements) {
            // Convert pixels to points (with Y-axis inversion)
            // In PDF coordinate system: y=0 is at bottom, y=pageHeight is at top
            // In editor coordinate system: y=0 is at top, y=pageHeight is at bottom
            // Element position is top-left corner, so we need to flip it
            const x = pxToPt(element.position.x)
            const yPx = pxToPt(element.position.y)
            const heightPx = pxToPt(element.size.height)
            const y = pageHeight - yPx - heightPx // Invert Y and subtract height to get bottom-left
            const width = pxToPt(element.size.width)
            const height = heightPx
            const rotation = element.rotation || 0
            
            console.log(`[PDF Export] Element ${element.id}: position=(${element.position.x},${element.position.y}), size=(${element.size.width},${element.size.height}), converted to x=${x.toFixed(2)}, y=${y.toFixed(2)}, w=${width.toFixed(2)}, h=${height.toFixed(2)}`)
                
            // Render element based on type
            if (element.type === 'text' && element.textContent) {
              // Render text element matching exact editor position
              const textStyle = element.textStyle || {}
              const fontSizePx = (typeof textStyle.fontSize === 'number' && textStyle.fontSize > 0) ? textStyle.fontSize : 14
              const fontSizePt = pxToPt(fontSizePx)
              const color = hexToRgb(textStyle.color || '#000000') || rgb(0, 0, 0)
              
              // Get all lines including newlines
              const textLines = element.textContent.split('\n')
              const lineHeight = fontSizePt * 1.2
              
              // In PDF coords: y is bottom-left of element
              // pdf-lib's drawText expects y to be the baseline
              // If we're at y + height (top of element), the baseline is below
              // So we need to subtract fontSize to get the baseline at the right position
              let textY = y + height - fontSizePt
              
              textLines.forEach(line => {
                if (line) {
                  page.drawText(line, {
                    x: x,
                    y: textY,
                    size: fontSizePt,
                    color: color,
                    maxWidth: width,
                  })
                }
                textY -= lineHeight
              })
            } else if (element.type === 'image' && element.imageUrl) {
              // Render image element
              try {
                const isSignature = element.imageUrl.includes('signature') || element.imageUrl.includes('canvas') || element.id.includes('cf4e') || element.id.includes('d0ae4891')
                console.log('[PDF Export] Rendering image:', element.imageUrl.substring(0, 50), '...', isSignature ? '(SIGNATURE)' : '')
                if (isSignature) console.log('[PDF Export] DETECTED SIGNATURE! Image URL:', element.imageUrl.substring(0, 100))
                
                // Create cache key with rotation
                const imageCacheKey = `${element.imageUrl}_${rotation}`
                
                if (!embeddedImages[imageCacheKey]) {
                  console.log('[PDF Export] Embedding image...')
                  
                  // Rotate image if needed
                  const imageDataUrl = await rotateImageDataUrl(element.imageUrl, rotation)
                  const imageBytes = dataUrlToUint8Array(imageDataUrl)
                  console.log('[PDF Export] Image bytes length:', imageBytes.length)
                  
                  // Try to determine image type and embed accordingly
                  let pdfImage
                  if (imageDataUrl.startsWith('data:image/png')) {
                    pdfImage = await pdfDoc.embedPng(imageBytes)
                    console.log('[PDF Export] Embedded as PNG')
                  } else if (imageDataUrl.startsWith('data:image/jpeg') || imageDataUrl.startsWith('data:image/jpg')) {
                    pdfImage = await pdfDoc.embedJpg(imageBytes)
                    console.log('[PDF Export] Embedded as JPG')
                  } else {
                    // Default to PNG
                    pdfImage = await pdfDoc.embedPng(imageBytes)
                    console.log('[PDF Export] Embedded as PNG (default)')
                  }
                  
                  embeddedImages[imageCacheKey] = pdfImage
                  console.log('[PDF Export] Image embedded successfully')
                }
                
                const imageToDraw = embeddedImages[imageCacheKey] as any
                
                // y is already the bottom-left position in PDF coordinates
                // We calculated: y = pageHeight - yPx - heightPx
                // This gives us the bottom-left corner ready for drawImage
                
                const imageY = y
                
                if (isSignature) {
                  console.log('[PDF Export] *** SIGNATURE PLACEMENT ***')
                  console.log('[PDF Export] Editor Y:', element.position.y, 'Height:', element.size.height)
                  console.log('[PDF Export] yPx (converted):', yPx.toFixed(2), 'heightPx:', heightPx.toFixed(2))
                  console.log('[PDF Export] y (top in PDF):', y.toFixed(2), 'imageY (bottom in PDF):', imageY.toFixed(2))
                  console.log('[PDF Export] Draw at (x, y):', x.toFixed(2), ',', imageY.toFixed(2))
                }
                
                // Draw the rotated image
                page.drawImage(imageToDraw, {
                  x: x,
                  y: imageY,
                  width: width,
                  height: height
                })
                
                console.log('[PDF Export] Image drawn successfully')
              } catch (error) {
                console.error('[PDF Export] Failed to embed/draw image:', error)
              }
                  } else if (element.type === 'table' && element.tableData) {
              // Render table element
              const { rows, columns, cellData, headerColor, showBodyBorder } = element.tableData
                    const cellWidth = width / columns
                    const cellHeight = height / rows
                    
              // Draw borders
              if (showBodyBorder !== false) {
                const borderColor = rgb(0, 0, 0)
                // Horizontal lines
                    for (let i = 0; i <= rows; i++) {
                  const lineY = y - (i * cellHeight)
                  page.drawLine({
                    start: { x: x, y: lineY },
                    end: { x: x + width, y: lineY },
                    thickness: 1,
                    color: borderColor
                  })
                }
                // Vertical lines
                    for (let j = 0; j <= columns; j++) {
                      const lineX = x + (j * cellWidth)
                  page.drawLine({
                    start: { x: lineX, y: y },
                    end: { x: lineX, y: y - height },
                    thickness: 1,
                    color: borderColor
                  })
                }
              }
              
              // Fill header row
                    if (headerColor && rows > 0) {
                const headerFillColor = hexToRgb(headerColor) || rgb(0.8, 0.8, 0.8)
                      for (let j = 0; j < columns; j++) {
                  page.drawRectangle({
                    x: x + (j * cellWidth),
                    y: y - cellHeight,
                    width: cellWidth,
                    height: cellHeight,
                    borderColor: rgb(0, 0, 0),
                    color: headerFillColor
                  })
                      }
                    }
                    
                    // Add cell content
                    for (let i = 0; i < rows; i++) {
                      for (let j = 0; j < columns; j++) {
                        const cellKey = `${i}-${j}`
                        const cellContent = cellData[cellKey] || ''
                  
                        if (cellContent) {
                    const baseFontSize = element.tableData.baseFontSize || 14
                    const headerFontSize = element.tableData.headerFontSize
                    const columnFontSize = element.tableData.columnFontSizes?.[j]
                    const rowFontSize = element.tableData.rowFontSizes?.[i]
                    const cellFontSize = element.tableData.cellFontSizes?.[cellKey]
                    
                    const finalFontSize = cellFontSize || rowFontSize || columnFontSize || 
                                       (i === 0 && headerFontSize) || baseFontSize
                    
                    // Convert font size from pixels to points
                    const fontSizeInPoints = pxToPt(finalFontSize)
                    
                    // Calculate proper positioning: x and y are already in points
                    const cellX = x + (j * cellWidth) + 3 // Padding from left
                    const cellTopY = y - (i * cellHeight) // Top of cell in PDF coordinates
                    
                    // Position text: in PDF coordinates, y=0 is bottom
                    // cellTopY is the top of the cell, text baseline should be near bottom of cell
                    const cellBottomY = cellTopY - cellHeight // Bottom of cell
                    const textY = cellBottomY + fontSizeInPoints + 3 // Position text with padding from bottom
                    
                    // Draw text with wrap support
                    page.drawText(cellContent, {
                      x: cellX,
                      y: textY,
                      size: fontSizeInPoints,
                      color: rgb(0, 0, 0),
                      maxWidth: cellWidth - 6 // Leave padding on both sides
                    })
                        }
                      }
                    }
                  } else if (element.type === 'line') {
              // Render line element
              const lineStyle = element.lineStyle
              const lineWidth = (lineStyle && typeof lineStyle.lineWidth === 'number' && lineStyle.lineWidth > 0)
                ? lineStyle.lineWidth : 2
              const lineColor = hexToRgb((lineStyle && lineStyle.color) || element.color || '#000000') || rgb(0, 0, 0)
              
              // Line spans horizontally in editor
              const lineStartY = y + height / 2
              const lineEndY = lineStartY
              
              page.drawLine({
                start: { x: x, y: lineStartY },
                end: { x: x + width, y: lineEndY },
                thickness: lineWidth / 3.78, // Convert px to points
                color: lineColor
              })
            }
          }
        }
      }

      // Save the PDF using pdf-lib
      const pdfBytes = await pdfDoc.save()
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'document.pdf'
      link.click()
      URL.revokeObjectURL(url)
      
      console.log('PDF exported successfully')
    } catch (error) {
      console.error('Error exporting PDF:', error)
      alert('Failed to export PDF. Please try again.')
    }
  }, [sheets])

  const previewPDF = useCallback(async () => {
    try {
      // Create a new PDF document (pdf-lib) - same as export
      const pdfDoc = await PDFDocument.create()
      
      // A4 size in points (595.3 x 841.89 points)
      const pageWidth = 595.3
      const pageHeight = 841.89
      
      // Keep track of embedded images
      const embeddedImages: Record<string, unknown> = {}
      
      const pxToMmFactor = getPxToMmFactor()
      console.log(`[PDF Preview] Using conversion factor: ${pxToMmFactor.toFixed(6)}`)
      
      // Helper to convert mm to points
      const mmToPt = (mm: number) => mm * 2.83465
      
      // Helper to convert pixels to points
      const pxToPt = (px: number) => mmToPt(px / pxToMmFactor)

      // Iterate through each sheet and add to PDF
      for (let sheetIndex = 0; sheetIndex < sheets.length; sheetIndex++) {
        const sheet = sheets[sheetIndex]
        
        // Create a new page
        const page = pdfDoc.addPage([pageWidth, pageHeight])

        // Add elements from the sheet
      if (sheet.elements && sheet.elements.length > 0) {
          // Sort elements by zIndex to maintain layering
          const sortedElements = [...sheet.elements].sort((a, b) => a.zIndex - b.zIndex)
          
          // Render each element on the page (same as export)
          for (const element of sortedElements) {
            // Convert pixels to points (with Y-axis inversion)
            // In PDF coordinate system: y=0 is at bottom, y=pageHeight is at top
            // In editor coordinate system: y=0 is at top, y=pageHeight is at bottom
            // Element position is top-left corner, so we need to flip it
            const x = pxToPt(element.position.x)
            const yPx = pxToPt(element.position.y)
            const heightPx = pxToPt(element.size.height)
            const y = pageHeight - yPx - heightPx // Invert Y and subtract height to get bottom-left
            const width = pxToPt(element.size.width)
            const height = heightPx
            const rotation = element.rotation || 0
            
            console.log(`[PDF Preview] Element ${element.id}: position=(${element.position.x},${element.position.y}), size=(${element.size.width},${element.size.height}), converted to x=${x.toFixed(2)}, y=${y.toFixed(2)}, w=${width.toFixed(2)}, h=${height.toFixed(2)}`)
                
            // Render element based on type (same rendering logic as export)
            if (element.type === 'text' && element.textContent) {
              // Render text element matching exact editor position
              const textStyle = element.textStyle || {}
              const fontSizePx = (typeof textStyle.fontSize === 'number' && textStyle.fontSize > 0) ? textStyle.fontSize : 14
              const fontSizePt = pxToPt(fontSizePx)
              const color = hexToRgb(textStyle.color || '#000000') || rgb(0, 0, 0)
              
              // Get all lines including newlines
              const textLines = element.textContent.split('\n')
              const lineHeight = fontSizePt * 1.2
              
              // In PDF coords: y is bottom-left of element
              // pdf-lib's drawText expects y to be the baseline
              // If we're at y + height (top of element), the baseline is below
              // So we need to subtract fontSize to get the baseline at the right position
              let textY = y + height - fontSizePt
              
              textLines.forEach(line => {
                if (line) {
                  page.drawText(line, {
                    x: x,
                    y: textY,
                    size: fontSizePt,
                    color: color,
                    maxWidth: width,
                  })
                }
                textY -= lineHeight
              })
            } else if (element.type === 'image' && element.imageUrl) {
              try {
                const isSignature = element.imageUrl.includes('signature') || element.imageUrl.includes('canvas') || element.id.includes('cf4e') || element.id.includes('d0ae4891')
                console.log('[PDF Preview] Rendering image:', element.imageUrl.substring(0, 50), '...', isSignature ? '(SIGNATURE)' : '')
                if (isSignature) console.log('[PDF Preview] DETECTED SIGNATURE! Image URL:', element.imageUrl.substring(0, 100))
                
                // Create cache key with rotation
                const imageCacheKey = `${element.imageUrl}_${rotation}`
                
                if (!embeddedImages[imageCacheKey]) {
                  console.log('[PDF Preview] Embedding image...')
                  
                  // Rotate image if needed
                  const imageDataUrl = await rotateImageDataUrl(element.imageUrl, rotation)
                  const imageBytes = dataUrlToUint8Array(imageDataUrl)
                  console.log('[PDF Preview] Image bytes length:', imageBytes.length)
                  
                  // Try to determine image type and embed accordingly
                  let pdfImage
                  if (imageDataUrl.startsWith('data:image/png')) {
                    pdfImage = await pdfDoc.embedPng(imageBytes)
                    console.log('[PDF Preview] Embedded as PNG')
                  } else if (imageDataUrl.startsWith('data:image/jpeg') || imageDataUrl.startsWith('data:image/jpg')) {
                    pdfImage = await pdfDoc.embedJpg(imageBytes)
                    console.log('[PDF Preview] Embedded as JPG')
                  } else {
                    // Default to PNG
                    pdfImage = await pdfDoc.embedPng(imageBytes)
                    console.log('[PDF Preview] Embedded as PNG (default)')
                  }
                  
                  embeddedImages[imageCacheKey] = pdfImage
                  console.log('[PDF Preview] Image embedded successfully')
                }
                
                const imageToDraw = embeddedImages[imageCacheKey] as any
                
                // y is already the bottom-left position in PDF coordinates
                // We calculated: y = pageHeight - yPx - heightPx
                // This gives us the bottom-left corner ready for drawImage
                
                const imageY = y
                
                if (isSignature) {
                  console.log('[PDF Preview] *** SIGNATURE PLACEMENT ***')
                  console.log('[PDF Preview] Editor Y:', element.position.y, 'Height:', element.size.height)
                  console.log('[PDF Preview] yPx (converted):', yPx.toFixed(2), 'heightPx:', heightPx.toFixed(2))
                  console.log('[PDF Preview] y (top in PDF):', y.toFixed(2), 'imageY (bottom in PDF):', imageY.toFixed(2))
                  console.log('[PDF Preview] Draw at (x, y):', x.toFixed(2), ',', imageY.toFixed(2))
                }
                
                // Draw the rotated image
                page.drawImage(imageToDraw, {
                  x: x,
                  y: imageY,
                  width: width,
                  height: height
                })
                
                console.log('[PDF Preview] Image drawn successfully')
              } catch (error) {
                console.error('[PDF Preview] Failed to embed/draw image:', error)
              }
            } else if (element.type === 'table' && element.tableData) {
              const { rows, columns, cellData, headerColor, showBodyBorder } = element.tableData
              const cellWidth = width / columns
              const cellHeight = height / rows
              
              if (showBodyBorder !== false) {
                const borderColor = rgb(0, 0, 0)
                for (let i = 0; i <= rows; i++) {
                  const lineY = y - (i * cellHeight)
                  page.drawLine({
                    start: { x: x, y: lineY },
                    end: { x: x + width, y: lineY },
                    thickness: 1,
                    color: borderColor
                  })
                }
                for (let j = 0; j <= columns; j++) {
                  const lineX = x + (j * cellWidth)
                  page.drawLine({
                    start: { x: lineX, y: y },
                    end: { x: lineX, y: y - height },
                    thickness: 1,
                    color: borderColor
                  })
                }
              }
              
              if (headerColor && rows > 0) {
                const headerFillColor = hexToRgb(headerColor) || rgb(0.8, 0.8, 0.8)
                for (let j = 0; j < columns; j++) {
                  page.drawRectangle({
                    x: x + (j * cellWidth),
                    y: y - cellHeight,
                    width: cellWidth,
                    height: cellHeight,
                    borderColor: rgb(0, 0, 0),
                    color: headerFillColor
                  })
                }
              }
              
              for (let i = 0; i < rows; i++) {
                for (let j = 0; j < columns; j++) {
                  const cellKey = `${i}-${j}`
                  const cellContent = cellData[cellKey] || ''
                  
                  if (cellContent) {
                    const baseFontSize = element.tableData.baseFontSize || 14
                    const headerFontSize = element.tableData.headerFontSize
                    const columnFontSize = element.tableData.columnFontSizes?.[j]
                    const rowFontSize = element.tableData.rowFontSizes?.[i]
                    const cellFontSize = element.tableData.cellFontSizes?.[cellKey]
                    
                    const finalFontSize = cellFontSize || rowFontSize || columnFontSize || 
                                       (i === 0 && headerFontSize) || baseFontSize
                    
                    // Convert font size from pixels to points
                    const fontSizeInPoints = pxToPt(finalFontSize)
                    
                    // Calculate proper positioning: x and y are already in points
                    const cellX = x + (j * cellWidth) + 3 // Padding from left
                    const cellTopY = y - (i * cellHeight) // Top of cell in PDF coordinates
                    
                    // Position text: in PDF coordinates, y=0 is bottom
                    // cellTopY is the top of the cell, text baseline should be near bottom of cell
                    const cellBottomY = cellTopY - cellHeight // Bottom of cell
                    const textY = cellBottomY + fontSizeInPoints + 3 // Position text with padding from bottom
                    
                    // Draw text with wrap support
                    page.drawText(cellContent, {
                      x: cellX,
                      y: textY,
                      size: fontSizeInPoints,
                      color: rgb(0, 0, 0),
                      maxWidth: cellWidth - 6 // Leave padding on both sides
                    })
                  }
                }
              }
            } else if (element.type === 'line') {
              const lineStyle = element.lineStyle
              const lineWidth = (lineStyle && typeof lineStyle.lineWidth === 'number' && lineStyle.lineWidth > 0)
                ? lineStyle.lineWidth : 2
              const lineColor = hexToRgb((lineStyle && lineStyle.color) || element.color || '#000000') || rgb(0, 0, 0)
              
              const lineStartY = y + height / 2
              const lineEndY = lineStartY
              
              page.drawLine({
                start: { x: x, y: lineStartY },
                end: { x: x + width, y: lineEndY },
                thickness: lineWidth / 3.78,
                color: lineColor
              })
            }
          }
        }
      }

      // Get PDF as bytes and return blob URL
      const pdfBytes = await pdfDoc.save()
      console.log('PDF bytes generated:', pdfBytes.length, 'bytes')
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' })
      console.log('Blob created:', blob.size, 'bytes')
      const url = URL.createObjectURL(blob)
      console.log('PDF preview generated successfully, blob URL:', url)
      return url
    } catch (error) {
      console.error('Error generating PDF preview:', error)
    return null
    }
  }, [sheets])

  const handleElementSelect = (elementId: string | null, elementType: string | null) => {
    setSelectedElement(elementId, elementType)
  }

  const updateElementStyle = useCallback((elementId: string | null, style: Partial<DragItem>) => {
    if (!elementId || !selectedPageId) return
    
    updateElement(selectedPageId, elementId, style)
  }, [selectedPageId, updateElement])

  const getSelectedElementData = useCallback(() => {
    if (!selectedElementId) return null
    
    const currentSheet = sheets.find(sheet => sheet.id === selectedPageId)
    if (!currentSheet || !currentSheet.elements) return null
    
    return currentSheet.elements.find(el => el.id === selectedElementId) || null
  }, [selectedElementId, selectedPageId, sheets])

  const getSelectedPageId = useCallback(() => selectedPageId, [selectedPageId])

  const updatePageSettings = useCallback((pageId: string, settings: Record<string, unknown>) => {
    updateSheet(pageId, settings)
  }, [updateSheet])

  useImperativeHandle(ref, () => ({
    exportToPDF,
    previewPDF,
    handleToolbarElementClick: (elementType: string) => {
      if (!selectedPageId) return
      const currentSheet = sheets.find(sheet => sheet.id === selectedPageId)
      const existingElements = currentSheet?.elements || []
      
      let x = 50, y = 50
      const newElementWidth = elementType === 'table' ? 400 : elementType === 'line' ? 200 : 100
      const newElementHeight = elementType === 'table' ? 180 : elementType === 'line' ? 2 : 100
      
      let attempts = 0, positionFound = false
      while (!positionFound && attempts < 100) {
        const overlaps = existingElements.some(element => {
          const ex = element.position.x, ey = element.position.y
          const ew = element.size.width, eh = element.size.height
          return !(x + newElementWidth < ex || x > ex + ew || y + newElementHeight < ey || y > ey + eh)
        })
        positionFound = !overlaps
        if (!positionFound) { x += 50; y += 50; attempts++ }
      }

      let element: DragItem
      const maxZIndex = Math.max(...existingElements.map(el => el.zIndex), 0)
      
      if (elementType === 'text') {
        element = {
          type: 'text',
          id: `${selectedPageId}-${uuidv4()}`,
          position: { x, y },
          size: { width: newElementWidth, height: newElementHeight },
          rotation: 0,
          color: '#000000',
          zIndex: maxZIndex + 1,
          textStyle: { fontSize: 14, color: '#000000', bold: false, italic: false, align: 'left' },
          textContent: 'New Text'
        }
      } else if (elementType === 'line') {
        element = {
          type: 'line',
          id: `${selectedPageId}-${uuidv4()}`,
          position: { x, y },
          size: { width: newElementWidth, height: 20 },
          rotation: 0,
          color: '#000000',
          zIndex: maxZIndex + 1,
          lineStyle: { strokeStyle: 'solid', lineWidth: 2, color: '#000000', startArrow: 'none', endArrow: 'none' }
        }
      } else if (elementType === 'table') {
        element = {
          type: 'table',
          id: `${selectedPageId}-${uuidv4()}`,
          position: { x, y },
          size: { width: 400, height: 180 },
          rotation: 0,
          color: 'transparent',
          zIndex: maxZIndex + 1,
          tableData: {
            rows: 3,
            columns: 3,
            cellData: { '0-0': 'Header 1', '0-1': 'Header 2', '0-2': 'Header 3', '1-0': 'Data 1', '1-1': 'Data 2', '1-2': 'Data 3', '2-0': 'Data 4', '2-1': 'Data 5', '2-2': 'Data 6' },
            headerColor: '#e3f2fd',
            showHeaderBorder: true,
            showBodyBorder: true,
            baseFontSize: 14,
            headerFontSize: undefined,
            columnFontSizes: {},
            rowFontSizes: {},
            cellFontSizes: {}
          }
        }
      } else {
        return
      }
      
      addElementToSheet(selectedPageId, element)
    },
    getSelectedElement: () => ({ id: selectedElementId, type: selectedElementType }),
    getSelectedElementData,
    updateElementStyle,
    getSelectedPageId,
    updatePageSettings,
    addImageElement
  }), [
    exportToPDF,
    previewPDF,
    selectedPageId,
    sheets,
    selectedElementId,
    selectedElementType,
    addElementToSheet,
    getSelectedElementData,
    updateElementStyle,
    getSelectedPageId,
    updatePageSettings,
    addImageElement
  ])

  return (
    <div className="relative w-full h-full">
      {/* Fixed page navigation buttons */}
      {/* {sheets.length > 0 && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[9999] flex gap-2">
          {sheets.map((sheet, index) => (
                <button
              key={sheet.id}
              onClick={() => setSelectedPageId(sheet.id)}
              className={`px-4 py-2 rounded-lg shadow-xl transition-all ${
                selectedPageId === sheet.id 
                  ? 'bg-blue-600 text-white scale-105' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:scale-105'
              }`}
            >
              Page {index + 1}
                </button>
          ))}
              </div>
      )} */}
      
      <div className="absolute inset-0 overflow-auto">
        <div className="flex flex-col items-center w-full min-h-full p-8 bg-gray-50">

          <div className="flex flex-col items-center gap-8">
                {sheets.map((sheet, index) => (
                      <A4Page 
                        key={sheet.id}
                        pageNumber={index + 1}
                pageTitle={sheet.title || `Page ${index + 1}`}
                        onPageTitleChange={(title) => updateSheetTitle(sheet.id, title)}
                onSelect={() => {
                  console.log('A4Page onSelect called for sheet:', sheet.id)
                  setSelectedPageId(sheet.id)
                }}
                onMoveUp={() => handleMovePageUp(sheet.id)}
                onMoveDown={() => handleMovePageDown(sheet.id)}
                onHide={() => {/* Hide functionality not yet implemented */}}
                onDuplicate={() => handleDuplicatePage(sheet.id)}
                onDelete={() => handleDeletePage(sheet.id)}
                onAddPage={() => handleAddPageAtIndex(index)}
                        pageIndex={index}
                sheetId={sheet.id}
                elements={sheet.elements}
                isSelected={sheet.id === selectedPageId}
                        onElementSelect={handleElementSelect}
                onUpdateElement={(sid, idx, updates) => {
                  const element = sheet.elements?.[idx]
                  if (element) updateElement(sid, element.id, updates)
                }}
                onDeleteElement={(sid, idx) => {
                  const element = sheet.elements?.[idx]
                  if (element) deleteElement(sid, element.id)
                }}
                onDuplicateElement={(sid, idx) => {
                  const element = sheet.elements?.[idx]
                  if (element) duplicateElement(sid, element.id)
                }}
                showMargins={sheet.showMargins ?? false}
                showGrid={sheet.showGrid ?? false}
                margins={sheet.margins}
                newlyAddedElementId={undefined}
                pageRef={(ref) => {
                  if (ref) {
                    pageRefs.current[sheet.id] = ref
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
})

export default DropZone
