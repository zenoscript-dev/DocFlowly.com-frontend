// Shared types for PDF Editor components
export interface TextStyle {
  bold?: boolean
  italic?: boolean
  underline?: boolean
  align?: 'left' | 'center' | 'right'
  fontSize?: number
  fontFamily?: string
  color?: string
}

export interface LineStyle {
  strokeStyle: 'solid' | 'dashed' | 'dotted'
  startArrow?: 'none' | 'arrow' | 'circle'
  endArrow?: 'none' | 'arrow' | 'circle'
  lineWidth?: number
  color?: string
}

export interface TableData {
  rows: number
  columns: number
  cellData: { [key: string]: string } // key format: "row-column" e.g., "0-0", "1-1"
  cellWidths?: { [key: string]: number } // column widths
  cellHeights?: { [key: string]: number } // row heights
  headerColor?: string // background color for the first row (header)
  showHeaderBorder?: boolean // toggle header borders
  showBodyBorder?: boolean // toggle body borders
  baseFontSize?: number // base font size for entire table
  headerFontSize?: number // font size for header row
  columnFontSizes?: { [key: number]: number } // per-column font sizes
  rowFontSizes?: { [key: number]: number } // per-row font sizes
  cellFontSizes?: { [key: string]: number } // per-cell font sizes
}

export interface DragItem {
  type: string
  id: string
  position: {
    x: number
    y: number
  }
  size: {
    width: number
    height: number
  }
  rotation: number
  color: string
  zIndex: number
  textContent?: string // Text content for text elements
  textStyle?: TextStyle
  lineStyle?: LineStyle
  tableData?: TableData
  imageUrl?: string // Image data URL for image elements
}

// Define item types for drag and drop
export const ItemTypes = {
  TEXT: 'text',
  IMAGE: 'image',
  SHAPE: 'shape',
  TABLE: 'table',
  LINE: 'line',
} as const

export type ItemType = typeof ItemTypes[keyof typeof ItemTypes]

// Element configuration interface
export interface ElementConfig {
  type: ItemType
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  bgColor?: string
  textColor?: string
}

// Sheet interface for multiple pages
export interface Sheet {
  id: string
  isSelected?: boolean
  title?: string
  elements?: DragItem[]
  margins?: {
    top: number // in mm
    right: number
    bottom: number
    left: number
  }
  showMargins?: boolean
  showGrid?: boolean
}
