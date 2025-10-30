import { Image, Minus, Table, Triangle, Type } from 'lucide-react'
import { ItemTypes, type ElementConfig } from './types'

// A4 page dimensions (standard ISO 216)
export const A4_PAGE_WIDTH_MM = 210
export const A4_PAGE_HEIGHT_MM = 297

// Page dimensions in pixels (fixed for consistent rendering across all devices)
// These match the A4 page size at 96 DPI exactly
export const A4_PAGE_WIDTH_PX = 794
export const A4_PAGE_HEIGHT_PX = 1123

// Simple conversion factor: editor uses 794px, PDF uses 210mm
// 1mm = 794px / 210mm = 3.78095... px
export const getPxToMmFactor = (): number => {
  // Direct conversion: editor uses pixels, PDF uses mm
  // Since page is 794px in editor and 210mm in PDF, the ratio is fixed
  return A4_PAGE_WIDTH_PX / A4_PAGE_WIDTH_MM
}

export const ELEMENT_CONFIGS: ElementConfig[] = [
  {
    type: ItemTypes.TEXT,
    id: 'text-element',
    label: 'Text',
    icon: Type,
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
  },
  {
    type: ItemTypes.IMAGE,
    id: 'image-element',
    label: 'Media',
    icon: Image,
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
  },
  {
    type: ItemTypes.SHAPE,
    id: 'shape-element',
    label: 'Shape',
    icon: Triangle,
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
  },
  {
    type: ItemTypes.TABLE,
    id: 'table-element',
    label: 'Table',
    icon: Table,
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
  },
  {
    type: ItemTypes.LINE,
    id: 'line-element',
    label: 'Line',
    icon: Minus,
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
  },
]
