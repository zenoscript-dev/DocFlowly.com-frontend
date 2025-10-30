import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DragItem, Sheet } from './types'

interface EditorState {
  sheets: Sheet[]
  history: Sheet[][]
  historyIndex: number
  maxHistorySize: number
  
  // Selection state
  selectedSheetId: string | null
  selectedElementId: string | null
  selectedElementType: string | null
  
  // UI state
  showMargins: boolean
  showGrid: boolean
  marginSize: number
  
  // JSON Data Library
  jsonDataLibrary: string
}

interface EditorActions {
  // Sheet operations
  setSheets: (sheets: Sheet[]) => void
  addSheet: () => void
  addSheetAtIndex: (index: number) => void
  updateSheet: (sheetId: string, updates: Partial<Sheet>) => void
  deleteSheet: (sheetId: string) => void
  duplicateSheet: (sheetId: string) => void
  moveSheetUp: (sheetId: string) => void
  moveSheetDown: (sheetId: string) => void
  
  // Element operations
  addElement: (sheetId: string, element: DragItem) => void
  updateElement: (sheetId: string, elementId: string, updates: Partial<DragItem>) => void
  deleteElement: (sheetId: string, elementId: string) => void
  duplicateElement: (sheetId: string, elementId: string) => void
  
  // Selection
  setSelectedSheet: (sheetId: string | null) => void
  setSelectedElement: (elementId: string | null, type: string | null) => void
  
  // UI controls
  setShowMargins: (show: boolean) => void
  setShowGrid: (show: boolean) => void
  setMarginSize: (size: number) => void
  
  // Undo/Redo
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  saveHistory: () => void
  resetApp: () => void
  
  // JSON Data Library
  setJsonDataLibrary: (jsonText: string) => void
  clearJsonDataLibrary: () => void
}

type EditorStore = EditorState & EditorActions

// Helper to deep clone sheets
const deepCloneSheets = (sheets: Sheet[]): Sheet[] => {
  return sheets.map(sheet => ({
    ...sheet,
    elements: sheet.elements?.map(element => ({
      ...element,
      textStyle: element.textStyle ? { ...element.textStyle } : undefined,
      lineStyle: element.lineStyle ? { ...element.lineStyle } : undefined,
      tableData: element.tableData ? {
        ...element.tableData,
        cellData: element.tableData.cellData ? { ...element.tableData.cellData } : {},
        columnFontSizes: element.tableData.columnFontSizes ? { ...element.tableData.columnFontSizes } : {},
        rowFontSizes: element.tableData.rowFontSizes ? { ...element.tableData.rowFontSizes } : {},
        cellFontSizes: element.tableData.cellFontSizes ? { ...element.tableData.cellFontSizes } : {},
        cellWidths: element.tableData.cellWidths ? { ...element.tableData.cellWidths } : {},
        cellHeights: element.tableData.cellHeights ? { ...element.tableData.cellHeights } : {}
      } : undefined
    }))
  }))
}

export const useEditorStore = create<EditorStore>()(
  persist(
    (set, get) => ({
  // Initial state
  sheets: [],
  history: [],
  historyIndex: -1,
  maxHistorySize: 20, // Reduced to prevent localStorage quota issues
  selectedSheetId: null,
  selectedElementId: null,
  selectedElementType: null,
  showMargins: false,
  showGrid: false,
  marginSize: 32,
  jsonDataLibrary: '',

  // Sheet operations
  setSheets: (sheets) => {
    set({ sheets })
    get().saveHistory()
  },

  addSheet: () => {
    const state = get()
    const selectedSheet = state.selectedSheetId 
      ? state.sheets.find(s => s.id === state.selectedSheetId)
      : null
    
    // Inherit margins and grid settings from selected sheet, or use defaults
    const margins = selectedSheet?.margins || {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    }
    const showMargins = selectedSheet?.showMargins ?? false
    const showGrid = selectedSheet?.showGrid ?? false
    
    const newSheet: Sheet = {
      id: `sheet-${Date.now()}`,
      title: `Page ${get().sheets.length + 1}`,
      elements: [],
      margins,
      showMargins,
      showGrid
    }
    set(state => ({ sheets: [...state.sheets, newSheet] }))
    get().setSelectedSheet(newSheet.id)
    get().saveHistory()
  },

  addSheetAtIndex: (index) => {
    const state = get()
    const selectedSheet = state.selectedSheetId 
      ? state.sheets.find(s => s.id === state.selectedSheetId)
      : null
    
    // Inherit margins and grid settings from selected sheet, or use defaults
    const margins = selectedSheet?.margins || {
      top: 20,
      right: 20,
      bottom: 20,
      left: 20
    }
    const showMargins = selectedSheet?.showMargins ?? false
    const showGrid = selectedSheet?.showGrid ?? false
    
    const newSheet: Sheet = {
      id: `sheet-${Date.now()}`,
      title: `Page ${index + 1}`,
      elements: [],
      margins,
      showMargins,
      showGrid
    }
    
    // Insert at the specified index
    const newSheets = [...state.sheets]
    newSheets.splice(index, 0, newSheet)
    
    set({ sheets: newSheets })
    get().setSelectedSheet(newSheet.id)
    get().saveHistory()
  },

  updateSheet: (sheetId, updates) => {
    set(state => ({
      sheets: state.sheets.map(sheet =>
        sheet.id === sheetId ? { ...sheet, ...updates } : sheet
      )
    }))
    get().saveHistory()
  },

  deleteSheet: (sheetId) => {
    const sheets = get().sheets
    const index = sheets.findIndex(s => s.id === sheetId)
    
    if (index === -1) return
    
    const newSheets = sheets.filter(s => s.id !== sheetId)
    
    // If no sheets left, create a new one
    if (newSheets.length === 0) {
      get().addSheet()
    } else {
      set({ sheets: newSheets })
      // Select the next sheet or previous one
      const newIndex = Math.min(index, newSheets.length - 1)
      get().setSelectedSheet(newSheets[newIndex]?.id || null)
    }
    
    get().saveHistory()
  },

  duplicateSheet: (sheetId) => {
    const sheets = get().sheets
    const sheetToDuplicate = sheets.find(s => s.id === sheetId)
    
    if (!sheetToDuplicate) return
    
    const clonedElements = deepCloneSheets([sheetToDuplicate])[0].elements?.map(element => ({
      ...element,
      id: `${element.id}-copy-${Date.now()}-${Math.random()}`,
      position: {
        x: element.position.x + 20,
        y: element.position.y + 20
      },
      textContent: element.textContent,
      textStyle: element.textStyle ? { ...element.textStyle } : undefined,
      lineStyle: element.lineStyle ? { ...element.lineStyle } : undefined,
      imageUrl: element.imageUrl,
      tableData: element.tableData ? {
        ...element.tableData,
        cellData: element.tableData.cellData ? { ...element.tableData.cellData } : {},
        columnFontSizes: element.tableData.columnFontSizes ? { ...element.tableData.columnFontSizes } : {},
        rowFontSizes: element.tableData.rowFontSizes ? { ...element.tableData.rowFontSizes } : {},
        cellFontSizes: element.tableData.cellFontSizes ? { ...element.tableData.cellFontSizes } : {},
        cellWidths: element.tableData.cellWidths ? { ...element.tableData.cellWidths } : {},
        cellHeights: element.tableData.cellHeights ? { ...element.tableData.cellHeights } : {}
      } : undefined
    })) || []
    
    const newSheet: Sheet = {
      id: `sheet-${Date.now()}`,
      title: `${sheetToDuplicate.title} (Copy)`,
      elements: clonedElements,
      margins: sheetToDuplicate.margins ? {
        top: sheetToDuplicate.margins.top,
        right: sheetToDuplicate.margins.right,
        bottom: sheetToDuplicate.margins.bottom,
        left: sheetToDuplicate.margins.left
      } : undefined,
      showMargins: sheetToDuplicate.showMargins,
      showGrid: sheetToDuplicate.showGrid
    }
    
    const index = sheets.findIndex(s => s.id === sheetId)
    const newSheets = [...sheets]
    newSheets.splice(index + 1, 0, newSheet)
    
    set({ sheets: newSheets })
    get().setSelectedSheet(newSheet.id)
    get().saveHistory()
  },

  moveSheetUp: (sheetId) => {
    const sheets = get().sheets
    const index = sheets.findIndex(s => s.id === sheetId)
    
    if (index <= 0) return
    
    const newSheets = [...sheets]
    ;[newSheets[index - 1], newSheets[index]] = [newSheets[index], newSheets[index - 1]]
    
    set({ sheets: newSheets })
    get().saveHistory()
  },

  moveSheetDown: (sheetId) => {
    const sheets = get().sheets
    const index = sheets.findIndex(s => s.id === sheetId)
    
    if (index === -1 || index >= sheets.length - 1) return
    
    const newSheets = [...sheets]
    ;[newSheets[index], newSheets[index + 1]] = [newSheets[index + 1], newSheets[index]]
    
    set({ sheets: newSheets })
    get().saveHistory()
  },

  // Element operations
  addElement: (sheetId, element) => {
    const state = get()
    
    // Save the current state BEFORE modifying sheets (for history)
    const beforeSheets = deepCloneSheets(state.sheets)
    
    set({
      sheets: state.sheets.map(sheet =>
        sheet.id === sheetId
          ? { ...sheet, elements: [...(sheet.elements || []), element] }
          : sheet
      )
    })
    
    // Now update selection (this might also update sheets if zIndex changes)
    get().setSelectedElement(element.id, element.type)
    
    // If this is the first action (history is empty), save BOTH before and after states
    if (state.history.length === 0) {
      const afterSheets = deepCloneSheets(get().sheets)
      set({
        history: [beforeSheets, afterSheets],
        historyIndex: 1
      })
      console.log('[History] Initialized with before/after states. Can undo: true')
    } else {
      get().saveHistory()
    }
  },

  updateElement: (sheetId, elementId, updates) => {
    console.log(`[Store] updateElement called for ${elementId} with updates:`, Object.keys(updates))
    set(state => ({
      sheets: state.sheets.map(sheet =>
        sheet.id === sheetId
          ? {
              ...sheet,
              elements: sheet.elements?.map(el =>
                el.id === elementId ? { ...el, ...updates } : el
              )
            }
          : sheet
      )
    }))
    get().saveHistory()
  },

  deleteElement: (sheetId, elementId) => {
    set(state => ({
      sheets: state.sheets.map(sheet =>
        sheet.id === sheetId
          ? { ...sheet, elements: sheet.elements?.filter(el => el.id !== elementId) }
          : sheet
      )
    }))
    get().setSelectedElement(null, null)
    get().saveHistory()
  },

  duplicateElement: (sheetId, elementId) => {
    const sheets = get().sheets
    const sheet = sheets.find(s => s.id === sheetId)
    if (!sheet) return
    
    const element = sheet.elements?.find(el => el.id === elementId)
    if (!element) return
    
    const duplicatedElement: DragItem = {
      ...element,
      id: `${element.id}-copy-${Date.now()}`,
      position: {
        x: element.position.x + 20,
        y: element.position.y + 20
      },
      textContent: element.textContent,
      textStyle: element.textStyle ? { ...element.textStyle } : undefined,
      lineStyle: element.lineStyle ? { ...element.lineStyle } : undefined,
      imageUrl: element.imageUrl,
      tableData: element.tableData ? {
        ...element.tableData,
        cellData: element.tableData.cellData ? { ...element.tableData.cellData } : {},
        columnFontSizes: element.tableData.columnFontSizes ? { ...element.tableData.columnFontSizes } : {},
        rowFontSizes: element.tableData.rowFontSizes ? { ...element.tableData.rowFontSizes } : {},
        cellFontSizes: element.tableData.cellFontSizes ? { ...element.tableData.cellFontSizes } : {},
        cellWidths: element.tableData.cellWidths ? { ...element.tableData.cellWidths } : {},
        cellHeights: element.tableData.cellHeights ? { ...element.tableData.cellHeights } : {}
      } : undefined
    }
    
    set(state => ({
      sheets: state.sheets.map(s =>
        s.id === sheetId
          ? { ...s, elements: [...(s.elements || []), duplicatedElement] }
          : s
      )
    }))
    
    get().setSelectedElement(duplicatedElement.id, duplicatedElement.type)
    get().saveHistory()
  },

  // Selection
  setSelectedSheet: (sheetId) => {
    console.log('[Store] setSelectedSheet called with sheetId:', sheetId)
    set({ selectedSheetId: sheetId, selectedElementId: null, selectedElementType: null })
    console.log('[Store] selectedSheetId is now:', sheetId)
  },

  setSelectedElement: (elementId, type) => {
    const state = get()
    let shouldSaveHistory = false
    
    // Bring element to front when selected
    if (elementId && state.selectedSheetId) {
      const sheets = [...state.sheets]
      const sheet = sheets.find(s => s.id === state.selectedSheetId)
      
      if (sheet && sheet.elements) {
        const elementIndex = sheet.elements.findIndex(el => el.id === elementId)
        
        if (elementIndex !== -1) {
          const maxZIndex = sheet.elements.reduce((max, el) => Math.max(max, el.zIndex), 0)
          const element = sheet.elements[elementIndex]
          
          if (element.zIndex < maxZIndex) {
            sheet.elements[elementIndex] = {
              ...element,
              zIndex: maxZIndex + 1
            }
            
            set({ sheets })
            shouldSaveHistory = true // Only save if zIndex changed
          }
        }
      }
    }
    
    set({ selectedElementId: elementId, selectedElementType: type })
    
    // Only save history if we actually changed the element's zIndex
    if (shouldSaveHistory) {
      get().saveHistory()
    }
  },

  // UI controls
  setShowMargins: (show) => set({ showMargins: show }),
  setShowGrid: (show) => set({ showGrid: show }),
  setMarginSize: (size) => set({ marginSize: size }),

  // Undo/Redo
  undo: () => {
    const state = get()
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1
      const sheets = deepCloneSheets(state.history[newIndex])
      set({ 
        sheets,
        historyIndex: newIndex,
        selectedElementId: null,
        selectedElementType: null
      })
      console.log(`[Undo] Restored to history index ${newIndex}`)
    }
  },

  redo: () => {
    const state = get()
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1
      const sheets = deepCloneSheets(state.history[newIndex])
      set({ 
        sheets,
        historyIndex: newIndex,
        selectedElementId: null,
        selectedElementType: null
      })
      console.log(`[Redo] Restored to history index ${newIndex}`)
    }
  },

  canUndo: () => {
    const state = get()
    return state.historyIndex > 0
  },

  canRedo: () => {
    const state = get()
    return state.historyIndex < state.history.length - 1
  },

  saveHistory: () => {
    const state = get()
    const currentSheets = deepCloneSheets(state.sheets)
    
    // If no sheets, don't save history
    if (currentSheets.length === 0) {
      console.log('[History] Skipping save - no sheets')
      return
    }
    
    let history = [...state.history]
    let historyIndex = state.historyIndex
    
    // If this is the first save (history is empty), initialize it
    if (history.length === 0 && historyIndex === -1) {
      console.log('[History] Initializing history')
      history = [currentSheets]
      historyIndex = 0
    } else {
      // Remove any history after current index (when redo history exists)
      history = history.slice(0, historyIndex + 1)
      
      // Add new state to history
      history.push(currentSheets)
      
      // Limit history size
      if (history.length > state.maxHistorySize) {
        history = history.slice(-state.maxHistorySize)
      }
      
      historyIndex = history.length - 1
    }
    
    set({
      history,
      historyIndex
    })
    
    console.log(`[History] Saved state at index ${historyIndex} (${history.length} total states). Can undo: ${historyIndex > 0}`)
  },

  resetApp: () => {
    // Create a new blank page
    const newSheet: Sheet = {
      id: `sheet-${Date.now()}`,
      title: 'Page 1',
      elements: [],
      margins: {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      },
      showMargins: false,
      showGrid: false
    }
    
    // Reset all state to initial values with one blank page
    set({
      sheets: [newSheet],
      history: [],
      historyIndex: -1,
      selectedSheetId: newSheet.id,
      selectedElementId: null,
      selectedElementType: null,
      showMargins: false,
      showGrid: false,
      marginSize: 32,
      jsonDataLibrary: ''
    })
    
    // Clear localStorage
    localStorage.removeItem('pdf-editor-storage')
    
    console.log('[Store] App reset - created blank page')
  },

  // JSON Data Library actions
  setJsonDataLibrary: (jsonText) => {
    set({ jsonDataLibrary: jsonText })
  },

  clearJsonDataLibrary: () => {
    set({ jsonDataLibrary: '' })
  }
}),
  {
    name: 'pdf-editor-storage', // localStorage key
    // Only persist certain parts of the state - skip history
      partialize: (state) => ({
      sheets: state.sheets,
      selectedSheetId: state.selectedSheetId,
      selectedElementId: state.selectedElementId,
      selectedElementType: state.selectedElementType,
      showMargins: state.showMargins,
      showGrid: state.showGrid,
      marginSize: state.marginSize,
      jsonDataLibrary: state.jsonDataLibrary
      // History is NOT persisted - it's too large for localStorage
    }),
    // Initialize history after loading from storage
    onRehydrateStorage: () => {
      return (state, error) => {
        console.log('[Store] Rehydrated from localStorage', { 
          hasSheets: state?.sheets?.length ?? 0,
          error
        })
        
        if (error) {
          console.error('[Store] Rehydration error:', error)
        }
        
        // History is NOT persisted (too large for localStorage)
        // When app loads, we have sheets but no history
        // History will be initialized on first operation that calls saveHistory()
      }
    }
  }
)
)

